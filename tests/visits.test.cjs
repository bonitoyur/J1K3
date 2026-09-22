const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('src/features/visit-model.js', 'utf8').replaceAll('export ', '') + '\n' +
  fs.readFileSync('src/features/visits.js', 'utf8').replace(/^import .*;\n/, '').replace('export ', '') +
  '\ninitVisits({selectedId: "a", service});';
function setup(configured = true) {
  const elements = new Map();
  function element() {
    const classes = new Set();
    return { value: '', children: [], dataset: {}, handlers: {}, textContent: '',
      classList: { contains: c => classes.has(c), toggle: (c, on) => on ? classes.add(c) : classes.delete(c) },
      append(...nodes) { for (const node of nodes) node.parent = this; this.children.push(...nodes); }, replaceChildren() { this.children = []; },
      remove() { this.parent.children = this.parent.children.filter(c => c !== this); },
      setAttribute() {}, focus() {}, scrollIntoView() {},
      querySelectorAll() { return this.children.flatMap(c => [c, ...c.querySelectorAll()]).filter(c => c.type === 'button'); },
      querySelector() { return this.children.find(c => c.className === 'visit-badge'); },
      addEventListener(name, fn) { this.handlers[name] = fn; } };
  }
  const get = id => { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); };
  const card = element(); card.dataset.id = 'a'; card.classList.toggle('mini-mountain', true);
  const state = { rows: [], fail: false, inserts: [], removed: [], confirmed: true, owned: new Set() };
  const service = !configured ? null : {
    async load() { return { records: [...state.rows], ownedIds: new Set(state.owned) }; },
    async save(row, id) {
      state.inserts.push({ ...row, id });
      if (state.fail) throw Error('save failed');
      return { ...row, id: id || '1' };
    },
    async remove(id) { if (state.fail) throw Error('delete failed'); state.removed.push(id); }
  };
  const handlers = {};
  const window = { confirm: () => state.confirmed, addEventListener: (n, fn) => { handlers[n] = fn; } };
  vm.runInNewContext(source, { window, document: { getElementById: get, querySelectorAll: () => [card], createElement: element }, service, Date, Set, Map, Intl });
  return { get, state, card, handlers };
}
const settle = () => new Promise(resolve => setImmediate(resolve));
test('unconfigured service stays disabled and explains setup', () => {
  const s = setup(false);
  assert.match(s.get('visitStatus').textContent, /Firebase/);
  assert.equal(s.get('visitRefresh').disabled, true);
});

test('owned record can be edited, cancelled and deleted; last deletion clears visited', async () => {
  const s = setup(); await settle();
  s.get('visitAuthor').value = '나'; s.get('visitComment').value = '첫 기록';
  await s.get('visitForm').handlers.submit({ preventDefault() {} });
  let actions = s.get('visitList').children[0].children[2].children;
  actions[0].handlers.click();
  assert.equal(s.get('visitComment').value, '첫 기록');
  assert.equal(s.get('visitSubmit').textContent, '수정 내용 저장');
  s.get('visitComment').value = '수정된 기록';
  await s.get('visitForm').handlers.submit({ preventDefault() {} });
  assert.equal(s.state.inserts[1].id, '1');
  assert.equal(s.get('visitList').children[0].children[1].textContent, '수정된 기록');
  actions = s.get('visitList').children[0].children[2].children;
  actions[0].handlers.click();
  s.get('visitCancel').handlers.click();
  assert.equal(s.get('visitComment').value, '');
  assert.equal(s.get('visitCancel').hidden, true);
  s.state.confirmed = false;
  await actions[1].handlers.click();
  assert.equal(s.state.removed.length, 0);
  s.state.confirmed = true;
  s.state.fail = true;
  await actions[1].handlers.click();
  assert.equal(s.card.classList.contains('visited'), true);
  s.state.fail = false;
  await actions[1].handlers.click();
  assert.equal(s.state.removed[0], '1');
  assert.equal(s.card.classList.contains('visited'), false);
});

test('other authors have no edit/delete actions and refreshed ownership persists', async () => {
  const s = setup(); await settle();
  s.state.rows = [
    { id: 'own', mountain_id: 'a', visited_on: '2026-01-01', author: '나', comment: '내 기록' },
    { id: 'other', mountain_id: 'a', visited_on: '2026-01-01', author: '친구', comment: '친구 기록' }
  ];
  s.state.owned.add('own');
  await s.get('visitRefresh').handlers.click();
  assert.equal(s.get('visitList').children[0].children.length, 3);
  assert.equal(s.get('visitList').children[1].children.length, 2);
});
test('save marks card, renders user content as text, and retains failed draft', async () => {
  const s = setup(); await settle();
  s.get('visitAuthor').value = '작성자'; s.get('visitComment').value = '<img onerror=alert(1)>';
  await s.get('visitForm').handlers.submit({ preventDefault() {} });
  assert.equal(s.state.inserts[0].mountain_id, 'a');
  assert.equal(s.card.classList.contains('visited'), true);
  assert.equal(s.get('visitList').children[0].children[1].textContent, '<img onerror=alert(1)>');
  s.state.fail = true;
  s.get('visitAuthor').value = '다른 작성자'; s.get('visitComment').value = '실패 초안';
  await s.get('visitForm').handlers.submit({ preventDefault() {} });
  assert.equal(s.get('visitComment').value, '실패 초안');
  assert.match(s.get('visitStatus').textContent, /저장하지 못/);
});
test('drafts follow their mountain and blank input is rejected', async () => {
  const s = setup(); await settle();
  s.get('visitComment').value = '산 A 초안';
  s.handlers.mountainchange({ detail: { id: 'b' } });
  assert.equal(s.get('visitComment').value, '');
  s.handlers.mountainchange({ detail: { id: 'a' } });
  assert.equal(s.get('visitComment').value, '산 A 초안');
  s.get('visitAuthor').value = '   ';
  await s.get('visitForm').handlers.submit({ preventDefault() {} });
  assert.equal(s.state.inserts.length, 0);
});
