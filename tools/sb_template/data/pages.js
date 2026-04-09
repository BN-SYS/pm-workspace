/**
 * pages.js — 화면 목록
 *
 * ★ 화면 추가/삭제 시 이 파일만 수정한다.
 * ★ capture.ps1 의 배열도 동일하게 맞춰야 한다.
 *
 * id 규칙:
 *   프로젝트 문서 → DOC##  (예: DOC05)
 *   사용자 화면   → U##    (예: U01)
 *   관리자 화면   → A##    (예: A01)
 *
 * section 값: 'doc' | 'user' | 'admin'
 *
 * tags 목록:
 *   list, detail, form, write, modal, auth, member-only, admin-only, static
 */

window.PAGES = [

  // ══════════════════════════════════════════
  // 프로젝트 문서 (section: 'doc')
  // ══════════════════════════════════════════
  {
    id: 'DOC05', section: 'doc', group: 'Documents', name: '공통 레이아웃',
    path: '#', img: 'DOC05_공통_레이아웃.png', tags: ['static'],
    desc: '헤더, 푸터, GNB 등 공통 레이아웃 정의'
  },
  {
    id: 'DOC06', section: 'doc', group: 'Documents', name: '공통 컴포넌트',
    path: '#', img: 'DOC06_공통_컴포넌트.png', tags: ['static'],
    desc: 'Alert, Toast, 페이지네이션 등 공통 UI 컴포넌트 정의'
  },

  // ══════════════════════════════════════════
  // 사용자 화면 (section: 'user')
  // ══════════════════════════════════════════
  {
    id: 'U01', section: 'user', group: '메인', name: '홈 메인',
    path: '../outputs/index.html', img: 'U01_홈_메인.png', tags: [],
    desc: '사이트 메인 홈 화면'
  },

  // ══════════════════════════════════════════
  // 관리자 화면 (section: 'admin')
  // ══════════════════════════════════════════
  {
    id: 'A01', section: 'admin', group: '회원관리', name: '회원 목록',
    path: '../outputs/admin/members.html', img: 'A01_회원_목록.png', tags: ['list', 'admin-only'],
    desc: '전체 회원 목록 조회 및 필터링'
  },

];
