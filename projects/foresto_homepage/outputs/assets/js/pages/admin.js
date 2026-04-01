/* =============================================
   admin.js | 관리자 공통 로직 (레이아웃 + 권한 + 사이드바)
   ============================================= */
'use strict';

/* ── 관리자 사이드바 네비게이션 데이터 (2단 계층) */
/* 아이콘 경로: assets/icons/ (admin 페이지 기준 상대경로) */
const _ICO = name => `../assets/icons/${name}.png`;

const ADMIN_NAV = [
  {
    key: 'member-group', ico: _ICO('users'), label: '회원관리',
    children: [
      { key: 'members',   href: 'members.html',          label: '회원관리' },
      { key: 'withdrawn', href: 'members-withdrawn.html', label: '탈퇴회원' },
    ]
  },

  {
    key: 'course-group', ico: _ICO('academic-cap'), label: '강좌관리',
    children: [
      { key: 'course-basic',      href: 'courses.html',              label: '기초과정 관리' },
      { key: 'course-qualify',    href: 'courses.html?type=qualify', label: '자격취득과정 관리' },
      { key: 'course-enhance',    href: 'courses.html?type=enhance', label: '역량강화 관리' },
      { key: 'course-academy',    href: 'courses.html?type=academy', label: '회원아카데미 관리' },
      { key: 'course-applicants', href: 'applicants.html',            label: '신청자 통합 관리' },
    ]
  },

  { key: 'calendar', href: 'calendar.html', ico: _ICO('calendar'), label: '일정관리' },

  {
    key: 'board-group', ico: _ICO('collection'), label: '게시판관리',
    children: [
      { key: 'board-notice',       href: 'board.html?type=notice',       label: '공지사항 관리' },
      { key: 'board-newsletter',   href: 'board.html?type=newsletter',   label: '협회지 관리' },
      { key: 'board-press',        href: 'board.html?type=press',        label: '언론보도 관리' },
      { key: 'board-forest-work',  href: 'board.html?type=forest-work',  label: '숲일터 관리' },
      { key: 'board-region',  href: 'board.html?type=region',  label: '전국지역협회 관리' },
      { key: 'board-intro',   href: 'board.html?type=intro',   label: '사공단소개 관리' },
      { key: 'board-club',    href: 'board.html?type=club',    label: '동아리소개 관리' },
    ]
  },

  {
    key: 'site-group', ico: _ICO('cog'), label: '사이트관리',
    children: [
      { key: 'site-banner', href: 'banner.html', label: '배너 관리' },
      { key: 'site-popup',  href: 'popup.html', label: '팝업 관리' },
    ]
  },

  {
    key: 'content-group', ico: _ICO('pencil-alt'), label: '콘텐츠관리',
    children: [
      { key: 'history',      href: 'history.html',      label: '연혁 관리' },
      { key: 'organization', href: 'organization.html', label: '조직도·임원진 관리' },
    ]
  },

  {
    key: 'apply-group', ico: _ICO('inbox'), label: '기타신청관리',
    children: [
      { key: 'apply-regular',       href: 'apply-regular.html',          label: '정회원신청자 관리' },
      { key: 'apply-forest',        href: 'apply-forest.html',            label: '숲해설신청자 관리' },
      { key: 'apply-sponsor',       href: 'apply-sponsor.html',           label: '후원신청자 관리' },
      { key: 'instructor-schedule', href: 'instructor-schedule.html',     label: '강사신청 일정관리' },
      { key: 'apply-instructor',    href: 'apply-instructor.html',        label: '강사신청자 관리' },
    ]
  },
];


