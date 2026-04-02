/**
 * sb.js — 스토리보드 뷰어 앱 로직
 *
 * 의존: window.SB_CONFIG (data/config.js), window.PAGES (data/pages.js), window.SPECS (data/specs/*.js)
 * 수정 금지 — 프로젝트별 커스텀은 data/config.js, data/pages.js, data/specs/ 에서 처리
 */

// ── 설정 & 데이터 ─────────────────────────────────────────
const C     = window.SB_CONFIG || {};
const PAGES = window.PAGES     || [];
const SPECS = window.SPECS     || {};
const TAG_LABELS = window.TAG_LABELS || {};

// 문서 제목 동적 적용
document.title = [C.projectName, 'SB', C.version].filter(Boolean).join(' — ');

// ── 상태 ──────────────────────────────────────────────────
let currentFilter   = 'all';
let currentView     = 'grid';
let searchKw        = '';
let currentDetailId = null;
let lastDetailId    = null;

// ── 섹션 헬퍼 ────────────────────────────────────────────
function getSectionLabel(sec) {
  return { doc: '프로젝트 문서', user: '사용자', admin: '관리자' }[sec] || sec;
}
function getSectionBadgeClass(sec) {
  if (sec === 'admin') return ' admin';
  if (sec === 'doc')   return ' doc';
  return '';
}
function getSectionIdClass(sec) {
  if (sec === 'admin') return 'admin';
  if (sec === 'doc')   return 'doc';
  return '';
}
function getSectionGroupClass(sec) {
  if (sec === 'admin') return ' admin-group';
  if (sec === 'doc')   return ' doc-group';
  return '';
}

// ── 필터링 ────────────────────────────────────────────────
function getFilteredPages() {
  return PAGES.filter(p => {
    if (currentFilter !== 'all' && p.section !== currentFilter) return false;
    if (searchKw) {
      const kw = searchKw.toLowerCase();
      return p.name.toLowerCase().includes(kw) || p.id.toLowerCase().includes(kw) ||
        p.group.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw) ||
        (p.path || '').toLowerCase().includes(kw);
    }
    return true;
  });
}

// 상세 모드 네비게이션용 리스트 (현재 섹션 기준)
function getDetailNavList() {
  if (!currentDetailId) return getFilteredPages();
  const cur = PAGES.find(p => p.id === currentDetailId);
  if (!cur) return getFilteredPages();
  if (currentFilter === 'all') {
    return PAGES.filter(p => {
      if (p.section !== cur.section) return false;
      if (searchKw) {
        const kw = searchKw.toLowerCase();
        return p.name.toLowerCase().includes(kw) || p.id.toLowerCase().includes(kw) ||
          p.group.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw) ||
          (p.path || '').toLowerCase().includes(kw);
      }
      return true;
    });
  }
  return getFilteredPages();
}

// ── 사이드바 ─────────────────────────────────────────────
function buildSidebar() {
  // 헤더 텍스트 적용
  const sbTitle    = document.getElementById('sbTitle');
  const sbSubtitle = document.getElementById('sbSubtitle');
  if (sbTitle)    sbTitle.textContent = (C.projectName || '') + ' SB';
  if (sbSubtitle) sbSubtitle.innerHTML =
    `${C.version || ''} &nbsp;|&nbsp; ${C.subtitle || ''}&nbsp;|&nbsp; ${C.author || ''}`;

  const nav = document.getElementById('sbNav');
  const sectionOrder  = ['doc', 'user', 'admin'];
  const sectionLabels = { doc: '프로젝트 문서', user: '사용자 페이지', admin: '관리자 페이지' };
  const sectionColors = { doc: '#c0975c', user: '#4a9e5c', admin: '#4a6fa5' };

  sectionOrder.forEach((sec, secIdx) => {
    const secPages = PAGES.filter(p => p.section === sec);
    if (!secPages.length) return;

    if (secIdx > 0 && sectionOrder[secIdx - 1] === 'doc') {
      const divider = document.createElement('div');
      divider.style.cssText = 'height:1px; background:rgba(255,255,255,.08); margin:8px 14px;';
      nav.appendChild(divider);
    }

    const title = document.createElement('div');
    title.className = 'sb-section-title';
    title.style.color = sectionColors[sec];
    title.textContent = sectionLabels[sec];
    nav.appendChild(title);

    const groups = [...new Set(secPages.map(p => p.group))];
    groups.forEach(g => {
      const items     = secPages.filter(p => p.group === g);
      const isDocSec  = sec === 'doc';
      const group     = document.createElement('div');
      group.className = 'sb-group';

      const label = document.createElement('div');
      label.className = 'sb-group-label' + (isDocSec ? ' open' : '');
      label.innerHTML = `<span>${g} <small style="color:#5a6a7a">(${items.length})</small></span><span class="arrow">▶</span>`;

      const itemsEl   = document.createElement('div');
      itemsEl.className = 'sb-group-items' + (isDocSec ? ' visible' : '');

      label.onclick = () => {
        label.classList.toggle('open');
        itemsEl.classList.toggle('visible');
      };

      items.forEach(p => {
        const item    = document.createElement('div');
        item.className = 'sb-item';
        item.dataset.id = p.id;
        if (isDocSec) item.dataset.type = 'doc';
        item.innerHTML = `<span>${p.name}</span>`;
        item.onclick   = () => showDetail(p.id);
        itemsEl.appendChild(item);
      });

      group.appendChild(label);
      group.appendChild(itemsEl);
      nav.appendChild(group);
    });
  });

  updateStats();
}

