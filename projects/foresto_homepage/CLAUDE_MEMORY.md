# CLAUDE_MEMORY — foresto_homepage
> 작업 시작 전 반드시 읽고, 새로운 실수 발생 시 즉시 업데이트

---

## 핵심 규칙

- **outputs/ 외부 파일 수정 금지.** 클라이언트 전달 파일은 `outputs/` 안에만 있다.
- **preview mode 유지.** `index.html`에 서브페이지 링크 차단 스크립트가 있다. 삭제하지 마.
- **팝업 HTML 주석 처리 상태.** 관련 JS는 null-check 처리되어 있다. 팝업 HTML 복구 시 JS 확인 필요.
- **글자 크기 조절 버튼은 달력 영역에 영향 안 줘야 한다.** 달력 관련 CSS는 px 고정값 사용.

---

## 디자인 가이드

### 색상
```
--green-dark:  #20281A   (헤더, 달력 nav 배경, 강조 텍스트)
--green-main:  #05803e   (포인트)
--green-light: #508829   (hover, 링크)
--green-pale:  #F1F5EE   (배경, 패널)
--gray-dark:   #2d3436
--gray-mid:    #636e72
--gray-light:  #dfe6e9
```

### 폰트 크기 (JS 글자 크기 조절 대상 — rem 사용)
```
--text-xs:   0.8125rem  (13px 기준)
--text-sm:   0.875rem   (14px)
--text-md:   1rem       (16px)
--text-base: 1.125rem   (18px)
--text-lg:   1.25rem    (20px)
--text-xl:   1.375rem   (22px)
```

### 폰트 크기 (글자 크기 조절 영향 없는 고정 영역 — px 사용)
```
달력 nav:          16px
달력 요일 헤더:    16px
달력 날짜 셀:      18px
달력 일정 항목:    18px
```

### 레이아웃
```
컨테이너 최대폭:  1700px
헤더 높이:        120px (유틸바 40px + 내비 80px)
메인 콘텐츠 높이: min-height 560px (고정 height 아님 — 폰트 커지면 늘어남)
```

---

## 반복 실수 목록

| # | 상황 | 실수 | 결과 | 정답 |
|---|---|---|---|---|
| 1 | cal-schedule-box 내용 잘릴 때 | `overflow: hidden` 제거 | 박스가 옆 패널보다 커짐 | `overflow-y: auto`로 교체 |
| 2 | 폰트 커질 때 패널 내용 잘릴 때 | `height: 560px` 고정 유지 | 글자 크기 3단계 + 6줄 달 → 일정 박스 짤림 | `min-height: 560px`로 변경, 부모 컨테이너도 동일하게 |
| 3 | HTML 요소 주석 처리 후 | JS null-check 없이 `.addEventListener()` 호출 | TypeError → 이후 스크립트 전체 멈춤(슬라이더 사라짐) | `const el = getElementById('x'); if (el) { ... }` |
| 4 | 모바일 가운데 정렬 | `text-align: center` 부모에 적용 | 블록 자식 요소 여전히 왼쪽 치우침 | 부모에 `display:flex; flex-direction:column; align-items:center` + 자식 `width:100%` |
| 5 | 버튼 너비 일치시킬 때 | `min-width: 168px` (px 고정) | 글자 크기 변경 시 인접 버튼과 너비 달라짐 | `min-width: 10.5rem` (rem 기반 스케일) |
| 6 | 한국어 텍스트 길이 제한 | `white-space: nowrap; text-overflow: ellipsis` | 폰트 커지면 텍스트 가로로 잘림 | `word-break: keep-all`로 교체, 줄바꿈 허용 |
| 7 | CSS 파일 편집 전 | Read 없이 바로 Edit 시도 | 린터가 파일 수정 후 old_string 불일치 → Edit 실패 | 편집 직전 항상 Read로 최신 내용 확인 후 Edit |
| 8 | 달마다 달력 높이 다를 때 | cal-cell에 min-height 미적용 | 5줄/6줄 달마다 캘린더 높이 달라져 일정 박스 출렁임 | `cal-cell { min-height: 40px }` 고정 |

---

## 작업 전 체크리스트

git push 전 반드시 확인:

- [ ] preview mode 스크립트 살아있는지 (`index.html` 내 `App.toast` 포함 클릭 차단 블록)
- [ ] 글자 크기 3단계에서 달력 일정 박스 잘리지 않는지
- [ ] 5월, 10월 등 6줄짜리 달에서 레이아웃 무너지지 않는지
- [ ] 글자 크기 3단계에서 패밀리사이트 버튼 너비 "구 홈페이지" 버튼과 일치하는지
- [ ] 모바일(600px 이하) 레이아웃 깨지지 않는지
- [ ] HTML 요소 주석 처리 시 관련 JS null-check 처리됐는지

---

## 최근 작업 이력

| 날짜 | 내용 | 변경 파일 |
|---|---|---|
| 2026-03-25 | CLAUDE_MEMORY.md 생성 및 반복 실수 표 정리 | CLAUDE_MEMORY.md |
| 2026-03-25 | 달력 영역 px 고정 폰트, 빈 셀 min-height 40px, content-main-grid min-height 전환 | main.css |
| 2026-03-25 | footer-family-btn min-width rem 전환 (10.5rem) | common.css |
| 2026-03-24 | preview mode 추가, 팝업 JS null-safety 처리, 슬라이더 복구 | index.html |
| 2026-03-24 | 마이페이지 비밀번호 변경 / 탈퇴하기 → 모달로 이동, 사이드메뉴 정리 | mypage/index.html |
