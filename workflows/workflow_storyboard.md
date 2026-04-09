# Workflow: 스토리보드(SB) 제작

## 언제 쓰나
HTML 프로토타입이 완성된 후, 개발팀 전달용 스토리보드가 필요할 때.
"SB 써줘", "스토리보드 만들어줘", "개발 전달 기획서 만들어줘" 라고 할 때.

> **산출물 형태**: HTML 뷰어 (`story_board/index.html`)  
> Word 문서 방식은 사용하지 않는다. HTML 뷰어가 표준이다.

---

## SB 구조 한 눈에 보기

```
{project}/story_board/
├── index.html              ← 뷰어 엔진 (수정 금지)
├── capture.ps1             ★ 스크린샷 자동 캡처 (배열만 수정)
├── HOW_TO_USE.md           ← 사용 가이드
├── css/sb.css              ← 스타일 엔진 (수정 금지)
├── js/sb.js                ← 앱 로직 엔진 (수정 금지)
├── data/
│   ├── config.js           ★ 프로젝트명·버전·작성자
│   ├── pages.js            ★ 화면 목록 (메타데이터)
│   └── specs/
│       ├── _template.js    ← 스펙 파일 템플릿 (복사해서 사용)
│       └── U01.js, A01.js… ★ 화면별 스펙 (Claude가 작성)
└── images/                 ★ 스크린샷 PNG (capture.ps1이 자동 생성)
```

---

## Step 1 — 템플릿 복사

```
tools/sb_template/ 전체를 {project}/story_board/ 로 복사
```

복사 후 images/ 는 비워둔다 (PNG는 캡처 후 생성).  
`data/specs/` 도 `_template.js` 만 남기고 나머지는 삭제.

---

## Step 2 — config.js 수정

```js
window.SB_CONFIG = {
  projectName : '클라이언트명 + 프로젝트명',
  version     : 'v1.0',
  subtitle    : '개발 전달용',
  author      : '배은아',
};
```

---

## Step 3 — 화면 목록 정의 (pages.js)

프로토타입 HTML 파일 기준으로 화면 목록을 작성한다.

```js
window.PAGES = [

  // 프로젝트 문서 (section: 'doc')
  { id: 'DOC05', section: 'doc', group: 'Documents', name: '공통 레이아웃',
    path: '#', img: 'DOC05_공통_레이아웃.png', tags: ['static'],
    desc: '헤더/푸터/GNB 레이아웃 정의' },

  // 사용자 화면 (section: 'user')
  { id: 'U01', section: 'user', group: '메인', name: '홈 메인',
    path: '../outputs/index.html', img: 'U01_홈_메인.png', tags: [],
    desc: '사이트 진입 메인 화면' },

  // 관리자 화면 (section: 'admin')
  { id: 'A01', section: 'admin', group: '회원관리', name: '회원 목록',
    path: '../outputs/admin/members.html', img: 'A01_회원_목록.png',
    tags: ['list', 'admin-only'], desc: '회원 목록 조회' },
];
```

**ID 규칙**

| 섹션 | 형식 | 예시 |
|---|---|---|
| 프로젝트 문서 | `DOC##` | DOC05, DOC06 |
| 사용자 화면 | `U##` | U01, U02 |
| 관리자 화면 | `A##` | A01, A02 |

**tags 목록**: `list` `detail` `form` `write` `modal` `auth` `member-only` `admin-only` `static`

---

## Step 4 — 스크린샷 캡처

`capture.ps1` 최상단 배열을 pages.js와 동일하게 맞춘 뒤 실행:

```powershell
cd "{project}/story_board"
.\capture.ps1
```

캡처된 PNG가 `images/` 에 저장되면 뷰어에 자동 표시된다.

---

## Step 5 — 스펙 작성 (specs/*.js)

각 화면마다 `_template.js` 복사 → ID명으로 저장 → 내용 채우기.

```
_template.js 복사 → U01.js 저장 → 키·내용 채우기
```

### 스펙 파일 구조

```js
window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

// 어노테이션: 스크린샷 위에 번호 오버레이
// 위치 규칙: 번호는 설명 대상 요소의 좌측 앞에 배치 (x≈13%)
window.ANNOTATIONS['U01'] = [
  { n: 1, x: 13, y: 12 },   // 영역명
  { n: 2, x: 13, y: 35 },   // 영역명
];

window.SPECS['U01'] = `
<h3>목적</h3>
<p>이 화면이 존재하는 이유.</p>

<h3>구조 및 상세</h3>
<h4>① 영역명</h4>
<p>역할 설명.</p>

<h3>Alert 메시지</h3>
...

<h3>Validation</h3>
...

<h3>연관 화면</h3>
...
`;
```

### 어노테이션 좌표 규칙

| 위치 | x 값 | 용도 |
|---|---|---|
| 좌측 콘텐츠 앞 | `x≈13` | 필터, 테이블, 폼 영역 등 대부분 |
| 우측 상단 버튼 | `x≈88~90` | [등록], [새로고침] 등 상단 우측 버튼 |
| 중앙 하단 | `x≈48~50` | 페이지네이션 |

좌표 확인이 필요하면: 뷰어 [📍 좌표] 버튼 ON → 이미지 클릭 → 좌표 클립보드 복사.

### Claude Vision을 이용한 좌표 자동 생성

Claude에게 스크린샷을 보여주면 스펙 섹션(①②③)과 이미지를 분석해 좌표를 자동 추정한다.  
추정 후 [📍 좌표] 버튼으로 미세조정.

---

## Step 6 — 스펙 작성 규칙

### 공통 레이아웃 화면 처리

헤더·푸터·GNB 등 공통 레이아웃은 DOC05에 1회만 기술.  
이후 동일 레이아웃을 사용하는 모든 화면은:
```
<h3>공통 레이아웃</h3>
<p>DOC05 공통 레이아웃 적용. 이 화면 고유 내용만 이하 기술.</p>
```

### 모달 포함 화면 처리

모달이 있는 화면은 같은 스펙 파일 내에 모달 섹션 추가:
```html
<h3>모달: {모달명}</h3>
<p>트리거: [버튼명] 클릭</p>
...
```
별도 파일로 분리하지 않는다.

### 미확정 항목 표기

```html
<span class="warn">⚠️ 협의 필요</span>
<span class="warn">⚠️ 정보 필요</span>
```

---

## Step 7 — 최종 점검

- [ ] 모든 화면에 스크린샷 PNG 존재하는가
- [ ] pages.js ID와 specs/*.js 키가 일치하는가
- [ ] 어노테이션 번호가 스펙 ①②③ 순서와 일치하는가
- [ ] `⚠️ 협의 필요` 항목이 02_decisions.md에 기록됐는가
- [ ] PDF 출력 확인 (뷰어 상단 PDF 버튼)

---

## 참고

- 뷰어 사용법 상세: `story_board/HOW_TO_USE.md`
- 스펙 파일 작성 예시: foresto_homepage의 `data/specs/A01.js` ~ `A33.js`
- 어노테이션 엔진 코드: `js/sb.js` (renderAnnotations, initAnnoDebug, toggleAnnoDebug)
