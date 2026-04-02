# 스토리보드 뷰어 — 사용 가이드

> 모든 기획자 공용 · 모든 프로젝트 재사용 가능  
> **수정하는 파일: `data/` 폴더 + `capture.ps1` 상단 배열만.**  
> `css/`, `js/`, `index.html` 은 건드리지 않는다.

---

## 파일 구조

```
story_board/
├── index.html            ← 뷰어. 수정 금지.
├── capture.ps1           ★ 스크린샷 자동 캡처. 화면 목록 배열만 수정.
├── HOW_TO_USE.md         ← 이 문서
├── css/sb.css            ← 스타일. 수정 금지.
├── js/sb.js              ← 앱 로직. 수정 금지.
│
├── data/
│   ├── config.js         ★ 프로젝트명·버전·작성자
│   ├── pages.js          ★ 화면 목록 (PAGES 배열)
│   └── specs/
│       ├── _template.js     스펙 파일 템플릿 (복사해서 사용)
│       └── A01.js 등        화면별 스펙 (자동 로드)
│
└── images/               ★ 화면 스크린샷 PNG (capture.ps1 출력)
```

---

## 새 프로젝트 세팅 (4단계)

### 1단계 — 폴더 복사

`story_board/` 폴더를 새 프로젝트 폴더 안에 통째로 복사한다.  
`images/` 안의 PNG와 `data/specs/` 안의 기존 스펙 파일(`_template.js` 제외)은 삭제한다.

### 2단계 — `data/config.js` 수정

```js
window.SB_CONFIG = {
  projectName : '클라이언트명 또는 프로젝트명',  // 사이드바 + PDF 표지에 표시
  version     : 'v1.0',
  subtitle    : '개발 전달용',                   // 또는 '클라이언트 검토용' 등
  author      : '작성자 이름',
};
```

### 3단계 — `data/pages.js` 작성

`window.PAGES` 배열에 화면을 추가한다.

```js
window.PAGES = [
  {
    id      : 'DOC-05',               // ID 규칙 아래 참고
    section : 'doc',                  // 'doc' | 'user' | 'admin'
    group   : 'Documents',            // 사이드바 그룹명
    name    : '공통 레이아웃',
    path    : '#',                    // 프로토타입 경로. 없으면 '#'
    img     : 'DOC05_공통레이아웃.png', // images/ 기준 파일명
    tags    : [],                     // 태그 목록 (아래 참고)
    desc    : '이 화면의 한 줄 설명',
  },
  // ... 계속 추가
];
```

### 4단계 — `capture.ps1` 화면 목록 업데이트

`pages.js`에 화면을 추가할 때마다 `capture.ps1`의 `$userPages` / `$adminPages` 배열도 동일하게 추가한다.  
두 파일의 화면 목록이 일치해야 캡처 결과가 뷰어에 연결된다.

```powershell
@{name="U01_홈_메인"; path="index.html"},
#       ↑ images/ 저장 파일명     ↑ outputs/ 기준 경로
```

---

## 스크린샷 자동 캡처 (`capture.ps1`)

### 사전 준비

| 항목 | 내용 |
|---|---|
| Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe` 에 설치 |
| PowerShell | 5.1 이상 (Windows 기본 포함) |
| 프로토타입 | `story_board/../outputs/` 폴더에 HTML 파일이 있어야 함 |

Chrome 경로가 다를 경우 `capture.ps1` 상단 `$chrome` 변수 수정:
```powershell
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

### 실행 방법

```powershell
# 방법 1 — PowerShell에서 직접 실행
cd "C:\...\story_board"
.\capture.ps1

# 방법 2 — 파일 탐색기에서 우클릭 → "PowerShell에서 실행"
```

실행하면 headless Chrome이 자동으로 열렸다 닫히며 `images/` 폴더에 PNG가 저장된다.  
터미널에서 각 화면마다 `OK (1920x높이)` 또는 `FAIL` 상태가 출력된다.

