// ============================================================
//  A01 — 회원 목록
//  그룹 : 회원 관리
//  섹션 : admin
//  작성일 : 2026-04-02
// ============================================================

window.SPECS = window.SPECS || {};
window.SPECS['A01'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>관리자가 전체 회원 목록을 조회하고, 검색·필터를 통해 특정 회원을 찾아 상세 정보로 진입하는 화면이다.</p>

<!-- ── 구조 및 상세 ──────────────────────────────── -->
<h3>구조 및 상세</h3>

<h4>① 페이지 타이틀</h4>
<p>화면 제목 "회원 목록" + 검색 결과 총 건수 표시 (예: 총 1,234명).</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>타이틀</td><td>텍스트</td><td>"회원 목록" 고정 텍스트</td></tr>
    <tr><td>전체 건수</td><td>텍스트</td><td>검색 결과 총 건수. 필터 변경 시 실시간 갱신</td></tr>
  </tbody>
</table>

<h4>② 검색·필터 영역</h4>
<p>회원 검색 조건 입력 및 필터 선택.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>검색어 입력</td><td>텍스트 입력</td><td>이름 · 이메일 · 연락처 중 선택 후 키워드 입력</td></tr>
    <tr><td>검색 조건 선택</td><td>셀렉트박스</td><td>이름 / 이메일 / 연락처 ⚠️ 검색 조건 항목 확정 필요</td></tr>
    <tr><td>회원 등급 필터</td><td>셀렉트박스</td><td>전체 / 일반회원 / 정회원 / 관리자 ⚠️ 등급 체계 확정 필요</td></tr>
    <tr><td>가입일 범위</td><td>날짜 선택 (from ~ to)</td><td>시작일·종료일 선택. 시작일 &gt; 종료일 시 에러</td></tr>
    <tr><td>상태 필터</td><td>셀렉트박스</td><td>전체 / 정상 / 휴면 / 탈퇴 ⚠️ 상태값 확정 필요</td></tr>
    <tr><td>검색 버튼</td><td>버튼</td><td>조건 적용 후 목록 갱신</td></tr>
    <tr><td>초기화 버튼</td><td>버튼</td><td>모든 필터·검색어를 기본값으로 리셋</td></tr>
  </tbody>
</table>

<h4>③ 회원 목록 테이블</h4>
<p>조건에 맞는 회원 리스트 출력. 한 페이지 기본 20건. ⚠️ 건수 협의 필요</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>행 클릭</td><td>인터랙션</td><td>클릭 → 해당 회원 상세 화면(A02)으로 이동</td></tr>
    <tr><td>정렬</td><td>인터랙션</td><td>컬럼 헤더 클릭 시 오름차순/내림차순 토글</td></tr>
    <tr><td>데이터 없음</td><td>안내 문구</td><td>"검색 결과가 없습니다." 메시지 표시</td></tr>
  </tbody>
</table>

<h4>④ 페이지네이션</h4>
<p>목록 페이지 이동.</p>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>페이지 번호</td><td>버튼</td><td>현재 페이지 강조. 최대 10개 번호 노출 ⚠️ 노출 개수 협의 필요</td></tr>
    <tr><td>이전/다음</td><td>버튼</td><td>10페이지 단위 이전/다음 그룹 이동</td></tr>
    <tr><td>처음/끝</td><td>버튼</td><td>첫 페이지 / 마지막 페이지로 이동</td></tr>
  </tbody>
</table>

<!-- ── 테이블 컬럼 ───────────────────────────────── -->
<h3>테이블 컬럼</h3>
<table>
  <thead><tr><th>#</th><th>컬럼</th><th>타입</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>No</td><td>number</td><td>C</td><td>자동 번호 (역순)</td></tr>
    <tr><td>2</td><td>이름</td><td>text</td><td>L</td><td>클릭 시 상세(A02) 이동</td></tr>
    <tr><td>3</td><td>이메일</td><td>text</td><td>L</td><td>가입 이메일</td></tr>
    <tr><td>4</td><td>연락처</td><td>text</td><td>C</td><td>010-****-1234 형태 (마스킹) ⚠️ 마스킹 규칙 협의 필요</td></tr>
    <tr><td>5</td><td>등급</td><td>badge</td><td>C</td><td>일반회원 / 정회원 / 관리자 ⚠️ 등급 체계 확정 필요</td></tr>
    <tr><td>6</td><td>상태</td><td>badge</td><td>C</td><td>정상(녹색) / 휴면(회색) / 탈퇴(적색) ⚠️ 상태값 확정 필요</td></tr>
    <tr><td>7</td><td>가입일</td><td>date</td><td>C</td><td>YYYY.MM.DD</td></tr>
    <tr><td>8</td><td>최종 로그인</td><td>date</td><td>C</td><td>YYYY.MM.DD HH:mm</td></tr>
  </tbody>
</table>

<!-- ── Alert 메시지 ──────────────────────────────── -->
<h3>Alert 메시지</h3>
<table>
  <thead><tr><th>트리거</th><th>유형</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>검색 결과 없음</td><td>안내 문구 (테이블 내)</td><td>검색 결과가 없습니다.</td></tr>
    <tr><td>가입일 범위 오류</td><td>Alert</td><td>시작일이 종료일보다 클 수 없습니다.</td></tr>
    <tr><td>데이터 로딩 실패</td><td>Alert</td><td>데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.</td></tr>
  </tbody>
</table>

<!-- ── Validation ────────────────────────────────── -->
<h3>Validation</h3>
<table>
  <thead><tr><th>필드</th><th>필수</th><th>규칙</th><th>에러 메시지</th></tr></thead>
  <tbody>
    <tr><td>검색어</td><td>N</td><td>입력 시 최소 2자 이상</td><td>검색어는 2자 이상 입력해주세요.</td></tr>
    <tr><td>가입일 시작</td><td>N</td><td>종료일 이하</td><td>시작일이 종료일보다 클 수 없습니다.</td></tr>
    <tr><td>가입일 종료</td><td>N</td><td>시작일 이상</td><td>종료일이 시작일보다 작을 수 없습니다.</td></tr>
  </tbody>
</table>

<!-- ── 반응형 ────────────────────────────────────── -->
<h3>반응형</h3>
<table>
  <thead><tr><th>구간</th><th>Breakpoint</th><th>변경 사항</th></tr></thead>
  <tbody>
    <tr><td>PC</td><td>≥ 1201px</td><td>테이블 전체 컬럼 노출 · 검색 영역 가로 1행 배치</td></tr>
    <tr><td>Tablet</td><td>768 ~ 1200px</td><td>테이블 가로 스크롤 · 검색 영역 2행 배치 · 연락처·최종 로그인 컬럼 숨김 가능 ⚠️ 숨김 컬럼 협의 필요</td></tr>
    <tr><td>Mobile</td><td>≤ 767px</td><td>테이블 → 카드형 리스트 전환 · 검색 영역 세로 풀폭 배치 · 필터 접기/펼치기 토글</td></tr>
  </tbody>
</table>
<p class="spec-note">공통 : 터치 영역 최소 44×44 px · 이미지/슬라이드 width 100%</p>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>화면 ID</th><th>화면명</th><th>관계</th></tr></thead>
  <tbody>
    <tr><td>A02</td><td>회원 상세</td><td>목록 행 클릭 시 이동</td></tr>
    <tr><td>U53</td><td>로그인</td><td>비관리자 접근 시 리다이렉트</td></tr>
    <tr><td>DOC-05</td><td>공통 레이아웃</td><td>관리자 레이아웃 공통 규칙 참조</td></tr>
  </tbody>
</table>

`;
