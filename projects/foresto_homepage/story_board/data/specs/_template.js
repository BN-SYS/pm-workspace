/**
 * {ID} — {화면명}
 * 그룹: {그룹명} / 섹션: 사용자 or 관리자
 * 작성일: YYYY-MM-DD
 *
 * ──────────────────────────────────────────────
 * 사용법
 * 1. 이 파일을 복사 → {ID}.js 로 저장  (예: A02.js)
 * 2. 위 주석 헤더 수정
 * 3. window.SPECS['{ID}'] 의 키를 실제 ID로 변경
 * 4. ①~⑦ 내용 채우기
 * 5. index.html 에 아래 한 줄 추가:
 *    <script src="data/specs/{ID}.js"></script>
 * ──────────────────────────────────────────────
 *
 * [작성 규칙 요약]
 * - 확정 안 된 항목: <span class="warn">⚠️ 협의 필요</span>
 * - 정보 없는 항목: <span class="warn">⚠️ 정보 필요</span>
 * - 버튼 표기: [버튼명] + 유형(Primary/Secondary/Danger/Outline/Gray)
 * - 날짜 형식: YYYY-MM-DD 기본
 * - 개인정보 컬럼: 마스킹 여부 반드시 ⚠️ 표기
 */

window.SPECS = window.SPECS || {};
window.SPECS['{ID}'] = `

<h3>① 목적</h3>
<p>
  이 화면이 존재하는 이유와 사용자 목표를 3~5줄로 서술한다.
</p>

<h3>② 화면 구성</h3>
<table>
  <thead><tr><th>#</th><th>영역</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>①</td><td>영역명</td><td>설명</td></tr>
    <tr><td>②</td><td>영역명</td><td>설명</td></tr>
    <tr><td>③</td><td>영역명</td><td>설명</td></tr>
  </tbody>
</table>

<h3>③ 영역별 상세</h3>

<h4>① 영역명</h4>
<table>
  <thead><tr><th>항목</th><th>유형</th><th>설명</th></tr></thead>
  <tbody>
    <tr><td>항목명</td><td>유형</td><td>설명. <span class="warn">⚠️ 협의 필요</span></td></tr>
  </tbody>
</table>

<h4>② 테이블 컬럼 (목록 화면인 경우)</h4>
<table>
  <thead><tr><th>#</th><th>컬럼</th><th>정렬</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>번호(No)</td><td>중앙</td><td>역순 — total - offset - i</td></tr>
    <tr><td>2</td><td>컬럼명</td><td>좌측 / 중앙</td><td>비고</td></tr>
  </tbody>
</table>
<p class="spec-note"><strong>행 동작:</strong> 클릭 → {다음 화면 ID} (<code>?id={파라미터}</code> 전달)</p>
<p class="spec-note"><strong>0건 처리:</strong> "조회된 데이터가 없습니다." 표시</p>

<h3>④ Alert 메시지</h3>
<table>
  <thead><tr><th>#</th><th>상황</th><th>메시지</th><th>유형</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>상황</td><td>메시지 내용</td><td>인라인 / Alert 팝업 / Confirm / Toast</td></tr>
  </tbody>
</table>

<h3>⑤ Validation 규칙</h3>
<table>
  <thead><tr><th>필드</th><th>조건</th><th>메시지</th></tr></thead>
  <tbody>
    <tr><td>필드명</td><td>조건</td><td>인라인 메시지</td></tr>
  </tbody>
</table>

<h3>⑥ 반응형 규칙</h3>
<table>
  <thead><tr><th>구분</th><th>기준</th><th>적용 규칙</th></tr></thead>
  <tbody>
    <tr><td>PC</td><td>1101px+</td><td>기본 레이아웃</td></tr>
    <tr><td>Mobile</td><td>~1100px</td><td><span class="warn">⚠️ 정보 필요</span></td></tr>
  </tbody>
</table>

<h3>⑦ 연관 화면</h3>
<table>
  <thead><tr><th>관계</th><th>ID</th><th>화면명</th></tr></thead>
  <tbody>
    <tr><td>이전</td><td>—</td><td>—</td></tr>
    <tr><td>다음</td><td>—</td><td>—</td></tr>
  </tbody>
</table>

`;