function updateStats() {
  const doc   = PAGES.filter(p => p.section === 'doc').length;
  const user  = PAGES.filter(p => p.section === 'user').length;
  const admin = PAGES.filter(p => p.section === 'admin').length;
  document.getElementById('sbStats').innerHTML =
    `전체 <strong><span>${PAGES.length}</span>개</strong><br>문서 <span>${doc}</span> / 사용자 <span>${user}</span> / 관리자 <span>${admin}</span>`;
}

// ── 목록 렌더 ─────────────────────────────────────────────
function render() {
  const listView = document.getElementById('list-view');
  listView.innerHTML = '';

  const filtered = getFilteredPages();
  const labels   = { all: '전체', doc: '프로젝트 문서', user: '사용자', admin: '관리자' };

  const badge = document.getElementById('sectionBadge');
  badge.textContent = labels[currentFilter];
  badge.className   = 'tb-badge' + getSectionBadgeClass(currentFilter);
  document.getElementById('topbarTitle').textContent = labels[currentFilter] + ' 화면 목록';
  document.getElementById('topbarSub').textContent   = `${filtered.length}개 화면`;

  if (!filtered.length) {
    listView.innerHTML = '<div class="empty-msg">검색 결과가 없습니다.</div>';
    return;
  }

  ['doc', 'user', 'admin'].forEach(sec => {
    const secPages = filtered.filter(p => p.section === sec);
    if (!secPages.length) return;

    [...new Set(secPages.map(p => p.group))].forEach(g => {
      const groupPages = secPages.filter(p => p.group === g);
      const section    = document.createElement('div');
      section.className = 'group-section' + getSectionGroupClass(sec);

      const header = document.createElement('div');
      header.className = 'group-header';
      header.innerHTML = `
        <span class="group-name">${getSectionLabel(sec)} — ${g}</span>
        <span class="group-count">${groupPages.length}개 화면</span>`;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'card-grid' + (currentView === 'list' ? ' list-view' : '');
      groupPages.forEach(p => grid.appendChild(createCard(p)));
      section.appendChild(grid);
      listView.appendChild(section);
    });
  });
}

function createCard(p) {
  const card = document.createElement('div');
  card.className  = 'page-card';
  card.dataset.id = p.id;
  card.onclick    = () => showDetail(p.id);

  const noImgIcon = p.section === 'doc' ? '📄' : '🖼';
  const noImgText = p.section === 'doc' ? '미등록' : '미캡처';
  const tagsHtml  = (p.tags || []).map(t => `<span class="tag ${t}">${TAG_LABELS[t] || t}</span>`).join('');

  card.innerHTML = `
    <div class="card-thumb">
      <img src="images/${p.img}" alt="${p.name}"
        onerror="this.parentNode.innerHTML='<div class=\\'no-img\\'><span class=\\'icon\\'>${noImgIcon}</span><span>${noImgText}</span></div>'">
    </div>
    <div class="card-body">
      <div class="card-num">${p.id}</div>
      <div class="card-title">${p.name}</div>
      ${p.path && p.path !== '#' ? `<div class="card-path">${p.path.replace('../outputs/', '')}</div>` : ''}
      <div class="card-desc">${p.desc}</div>
      ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
    </div>`;
  return card;
}

