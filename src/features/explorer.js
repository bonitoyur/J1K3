import { mountains, regions } from '../data/mountains.js';
import { regionMaps } from '../data/region-maps.js';
import { renderRegionalMap } from './regional-map.js';

const byId = id => document.getElementById(id);
const hotspots = byId('hotspots');
const grid = byId('mountainGrid');
const detailCard = byId('detailCard');
let activeId = mountains[0].id;
let activeRegion = '전국';

function visibleMountains() { return mountains.filter(m => activeRegion === '전국' || m.group === activeRegion); }

function renderRegionNav() {
  const nav = byId('regionNav');
  ['전국', ...regions].forEach(region => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.region = region;
    const count = region === '전국' ? mountains.length : mountains.filter(m => m.group === region).length;
    button.textContent = `${region} ${count}`;
    button.addEventListener('click', () => selectRegion(region));
    nav.append(button);
  });
  const overview = byId('nationalOverview');
  const subtitles = {'수도권':'서울 · 경기 · 인천', '강원':'강원특별자치도', '충청':'충북 · 충남 · 대전', '전라':'전북 · 전남 · 광주', '경상':'경북 · 경남 · 부산 · 대구 · 울산', '제주':'제주특별자치도'};
  regions.forEach((region, index) => {
    const items = mountains.filter(m => m.group === region);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'region-tile tile-' + index;
    button.innerHTML = `<span class="tile-icon" aria-hidden="true">⛰️</span><strong>${region}</strong><span>${subtitles[region]}</span><b>${items.length}곳 보기 ↗</b>`;
    button.addEventListener('click', () => selectRegion(region));
    overview.append(button);
  });
}

