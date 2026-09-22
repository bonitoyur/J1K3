import { regionMaps } from '../data/region-maps.js';

export function renderRegionalMap(region, items, onSelect) {
  const host = document.getElementById('regionMountains');
  host.replaceChildren();
  const spec = regionMaps[region];
  if (!spec) return;
  const toolbar = document.createElement('div');
  toolbar.className = 'regional-map-toolbar';
  const title = document.createElement('strong');
  title.textContent = `${region} · ${items.length}개의 산`;
  const zoom = document.createElement('button');
  zoom.type = 'button'; zoom.textContent = '지도 확대 +'; zoom.setAttribute('aria-pressed','false');
  toolbar.append(title, zoom);
  const scroll = document.createElement('div');
  scroll.className = 'regional-map-scroll'; scroll.tabIndex = 0;
  scroll.setAttribute('aria-label', `${region} 산 선택용 개략 지도. 좌우로 스크롤할 수 있습니다.`);
  const canvas = document.createElement('div');
  canvas.className = 'regional-map-canvas';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox','0 0 800 900'); svg.setAttribute('aria-hidden','true');
  svg.innerHTML = `<defs><pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#dce9e6" stroke-width="1"/></pattern></defs><rect width="800" height="900" fill="#f0f6f4"/><rect width="800" height="900" fill="url(#mapGrid)"/><path d="${spec.outline}" fill="#e5efce" stroke="#acbf96" stroke-width="3"/><text x="40" y="58" fill="#173c2d" font-size="23" font-weight="700">${region} 명산 지도</text><text x="735" y="55" fill="#537465" font-size="18">↑ N</text><text x="40" y="870" fill="#537465" font-size="15">산 선택용 개략도 · 실제 경계·위치·축척과 차이가 있습니다</text>`;
  spec.labels.forEach(([name,x,y])=>{
    const t=document.createElementNS(ns,'text'); t.setAttribute('x',x); t.setAttribute('y',y); t.setAttribute('class','map-place-label'); t.textContent=name; svg.append(t);
  });
  canvas.append(svg);
  items.forEach(m=>{
    const p=spec.points.find(p=>p[0]===m.name);
    if (!p) throw new Error(`Missing map position: ${m.name}`);
    const button=document.createElement('button'); button.type='button'; button.className='regional-pin'; button.dataset.id=m.id;
    button.style.left=`${p[1]/8}%`; button.style.top=`${p[2]/9}%`;
    button.setAttribute('aria-label',`${m.name} 상세 정보 보기`); button.setAttribute('aria-pressed','false');
    const icon=document.createElement('span'); icon.setAttribute('aria-hidden','true'); icon.textContent='⛰️';
    const name=document.createElement('strong'); name.textContent=m.name; button.append(icon,name);
    button.addEventListener('click',()=>onSelect(m.id,true)); canvas.append(button);
  });
  zoom.addEventListener('click',()=>{
    const expanded=canvas.classList.toggle('expanded');
    zoom.textContent=expanded?'기본 크기 −':'지도 확대 +'; zoom.setAttribute('aria-pressed',String(expanded));
  });
  scroll.append(canvas); host.append(toolbar,scroll);
}
