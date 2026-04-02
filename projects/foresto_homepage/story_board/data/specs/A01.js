/**
 * A01 — 회원 목록
 * 그룹: 회원관리 / 섹션: 관리자
 * 작성일: 2026-04-02
 */
window.SPECS = window.SPECS || {};
window.SPECS['A01'] = `
<h3>① 목적</h3>
<p>관리자가 시스템에 등록된 전체 회원을 조회하고, 다양한 조건 필터로 대상 회원을 빠르게 탐색하는 화면이다. 가입기간·등급·상태·검색어 조건을 복합 적용할 수 있으며, 검색 결과는 테이블로 출력된다. 특정 회원 행을 클릭하면 상세 화면으로 진입하고, 복수 선택 후 일괄 삭제할 수 있다. 탈퇴회원 조회는 별도 화면(A04)에서 관리한다.</p>

<h3>② 화면 구성</h3>
<table>
  <thead><tr><th>#</th><th>영역</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>①</td><td>상단바</td><td>타이틀·새로고침·회원 등록</td></tr>
    <tr><td>②</td><td>검색필터</td><td>가입기간/등급/상태/검색어 + 버튼</td></tr>
    <tr><td>③</td><td>목록 상단</td><td>총 건수 + 페이지 사이즈 선택</td></tr>
    <tr><td>④</td><td>테이블</td><td>검색 결과 목록, 행 클릭 → 상세</td></tr>
    <tr><td>⑤</td><td>페이지네이션</td><td>페이지 이동 컨트롤</td></tr>
    <tr><td>⑥</td><td>하단 버튼</td><td>선택 삭제</td></tr>
  </tbody>
</table>

<h3>③ 영역별 상세</h3>

<h4>① 상단바</h4>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>[새로고침]</td><td>아이콘 버튼</td><td>현재 페이지 reload</td></tr>
    <tr><td>[+ 회원 등록]</td><td>Primary / Small</td><td>A03 이동 (신규 등록 모드)</td></tr>
  </tbody>
</table>

<h4>② 검색필터</h4>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>가입기간</td><td>Date Input</td><td>시작일~종료일. 미입력 시 전체 기간</td></tr>
    <tr><td>날짜 프리셋</td><td>버튼 그룹</td><td>오늘/7일/30일/3개월/6개월. 클릭 시 즉시 검색</td></tr>
    <tr><td>등급</td><td>라디오 chip</td><td>전체(기본) / 일반회원 / 정회원 / 관리자</td></tr>
    <tr><td>상태</td><td>라디오 chip</td><td>전체(기본) / 정상 / 차단</td></tr>
    <tr><td>검색어 조건</td><td>드롭다운</td><td>전체 필드 / 아이디 / 이름 / 연락처 / 이메일</td></tr>
    <tr><td>검색어 입력</td><td>Text Input</td><td>Enter 키로 검색 수행</td></tr>
    <tr><td>[엑셀 다운로드]</td><td>Outline / Small</td><td>현재 조건 기준 .xlsx 다운로드 <span class="warn">⚠️ 임계값 협의</span></td></tr>
    <tr><td>[초기화]</td><td>Gray / Small</td><td>모든 필터 리셋 + 전체 재조회</td></tr>
    <tr><td>[검색]</td><td>Primary / Small</td><td>조건으로 재조회, 1페이지부터</td></tr>
  </tbody>
</table>

<h4>③ 목록 상단 / ⑤ 페이지네이션</h4>
<table>
  <thead><tr><th>항목</th><th>상세</th></tr></thead>
  <tbody>
    <tr><td>총 건수</td><td>"총 N건" — 3자리 콤마 표기</td></tr>
    <tr><td>페이지 사이즈</td><td>드롭다운: 10(기본) / 30 / 50 / 100개씩. 변경 시 1페이지 재시작</td></tr>
    <tr><td>페이지네이션</td><td>이전 / 번호 / 다음. 현재 페이지 Bold+색상 구분</td></tr>
  </tbody>
</table>

<h4>④ 테이블 컬럼</h4>
<table>
  <thead><tr><th>#</th><th>컬럼</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>—</td><td>체크박스</td><td>중앙</td><td>헤더: 전체 선택/해제</td></tr>
    <tr><td>1</td><td>번호(No)</td><td>중앙</td><td>역순 — total - offset - i</td></tr>
    <tr><td>2</td><td>구분(등급)</td><td>중앙</td><td>배지: 정회원=초록 / 일반=파랑 / 관리자=빨강</td></tr>
    <tr><td>3</td><td>아이디</td><td>좌측</td><td>—</td></tr>
    <tr><td>4</td><td>이름</td><td>좌측</td><td>Bold 처리</td></tr>
    <tr><td>5</td><td>성별</td><td>중앙</td><td>남 / 여</td></tr>
    <tr><td>6</td><td>생년월일</td><td>중앙</td><td>YYYY-MM-DD</td></tr>
    <tr><td>7</td><td>연락처</td><td>중앙</td><td><span class="warn">⚠️ 마스킹 여부 확인 필요</span></td></tr>
    <tr><td>8</td><td>이메일</td><td>좌측</td><td><span class="warn">⚠️ 마스킹 여부 확인 필요</span></td></tr>
    <tr><td>9</td><td>가입일시</td><td>중앙</td><td>YYYY-MM-DD HH:MM:SS</td></tr>
    <tr><td>10</td><td>상태</td><td>중앙</td><td>배지: 정상=초록 / 차단=적색</td></tr>
  </tbody>
</table>
<p class="spec-note"><strong>행 동작:</strong> 행 클릭 → A02 회원 상세 (<code>?id={회원ID}</code> 전달). 체크박스 셀 클릭은 이동 없이 체크만 처리.</p>
<p class="spec-note"><strong>0건 처리:</strong> tbody 내 "조회된 데이터가 없습니다." 중앙 정렬 표시.</p>

<h4>⑥ 하단 버튼</h4>
<table>
  <thead><tr><th>버튼</th><th>유형</th><th>상세</th></tr></thead>
  <tbody>
    <tr><td>[선택 삭제]</td><td>Danger / Small</td><td>체크 없으면 비활성(disabled). 클릭 시 Confirm 팝업 후 처리. <span class="warn">⚠️ 하드/소프트 딜리트 방식 협의 필요</span></td></tr>
  </tbody>
</table>

<h3>④ Alert 메시지</h3>
<table>
  <thead><tr><th>#</th><th>상황</th><th>메시지</th><th>유형</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>검색 0건</td><td>조회된 데이터가 없습니다.</td><td>인라인</td></tr>
    <tr><td>2</td><td>선택 삭제 클릭</td><td>선택한 N명의 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</td><td>Confirm</td></tr>
    <tr><td>3</td><td>삭제 완료</td><td>N명이 삭제되었습니다.</td><td>Toast (success)</td></tr>
    <tr><td>4</td><td>엑셀 — 0건</td><td>다운로드할 데이터가 없습니다.</td><td>Alert 팝업</td></tr>
    <tr><td>5</td><td>엑셀 — 대량</td><td>데이터가 많아 시간이 소요될 수 있습니다. 계속하시겠습니까?</td><td>Confirm <span class="warn">⚠️ 임계값 협의</span></td></tr>
  </tbody>
</table>

<h3>⑤ Validation 규칙</h3>
<table>
  <thead><tr><th>필드</th><th>조건</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>가입기간 시작일</td><td>종료일 이후 선택 불가</td><td>시작일은 종료일 이전이어야 합니다.</td></tr>
    <tr><td>가입기간 종료일</td><td>오늘 이후 선택 불가</td><td>종료일은 오늘 이전이어야 합니다.</td></tr>
    <tr><td>검색어 (연락처)</td><td>숫자·하이픈 외 입력</td><td>연락처는 숫자로 입력해 주세요.</td></tr>
    <tr><td>검색어 미입력</td><td>조건 선택 후 빈 값 검색</td><td><span class="warn">⚠️ 빈 값 허용 여부 협의 필요</span></td></tr>
  </tbody>
</table>

<h3>⑥ 반응형 규칙</h3>
<table>
  <thead><tr><th>구분</th><th>기준</th><th>적용 규칙</th></tr></thead>
  <tbody>
    <tr><td>PC</td><td>1101px+</td><td>기본 레이아웃. 사이드바 고정 노출.</td></tr>
    <tr><td>Mobile</td><td>~1100px</td><td>사이드바 overlay 전환. 필터 chip 세로 스택. 테이블 가로 스크롤.</td></tr>
  </tbody>
</table>
<p class="spec-note">공통: 터치 영역 최소 44×44px 확보. 날짜 프리셋 버튼 모바일 유지.</p>

<h3>⑦ 연관 화면</h3>
<table>
  <thead><tr><th>관계</th><th>ID</th><th>화면명</th></tr></thead>
  <tbody>
    <tr><td>행 클릭 →</td><td>A02</td><td>회원 상세</td></tr>
    <tr><td>상단 버튼 →</td><td>A03</td><td>회원 등록/수정</td></tr>
    <tr><td>사이드바 →</td><td>A04</td><td>탈퇴회원 목록</td></tr>
  </tbody>
</table>
`;
