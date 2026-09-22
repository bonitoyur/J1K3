import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createVisitService } from '../src/services/visits.js';

function fixture() {
  const state = { user: null, writes: [], fail: false };
  const auth = { authStateReady: async () => {}, get currentUser() { return state.user; } };
  const sdk = {
    getApps: () => [], initializeApp: () => ({}), getAuth: () => auth, getFirestore: () => ({}),
    signInAnonymously: async () => { state.user = { uid: 'owner' }; },
    collection: (db, name) => ({ name }), doc: (db, name, id) => name ? { name, id } : { name: db.name, id: 'new' },
    query: ref => ref, documentId: () => '__name__', orderBy: () => ({}), limit: () => ({}),
    where: () => ({}), getDocsFromServer: async () => ({ docs: [] }),
    writeBatch() { const writes = []; return {
      set: (ref, data) => writes.push({ ref, data }),
      commit: async () => { if (state.fail) throw Error('denied'); state.writes.push(...writes); }
    }; },
    updateDoc: async (ref, data) => { if (state.fail) throw Error('denied'); state.writes.push({ ref, data }); },
    runTransaction: async (db, callback) => {
      if (state.fail) throw Error('denied');
      await callback({ get: async () => ({ exists: () => true }), delete: ref => state.writes.push({ ref }) });
    }
  };
  return { state, service: createVisitService({ apiKey: 'key', projectId: 'p', appId: 'a', authDomain: 'd' }, async () => sdk) };
}
const values = { mountain_id: 'bukhansan', visited_on: '2026-01-01', author: '나', comment: '기록' };
test('Firestore writes owner separately; update cannot change ownership or mountain', async () => {
  const { service, state } = fixture();
  await service.save(values);
  assert.deepEqual(state.writes[0].data, values);
  assert.deepEqual(state.writes[1].data, { uid: 'owner' });
  await service.save(values, 'new');
  assert.deepEqual(Object.keys(state.writes[2].data).sort(), ['author', 'comment', 'visited_on']);
  await service.remove('new');
  assert.deepEqual(state.writes.slice(3).map(w => w.ref.name), ['mountain_visits', 'visit_owners']);
});
test('Firestore read does not create accounts; failures propagate', async () => {
  const { service, state } = fixture();
  assert.equal((await service.load()).records.length, 0);
  assert.equal(state.user, null);
  await assert.rejects(service.remove('new'));
  state.fail = true;
  await assert.rejects(service.save(values));
  assert.equal(state.writes.length, 0);
});
test('missing Firebase config disables recording', () => assert.equal(createVisitService({}), null));