/* ── AdminSidebar: 2단 아코디언 사이드바 */
const AdminSidebar = {

  /**
   * @param {string} activeKey - ADMIN_NAV leaf key (예: 'members', 'course-basic')
   */
  mount(activeKey) {
    const mountEl = document.getElementById('adminNavMount');
    if (!mountEl) return;

    /* 현재 페이지가 속한 그룹 키 찾기 */
    const activeGroupKey = (() => {
      for (const item of ADMIN_NAV) {
        if (item.children && item.children.some(c => c.key === activeKey)) {
          return item.key;
        }
      }
      return null;
    })();

    mountEl.innerHTML = ADMIN_NAV.map(item => {

      /* 단독 메뉴 (하위 없음) */
      if (!item.children) {
        return `
          <a href="${item.href}"
             class="admin-nav-item ${item.key === activeKey ? 'active' : ''}"
             aria-current="${item.key === activeKey ? 'page' : 'false'}">
            <img class="nav-ico" src="${item.ico}" alt="" aria-hidden="true">
            <span class="nav-txt">${item.label}</span>
          </a>`;
      }

      /* 그룹 메뉴 (아코디언) */
      const isOpen    = item.key === activeGroupKey;
      const firstHref = item.children[0].href;

      return `
        <div class="nav-group ${isOpen ? 'open' : ''}">
          <button class="admin-nav-item nav-group-header"
                  onclick="AdminSidebar.toggleGroup(this, '${firstHref}')">
            <img class="nav-ico" src="${item.ico}" alt="" aria-hidden="true">
            <span class="nav-txt">${item.label}</span>
            <img class="nav-arrow" src="${_ICO('chevron-right')}" alt="" aria-hidden="true">
          </button>
          <div class="nav-submenu">
            ${item.children.map(child => `
              <a href="${child.href}"
                 class="nav-sub-item ${child.key === activeKey ? 'active' : ''}">
                ${child.label}
              </a>`).join('')}
          </div>
        </div>`;

    }).join('');
  },


  /**
   * 그룹 헤더 클릭 시 — 열기/닫기 + 첫 번째 하위 메뉴 이동
   * @param {HTMLElement} btn
   * @param {string}      firstHref
   */
  toggleGroup(btn, firstHref) {
    const group  = btn.closest('.nav-group');
    const isOpen = group.classList.contains('open');

    /* 다른 그룹 모두 닫기 */
    document.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));

    if (!isOpen) {
      group.classList.add('open');
      /* 첫 번째 하위 페이지로 이동 */
      if (firstHref && firstHref !== '#') {
        location.href = firstHref;
      }
    }
  },
};


/* ── 관리자 전용 TOPBAR — 사이트 헤더·푸터 대체
   모든 관리자 페이지에 DOMContentLoaded 시 자동 주입 */
const AdminTopbar = {

  render() {
    return `
      <button class="adm-mobile-menu-btn" onclick="AdminLayout.toggleSidebar()" aria-label="메뉴 열기">
        <img src="../assets/icons/menu.png" alt="메뉴" onerror="this.style.display='none';this.parentNode.textContent='☰'">
      </button>
      <div class="adm-brand" style="display:flex;align-items:center;gap:10px;text-decoration:none;cursor:default">
        <span class="adm-brand-text">한국숲해설가협회</span>
        <span class="adm-brand-badge">Admin</span>
      </div>
      <div class="adm-topbar-right">
        <div class="adm-user">
          <div class="adm-user-avatar">A</div>
          <span class="adm-user-name">관리자</span>
        </div>
        <div class="adm-divider"></div>
        <a href="../index.html" class="adm-home-btn" target="_blank">HOMEPAGE</a>
        <button class="adm-logout-btn" onclick="AdminTopbar.logout()">로그아웃</button>
      </div>`;
  },

  logout() {
    if (!confirm('로그아웃 하시겠습니까?')) return;
    /* 실제 구현 시 세션/토큰 삭제 후 로그인 페이지로 이동 */
    App.toast('로그아웃 되었습니다.', 'success');
    setTimeout(() => { location.href = '../index.html'; }, 800);
  },

  mount() {
    /* 이미 주입된 경우 중복 방지 */
    if (document.querySelector('.adm-topbar')) return;

    const topbar = document.createElement('header');
    topbar.className = 'adm-topbar';
    topbar.id        = 'adminTopbarEl';
    topbar.innerHTML = this.render();

    /* .admin-layout 앞에 삽입 */
    const layout = document.querySelector('.admin-layout');
    if (layout && layout.parentNode) {
      layout.parentNode.insertBefore(topbar, layout);
    } else {
      document.body.prepend(topbar);
    }

    /* 모바일 사이드바 backdrop 주입 */
    if (!document.getElementById('sidebarBackdrop')) {
      const bd = document.createElement('div');
      bd.className = 'sidebar-backdrop';
      bd.id        = 'sidebarBackdrop';
      bd.addEventListener('click', () => AdminLayout.closeSidebar());
      document.body.appendChild(bd);
    }
  },
};

