# Workflow: HTML 프로토타입 제작 (Figma 시안 기반)

## 언제 쓰나
Figma 시안이 있고 이를 HTML로 구현할 때.

---

## Step 1 — Figma 시안 수령

**방법 A — URL 공유 받은 경우**
```
1. .env에서 FIGMA_TOKEN 확인
2. URL에서 file_key 추출:
   https://www.figma.com/file/{FILE_KEY}/프로젝트명
3. API 호출:
   GET https://api.figma.com/v1/files/{file_key}        → 구조
   GET https://api.figma.com/v1/files/{file_key}/styles → 색상/폰트
   GET https://api.figma.com/v1/images/{file_key}       → 이미지
4. PM에게 API 호출 전 확인 요청 (유료 크레딧 사용)
```

**방법 B — 이미지(PNG/JPG) 받은 경우**
```
1. assets/figma/ 폴더에 시안 이미지 저장
2. 시각적 분석 진행 (Step 2)
```

---

## Step 2 — 시안 분석 보고

분석 후 PM에게 먼저 보고:

```
[시안 분석 결과]
- 색상 팔레트: Primary #XXXXXX / Secondary #XXXXXX / ...
- 폰트: 본문 XXpx / 제목 XXpx / 소제목 XXpx
- 간격 체계: 8px 그리드 / 4px 그리드
- 주요 컴포넌트: 버튼 2종 / 카드 / 폼 / 테이블 / 모달
- 시안에 없는 상태 (시니어 판단으로 추가 예정):
  - 빈 상태 화면
  - 에러 메시지
  - 로딩 인디케이터
```

---

## Step 3 — CSS 변수 정의

```css
:root {
  /* 시안에서 추출한 값 */
  --color-primary: #시안값;
  --color-secondary: #시안값;
  --color-neutral-100: #시안값;
  --color-error: #시안값;
  --font-body: '시안폰트', sans-serif;
  --font-size-base: 14px;
  --spacing-unit: 8px;
  --border-radius: 시안값px;
}
```

---

## Step 4 — 구현 순서

```
1. 공통 레이아웃 (헤더, 사이드바, 푸터)
2. 공통 컴포넌트 (버튼, 인풋, 카드, 테이블)
3. 화면별 콘텐츠 (시안 순서대로)
4. 인터랙션 (hover, active, 모달, 탭)
5. 시안에 없는 상태 추가 (빈 상태, 에러, 로딩)
```

---

## Step 5 — 산출물 저장

- 저장 위치: `outputs/prototype_프로젝트명_v1.html`

---

## Step 6 — PM 보고

- "시안 N개 화면 중 N개 구현, 이 항목은 시안 미비로 시니어 판단 적용했습니다"
- 시안과 구현 간 차이 목록 전달