// ── 상세 모드 ─────────────────────────────────────────────
function showDetail(id) {
  const p = PAGES.find(pg => pg.id === id);
  if (!p) return;

  lastDetailId    = currentDetailId || id;
  currentDetailId = id;

  document.body.classList.add('mode-detail');
  document.body.classList.remove('mode-list');

  const sec   = p.section;
  const badge = document.getElementById('detailBadge');
  badge.textContent = getSectionLabel(sec);
  badge.className   = 'tb-badge' + getSectionBadgeClass(sec);
  document.getElementById('detailNum').textContent   = p.id;
  document.getElementById('detailTitle').textContent = p.name;
  updateNavButtons();

  const imgWrap = document.getElementById('detail-img-wrap');
  imgWrap.innerHTML = '<img id="detail-img" src="" alt="" onclick="openModalCurrent()">';
  const img  = document.getElementById('detail-img');
  img.style.cssText = 'cursor:zoom-in; width:98%; max-width:98%; height:auto;';
  img.alt   = p.name;
  img.onerror = function () {
    const icon = sec === 'doc' ? '📄' : '🖼';
    const text = sec === 'doc' ? '문서 이미지 미등록' : '스크린샷 미캡처';
    imgWrap.innerHTML = `
      <div class="detail-no-img">
        <div class="icon">${icon}</div>
        <p>${text}</p>
        <p class="sub">${p.img}</p>
      </div>`;
  };
  img.src = `images/${p.img}`;

  document.getElementById('detail-view').scrollTop = 0;
  buildDescPanel(p);
  highlightSidebar(id);
}

function buildDescPanel(p) {
  const panel = document.getElementById('desc-panel');
  const sec   = p.section;
  const list  = getDetailNavList();
  const idx   = list.findIndex(pg => pg.id === p.id);

  const tagsHtml = (p.tags || []).length
    ? p.tags.map(t => `<span class="tag ${t}">${TAG_LABELS[t] || t}</span>`).join('')
    : '<span class="dp-tags-empty">태그 없음</span>';

  const spec = SPECS[p.id] || null;
  const descSection = spec
    ? `<div class="dp-label">화면 스펙 <span class="spec-badge">전체 스펙</span></div><div class="spec-content">${spec}</div>`
    : `<div class="dp-label">${sec === 'doc' ? '문서 설명' : '화면 설명'}</div><div class="dp-desc">${p.desc}</div>`;

  const pathRow  = p.path && p.path !== '#'
    ? `<div class="dp-row"><span class="dp-key">경로</span><span class="dp-val">${p.path.replace('../outputs/', '')}</span></div>` : '';
  const protoBtn = p.path && p.path !== '#'
    ? `<a href="${p.path}" target="_blank" class="btn-dp-primary ${getSectionIdClass(sec)}">프로토타입 열기 →</a>` : '';
  const navPosText = idx >= 0 ? `${getSectionLabel(sec)} ${idx + 1} / ${list.length}` : '';

  panel.innerHTML = `
    <div class="resize-handle" id="panel-resize"></div>

    <div class="dp-sec">
      <div class="dp-header">
        <span class="dp-id ${getSectionIdClass(sec)}">${p.id}</span>
        <span class="dp-title">${p.name}</span>
      </div>
    </div>

    <div class="dp-sec">
      <div class="dp-label">페이지 정보</div>
      <div class="dp-rows">
        <div class="dp-row">
          <span class="dp-key">섹션</span>
          <span class="dp-val t">${getSectionLabel(sec)} — ${p.group}</span>
        </div>
        ${pathRow}
        <div class="dp-row">
          <span class="dp-key">순서</span>
          <span class="dp-val t">${idx >= 0 ? (idx + 1) + ' / ' + list.length : '—'}</span>
        </div>
      </div>
    </div>

    <div class="dp-sec">
      <div class="dp-label">태그</div>
      <div class="dp-tags">${tagsHtml}</div>
    </div>

    <div class="dp-sec">${descSection}</div>

    ${protoBtn ? `<div class="dp-sec">${protoBtn}</div>` : ''}

    <div class="dp-sec">
      <div class="dp-label">이동</div>
      <div class="dp-nav-row">
        <button class="btn-dp-sec" onclick="navigateDetail(-1)" ${idx <= 0 ? 'disabled' : ''}>◀ 이전</button>
        <button class="btn-dp-sec" onclick="navigateDetail(1)"  ${idx >= list.length - 1 ? 'disabled' : ''}>다음 ▶</button>
      </div>
      <div class="dp-pos">${navPosText}</div>
    </div>`;

  initPanelResize();
}

