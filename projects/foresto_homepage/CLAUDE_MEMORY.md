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

### 1. overflow:hidden 제거 → 박스 늘어남
- **실수:** `cal-schedule-box`의 `overflow: hidden` 제거만 함
- **결과:** 박스가 옆 패널보다 커짐
- **정답:** `overflow-y: auto`로 교체 또는 `min-height` 조정으로 해결

### 2. height 고정값 → 폰트 커지면 내용 잘림
- **실수:** `home-panel { height: 560px }` 고정
- **결과:** 글자 크기 3단계 + 6줄 달 → 일정 박스 짤림
- **정답:** `min-height: 560px`으로 변경, 컨테이너도 동일하게

### 3. JS DOM null 참조 → 이후 스크립트 전체 멈춤
- **실수:** 팝업 HTML 주석 처리 후 JS는 그대로 둠
- **결과:** `getElementById('popupNoShow')` → null → TypeError → 슬라이더 초기화 안 됨
- **정답:** `const el = getElementById('x'); if (el) { ... }`

### 4. 모바일 센터링 text-align으로 시도
- **실수:** `.hero .container { text-align: center }` 적용
- **결과:** 블록 요소 자식들은 여전히 왼쪽 치우침
- **정답:** 부모에 `display:flex; flex-direction:column; align-items:center` + 자식에 `width:100%`

### 5. min-width px 고정 → 글자 크기 변경 시 버튼 크기 불일치
- **실수:** `.footer-family-btn { min-width: 168px }` (px 고정)
- **결과:** 글자 키우면 "구 홈페이지 바로가기" 버튼과 너비 달라짐
- **정답:** `min-width: 10.5rem` (rem 기반으로 같이 스케일)

---

## 작업 전 체크리스트

git push 전 반드시 확인:

- [ ] preview mode 스크립트 살아있는지 (`index.html` 내 `App.toast` 포함 클릭 차단 블록)
- [ ] 글자 크기 3단계에서 달력 일정 박스 잘리지 않는지
- [ ] 6줄짜리 달(5월 등)에서 레이아웃 무너지지 않는지
- [ ] 글자 크기 3단계에서 패밀리사이트 버튼 너비 "구 홈페이지" 버튼과 일치하는지
- [ ] 모바일(600px 이하) 레이아웃 깨지지 않는지

---

## 최근 작업 이력

| 날짜 | 내용 | 변경 파일 |
|---|---|---|
| 2026-03-25 | 달력 영역 px 고정 폰트, 빈 셀 min-height 40px, content-main-grid min-height 전환 | main.css |
| 2026-03-25 | footer-family-btn min-width rem 전환 (10.5rem) | common.css |
| 2026-03-24 | preview mode 추가, 팝업 JS null-safety 처리, 슬라이더 복구 | index.html |
| 2026-03-24 | 마이페이지 비밀번호 변경 / 탈퇴하기 → 모달로 이동, 사이드메뉴 정리 | mypage/index.html |