function selectRegion(region, chooseFirst = true) {
  if (!['전국', ...regions].includes(region)) return;
  activeRegion = region;
  document.querySelectorAll('[data-region]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.region === region)));
  byId('capitalMap').hidden = region !== '수도권';
  byId('nationalOverview').hidden = region !== '전국';
  byId('regionMountains').hidden = ['전국','수도권'].includes(region);
  const items = visibleMountains();
  byId('mapCount').textContent = `${items.length} MOUNTAINS`;
  byId('selectionSummary').textContent = `${region} · ${items.length}곳 / 전국 100곳 — 경계에 걸친 산은 대표 접근 지역에 한 번만 표시`;
  byId('quick-title').textContent = `${region} ${items.length}곳 한눈에 보기`;
  byId('mapHelp').textContent = region === '전국' ? '지역을 고르면 각 지역 지도가 열립니다. 지도 위 산 아이콘이나 이름을 눌러보세요.' : region === '수도권' ? '산 아이콘이나 이름을 누르세요. 원본 배치를 따른 개략 지도이며 작은 화면에서는 좌우로 이동할 수 있어요.' : '지도 위 산 아이콘·이름을 누르면 상세 카드가 열립니다. 확대하거나 좌우로 밀어서 선택하세요. 산 선택용 개략도로 실제 경계·위치·축척과 다릅니다. 정확한 접근 위치는 카드의 길찾기를 확인하세요.';
  renderControls();
  const chosen = mountains.find(m => m.id === activeId);
  if (chooseFirst && region !== '전국' && chosen.group !== region) selectMountain(items[0].id, false);
  else markSelection();
}

function markSelection() {
  window.dispatchEvent(new CustomEvent('mountainchange', { detail: { id: activeId } }));
  document.querySelectorAll('[data-id]').forEach(element => {
    const active = element.dataset.id === activeId;
    element.classList.toggle('active', active);
    element.setAttribute('aria-pressed', String(active));
  });
}

function directionsUrl(destination) {
  return `https://map.kakao.com/?sName=${encodeURIComponent('서울역')}&eName=${encodeURIComponent(destination)}`;
}

function festivalUrl(query) {
  return `https://search.naver.com/search.naver?query=${encodeURIComponent(query + ' 2026 일정')}`;
}

function renderControls() {
  hotspots.replaceChildren();
  grid.replaceChildren();
  byId('regionMountains').replaceChildren();
  visibleMountains().forEach((mountain) => {
    const index = mountains.indexOf(mountain);
    const hotspot = document.createElement('button');
    hotspot.className = 'hotspot';
    hotspot.type = 'button';
    hotspot.dataset.id = mountain.id;
    if (mountain.group === '수도권') {
      hotspot.style.left = `${mountain.x}%`;
      hotspot.style.top = `${mountain.y}%`;
    } else {
      hotspot.className = 'region-mountain-button';
    }
    hotspot.setAttribute('aria-label', `${mountain.name} 상세 정보 보기`);
    hotspot.title = mountain.name;
    const icon = document.createElement('span');
    icon.className = 'mountain-pin-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '⛰️';
    const label = document.createElement('span');
    label.className = 'mountain-pin-name';
    label.textContent = mountain.id === 'baegun' ? '백운산' : mountain.name;
    hotspot.append(icon, label);
    hotspot.addEventListener('click', () => selectMountain(mountain.id, true));
    if (mountain.group === '수도권') hotspots.appendChild(hotspot);

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'mini-mountain';
    card.dataset.id = mountain.id;
    card.innerHTML = `<span>${String(index + 1).padStart(2, '0')} · ${mountain.region}</span><strong>${mountain.name}</strong><small>${mountain.elevation} · ${mountain.hikeTime}</small>`;
    card.addEventListener('click', () => selectMountain(mountain.id, true));
    grid.appendChild(card);
  });
  if (regionMaps[activeRegion]) renderRegionalMap(activeRegion, visibleMountains(), selectMountain);
}

function selectMountain(id, scrollToDetail = false) {
  const mountain = mountains.find(item => item.id === id);
  if (!mountain) return;
  activeId = id;
  if (activeRegion !== '전국' && mountain.group !== activeRegion) selectRegion(mountain.group, false);

  byId('regionBadge').textContent = mountain.region;
  byId('difficultyBadge').textContent = mountain.difficulty;
  byId('mountainName').textContent = mountain.name;
  byId('mountainLocation').textContent = mountain.location;
  byId('mountainNumber').textContent = String(mountains.indexOf(mountain) + 1).padStart(2, '0');
  byId('mountainFeature').textContent = mountain.feature;
  byId('elevation').textContent = mountain.elevation;
  byId('hikeTime').textContent = mountain.hikeTime;
  byId('driveTime').textContent = mountain.driveTime;
  byId('trail').textContent = mountain.trail;
  byId('transitTime').textContent = mountain.transitTime;
  byId('transitRoute').textContent = mountain.transitRoute;
  byId('carTime').textContent = mountain.carTime;
  byId('carRoute').textContent = mountain.carRoute;
  byId('routeLink').href = directionsUrl(mountain.destination);
  byId('food').textContent = mountain.food;
  byId('festival').textContent = mountain.festival;
  byId('festivalNote').textContent = mountain.festivalNote;
  byId('festivalLink').href = festivalUrl(mountain.festivalQuery);
  byId('sourceLink').href = mountain.sourceUrl || 'https://fmtview.com/227';
  byId('safetyLink').href = mountain.safetyUrl || `https://search.naver.com/search.naver?query=${encodeURIComponent(mountain.location + ' ' + mountain.name + ' 공식 탐방로 통제')}`;
  byId('safetyLink').textContent = mountain.safetyLabel || '탐방로·입산 공지 검색 ↗';

  document.querySelectorAll('[data-id]').forEach(element => {
    const active = element.dataset.id === id;
    element.classList.toggle('active', active);
    element.setAttribute('aria-pressed', String(active));
  });

  history.replaceState(null, '', `#${mountain.id}`);
  window.dispatchEvent(new CustomEvent('mountainchange', { detail: { id: activeId } }));
  if (scrollToDetail) {
    detailCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

async function sharePage() {
  const mountain = mountains.find(item => item.id === activeId);
  const shareData = {
    title: '홍제 공삼삼 · 전국 100대 명산',
    text: `${mountain.name} — 홍제 공삼삼에서 출발하는 전국 명산 가이드`,
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('링크를 복사했어요.');
    }
  } catch (error) {
    if (error.name !== 'AbortError') showToast('주소창의 링크를 복사해 주세요.');
  }
}

function showToast(message) {
  const toast = byId('toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
}

export function initExplorer() {
  renderRegionNav();
  const initialId = window.location.hash.slice(1);
  const initialMountain = mountains.find(item => item.id === initialId);
  if (initialMountain) activeId = initialMountain.id;
  selectRegion(initialMountain ? initialMountain.group : '전국', false);
  selectMountain(activeId, false);
  byId('shareButton').addEventListener('click', sharePage);

  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    if (id && id !== activeId) selectMountain(id, false);
  });

  return { getSelectedId: () => activeId };
}
