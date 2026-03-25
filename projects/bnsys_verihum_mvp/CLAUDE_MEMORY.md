# CLAUDE_MEMORY — bnsys_verihum_mvp
> 작업 시작 전 반드시 읽고, 새로운 실수 발생 시 즉시 업데이트

---

## 핵심 규칙

- **산출물 경로:** `outputs/intro/index.html` — 단일 HTML 파일로 모든 것이 들어있다.
- **도입문의 CTA 링크:** 반드시 `https://bn-system.com/it_sub/contact.php` (target="_blank"). 다른 URL로 바꾸지 마.
- **통계 수치 출처 고정:** `96.5%` — 진학사 설문 351명, 2025.10.29. 임의로 수정 금지.
- **데모 UI 관점:** 학생이 실시간으로 보는 것이 아니라, **교사가 제출 후 확인하는 리포트** 화면이다.

---

## 디자인 가이드

### 색상
```
배경(섹션):    #0a0e1a (hero), #f8f9ff (light section)
포인트:        #6366f1 (인디고 계열)
텍스트 메인:   #1e293b
텍스트 설명:   --color-sub: #a2abbe  (← 이 값 사용. 너무 어두우면 가독성 저하됨)
텍스트 muted:  --color-muted: #7c8698
```

### 타이포
```
hero 제목:     굵고 크게 (2.5rem~4rem)
hero 부제:     max-width: 660px, word-break: keep-all
설명 텍스트:   var(--color-sub) 사용 — #5a6070 이하로 내리지 마 (어두워서 가독성 저하)
step 태그:     한국어 (영어로 바꾸지 마)
```

### 섹션 구조 순서
```
1. Hero (eyebrow + h1 + sub + CTA 버튼 + 데모 UI)
2. Problem (문제 제기)
3. Solution (해결책)
4. Features (기능 목록)
5. How it works (단계별 설명)
6. Model (가격/플랜)
7. CTA (도입 문의)
8. Footer
```

---

## 반복 실수 목록

| # | 상황 | 실수 | 결과 | 정답 |
|---|---|---|---|---|
| 1 | 모바일 가운데 정렬 | `text-align: center` 부모에 적용 | 블록 자식 요소 왼쪽 치우침 | 부모에 `display:flex; flex-direction:column; align-items:center` + 자식 `width:100%` |
| 2 | 설명 텍스트 색상 | `color: #5a6070` 이하 어두운 값 사용 | 배경과 대비 부족, 가독성 저하 | `var(--color-sub): #a2abbe` 사용 |
| 3 | 통계 수치 | 출처 불명확한 수치 사용(92% 등) | PM 확인 요청 → 재수정 | 96.5% 고정 (진학사 2025), 출처 주석으로 HTML에 기재 |
| 4 | step 태그 텍스트 | 영문으로 작성 (STEP 1, ANALYZE 등) | 한국어 페이지와 톤 불일치 | 한국어로 작성 (1단계, 분석 등) |
| 5 | hero 부제 줄바꿈 | `<br>` 태그로 강제 줄바꿈 | 반응형에서 레이아웃 깨짐 | `word-break: keep-all` + `max-width: 660px` |

---

## 작업 전 체크리스트

- [ ] CTA 버튼 2개 모두 `https://bn-system.com/it_sub/contact.php` 연결됐는지
- [ ] 통계 수치 96.5% / 출처 표기 그대로인지
- [ ] 모바일(768px 이하) hero 섹션 가운데 정렬 유지되는지
- [ ] 설명 텍스트가 `var(--color-sub)` 또는 동등한 밝은 값인지
- [ ] 데모 UI 레이블이 "교사 검토" 관점인지 (학생 실시간 X)

---

## 최근 작업 이력

| 날짜 | 내용 | 변경 파일 |
|---|---|---|
| 2026-03-25 | CLAUDE_MEMORY.md 생성 | CLAUDE_MEMORY.md |
| 2026-03-24 | CTA 버튼 bn-system.com 연결, 통계 96.5% 반영, 출처 메모리 저장 | outputs/intro/index.html |
| 2026-03-24 | 모바일 hero 센터링 수정 (flexbox), 설명 텍스트 색상 개선 | outputs/intro/index.html |
| 2026-03-24 | 데모 UI → 교사 리포트 관점으로 레이블 변경, 문구 전체 다듬기 | outputs/intro/index.html |