### 새 프로젝트에서 수정할 항목

`capture.ps1`에서 수정이 필요한 부분은 **화면 목록 배열 2개뿐**이다.  
경로(`$baseDir`, `$outDir`)는 `$PSScriptRoot` 기반 상대경로로 자동 설정되므로 수정 불필요.

```powershell
# ── 사용자 페이지 ───────
$userPages = @(
  @{name="U01_홈_메인"; path="index.html"},
  @{name="U02_소개_인사말"; path="about/index.html"},
  # ... pages.js와 동일하게 추가
)

# ── 관리자 페이지 ───────
$adminPages = @(
  @{name="A01_회원_목록"; path="admin/members.html"},
  # ...
)
```

### 캡처 품질 동작 방식

| 항목 | 동작 |
|---|---|
| 해상도 | 1920px 고정 폭, 높이는 콘텐츠에 맞게 자동 측정 |
| JS 대기 | `readyState === complete` 폴링 후 추가 2000ms 대기 — 상세 페이지 데이터 로드 보장 |
| 하단 공백 제거 | `min-height 300px 초과` 값을 자동 제거 후 BoundingClientRect 기반 실제 높이 측정 |
| 스크롤바 | 자동 숨김 처리 |
| fixed 헤더 | `relative`로 전환 — 헤더 아래 콘텐츠가 가려지지 않도록 처리 |

### 캡처 문제 해결

| 증상 | 원인 | 해결 |
|---|---|---|
| `FAIL` 출력 | Chrome 경로 불일치 | `$chrome` 변수 경로 확인 |
| `SKIP (no data)` | 페이지 로드 타임아웃 | 해당 HTML 파일 존재 여부 확인 |
| 이미지가 뷰어에 안 나옴 | `name` 값과 `pages.js img` 파일명 불일치 | `capture.ps1`의 `name`과 `pages.js`의 `img` 값 일치 여부 확인 |
| 상세 페이지 내용 없음 | JS 데이터 로드 미완료 | 프로토타입 JS에 `setTimeout` 등 지연이 크다면 스크립트 내 `Start-Sleep -Milliseconds 2000` 값 증가 |
| 화면 아래 흰 공백 | 레이아웃 `min-height` 잔존 | 스크립트 내 `if(mh > 300)` 기준값을 낮춰서 재시도 |

---

## ID 규칙

| 섹션 | ID 형식 | 예시 |
|---|---|---|
| 프로젝트 문서 | `DOC-##` | `DOC-01`, `DOC-05` |
| 사용자 페이지 | `U##` | `U01`, `U23` |
| 관리자 페이지 | `A##` | `A01`, `A15` |

- 번호는 01부터 순서대로. 두 자리 유지.
- 한 섹션 안에서 번호 중복 금지.

---

## 이미지 파일명 규칙

```
{ID}_{화면명}.png

예)
U01_홈_메인.png
A01_회원_목록.png
DOC05_공통레이아웃.png
```

- 확장자: `.png` 고정
- 한글 공백은 `_`로 대체
- `pages.js`의 `img` 값과 정확히 일치해야 함
- 파일 없으면 뷰어에서 "미캡처" 표시 (오류 아님)

---

## 태그 목록

`tags` 배열에 문자열로 입력. 없으면 `[]`.

| 태그 키 | 의미 |
|---|---|
| `list` | 목록형 화면 |
| `detail` | 상세 화면 |
| `form` | 입력 폼 |
| `write` | 등록/수정 |
| `modal` | 모달 포함 |
| `auth` | 로그인 필요 |
| `member-only` | 회원 전용 |
| `admin-only` | 관리자 전용 |

```js
tags: ['list', 'auth'],
```

---

## 스펙 파일 작성 (`data/specs/`)

화면 상세 스펙(구조·컬럼·Validation·반응형 등)이 있는 경우 작성.  
없어도 동작함 — `desc`(한 줄 설명)만 패널에 표시됨.

