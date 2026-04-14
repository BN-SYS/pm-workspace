/**
 * T1 정적 콘텐츠 페이지 — 대표화면 스펙 + 화면별 차이점 명세
 * 그룹: T1. 정적 콘텐츠 페이지 / 섹션: user
 * 작성일: 2026-04-14
 *
 * ※ 이 파일의 스펙은 T1-01(인사말 대표화면)에 연결된다.
 *    공통 레이아웃 기준 + 화면별 차이점 명세표 포함.
 */

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['T1-01'] = [];

window.SPECS['T1-01'] = `

<!-- ── T1 정적 콘텐츠 페이지 개요 ────────────────── -->
<h3>T1. 정적 콘텐츠 페이지</h3>
<p>
  T1 템플릿을 공유하는 9개 화면의 공통 구조와 개별 차이점을 정의한다.<br>
  <strong>이 대표화면(인사말) 스펙을 기준으로, 아래 차이점 명세표의 항목만 달리 적용하여 구현한다.</strong>
</p>

<!-- ── 공통 레이아웃 ──────────────────────────────── -->
<h3>공통 레이아웃</h3>
<table>
  <thead><tr><th>영역</th><th>공통 구성</th></tr></thead>
  <tbody>
    <tr><td>헤더</td><td>C01 공통 헤더</td></tr>
    <tr><td>페이지 타이틀 배너</td><td>페이지명(화면별 상이) + 숲 테마 배경이미지</td></tr>
    <tr><td>LNB</td><td>해당 2depth 그룹 + 3depth 목록 (화면별 위치 상이)</td></tr>
    <tr><td>브레드크럼</td><td>1depth &gt; 2depth &gt; 현재 페이지</td></tr>
    <tr><td>콘텐츠 영역</td><td>화면별 상이 (아래 명세표 참조)</td></tr>
    <tr><td>푸터</td><td>C01 공통 푸터</td></tr>
    <tr><td>JS</td><td>없음 원칙. 탭 토글(U15)만 예외 허용. ※ 오시는길(U10)은 카카오맵 API로 고유화면 별도 등록</td></tr>
    <tr><td>권한</td><td>모든 권한 등급 접근 가능 (비회원 포함)</td></tr>
  </tbody>
</table>

<!-- ── 화면별 차이점 명세표 ───────────────────────── -->
<h3>화면별 차이점 명세표</h3>
<table>
  <thead>
    <tr>
      <th>화면명</th>
      <th>LNB 위치 (1depth &gt; 2depth)</th>
      <th>콘텐츠 영역 구성</th>
      <th>데이터 연동</th>
      <th>비고</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>인사말</strong> (T1-01 대표)</td>
      <td>소개 &gt; 협회 소개</td>
      <td>협회장 사진(우측 float or 상단) + 인사말 텍스트(에디터 HTML)</td>
      <td>board_type=greeting</td>
      <td><strong>이 화면이 대표 기준.</strong></td>
    </tr>
    <tr>
      <td>미션 &amp; 비전 (U03)</td>
      <td>소개 &gt; 협회 소개</td>
      <td>미션·비전·핵심가치 3개 카드 (아이콘 + 텍스트). 카드 배치: 가로 3열 / 모바일 1열.</td>
      <td>하드코딩 (관리자 편집 불필요)</td>
      <td>—</td>
    </tr>
    <tr>
      <td>주요 사업 (U04)</td>
      <td>소개 &gt; 협회 소개</td>
      <td>사업 카드 그리드 (아이콘 + 사업명 + 설명). 카드 수: 실제 사업 수에 따라 PHP 루프 출력.</td>
      <td>board_type=project or 하드코딩 (협의 필요)</td>
      <td><span class="warn">⚠️ 데이터 연동 여부 협의 필요</span></td>
    </tr>
    <tr>
      <td>회원 규정 (U09)</td>
      <td>소개 &gt; 회원 안내</td>
      <td>규정 전문 텍스트 (스크롤 가능). 에디터 HTML 또는 하드코딩.</td>
      <td>하드코딩 (관리자 편집 불필요)</td>
      <td>문서 개정 시 HTML 직접 수정. 버전 표시 여부 확인.</td>
    </tr>
    <tr>
      <td>숲해설가 알아보기 (U11)</td>
      <td>교육과정 &gt; 숲해설가란</td>
      <td>직무 소개 이미지(대형) + 역할·자격요건·활동분야 텍스트. 에디터 HTML 출력.</td>
      <td>board_type=forester or 하드코딩</td>
      <td><span class="warn">⚠️ 데이터 연동 여부 협의 필요</span></td>
    </tr>
    <tr>
      <td>기초과정 개요 (U13)</td>
      <td>교육과정 &gt; 기초 과정</td>
      <td>과정 설명 + 커리큘럼표 + 일정 안내 + [신청하기] CTA. CTA 클릭 → T2-M 신청모달.</td>
      <td>하드코딩 (커리큘럼) + API (신청모달 연동)</td>
      <td>CTA: 신청 기간 외 비활성 + "신청 기간이 아닙니다" 텍스트.</td>
    </tr>
    <tr>
      <td>자격취득 과정소개 (U15)</td>
      <td>교육과정 &gt; 자격취득 과정</td>
      <td>과정 종류 탭 + 각 탭별 과정 설명. 탭 전환: JS show/hide. CTA [목록 보기] → T2-L.</td>
      <td>하드코딩</td>
      <td>JS show/hide 허용 (탭 토글). 데이터 생성·DOM 주입 금지.</td>
    </tr>
    <tr>
      <td>역량강화 과정 (U18)</td>
      <td>교육과정 &gt; 역량강화 과정</td>
      <td>과정 소개 텍스트 + 강좌 리스트 (PHP 루프 출력). 각 강좌: 강좌명·기간·모집상태·[신청하기] CTA.</td>
      <td>API: GET /api/courses?type=job-training</td>
      <td>PHP 루프 출력. JS 데이터 배열·DOM 주입 금지.</td>
    </tr>
    <tr>
      <td>정회원 가입 안내 (U48)</td>
      <td>소개 &gt; 회원 안내</td>
      <td>가입 절차 안내 (스텝 다이어그램) + 혜택 목록 + [정회원 신청하기] CTA → U49. [후원하기] CTA → U51.</td>
      <td>하드코딩</td>
      <td>—</td>
    </tr>
    <tr>
      <td>후원 안내 (U50)</td>
      <td>소개 &gt; 회원 안내</td>
      <td>후원 방법·혜택 안내 텍스트 + [후원하기] CTA → U51.</td>
      <td>하드코딩</td>
      <td>—</td>
    </tr>
  </tbody>
</table>

<!-- ── 공통 주의사항 ──────────────────────────────── -->
<h3>공통 주의사항</h3>
<table>
  <thead><tr><th>#</th><th>항목</th><th>내용</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>JS 사용 원칙</td><td>T1 화면은 JS 없음이 원칙. 탭 토글(U15)만 예외 허용.</td></tr>
    <tr><td>2</td><td>오시는길 분리</td><td>U10(오시는길)은 카카오맵 API 연동으로 고유화면 별도 등록. T1에 포함하지 않는다.</td></tr>
    <tr><td>3</td><td>CTA 버튼 상태</td><td>기초과정 개요(U13): 신청 기간 외 [신청하기] 비활성. 비활성 시 "신청 기간이 아닙니다" 텍스트.</td></tr>
    <tr><td>4</td><td>PHP 루프 출력</td><td>역량강화(U18) 강좌 리스트는 PHP 루프. JS 데이터 배열·DOM 주입 금지.</td></tr>
    <tr><td>5</td><td>데이터 연동 미확정</td><td>주요사업(U04)·숲해설가란(U11) 데이터 연동 여부 PM 확인 필요.</td></tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>관계</th><th>ID</th><th>화면명</th></tr></thead>
  <tbody>
    <tr><td>오시는길 (카카오API 고유화면)</td><td>U10</td><td>오시는 길</td></tr>
    <tr><td>T1 → T2 신청 연결</td><td>T2-M</td><td>대표화면: 신청모달 [풀 스펙]</td></tr>
    <tr><td>T1 → T2 목록 연결</td><td>T2-L</td><td>대표화면: 목록 [풀 스펙]</td></tr>
    <tr><td>정회원 신청 폼</td><td>U49</td><td>정회원 가입 신청 폼</td></tr>
    <tr><td>후원 신청 폼</td><td>U51</td><td>후원 신청 폼</td></tr>
  </tbody>
</table>

`;
