# HTML/CSS/JS 공통 패턴 레퍼런스

> CLAUDE.md에서 분리된 코드 예시 모음. 실제 구현 시 참조.

---

## 1. JS 금지 패턴

```javascript
// ❌ 금지 — 배열·객체로 데이터를 만들어 DOM에 주입
const items = [{ name: '상품1' }, { name: '상품2' }];
items.forEach(item => { document.body.innerHTML += '<li>' + item.name + '</li>'; });

// ❌ 금지 — mock/sample/dummy data 배열 선언 후 렌더링
const ALL_MEMBERS = Array.from({ length: 50 }, (_, i) => ({ id: i, name: '테스트' }));
```

---

## 2. 올바른 HTML 샘플 데이터 패턴

```html
<!-- ✅ HTML에 샘플 데이터 직접 작성 — PHP 교체 시 이 자리만 바꾸면 됨 -->
<ul class="item-list">
  <li class="item">
    <span class="item-name">김숲해설</span>
    <span class="item-date">2024-03-15</span>
  </li>
  <li class="item">
    <span class="item-name">이정회</span>
    <span class="item-date">2024-04-02</span>
  </li>
  <!-- 데이터 없을 때 노출 -->
  <!-- <li class="item-empty">등록된 항목이 없습니다.</li> -->
</ul>
```

```javascript
// ✅ JS: HTML에 이미 있는 DOM에 동작만 붙임
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', () => { /* UI 동작만 */ });
});
```

---

## 3. JS DOM null-safety

HTML 요소를 주석 처리하면 관련 JS가 TypeError를 내고 이후 전체 스크립트가 멈춘다.

```javascript
// ❌ 위험: popupEl이 null이면 TypeError → 이후 초기화 전부 멈춤
document.getElementById('popup').addEventListener('click', fn);

// ✅ 안전: 항상 null 체크 먼저
const popup = document.getElementById('popup');
if (popup) popup.addEventListener('click', fn);
```

HTML에서 요소를 주석 처리할 때 → 해당 JS 블록도 null 체크 추가하거나 같이 주석 처리.

---

## 4. CSS 모바일 센터링

`text-align: center`는 인라인 텍스트만 가운데 정렬된다. div/p 같은 블록 요소는 안 된다.

```css
/* ❌ 틀린 방법 — 블록 자식 요소는 왼쪽 치우침 */
.hero .container { text-align: center; }

/* ✅ 맞는 방법 */
@media (max-width: 768px) {
  .hero .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero h1, .hero p { width: 100%; text-align: center; }
}
```

---

## 5. Preview mode (클라이언트 시연용 링크 차단)

특정 페이지만 오픈하고 나머지 링크를 막을 때:

```javascript
document.addEventListener('click', function(e) {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || href === '#' || href.startsWith('javascript') || href.startsWith('mailto')) return;
  if (href.startsWith('http') || href.startsWith('//')) return;
  e.preventDefault();
  App.toast('해당 페이지는 현재 준비 중입니다.');
}, true);
```

---

## 6. Figma → CSS 변수 구조

```css
:root {
  /* 시안에서 추출한 색상 */
  --color-primary: #2d6a3f;
  --color-secondary: #4a9e5c;
  --color-neutral: #f7f8fa;
  --color-error: #e53935;

  /* 폰트 */
  --font-body: 'Pretendard', 'Noto Sans KR', sans-serif;
  --font-size-base: 16px;

  /* 간격 (8px 그리드) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 40px;
}
```

---

## 7. Figma API 상세 (URL 공유 방식)

```
필요한 것: FIGMA_TOKEN (개인 액세스 토큰) → .env에 저장
사용 API:
  GET https://api.figma.com/v1/files/{file_key}        → 구조/레이아웃
  GET https://api.figma.com/v1/images/{file_key}       → 이미지 추출
  GET https://api.figma.com/v1/files/{file_key}/styles → 색상/폰트 스타일

Figma URL에서 file_key 추출:
  https://www.figma.com/file/{FILE_KEY}/프로젝트명
                              ↑ 이 부분이 file_key

.env 저장:
  FIGMA_TOKEN=your_personal_access_token
  FIGMA_FILE_KEY=프로젝트별_파일키
```
