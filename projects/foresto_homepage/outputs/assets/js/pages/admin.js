/* =============================================
   admin.js | 관리자 공통 로직 (레이아웃 + 권한 + 사이드바)
   ============================================= */
'use strict';

/* ── 관리자 사이드바 네비게이션 데이터 */
const ADMIN_NAV = [
  { key: 'dashboard',    href: 'index.html',              ico: '📊', label: '대시보드' },
  { key: 'members',      href: 'members.html',            ico: '👥', label: '회원관리' },
  { key: 'withdrawn',    href: 'members-withdrawn.html',  ico: '🚪', label: '탈퇴회원' },
  { key: 'courses',      href: 'courses.html',            ico: '📚', label: '강좌관리' },
  { key: 'calendar',     href: 'calendar.html',           ico: '📅', label: '일정관리' },
  { key: 'history',      href: 'history.html',            ico: '🕐', label: '연혁관리' },
  { key: 'organization', href: 'organization.html',       ico: '🏛', label: '조직도/임원진' },
  { key: 'content',      href: 'content.html',            ico: '📝', label: '콘텐츠관리' },
];

/* ── AdminSidebar: 마운트 포인트(#adminNavMount)에 nav 항목을 주입 */
const AdminSidebar = {

  /**
   * @param {string} activeKey - ADMIN_NAV의 key 값
   */
  mount(activeKey) {
    const mountEl = document.getElementById('adminNavMount');
    if (!mountEl) return;

    mountEl.innerHTML = ADMIN_NAV.map(item => `
      <a href="${item.href}"
         class="admin-nav-item ${item.key === activeKey ? 'active' : ''}"
         aria-current="${item.key === activeKey ? 'page' : 'false'}">

        <span class="nav-ico" aria-hidden="true">${item.ico}</span>
        <span class="nav-txt">${item.label}</span>

      </a>
    `).join('');
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