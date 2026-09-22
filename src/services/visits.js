import { validateVisit } from '../features/visit-model.js';

async function loadFirebase() {
  const modules = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
  ]);
  return Object.assign({}, ...modules);
}

export function createVisitService(config = {}, loadSDK = loadFirebase) {
  if (!config?.apiKey || !config?.projectId || !config?.appId || !config?.authDomain) return null;
  let ready;
  async function connect() {
    if (!ready) ready = (async () => {
      const sdk = await loadSDK();
      const app = sdk.getApps().find(app => app.name === 'mountain-visits') || sdk.initializeApp(config, 'mountain-visits');
      const auth = sdk.getAuth(app);
      await auth.authStateReady();
      return { sdk, auth, db: sdk.getFirestore(app) };
    })().catch(error => { ready = null; throw error; });
    return ready;
  }
  async function pages(sdk, reference, constraints = []) {
    const rows = [];
    let cursor;
    for (;;) {
      const query = sdk.query(reference, ...constraints, sdk.orderBy(sdk.documentId()),
        ...(cursor ? [sdk.startAfter(cursor)] : []), sdk.limit(500));
      const snapshot = await sdk.getDocsFromServer(query);
      rows.push(...snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      if (snapshot.docs.length < 500) return rows;
      cursor = snapshot.docs.at(-1);
    }
  }
  return {
    async load() {
      const { sdk, auth, db } = await connect();
      const records = await pages(sdk, sdk.collection(db, 'mountain_visits'));
      records.sort((a, b) => b.visited_on.localeCompare(a.visited_on) || a.id.localeCompare(b.id));
      let ownedIds = new Set();
      let ownershipUnavailable = false;
      if (auth.currentUser) {
        try {
          const owners = await pages(sdk, sdk.collection(db, 'visit_owners'), [sdk.where('uid', '==', auth.currentUser.uid)]);
          ownedIds = new Set(owners.map(row => row.id));
        } catch { ownershipUnavailable = true; }
      }
      return { records, ownedIds, ownershipUnavailable };
    },
    async save(values, id = null) {
      const validation = validateVisit(values);
      if (validation) throw new Error(validation);
      const { sdk, auth, db } = await connect();
      if (!auth.currentUser) await sdk.signInAnonymously(auth);
      const editable = { visited_on: values.visited_on, author: values.author.trim(), comment: values.comment.trim() };
      if (id) {
        await sdk.updateDoc(sdk.doc(db, 'mountain_visits', id), editable);
        return { id, mountain_id: values.mountain_id, ...editable };
      }
      const ref = sdk.doc(sdk.collection(db, 'mountain_visits'));
      const record = { mountain_id: values.mountain_id, ...editable };
      const batch = sdk.writeBatch(db);
      batch.set(ref, record);
      batch.set(sdk.doc(db, 'visit_owners', ref.id), { uid: auth.currentUser.uid });
      await batch.commit();
      return { id: ref.id, ...record };
    },
    async remove(id) {
      const { sdk, auth, db } = await connect();
      if (!auth.currentUser) throw new Error('No authenticated session');
      const ref = sdk.doc(db, 'mountain_visits', id);
      await sdk.runTransaction(db, async transaction => {
        const snapshot = await transaction.get(ref);
        if (!snapshot.exists()) throw new Error('Record no longer exists');
        transaction.delete(ref);
        transaction.delete(sdk.doc(db, 'visit_owners', id));
      });
      return { id };
    }
  };
}
