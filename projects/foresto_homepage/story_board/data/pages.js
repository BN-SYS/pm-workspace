/**
 * pages.js — 한국숲해설가협회 스토리보드 화면 목록
 *
 * ▸ 이 파일을 수정해서 화면 메타데이터를 관리한다.
 * ▸ 새 화면 추가 시: PAGES 배열에 항목 추가 (포맷은 기존 항목 참고)
 * ▸ id 규칙: 프로젝트문서 = DOC-##, 사용자 = U##, 관리자 = A##
 */

window.PAGES = [

  // ══════════════════════════════════════════
  // 프로젝트 문서
  // ══════════════════════════════════════════
  {
    id: 'DOC-01', section: 'doc', group: 'Documents', name: 'Document History',
    path: '#', img: 'doc-history.png', tags: [],
    desc: '문서 버전 이력 및 변경 사항 기록'
  },
  {
    id: 'DOC-02', section: 'doc', group: 'Documents', name: '문서 정의',
    path: '#', img: 'doc-definition.png', tags: [],
    desc: '본 스토리보드 문서의 목적, 범위, 용어 정의'
  },
  {
    id: 'DOC-03', section: 'doc', group: 'Documents', name: 'IA',
    path: '#', img: 'ia.png', tags: [],
    desc: '전체 사이트맵 및 정보 구조도'
  },
  {
    id: 'DOC-04', section: 'doc', group: 'Documents', name: '사용자 Flow Chart',
    path: 'flowchart.html', img: 'flowchart.png', tags: [],
    desc: '사용자 주요 태스크별 화면 흐름도'
  },
  {
    id: 'DOC-05', section: 'doc', group: 'Documents', name: '공통 레이아웃_사용자',
    path: '#', img: 'DOC05_사용자_공통레이아웃.png', tags: [],
    desc: 'Header, Footer, GNB 등 공통 레이아웃 구성 및 규칙'
  },
{
    id: 'DOC-06', section: 'doc', group: 'Documents', name: '공통 레이아웃_관리자',
    path: '#', img: 'DOC06_관리자_공통레이아웃.png', tags: [],
    desc: 'Header, Footer, GNB 등 관리자 공통 레이아웃 구성 및 규칙'
  },


  // ══════════════════════════════════════════
  // 사용자 페이지
  // ══════════════════════════════════════════

  // ── 메인 ──────────────────────────────────
  {
    id: 'U01', section: 'user', group: '메인', name: '홈 메인', path: '../outputs/index.html', img: 'U01_홈_메인.png',
    tags: [], desc: '사이트 진입점. 메인 슬라이더 배너, 최근 교육 일정, 공지사항 미리보기, 협회 캘린더 미니뷰, 갤러리 섹션으로 구성. 배너 데이터는 관리자 배너관리에서 연동.'
  },

  // ── 소개 ──────────────────────────────────
  {
    id: 'U02', section: 'user', group: '소개', name: '인사말', path: '../outputs/about/index.html', img: 'U02_소개_인사말.png',
    tags: [ 'static' ], desc: '협회장 인사말 이미지 + 텍스트 구성.'
  },
  {
    id: 'U03', section: 'user', group: '소개', name: '미션/비전', path: '../outputs/about/vision.html', img: 'U03_소개_미션비전.png',
    tags: ['static'], desc: '협회 미션·비전·핵심가치 소개.'
  },
  {
    id: 'U04', section: 'user', group: '소개', name: '주요사업', path: '../outputs/about/project.html', img: 'U04_소개_주요사업.png',
    tags: ['static'], desc: '협회 주요사업 목록 및 설명.<br>카드형 레이아웃.'
  },
  {
    id: 'U05', section: 'user', group: '소개', name: '연혁', path: '../outputs/about/history.html', img: 'U05_소개_연혁.png',
    tags: [], desc: '타임라인형 연혁. 연도별 이미지+내용. 관리자 연혁관리(A24~A25)에서 CRUD 연동.'
  },
  {
    id: 'U06', section: 'user', group: '소개', name: '조직도/임원진', path: '../outputs/about/members.html', img: 'U06_소개_조직도임원진.png',
    tags: [], desc: '조직도 이미지 + 임원진 카드 그리드(2열). 임원진 프로필 hover 시 상세 portrait 노출. 관리자 조직도 관리(A23) 연동.'
  },
  {
    id: 'U07', section: 'user', group: '소개', name: '전국지역협회', path: '../outputs/about/regions.html', img: 'U07_소개_전국지역협회.png',
    tags: [], desc: '지역 협회 목록. 지역 필터 탭 + 카드 목록. 카드 클릭 시 지역협회 상세(U08)로 이동.'
  },
  {
    id: 'U08', section: 'user', group: '소개', name: '지역협회 상세', path: '../outputs/about/region-detail.html', img: 'U08_소개_지역협회_상세.png',
    tags: ['detail'], desc: '특정 지역협회 상세 정보. URL 파라미터 ?id=로 특정 협회 조회. 연락처·활동 소개 포함.'
  },
  {
    id: 'U09', section: 'user', group: '소개', name: '회원규정', path: '../outputs/about/regulation.html', img: 'U09_소개_회원규정.png',
    tags: ['static'], desc: '회원 규정 전문.'
  },
  {
    id: 'U10', section: 'user', group: '소개', name: '오시는길', path: '../outputs/about/contact.html', img: 'U10_소개_오시는길.png',
    tags: ['static'], desc: '협회 주소 + 지도(카카오맵 API 삽입).'
  },

  // ── 교육 ──────────────────────────────────
  {
    id: 'U11', section: 'user', group: '교육', name: '숲해설가란', path: '../outputs/education/forester.html', img: 'U11_교육_숲해설가란.png',
    tags: ['static'], desc: '숲해설가 직무 소개 페이지.'
  },
  {
    id: 'U12', section: 'user', group: '교육', name: 'FAQ', path: '../outputs/education/faq.html', img: 'U12_교육_FAQ.png',
    tags: ['static'], desc: '자주 묻는 질문.<br>아코디언형 Q&A.<br>콘텐츠 하드코딩.'
  },
  {
    id: 'U13', section: 'user', group: '교육', name: '기초과정 개요', path: '../outputs/education/academy.html', img: 'U13_교육_기초과정_개요.png',
    tags: ['static'], desc: '숲해설가 기초 양성과정 소개.<br>커리큘럼·일정·신청 방법 안내.<br>신청 CTA → academy-apply(U14)로 이동.'
  },
  {
    id: 'U14', section: 'user', group: '교육', name: '기초과정 신청', path: '../outputs/education/academy-apply.html', img: 'U14_교육_기초과정_신청.png',
    tags: ['form', 'auth'], desc: '기초과정 수강 신청 폼. 비회원도 접근 가능하나 제출 시 로그인 유도. 신청 데이터 → 강좌신청자(A08) 연동.'
  },
  {
    id: 'U15', section: 'user', group: '교육', name: '자격취득 과정 소개', path: '../outputs/education/course-intro.html', img: 'U15_교육_자격취득_과정소개.png',
    tags: ['static'], desc: '자격취득 과정 전체 안내.<br>과정 종류 탭(기초/심화/전문 등).<br>각 과정 클릭 → course-list(U16)로 이동.'
  },
  {
    id: 'U16', section: 'user', group: '교육', name: '자격취득 목록', path: '../outputs/education/course-list.html', img: 'U16_교육_자격취득_목록.png',
    tags: ['list'], desc: '개설 강좌 목록. 기간·모집상태 필터. 카드형 그리드. 관리자 강좌관리(A05) 데이터 연동. 접수중 상태 표시 필수.'
  },
  {
    id: 'U17', section: 'user', group: '교육', name: '과정 상세', path: '../outputs/education/course-detail.html', img: 'U17_교육_자격취득_상세.png',
    tags: ['detail', 'auth'], desc: '강좌 상세. URL ?id=로 조회. 커리큘럼·강사·일정 정보 표시. 신청하기 버튼 → 로그인 필요. 신청 기간 외에는 버튼 비활성화.'
  },
  {
    id: 'U18', section: 'user', group: '교육', name: '역량강화 과정', path: '../outputs/education/job-training.html', img: 'U18_교육_역량강화_과정.png',
    tags: ['list'], desc: '역량강화 교육과정 목록 및 소개. 강좌 리스트 형태. 관리자 강좌관리 연동.'
  },
  {
    id: 'U19', section: 'user', group: '교육', name: '역량강화 신청', path: '../outputs/education/job-training-apply.html', img: 'U19_교육_역량강화_신청.png',
    tags: ['form', 'auth'], desc: '역량강화 과정 신청 폼. 로그인 필요. 신청 데이터 → 강좌신청자(A08) 연동.'
  },
  {
    id: 'U20', section: 'user', group: '교육', name: '수료생 후기 목록', path: '../outputs/education/reviews.html', img: 'U20_교육_수료생_후기목록.png',
    tags: ['list'], desc: '수료생 후기 게시판 목록. 카드형. 관리자 게시판관리 board_type=review 연동.'
  },
  {
    id: 'U21', section: 'user', group: '교육', name: '수료생 후기 상세', path: '../outputs/education/review-detail.html', img: 'U21_교육_수료생_후기상세.png',
    tags: ['detail'], desc: '후기 상세 페이지. URL ?id=로 조회. 이전/다음 글 이동 링크 포함.'
  },

  // ── 회원 전용 ──────────────────────────────
  {
    id: 'U22', section: 'user', group: '회원 전용', name: '특강 목록', path: '../outputs/member/competency.html', img: 'U22_회원_특강_목록.png',
    tags: ['member-only', 'list'], desc: '회원 전용 특강 목록. 비회원 접근 시 로그인 유도. 관리자 강좌관리 타입=특강 연동.'
  },
  {
    id: 'U23', section: 'user', group: '회원 전용', name: '특강 상세', path: '../outputs/member/competency-detail.html', img: 'U23_회원_특강_상세.png',
    tags: ['member-only', 'detail'], desc: '특강 상세. 신청하기 버튼 → 회원만 가능. 신청 데이터 강좌신청자 연동.'
  },
  {
    id: 'U24', section: 'user', group: '회원 전용', name: '아카데미강좌 목록', path: '../outputs/member/academy-course.html', img: 'U24_회원_아카데미강좌_목록.png',
    tags: ['member-only', 'list'], desc: '회원 아카데미 강좌 목록. 관리자 강좌관리 타입=아카데미 연동.'
  },
  {
    id: 'U25', section: 'user', group: '회원 전용', name: '아카데미강좌 상세', path: '../outputs/member/academy-course-detail.html', img: 'U25_회원_아카데미강좌_상세.png',
    tags: ['member-only', 'detail'], desc: '아카데미 강좌 상세. 신청 기능 포함.'
  },
  {
    id: 'U26', section: 'user', group: '회원 전용', name: '멘토링 목록', path: '../outputs/member/mentoring.html', img: 'U26_회원_멘토링_목록.png',
    tags: ['member-only', 'list'], desc: '멘토링 프로그램 목록. 회원 전용. 신청 가능 여부 상태 표시.'
  },
  {
    id: 'U27', section: 'user', group: '회원 전용', name: '멘토링 상세', path: '../outputs/member/mentoring-detail.html', img: 'U27_회원_멘토링_상세.png',
    tags: ['member-only', 'detail'], desc: '멘토링 상세 + 신청 폼.'
  },
  {
    id: 'U28', section: 'user', group: '회원 전용', name: '사공단 소개', path: '../outputs/member/sagongdan.html', img: 'U28_회원_사공단_소개.png',
    tags: ['member-only'], desc: '사공단(사회공헌단) 소개. 사공단 소식·일지 목록 진입 링크 포함.'
  },
  {
    id: 'U29', section: 'user', group: '회원 전용', name: '사공단 소식', path: '../outputs/member/sagongdan-news.html', img: 'U29_회원_사공단_소식목록.png',
    tags: ['member-only', 'list'], desc: '사공단 소식 게시판 목록+상세. 회원만 접근. 관리자 게시판관리 board_type=sagongdan-news 연동.'
  },
  {
    id: 'U30', section: 'user', group: '회원 전용', name: '사공단 일지', path: '../outputs/member/sagongdan-log.html', img: 'U30_회원_사공단_일지목록.png',
    tags: ['member-only', 'list'], desc: '사공단 활동 일지 목록. board_type=sagongdan-log 연동.'
  },
  {
    id: 'U31', section: 'user', group: '회원 전용', name: '동아리 목록', path: '../outputs/member/club.html', img: 'U31_회원_동아리_목록.png',
    tags: ['member-only', 'list'], desc: '동아리 목록. 카드형 그리드. 회원모집중 배지 표시. 동아리 소식·자료 게시판 진입 링크 포함.'
  },
  {
    id: 'U32', section: 'user', group: '회원 전용', name: '강사신청 일정목록', path: '../outputs/member/instructor.html', img: 'U32_회원_강사신청_일정목록.png',
    tags: ['member-only', 'list'], desc: '강사 활동 신청 가능 일정 목록. 비회원 클릭 시 toast 차단. 관리자 강좌관리(A05~A10)와 동일 구조로 운영.'
  },
  {
    id: 'U33', section: 'user', group: '회원 전용', name: '강사신청 일정상세', path: '../outputs/member/instructor-detail.html', img: 'U33_회원_강사신청_일정상세.png',
    tags: ['member-only', 'form'], desc: '일정 상세 + 신청 모달. 신청 데이터 → 관리자 강좌관리 패턴으로 운영. 중복 신청 방지 처리 필요.'
  },
  {
    id: 'U34', section: 'user', group: '회원 전용', name: '숲일터 목록', path: '../outputs/member/forest-work.html', img: 'U34_회원_숲일터_목록.png',
    tags: ['member-only', 'list'], desc: '숲일터 일자리 정보 게시판 목록. board_type=forest-work 연동.'
  },
  {
    id: 'U35', section: 'user', group: '회원 전용', name: '숲일터 상세', path: '../outputs/member/forest-work-detail.html', img: 'U35_회원_숲일터_상세.png',
    tags: ['member-only', 'detail'], desc: '숲일터 공고 상세. 첨부파일 다운로드 링크 포함.'
  },

  // ── 커뮤니티 ──────────────────────────────
  {
    id: 'U36', section: 'user', group: '커뮤니티', name: '공지사항 목록', path: '../outputs/community/notice-list.html', img: 'U36_커뮤니티_공지사항_목록.png',
    tags: ['list'], desc: '공지사항 목록. 상단 고정글 구분 표시. 페이지네이션. 관리자 게시판(board_type=notice) 연동.'
  },
  {
    id: 'U37', section: 'user', group: '커뮤니티', name: '공지사항 상세', path: '../outputs/community/notice-detail.html', img: 'U37_커뮤니티_공지사항_상세.png',
    tags: ['detail'], desc: '공지사항 상세. 첨부파일 다운로드. 이전/다음 글 이동.'
  },
  {
    id: 'U38', section: 'user', group: '커뮤니티', name: '협회 캘린더', path: '../outputs/community/calendar.html', img: 'U38_커뮤니티_협회캘린더.png',
    tags: [], desc: '월별 일정 달력. 날짜 클릭 시 해당 일정 목록 표시. 일정 클릭 시 상세 페이지 이동. 관리자 일정관리(A17~A19) 연동.'
  },
  {
    id: 'U39', section: 'user', group: '커뮤니티', name: '협회지 목록', path: '../outputs/community/newsletter.html', img: 'U39_커뮤니티_협회지_목록.png',
    tags: ['list'], desc: '협회 소식지(뉴스레터) 목록. 카드형. board_type=newsletter 연동.'
  },
  {
    id: 'U40', section: 'user', group: '커뮤니티', name: '협회지 상세', path: '../outputs/community/newsletter-detail.html', img: 'U40_커뮤니티_협회지_상세.png',
    tags: ['detail'], desc: '협회지 상세. 이미지 뷰어 또는 PDF 뷰어 포함.'
  },
  {
    id: 'U41', section: 'user', group: '커뮤니티', name: '언론보도 목록', path: '../outputs/community/press.html', img: 'U41_커뮤니티_언론보도_목록.png',
    tags: ['list'], desc: '언론보도 목록. 외부 링크 포함. board_type=press 연동.'
  },
  {
    id: 'U42', section: 'user', group: '커뮤니티', name: '언론보도 상세', path: '../outputs/community/press-detail.html', img: 'U42_커뮤니티_언론보도_상세.png',
    tags: ['detail'], desc: '언론보도 상세. 원문 링크 버튼 포함.'
  },
  {
    id: 'U43', section: 'user', group: '커뮤니티', name: '갤러리 목록', path: '../outputs/community/gallery.html', img: 'U43_커뮤니티_갤러리_목록.png',
    tags: ['list'], desc: '사진 갤러리 목록. 썸네일 그리드. 검색 필터. 회원 로그인 시 글쓰기 버튼 노출. board_type=gallery 연동.'
  },
  {
    id: 'U44', section: 'user', group: '커뮤니티', name: '갤러리 상세', path: '../outputs/community/gallery-detail.html', img: 'U44_커뮤니티_갤러리_상세.png',
    tags: ['detail'], desc: '갤러리 상세. 이미지 슬라이더 + 본문. 작성자 본인인 경우 수정/삭제 버튼 표시.'
  },
  {
    id: 'U45', section: 'user', group: '커뮤니티', name: '갤러리 글쓰기', path: '../outputs/community/gallery-write.html', img: 'U45_커뮤니티_갤러리_글쓰기.png',
    tags: ['member-only', 'write', 'form'], desc: '갤러리 글 작성. SmartEditor2 사용. 이미지 첨부(에디터 내 첫 이미지가 썸네일 자동 설정). 회원 전용.'
  },
  {
    id: 'U46', section: 'user', group: '커뮤니티', name: '자료실 목록', path: '../outputs/community/archive.html', img: 'U46_커뮤니티_자료실_목록.png',
    tags: ['list'], desc: '자료 다운로드 게시판 목록. 파일 유형·크기 표시. board_type=archive 연동.'
  },
  {
    id: 'U47', section: 'user', group: '커뮤니티', name: '자료실 상세', path: '../outputs/community/archive-detail.html', img: 'U47_커뮤니티_자료실_상세.png',
    tags: ['detail'], desc: '자료실 상세. 첨부파일 다운로드. 파일 다운로드 수 집계 가능.'
  },

  // ── 참여 ──────────────────────────────────
  {
    id: 'U48', section: 'user', group: '참여', name: '정회원 가입안내', path: '../outputs/participate/membership.html', img: 'U48_참여_정회원_가입안내.png',
    tags: [], desc: '정회원 가입 절차 및 혜택 안내.<br>정회원 신청 CTA → regular-apply(U49).<br>후원 CTA → donate(U51).'
  },
  {
    id: 'U49', section: 'user', group: '참여', name: '정회원 신청', path: '../outputs/participate/regular-apply.html', img: 'U49_참여_정회원_신청.png',
    tags: ['form'], desc: '정회원 신청 통합 폼. 개인정보·이력·서약. 첨부파일 업로드(자격증 등). 신청 데이터 → 관리자 정회원신청(A11~A12) 연동.'
  },
  {
    id: 'U50', section: 'user', group: '참여', name: '후원 안내', path: '../outputs/participate/donate-info.html', img: 'U50_참여_후원_안내.png',
    tags: [], desc: '후원 방법 및 혜택 안내.<br>후원하기 CTA → donate(U51).'
  },
  {
    id: 'U51', section: 'user', group: '참여', name: '후원하기', path: '../outputs/participate/donate.html', img: 'U51_참여_후원하기.png',
    tags: ['form'], desc: '후원 신청 통합 폼. 후원 유형·금액 선택. 신청 데이터 → 관리자 후원신청(A15~A16) 연동.'
  },
  {
    id: 'U52', section: 'user', group: '참여', name: '숲해설 신청', path: '../outputs/forest/index.html', img: 'U52_참여_숲해설신청.png',
    tags: ['form'], desc: '숲해설 프로그램 신청 폼. 기관/단체 대상. 신청 데이터 → 관리자 숲해설신청(A13~A14) 연동.'
  },

  // ── 인증 ──────────────────────────────────
  {
    id: 'U53', section: 'user', group: '인증', name: '로그인', path: '../outputs/auth/login.html', img: 'U53_인증_로그인.png',
    tags: ['auth', 'form'], desc: '아이디/비밀번호 로그인. 자동로그인 체크박스. 아이디찾기/비밀번호찾기 → find(U54). 회원가입 → register(U55). Laravel Auth 세션 연동.'
  },
  {
    id: 'U54', section: 'user', group: '인증', name: '아이디/비밀번호 찾기', path: '../outputs/auth/find.html', img: 'U54_인증_아이디비밀번호찾기.png',
    tags: ['auth', 'form'], desc: '탭 전환: 아이디 찾기 / 비밀번호 찾기. 이름+이메일 인증 방식. 임시비밀번호 발송 또는 SMS 인증 방식 협의 필요.'
  },
  {
    id: 'U55', section: 'user', group: '인증', name: '회원가입', path: '../outputs/auth/register.html', img: 'U55_인증_회원가입.png',
    tags: ['auth', 'form'], desc: '회원가입 폼. 필수: 아이디/비밀번호/이름/이메일/전화번호. 이메일 중복 확인 API 필요. 가입 완료 → 자동 로그인 후 마이페이지 이동.'
  },

  // ── 마이페이지 ────────────────────────────
  {
    id: 'U56', section: 'user', group: '마이페이지', name: '마이페이지', path: '../outputs/mypage/index.html', img: 'U56_마이페이지_홈.png',
    tags: ['auth', 'member-only'], desc: '탭 구성: 내 정보 수정 / 신청내역(교육+강사활동 통합) / 비밀번호 변경 / 회원탈퇴. 신청내역 상태: 신청/수강중/취소/미선정/완료. 완료 시 수료증 또는 활동확인서 발급 버튼 표시.'
  },
  {
    id: 'U57', section: 'user', group: '마이페이지', name: '증명서 미리보기', path: '../outputs/mypage/certificate-preview.html', img: 'U57_마이페이지_증명서미리보기.png',
    tags: ['auth'], desc: '수료증 또는 활동확인서 미리보기. URL 파라미터: type(cert|activity), certNo, name, course, date, hours. 인쇄 버튼 포함.'
  },

  // ── 기타 ──────────────────────────────────
  {
    id: 'U58', section: 'user', group: '기타', name: '사이트맵', path: '../outputs/sitemap.html', img: 'U58_사이트맵.png',
    tags: [], desc: '정적 페이지.<br>전체 메뉴 구조 목록.<br>① 우측 최상단 사이트맵 아이콘 클릭시 페이지 진입 가능.<br>②각 메뉴 클릭시 페이지 이동.'
  },
  {
    id: 'U59', section: 'user', group: '기타', name: '이용약관', path: '../outputs/terms.html', img: 'U59_이용약관.png',
    tags: [], desc: '정적 페이지.<br>서비스 이용약관 전문.<br>푸터에서 링크 클릭시 페이지 진입 가능.<br>U60 개인정보처리방침 + U61 이메일 무단수집거부와 동일한 레이아웃.'
  },
  {
    id: 'U60', section: 'user', group: '기타', name: '개인정보처리방침', path: '../outputs/privacy.html', img: 'U60_개인정보처리방침.png',
    tags: [], desc: '정적 페이지.<br>U59 이용약관과 동일.<br>개인정보처리방침 전문.'
  },
  {
    id: 'U61', section: 'user', group: '기타', name: '이메일 무단수집거부', path: '../outputs/email.html', img: 'U61_이메일무단수집거부.png',
    tags: [], desc: '정적 페이지.<br>U59 이용약관과 동일.<br>이메일 무단수집거부 고지. 정적 콘텐츠.'
  },

  // ══════════════════════════════════════════
  // 관리자 페이지
  // ══════════════════════════════════════════

  // ── 회원관리 ──────────────────────────────
  {
    id: 'A01', section: 'admin', group: '회원관리', name: '회원 목록', path: '../outputs/admin/members.html', img: 'A01_회원_목록.png',
    tags: ['admin-only', 'list'], desc: '전체 회원 목록. 필터: 가입일/등급/상태/검색어. 엑셀 다운로드. No 역순 정렬. 회원 클릭 → 회원상세(A02). API: GET /admin/api/members'
  },
  {
    id: 'A02', section: 'admin', group: '회원관리', name: '회원 상세', path: '../outputs/admin/member-detail.html', img: 'A02_회원_상세.png',
    tags: ['admin-only', 'detail'], desc: '회원 상세 정보 열람. 상태 변경(정상/차단) 버튼. 신청 이력 요약. 수정 → A03. API: GET /admin/api/members/{id}'
  },
  {
    id: 'A02-1', section: 'admin', group: '회원관리', name: '회원 상세—탈퇴 처리', path: '../outputs/admin/member-detail.html', img: 'A02_회원_상세_탈퇴.png',
    tags: ['admin-only', 'modal'], desc: 'A02에서 [탈퇴 처리] 클릭 시 노출되는 확인 모달. 탈퇴 사유 직접 입력(필수). [탈퇴 처리] 확인 → 처리 완료 후 회원 목록(A01) 이동.'
  },
  {
    id: 'A03', section: 'admin', group: '회원관리', name: '회원 등록/수정', path: '../outputs/admin/member-edit.html', img: 'A03_회원_등록수정.png',
    tags: ['admin-only', 'form'], desc: '회원 정보 등록·수정 폼. URL ?id= 없으면 등록, 있으면 수정. 우편번호 검색(카카오 API). API: POST/PUT /admin/api/members'
  },
  {
    id: 'A04', section: 'admin', group: '회원관리', name: '탈퇴회원 목록', path: '../outputs/admin/members-withdrawn.html', img: 'A04_탈퇴회원_목록.png',
    tags: ['admin-only', 'list'], desc: '탈퇴 처리된 회원 목록. 탈퇴일 기준 필터. 복구 기능 필요 여부 협의. API: GET /admin/api/members/withdrawn'
  },

  // ── 강좌관리 ──────────────────────────────
  {
    id: 'A05', section: 'admin', group: '강좌관리', name: '강좌 목록', path: '../outputs/admin/courses.html', img: 'A05_강좌_목록.png',
    tags: ['admin-only', 'list'], desc: '강좌 목록 탭(기초/자격/역량/아카데미). 필터: 기간/모집상태/검색. 강좌 등록/수정/삭제. API: GET /admin/api/courses'
  },
  {
    id: 'A06', section: 'admin', group: '강좌관리', name: '강좌 상세', path: '../outputs/admin/course-detail.html', img: 'A06_강좌_상세.png',
    tags: ['admin-only', 'detail'], desc: '강좌 상세 정보. 신청자 현황 요약. 수정 → A07. API: GET /admin/api/courses/{id}'
  },
  {
    id: 'A07', section: 'admin', group: '강좌관리', name: '강좌 등록/수정', path: '../outputs/admin/course-edit.html', img: 'A07_강좌_등록수정.png',
    tags: ['admin-only', 'form'], desc: '강좌 등록·수정 폼. SmartEditor2 에디터, 파일첨부(3슬롯), 썸네일 이미지. multipart/form-data. API: POST/PUT /admin/api/courses'
  },
  {
    id: 'A08', section: 'admin', group: '강좌관리', name: '강좌 신청자 목록', path: '../outputs/admin/applicants.html', img: 'A08_강좌신청자_목록.png',
    tags: ['admin-only', 'list'], desc: '강좌별 신청자 통합 목록. 필터: 날짜/강좌유형/신청상태/검색. 상태 일괄 변경. 수료증 발급 처리. 엑셀. API: GET /admin/api/applicants'
  },
  {
    id: 'A09', section: 'admin', group: '강좌관리', name: '강좌 신청 등록', path: '../outputs/admin/apply-register.html', img: 'A09_강좌신청_등록.png',
    tags: ['admin-only', 'form'], desc: '관리자가 회원 검색 후 강좌를 선택하여 수동으로 강좌 신청을 등록하는 화면. 회원 검색(이름/아이디/휴대폰), 과정유형→강좌명→일정 순 연계 선택, 신청 상태 지정, 관리자 메모 입력. API: POST /admin/api/applicants'
  },
  {
    id: 'A10', section: 'admin', group: '강좌관리', name: '강좌 신청자 상세', path: '../outputs/admin/applicant-detail.html', img: 'A10_강좌신청자_상세.png',
    tags: ['admin-only', 'detail'], desc: '신청자 상세. 상태 변경(선정/미선정/완료). 수료증 발급 버튼. API: PUT /admin/api/applicants/{id}/status'
  },

  // ── 기타 신청관리 ─────────────────────────
  {
    id: 'A11', section: 'admin', group: '기타 신청관리', name: '정회원신청 목록', path: '../outputs/admin/apply-regular.html', img: 'A11_정회원신청_목록.png',
    tags: ['admin-only', 'list'], desc: '정회원 신청 목록. 필터: 날짜/상태/지역/검색. 상태: 검토중→승인/반려. 접수번호 APP-YYYY-XXXXX 형식. API: GET /admin/api/apply/regular'
  },
  {
    id: 'A12', section: 'admin', group: '기타 신청관리', name: '정회원신청 상세', path: '../outputs/admin/apply-regular-detail.html', img: 'A12_정회원신청_상세.png',
    tags: ['admin-only', 'detail'], desc: '정회원 신청 상세. 첨부파일 다운로드. 상태 변경 + 메모 저장. 승인 시 회원 자동 생성 여부 협의 필요.'
  },
  {
    id: 'A13', section: 'admin', group: '기타 신청관리', name: '숲해설신청 목록', path: '../outputs/admin/apply-forest.html', img: 'A13_숲해설신청_목록.png',
    tags: ['admin-only', 'list'], desc: '숲해설 프로그램 신청 목록. 기관/단체 신청. 상태: 접수/완료/취소. API: GET /admin/api/apply/forest'
  },
  {
    id: 'A14', section: 'admin', group: '기타 신청관리', name: '숲해설신청 상세', path: '../outputs/admin/apply-forest-detail.html', img: 'A14_숲해설신청_상세.png',
    tags: ['admin-only', 'detail'], desc: '숲해설 신청 상세. 신청 기관 정보, 희망 일시, 참가 인원. 첨부파일 다운로드.'
  },
  {
    id: 'A15', section: 'admin', group: '기타 신청관리', name: '후원신청 목록', path: '../outputs/admin/apply-sponsor.html', img: 'A15_후원신청_목록.png',
    tags: ['admin-only', 'list'], desc: '후원 신청 목록. 후원 유형·금액 정보. API: GET /admin/api/apply/sponsor'
  },
  {
    id: 'A16', section: 'admin', group: '기타 신청관리', name: '후원신청 상세', path: '../outputs/admin/apply-sponsor-detail.html', img: 'A16_후원신청_상세.png',
    tags: ['admin-only', 'detail'], desc: '후원 신청 상세. 후원자 정보, 금액, 납부 방법. 영수증 발급 처리 필요 여부 협의.'
  },

  // ── 일정관리 ──────────────────────────────
  {
    id: 'A17', section: 'admin', group: '일정관리', name: '일정 목록', path: '../outputs/admin/calendar.html', img: 'A17_일정_목록.png',
    tags: ['admin-only', 'list'], desc: '협회 일정 목록. 필터: 연월/카테고리(edu/event/notice)/검색. 사용자 캘린더(U38) 연동. API: GET /admin/api/calendar'
  },
  {
    id: 'A18', section: 'admin', group: '일정관리', name: '일정 상세', path: '../outputs/admin/calendar-detail.html', img: 'A18_일정_상세.png',
    tags: ['admin-only', 'detail'], desc: '일정 상세. 수정/삭제 버튼.'
  },
  {
    id: 'A19', section: 'admin', group: '일정관리', name: '일정 등록/수정', path: '../outputs/admin/calendar-edit.html', img: 'A19_일정_등록수정.png',
    tags: ['admin-only', 'form'], desc: '일정 등록·수정 폼. 날짜/카테고리/제목/링크. API: POST/PUT /admin/api/calendar'
  },

  // ── 게시판관리 ────────────────────────────
  {
    id: 'A20', section: 'admin', group: '게시판관리', name: '게시판 목록', path: '../outputs/admin/board.html', img: 'A20_게시판_목록.png',
    tags: ['admin-only', 'list'], desc: '게시판 목록. URL ?type= 으로 게시판 유형 전환(notice/newsletter/press/gallery/forest-work/region/club 등). 상단고정 토글. API: GET /admin/api/board'
  },
  {
    id: 'A21', section: 'admin', group: '게시판관리', name: '게시글 상세', path: '../outputs/admin/board-detail.html', img: 'A21_게시판_글상세.png',
    tags: ['admin-only', 'detail'], desc: '게시글 상세. 수정/삭제/고정 처리.'
  },
  {
    id: 'A22', section: 'admin', group: '게시판관리', name: '게시글 등록/수정', path: '../outputs/admin/board-edit.html', img: 'A22_게시판_글등록수정.png',
    tags: ['admin-only', 'form'], desc: '게시글 등록·수정. SmartEditor2 에디터. 파일첨부(3슬롯). 상단고정 체크박스. multipart. API: POST/PUT /admin/api/board'
  },

  // ── 콘텐츠관리 ───────────────────────────
  {
    id: 'A23', section: 'admin', group: '콘텐츠관리', name: '조직도/임원진 관리', path: '../outputs/admin/organization.html', img: 'A23_조직도임원진_관리.png',
    tags: ['admin-only'], desc: '조직도 이미지 교체 + 임원진 카드 CRUD. 임원진 사진 업로드, 직책/이름/소개 편집. API: /admin/api/organization (별도 설계 필요)'
  },
  {
    id: 'A24', section: 'admin', group: '콘텐츠관리', name: '연혁 목록', path: '../outputs/admin/history.html', img: 'A24_연혁_목록.png',
    tags: ['admin-only', 'list'], desc: '연혁 목록. 연도별 그룹. 등록/수정/삭제. 사용자 연혁 페이지(U05) 연동. API: GET /admin/api/history'
  },
  {
    id: 'A25', section: 'admin', group: '콘텐츠관리', name: '연혁 등록/수정', path: '../outputs/admin/history-edit.html', img: 'A25_연혁_등록수정.png',
    tags: ['admin-only', 'form'], desc: '연혁 등록·수정. 연도/월/내용/원형이미지. multipart. API: POST/PUT /admin/api/history/{id}'
  },
  {
    id: 'A26', section: 'admin', group: '콘텐츠관리', name: '배너 목록', path: '../outputs/admin/banner.html', img: 'A26_배너_목록.png',
    tags: ['admin-only', 'list'], desc: '메인 슬라이더 배너 목록. 순서 변경(위/아래 버튼). 최대 3개. 활성화 토글. API: GET /admin/api/banners'
  },
  {
    id: 'A27', section: 'admin', group: '콘텐츠관리', name: '배너 등록/수정', path: '../outputs/admin/banner-edit.html', img: 'A27_배너_등록수정.png',
    tags: ['admin-only', 'form'], desc: '배너 등록·수정. 이미지 업로드, 상단/메인/하단 텍스트, 링크URL. multipart. API: POST/PUT /admin/api/banners'
  },
  {
    id: 'A28', section: 'admin', group: '콘텐츠관리', name: '팝업 목록', path: '../outputs/admin/popup.html', img: 'A28_팝업_목록.png',
    tags: ['admin-only', 'list'], desc: '팝업 목록. 노출기간/활성화 여부. 현재 팝업 HTML은 주석 처리 상태 — PHP 연동 후 세션쿠키(오늘하루닫기)와 함께 복구 필요. API: GET /admin/api/popups'
  },
  {
    id: 'A29', section: 'admin', group: '콘텐츠관리', name: '팝업 등록/수정', path: '../outputs/admin/popup-edit.html', img: 'A29_팝업_등록수정.png',
    tags: ['admin-only', 'form'], desc: '팝업 등록·수정. 노출기간/크기/PC위치/이미지/SE2에디터/링크. 모바일은 항상 center 고정. API: POST/PUT /admin/api/popups'
  }

];

// ── 태그 레이블 ────────────────────────────────────────────
window.TAG_LABELS = {
  'auth': '로그인 필요',
  'member-only': '회원 전용',
  'admin-only': '관리자 전용',
  'write': '글쓰기',
  'modal': '모달',
  'list': '목록',
  'form': '폼',
  'detail': '상세',
  'static': '정적 페이지'
};