function updateNavButtons() {
  const list = getDetailNavList();
  const idx  = list.findIndex(p => p.id === currentDetailId);
  const prev = document.getElementById('btnPrev');
  const next = document.getElementById('btnNext');
  if (prev) prev.disabled = idx <= 0;
  if (next) next.disabled = idx >= list.length - 1;
}

function navigateDetail(dir) {
  const list   = getDetailNavList();
  const newIdx = list.findIndex(p => p.id === currentDetailId) + dir;
  if (newIdx < 0 || newIdx >= list.length) return;
  showDetail(list[newIdx].id);
}

function backToList() {
  currentDetailId = null;
  document.body.classList.remove('mode-detail');
  document.body.classList.add('mode-list');
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  render();
  if (lastDetailId) {
    setTimeout(() => {
      const card = document.querySelector(`.page-card[data-id="${lastDetailId}"]`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  }
}

function highlightSidebar(id) {
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  const item = document.querySelector(`.sb-item[data-id="${id}"]`);
  if (!item) return;
  item.classList.add('active');
  const groupItems = item.closest('.sb-group-items');
  if (groupItems && !groupItems.classList.contains('visible')) {
    groupItems.classList.add('visible');
    const lbl = groupItems.previousElementSibling;
    if (lbl) lbl.classList.add('open');
  }
  item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── 필터 & 뷰 ────────────────────────────────────────────
function setFilter(f) {
  currentFilter = f;
  ['all','doc','user','admin'].forEach(k => {
    const btn = document.getElementById('btn' + k.charAt(0).toUpperCase() + k.slice(1));
    if (btn) btn.classList.toggle('active', k === f);
  });
  if (document.body.classList.contains('mode-detail')) {
    updateNavButtons();
    const p = PAGES.find(pg => pg.id === currentDetailId);
    if (p) buildDescPanel(p);
  } else {
    render();
  }
}

function setView(v) {
  currentView = v;
  document.getElementById('btnGrid').classList.toggle('active', v === 'grid');
  document.getElementById('btnList').classList.toggle('active', v === 'list');
  if (!document.body.classList.contains('mode-detail')) render();
}

function filterSearch(kw) {
  searchKw = kw.trim();
  if (document.body.classList.contains('mode-detail')) {
    updateNavButtons();
  } else {
    render();
  }
}

// ── 이미지 모달 ───────────────────────────────────────────
function openModalCurrent() {
  if (!currentDetailId) return;
  const p = PAGES.find(pg => pg.id === currentDetailId);
  if (!p) return;
  document.getElementById('modalImg').src = `images/${p.img}`;
  document.getElementById('modalInfo').textContent =
    `${p.id} — ${p.name}${p.path && p.path !== '#' ? '  |  ' + p.path.replace('../outputs/', '') : ''}`;
  document.getElementById('imgModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  document.getElementById('imgModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('imgModal').classList.contains('open')) { closeModal(); return; }
    if (document.body.classList.contains('mode-detail')) backToList();
  }
  if (document.body.classList.contains('mode-detail') && !document.getElementById('imgModal').classList.contains('open')) {
    if (e.key === 'ArrowLeft')  navigateDetail(-1);
    if (e.key === 'ArrowRight') navigateDetail(1);
  }
});

// ── 사이드바 리사이즈 ─────────────────────────────────────
(function initSidebarResize() {
  const sidebar = document.getElementById('sidebar');
  const handle  = document.getElementById('sidebar-resize');
  if (!handle) return;
  let isResizing = false, startX = 0, startW = 0;
  handle.addEventListener('mousedown', e => {
    e.preventDefault(); isResizing = true; startX = e.clientX; startW = sidebar.offsetWidth;
    handle.classList.add('active'); document.body.classList.add('resizing');
  });
  document.addEventListener('mousemove', e => {
    if (!isResizing) return;
    const cs   = getComputedStyle(document.documentElement);
    const minW = parseInt(cs.getPropertyValue('--sidebar-min-w')) || 60;
    const maxW = parseInt(cs.getPropertyValue('--sidebar-max-w')) || 320;
    sidebar.style.width = Math.min(maxW, Math.max(minW, startW + e.clientX - startX)) + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (!isResizing) return; isResizing = false;
    handle.classList.remove('active'); document.body.classList.remove('resizing');
  });
})();

// ── 패널 리사이즈 ─────────────────────────────────────────
function initPanelResize() {
  const panel  = document.getElementById('desc-panel');
  const handle = document.getElementById('panel-resize');
  if (!handle || !panel) return;
  let isResizing = false, startX = 0, startW = 0;
  handle.addEventListener('mousedown', e => {
    e.preventDefault(); isResizing = true; startX = e.clientX; startW = panel.offsetWidth;
    handle.classList.add('active'); document.body.classList.add('resizing');
  });
  const onMove = e => {
    if (!isResizing) return;
    const cs   = getComputedStyle(document.documentElement);
    const minW = parseInt(cs.getPropertyValue('--panel-min-w')) || 250;
    const maxW = Math.min(parseInt(cs.getPropertyValue('--panel-max-w')) || 700, window.innerWidth * 0.5);
    panel.style.width = Math.min(maxW, Math.max(minW, startW + startX - e.clientX)) + 'px';
  };
  const onUp = () => {
    if (!isResizing) return; isResizing = false;
    handle.classList.remove('active'); document.body.classList.remove('resizing');
  };
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}
initPanelResize();

// ── PDF 내보내기 ──────────────────────────────────────────
function exportAllPDF() {
  const overlay       = document.getElementById('print-overlay');
  const sectionOrder  = ['doc', 'user', 'admin'];
  const sectionLabels = { doc: '프로젝트 문서', user: '사용자 페이지', admin: '관리자 페이지' };
  const projectName   = C.projectName || 'Storyboard';
  const version       = C.version     || '';

  let html = '';

  // 컨트롤 바
  html += `
    <div class="print-close-bar">
      <button class="btn-print" onclick="doPrint()">🖨 인쇄 / PDF 저장</button>
      <button class="btn-cancel" onclick="closePrintOverlay()">✕ 닫기</button>
      <span class="print-info">총 ${PAGES.length}개 화면 &nbsp;|&nbsp; 인쇄 시 A4 가로 권장 &nbsp;|&nbsp; "PDF로 저장" 선택</span>
    </div>`;

  // 표지
  html += `
    <div class="print-page print-divider-page">
      <div class="print-divider-inner">
        <div style="font-size:36px; font-weight:900; color:var(--green-dark); margin-bottom:8px;">${projectName}</div>
        <div style="font-size:24px; font-weight:700; color:var(--text); margin-bottom:24px;">스토리보드 ${version}</div>
        <div style="font-size:14px; color:var(--text-sm);">
          전체 ${PAGES.length}개 화면 &nbsp;|&nbsp;
          문서 ${PAGES.filter(p => p.section === 'doc').length} /
          사용자 ${PAGES.filter(p => p.section === 'user').length} /
          관리자 ${PAGES.filter(p => p.section === 'admin').length}
        </div>
        <div style="font-size:13px; color:var(--text-sm); margin-top:8px;">생성일: ${new Date().toLocaleDateString('ko-KR')}</div>
      </div>
    </div>`;

  // 목차
  const total = PAGES.length;
  let tocCols = 3, tocFont = 11, tocLH = 1.7;
  if (total > 80)      { tocCols = 4; tocFont = 9;  tocLH = 1.5; }
  else if (total > 60) { tocCols = 3; tocFont = 10; tocLH = 1.55; }
  else if (total > 40) { tocCols = 3; tocFont = 11; tocLH = 1.6; }

  html += `<div class="print-page print-toc-page">`;
  html += `<div class="print-section-title" style="margin-bottom:10px; padding-bottom:6px;">목차</div>`;
  html += `<div style="columns:${tocCols}; column-gap:16px; font-size:${tocFont}px; line-height:${tocLH}; column-fill:balance;">`;

  sectionOrder.forEach(sec => {
    const secPages = PAGES.filter(p => p.section === sec);
    if (!secPages.length) return;
    const borderColor = sec === 'admin' ? 'var(--admin-light)' : sec === 'doc' ? 'var(--doc-light)' : 'var(--green-light)';
    html += `<div style="font-size:${tocFont + 2}px; font-weight:700; color:var(--text); margin:8px 0 3px; padding-bottom:2px; border-bottom:2px solid ${borderColor};">${sectionLabels[sec]} (${secPages.length})</div>`;

    [...new Set(secPages.map(p => p.group))].forEach(g => {
      const items = secPages.filter(p => p.group === g);
      html += `<div style="break-inside:avoid-column; margin-bottom:4px;">`;
      html += `<div style="font-size:${tocFont}px; font-weight:700; color:var(--text-sm); margin:2px 0 1px;">${g}</div>`;
      items.forEach(p => {
        html += `<div style="padding-left:6px; font-size:${tocFont - 1}px; color:var(--gray-mid); line-height:${tocLH};">${p.id} ${p.name}</div>`;
      });
      html += `</div>`;
    });
  });
  html += `</div></div>`;

  // 화면별 페이지
  let lastSec = '';
  PAGES.forEach(p => {
    const sec      = p.section;
    const secClass = getSectionIdClass(sec);

    if (sec !== lastSec) {
      html += `
        <div class="print-page print-divider-page">
          <div class="print-divider-inner">
            <div class="print-divider-title ${secClass}">${sectionLabels[sec]}</div>
          </div>
        </div>`;
      lastSec = sec;
    }

    const spec     = SPECS[p.id] || '';
    const tagsHtml = (p.tags || [])
      .map(t => `<span class="tag ${t}" style="font-size:11px; padding:1px 5px;">${TAG_LABELS[t] || t}</span>`)
      .join('');

    let rightHtml = `
      <div class="print-desc-info">
        <div><strong>ID</strong><span>${p.id}</span></div>
        <div><strong>섹션</strong><span>${getSectionLabel(sec)} — ${p.group}</span></div>
        ${p.path && p.path !== '#' ? `<div><strong>경로</strong><span style="word-break:break-all; font-family:monospace; font-size:10px;">${p.path.replace('../outputs/', '')}</span></div>` : ''}
      </div>`;

    if (tagsHtml) rightHtml += `<div style="margin-top:8px;"><div class="print-desc-label">태그</div><div class="print-desc-tags">${tagsHtml}</div></div>`;

    if (spec) {
      rightHtml += `<div style="margin-top:10px;"><div class="print-desc-label">화면 스펙</div><div class="print-desc-body spec-content">${spec}</div></div>`;
    } else {
      rightHtml += `<div style="margin-top:10px;"><div class="print-desc-label">${sec === 'doc' ? '문서 설명' : '화면 설명'}</div><div class="print-desc-body">${p.desc}</div></div>`;
    }

    const noImgMsg = sec === 'doc' ? '📄 문서 이미지 미등록' : '🖼 스크린샷 미캡처';

    html += `
      <div class="print-page">
        <div class="print-page-header">
          <span class="print-page-id ${secClass}">${p.id}</span>
          <span class="print-page-name">${p.name}</span>
        </div>
        <div class="print-page-desc">${p.desc}</div>
        <div class="print-content-row">
          <div class="print-content-left">
            <img class="print-page-img" src="images/${p.img}" alt="${p.name}"
              onerror="this.outerHTML='<div class=\\'print-page-noimg\\'>${noImgMsg}</div>'">
          </div>
          <div class="print-content-right">${rightHtml}</div>
        </div>
      </div>`;
  });

  overlay.innerHTML = html;
  overlay.classList.add('active');
  overlay.scrollTop = 0;
}

function doPrint() {
  const overlay = document.getElementById('print-overlay');
  const app     = document.getElementById('app');
  const modal   = document.getElementById('imgModal');

  app.style.display = 'none';
  if (modal) modal.style.display = 'none';

  overlay.style.cssText = 'position:static; overflow:visible; height:auto; inset:auto; z-index:auto;';
  document.body.style.overflow = 'visible';
  document.body.style.height   = 'auto';
  document.documentElement.style.overflow = 'visible';
  document.documentElement.style.height   = 'auto';

  setTimeout(() => {
    window.print();
    app.style.display = '';
    if (modal) modal.style.display = '';
    overlay.style.cssText = '';
    document.body.style.overflow = '';
    document.body.style.height   = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.height   = '';
  }, 100);
}

function closePrintOverlay() {
  const overlay = document.getElementById('print-overlay');
  overlay.classList.remove('active');
  overlay.innerHTML = '';
}

// ── 초기화 ────────────────────────────────────────────────
buildSidebar();
render();
