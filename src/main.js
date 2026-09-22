// Templates must exist before feature modules bind their DOM elements.
async function loadTemplates() {
  const allowed = new Set(['header', 'explorer', 'visits', 'footer']);
  while (document.querySelector('[data-template]')) {
    await Promise.all([...document.querySelectorAll('[data-template]')].map(async host => {
      const name = host.dataset.template;
      if (!allowed.has(name)) throw new Error('Unknown template');
      const response = await fetch(new URL(`./templates/${name}.html`, import.meta.url));
      if (!response.ok) throw new Error(`Template HTTP ${response.status}`);
      // Only trusted, local project templates are inserted here; never user input.
      host.outerHTML = await response.text();
    }));
  }
}

try {
  await loadTemplates();
  const [{ initExplorer }, { initVisits }, { createVisitService }] = await Promise.all([
    import('./features/explorer.js'),
    import('./features/visits.js'),
    import('./services/visits.js')
  ]);
  const explorer = initExplorer();
  initVisits({ selectedId: explorer.getSelectedId(), service: createVisitService(window.FIREBASE_CONFIG) });
  document.getElementById('appStatus').hidden = true;
} catch (error) {
  document.getElementById('appStatus').textContent = '화면을 불러오지 못했어요. 개발 서버(npm run dev) 또는 웹 호스팅 주소에서 열고 새로고침해 주세요.';
  console.error('Application initialization failed', error);
}
