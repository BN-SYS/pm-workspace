/* =============================================
   admin.js | 관리자 공통 로직 (레이아웃 + 권한 + 사이드바)
   ============================================= */
'use strict';

/* ── 관리자 사이드바 네비게이션 데이터 (2단 계층) */
const ADMIN_NAV = [
  {
    key: 'member-group', ico: '👥', label: '회원관리',
    children: [
      { key: 'members',   href: 'members.html',          label: '회원관리' },
      { key: 'withdrawn', href: 'members-withdrawn.html', label: '탈퇴회원' },
    ]
  },

  {
    key: 'course-group', ico: '📚', label: '강좌관리',
    children: [
      { key: 'course-basic',      href: 'courses.html', label: '기초과정 관리' },
      { key: 'course-qualify',    href: '#',            label: '자격취득과정 관리' },
      { key: 'course-enhance',    href: '#',            label: '역량강화 관리' },
      { key: 'course-academy',    href: '#',            label: '회원아카데미 관리' },
      { key: 'course-applicants', href: '#',            label: '신청자 통합 관리' },
    ]
  },

  { key: 'calendar', href: 'calendar.html', ico: '📅', label: '일정관리' },

  {
    key: 'board-group', ico: '📋', label: '게시판관리',
    children: [
      { key: 'board-notice', href: '#', label: '공지사항 관리' },
      { key: 'board-region', href: '#', label: '전국지역협회 관리' },
      { key: 'board-intro',  href: '#', label: '사공단소개 관리' },
      { key: 'board-club',   href: '#', label: '동아리소개 관리' },
    ]
  },

  {
    key: 'site-group', ico: '⚙️', label: '사이트관리',
    children: [
      { key: 'site-banner', href: '#', label: '배너 관리' },
      { key: 'site-popup',  href: '#', label: '팝업 관리' },
    ]
  },

  {
    key: 'content-group', ico: '📝', label: '콘텐츠관리',
    children: [
      { key: 'history',      href: 'history.html',      label: '연혁 관리' },
      { key: 'organization', href: 'organization.html', label: '조직도·임원진 관리' },
    ]
  },

  {
    key: 'apply-group', ico: '📩', label: '기타신청관리',
    children: [
      { key: 'apply-regular',    href: '#', label: '정회원신청 관리' },
      { key: 'apply-instructor', href: '#', label: '강사신청 관리' },
      { key: 'apply-forest',     href: '#', label: '숲해설신청 관리' },
      { key: 'apply-sponsor',    href: '#', label: '후원신청 관리' },
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
            <span class="nav-ico" aria-hidden="true">${item.ico}</span>
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
            <span class="nav-ico" aria-hidden="true">${item.ico}</span>
            <span class="nav-txt">${item.label}</span>
            <span class="nav-arrow" aria-hidden="true"></span>
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
      <div class="adm-brand" style="display:flex;align-items:center;gap:10px;text-decoration:none;cursor:default">
        <div class="adm-brand-icon">🌲</div>
        <span class="adm-brand-text">한국숲해설가협회</span>
        <span class="adm-brand-badge">Admin</span>
      </div>
      <div class="adm-topbar-right">
        <a href="../index.html" class="adm-home-btn" target="_blank">홈페이지</a>
        <div class="adm-divider"></div>
        <div class="adm-user">
          <div class="adm-user-avatar">A</div>
          <span class="adm-user-name">관리자</span>
        </div>
        <div class="adm-divider"></div>
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
  },
};

/* 모든 관리자 페이지 자동 실행 */
document.addEventListener('DOMContentLoaded', () => AdminTopbar.mount());


/* ── 관리자 레이아웃 */
const AdminLayout = {

  toggleSidebar() {
    const sb     = document.getElementById('adminSidebar');
    const layout = document.querySelector('.admin-layout');

    if (!sb) return;

    if (window.innerWidth <= 900) {
      sb.classList.toggle('mobile-open');
    } else {
      layout && layout.classList.toggle('sidebar-collapsed');
    }
  },

};


/* ── 관리자 권한 체크 */
// (function checkAdminAuth() {
//   if (typeof App !== 'undefined' && App.user.role !== 'admin') {
//     alert('관리자만 접근 가능합니다.');
//     location.href = '../index.html';
//   }
// })();
