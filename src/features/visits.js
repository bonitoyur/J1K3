import { today, validateVisit } from './visit-model.js';

export function initVisits({ selectedId, service }) {
  const el = id => document.getElementById(id);
  const drafts = new Map();
  let records = [];
  let ownedIds = new Set();
  let selected = selectedId;
  let editingId = null;
  let busy = false;
  let loaded = false;
  const status = message => { el('visitStatus').textContent = message; };
  const failure = (message, error) => {
    console.error('Visit operation failed', error);
    status(message + (error?.code ? ` (${error.code})` : ''));
  };
  const snapshot = () => ({ date: el('visitDate').value, author: el('visitAuthor').value, comment: el('visitComment').value, editingId });

  function setBusy(value) {
    busy = value;
    el('visitFields').disabled = value || !loaded;
    el('visitRefresh').disabled = value || !service;
    el('visitList').querySelectorAll('button').forEach(button => { button.disabled = value; });
  }
  function restoreDraft() {
    const draft = drafts.get(selected);
    editingId = draft?.editingId || null;
    el('visitDate').max = today();
    el('visitDate').value = draft?.date || today();
    el('visitAuthor').value = draft?.author || '';
    el('visitComment').value = draft?.comment || '';
    el('visitSubmit').textContent = editingId ? '수정 내용 저장' : '다녀왔어요 · 기록 저장';
    el('visitCancel').hidden = !editingId;
    el('visitEditState').textContent = editingId ? '기존 방문 기록을 수정하고 있어요.' : '새 방문 기록';
  }
  function beginEdit(row) {
    if (busy || !ownedIds.has(row.id)) return;
    if ((editingId || el('visitComment').value.trim()) && !window.confirm('작성 중인 내용을 바꾸고 이 기록을 수정할까요?')) return;
    drafts.set(selected, { date: row.visited_on, author: row.author, comment: row.comment, editingId: row.id });
    restoreDraft();
    el('visitDate').focus();
    el('visitForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function render() {
    const visited = new Set(records.map(row => row.mountain_id));
    document.querySelectorAll('[data-id]').forEach(card => {
      const done = visited.has(card.dataset.id);
      card.classList.toggle('visited', done);
      if (card.classList.contains('mini-mountain')) {
        let badge = card.querySelector('.visit-badge');
        if (done && !badge) {
          badge = document.createElement('span');
          badge.className = 'visit-badge';
          badge.textContent = '✓ 방문 완료';
          card.append(badge);
        } else if (!done && badge) badge.remove();
      }
    });
    el('detailCard').classList.toggle('visited', visited.has(selected));
    const list = el('visitList');
    list.replaceChildren();
    const entries = records.filter(row => row.mountain_id === selected);
    if (!entries.length && loaded) {
      const empty = document.createElement('p');
      empty.textContent = '아직 방문 기록이 없어요. 첫 산행을 남겨주세요!';
      list.append(empty);
    }
    entries.forEach(row => {
      const item = document.createElement('article');
      const heading = document.createElement('strong');
      const comment = document.createElement('p');
      heading.textContent = `${row.visited_on} · ${row.author}`;
      comment.textContent = row.comment;
      item.append(heading, comment);
      if (ownedIds.has(row.id)) {
        const actions = document.createElement('div');
        actions.className = 'visit-actions';
        for (const [label, handler] of [['수정', () => beginEdit(row)], ['삭제', () => remove(row)]]) {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = label;
          button.disabled = busy;
          button.setAttribute('aria-label', `${row.visited_on} ${row.author} 기록 ${label}`);
          button.addEventListener('click', handler);
          actions.append(button);
        }
        item.append(actions);
      }
      list.append(item);
    });
  }
  async function remove(row) {
    if (busy || !ownedIds.has(row.id) || !window.confirm(`${row.visited_on} 방문 기록을 삭제할까요? 삭제하면 복구할 수 없습니다.`)) return;
    setBusy(true);
    status('기록을 삭제하고 있어요…');
    try {
      await service.remove(row.id);
      records = records.filter(item => item.id !== row.id);
      ownedIds.delete(row.id);
      if (drafts.get(row.mountain_id)?.editingId === row.id) drafts.delete(row.mountain_id);
      if (editingId === row.id) { drafts.delete(selected); restoreDraft(); }
      render();
      status('기록을 삭제했어요. 남은 방문 기록에 맞춰 카드 표시를 변경했습니다.');
    } catch (error) {
      failure('삭제하지 못했어요. 연결 상태와 본인 기록인지 확인한 뒤 다시 시도해 주세요.', error);
    } finally { setBusy(false); }
  }
  window.addEventListener('mountainchange', event => {
    if (selected !== event.detail.id) {
      drafts.set(selected, snapshot());
      selected = event.detail.id;
      restoreDraft();
    }
    render();
  });
  async function refresh() {
    if (!service || busy) return;
    setBusy(true);
    status('방문 기록을 불러오고 있어요…');
    try {
      const result = await service.load();
      records = result.records;
      ownedIds = result.ownedIds;
      loaded = true;
      render();
      status(result.ownershipUnavailable
        ? '기록은 불러왔지만 수정 권한을 확인하지 못했어요. DB 수정 기능 설정을 확인하고 새로고침해 주세요.'
        : `함께 다녀온 산 ${new Set(records.map(row => row.mountain_id)).size}곳 · 방문 기록 ${records.length}개`);
    } catch (error) {
      failure('기록을 불러오지 못했어요. 인터넷 연결과 Firebase 설정을 확인한 뒤 새로고침해 주세요.', error);
    } finally { setBusy(false); }
  }
  el('visitForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (!service || busy || !loaded) return;
    const mountainId = selected;
    const id = editingId;
    const values = { mountain_id: mountainId, visited_on: el('visitDate').value, author: el('visitAuthor').value.trim(), comment: el('visitComment').value.trim() };
    const validation = validateVisit(values);
    if (validation) { status(validation); return; }
    if (id && !ownedIds.has(id)) { status('이 기록을 수정할 권한이 없어요.'); return; }
    setBusy(true);
    status(id ? '수정 내용을 저장하고 있어요…' : '방문 기록을 저장하고 있어요…');
    try {
      const data = await service.save(values, id);
      records = records.filter(row => row.id !== data.id);
      records.push(data);
      ownedIds.add(data.id);
      records.sort((a, b) => b.visited_on.localeCompare(a.visited_on) || a.id.localeCompare(b.id));
      drafts.delete(mountainId);
      if (selected === mountainId) restoreDraft();
      render();
      status(id ? '방문 기록을 수정했어요.' : '저장했어요. 다녀온 산에 방문 완료 표시가 생겼어요.');
    } catch (error) {
      failure('저장하지 못했어요. 입력 내용은 유지됩니다. 연결 상태와 DB 설정을 확인해 주세요.', error);
    } finally { setBusy(false); }
  });
  el('visitCancel').addEventListener('click', () => {
    if (busy) return;
    drafts.delete(selected);
    restoreDraft();
    status('수정을 취소했어요. 기존 기록은 그대로 유지됩니다.');
  });
  el('visitRefresh').addEventListener('click', refresh);
  restoreDraft();
  if (!service) {
    status('방문 기록 저장은 준비 중입니다. 관리자가 Firebase를 연결하면 사용할 수 있어요.');
    setBusy(false);
    return;
  }
  refresh();
}