/* 모든 관리자 페이지 자동 실행 */
document.addEventListener('DOMContentLoaded', () => AdminTopbar.mount());


/* ── 관리자 레이아웃 */
const AdminLayout = {

  toggleSidebar() {
    const sb = document.getElementById('adminSidebar');
    if (!sb) return;

    if (window.innerWidth <= 1100) {
      /* 모바일: slide-in overlay + backdrop */
      const isOpen = sb.classList.toggle('mobile-open');
      const bd = document.getElementById('sidebarBackdrop');
      if (bd) bd.classList.toggle('open', isOpen);
    } else {
      /* PC: 아이콘 모드 토글 */
      const layout = document.querySelector('.admin-layout');
      layout && layout.classList.toggle('sidebar-collapsed');
    }
  },

  closeSidebar() {
    const sb = document.getElementById('adminSidebar');
    const bd = document.getElementById('sidebarBackdrop');
    if (sb) sb.classList.remove('mobile-open');
    if (bd) bd.classList.remove('open');
  },

};


/* ── 관리자 권한 체크
   PHP 세션 처리 완료 후 아래 블록 주석 해제
   세션 체크는 서버사이드(PHP)에서도 반드시 수행할 것 */
// (function checkAdminAuth() {
//   if (typeof App !== 'undefined' && App.user.role !== 'admin') {
//     alert('관리자만 접근 가능합니다.');
//     location.href = '../index.html';
//   }
// })();


/* ══════════════════════════════════════════════
   PHP 연동 API 엔드포인트 설정
   ──────────────────────────────────────────────
   실제 연동 시 이 상수들을 기준으로 fetch() 교체
   Laravel: /admin/api/...  |  CI: /admin/ajax/...
   ══════════════════════════════════════════════ */
const ADMIN_API = {
  base: '/admin/api',            /* ← 배포 환경에 맞게 수정 */

  /* 회원 */
  members:         '/admin/api/members',
  memberDetail:    '/admin/api/members/:id',
  memberSave:      '/admin/api/members/save',
  memberDelete:    '/admin/api/members/delete',
  memberExcel:     '/admin/api/members/export',

  /* 강좌 */
  courses:         '/admin/api/courses',
  courseDetail:    '/admin/api/courses/:id',
  courseSave:      '/admin/api/courses/save',
  courseDelete:    '/admin/api/courses/delete',
  applicants:      '/admin/api/courses/applicants',   /* 신청자 통합 목록 */

  /* 일정 */
  calendar:        '/admin/api/calendar',
  calendarSave:    '/admin/api/calendar/save',
  calendarDelete:  '/admin/api/calendar/delete',

  /* 게시판 (type 파라미터로 구분) */
  board:           '/admin/api/board',                /* ?type=notice|newsletter|... */
  boardSave:       '/admin/api/board/save',
  boardDelete:     '/admin/api/board/delete',
  boardPin:        '/admin/api/board/pin',

  /* 기타 신청 */
  applyRegular:    '/admin/api/apply/regular',
  applyInstructor: '/admin/api/apply/instructor',
  applyForest:     '/admin/api/apply/forest',
  applySponsor:    '/admin/api/apply/sponsor',
  applyStatusSave: '/admin/api/apply/status',        /* 처리상태 일괄변경 */

  /* 콘텐츠 */
  history:         '/admin/api/content/history',
  historySave:     '/admin/api/content/history/save',
  organization:    '/admin/api/content/organization',

  /* 사이트 관리 */
  banner:          '/admin/api/site/banner',
  bannerSave:      '/admin/api/site/banner/save',
  bannerOrder:     '/admin/api/site/banner/order',
  popup:           '/admin/api/site/popup',
  popupSave:       '/admin/api/site/popup/save',
};

/**
 * ADMIN_API 사용 예시 (fetch 기반)
 *
 * // 목록 조회
 * fetch(ADMIN_API.members + '?page=1&size=10&status=active')
 *   .then(r => r.json())
 *   .then(data => { ... });
 *
 * // 저장
 * fetch(ADMIN_API.memberSave, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '...' },
 *   body: JSON.stringify(formData)
 * }).then(r => r.json()).then(...);
 *
 * // ID 치환
 * fetch(ADMIN_API.memberDetail.replace(':id', memberId))
 */