### 작성 순서

1. `_template.js` 복사
2. 파일명 규칙: ID에서 하이픈 제거  
   `DOC-05` → `DOC05.js` / `A01` → `A01.js` / `U01` → `U01.js`
3. 최상단 키 변경

```js
window.SPECS = window.SPECS || {};
window.SPECS['A01'] = `   ← 이 키를 실제 ID로 변경
  ...내용...
`;
```

4. 내용 채우기 (템플릿 섹션 구조 유지)
5. 저장하면 **자동 연결** — `pages.js`에 ID가 있으면 자동 로드됨

### 스펙 작성 규칙 (요약)

| 항목 | 규칙 |
|---|---|
| 미확정 항목 | `<span class="warn">⚠️ 협의 필요</span>` |
| 정보 없음 | `<span class="warn">⚠️ 정보 필요</span>` |
| 버튼 표기 | `[버튼명]` + 유형(Primary / Secondary / Danger / Outline / Gray) |
| 날짜 형식 | `YYYY-MM-DD` |
| 개인정보 컬럼 | 마스킹 규칙 반드시 ⚠️ 명시 |
| h3 | 섹션 제목 (번호 없음) |
| h4 | 구조 영역 번호 ①②③… 와 매칭 |
| "구조 및 상세" | `h4` + `<p>` 한 줄 요약 + `<table>` |

---

## 뷰어 조작법

| 동작 | 방법 |
|---|---|
| 화면 열기 | 카드 클릭 또는 사이드바 클릭 |
| 목록 복귀 | `← 목록` 버튼 또는 `Esc` |
| 이전/다음 | 상단 버튼 또는 `←` `→` 방향키 |
| 이미지 확대 | 상세 화면의 이미지 클릭 |
| 프로토타입 열기 | 우측 패널 하단 버튼 |
| 섹션 필터 | 상단 `전체` `문서` `사용자` `관리자` |
| 검색 | 상단 검색창 (ID·화면명·그룹·설명 검색) |
| 레이아웃 전환 | 상단 ⊞(그리드) / ≡(리스트) |
| PDF 출력 | 상단 `PDF` 버튼 → 미리보기 확인 → 인쇄/저장 |

---

## 자주 하는 실수

| 실수 | 원인 | 해결 |
|---|---|---|
| 화면이 아무것도 안 나옴 | `pages.js` 문법 오류 (콤마 누락 등) | 브라우저 콘솔(F12) 확인 |
| 스펙이 표시 안 됨 | 파일명 또는 SPECS 키 불일치 | 파일명 = ID에서 `-` 제거 / 키 = ID 그대로 |
| 이미지 안 나옴 | 파일명 대소문자·공백 불일치 | `images/` 폴더 파일명 정확히 일치시킬 것 |
| PDF 표지 프로젝트명 틀림 | `config.js` 미수정 | `config.js` 먼저 수정 |
| 사이드바에 화면이 없음 | `section` 값 오타 | `'doc'` `'user'` `'admin'` 중 하나만 허용 |

---

## 수정 가능한 파일 / 금지 파일

| 파일 | 수정 여부 | 설명 |
|---|---|---|
| `data/config.js` | **✅ 수정** | 프로젝트명·버전·작성자 |
| `data/pages.js` | **✅ 수정** | 화면 목록 |
| `data/specs/*.js` | **✅ 추가** | 화면별 스펙 |
| `images/*.png` | **✅ 추가** | 스크린샷 (capture.ps1 자동 생성) |
| `capture.ps1` | **✅ 수정** | `$userPages` / `$adminPages` 배열 + 필요시 `$chrome` 경로만 |
| `index.html` | ❌ 수정 금지 | HTML 구조 |
| `css/sb.css` | ❌ 수정 금지 | 공통 스타일 |
| `js/sb.js` | ❌ 수정 금지 | 앱 로직 |
