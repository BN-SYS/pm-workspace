# pm-workspace

웹에이전시 PM이 Claude AI와 함께 기획 업무를 처리하는 작업 레포지토리입니다.
기능정의서, 화면설계서, HTML 프로토타입, 개발 스펙 등 반복되는 기획 산출물을 자동화합니다.

---

## 이 레포가 하는 일

클라이언트 요청 → 기획 문서 → 프로토타입 → 개발 전달까지,  
PM이 직접 코드를 짜지 않아도 Claude가 판단하고 실행합니다.

```
PM이 지시한다
    └── Claude(기획자)가 Workflow를 읽고 Tool을 골라 실행한다
            ├── 기능정의서 / 요구사항 정의서 (Word)
            ├── 화면설계서 / 스토리보드 (Word)
            ├── HTML 프로토타입 (Figma 시안 기반 또는 독립 제작)
            ├── 개발팀 전달용 스펙 문서 (Word)
            └── 테스트 시나리오 (Excel)
```

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| 백엔드 | PHP (Laravel / CodeIgniter) |
| 프론트엔드 | HTML / CSS / JavaScript (Vanilla JS, jQuery) |
| DB | MySQL |
| 디자인 | Figma |
| 운영 환경 | Linux + Apache, AWS |

---

## 폴더 구조

```
pm-workspace/
│
├── README.md                       # 이 파일
├── CLAUDE.md                       # Claude 작업 지침서 (Claude Code가 자동으로 읽음)
│
├── workflows/                      # 공용 — 업무 유형별 단계별 지시서
│   ├── workflow_function_spec.md   # 기능정의서 작성
│   ├── workflow_storyboard.md      # 화면설계서 / 스토리보드 작성
│   ├── workflow_prototype.md       # HTML 프로토타입 제작 (Figma 없는 경우)
│   ├── workflow_prototype_figma.md # Figma 시안 → HTML 프로토타입 변환
│   ├── workflow_design_update.md   # 기존 프로토타입 → Figma 디자인 시안 반영
│   ├── workflow_client_report.md   # 클라이언트 보고자료 작성
│   ├── workflow_dev_spec.md        # 개발팀 전달 스펙 문서
│   └── workflow_test_scenario.md   # 테스트 시나리오 작성
│
├── tools/                          # 공용 — 재사용 가능한 산출물 생성 스크립트
│   ├── generate_docx.js            # Word 문서 생성
│   ├── generate_xlsx.js            # 엑셀 생성
│   └── build_prototype.js          # HTML 프로토타입 빌드
│
└── projects/                       # 프로젝트별 독립 공간
    ├── mensa_homepage/             # 예시: 멘사코리아 홈페이지 리뉴얼
    │   ├── outputs/                # 완성 산출물 (클라이언트 전달용)
    │   ├── assets/figma/           # Figma export 이미지, 아이콘
    │   ├── .tmp/                   # 임시 파일 (삭제해도 무방)
    │   └── .env                   # 프로젝트 전용 API 키, Figma 토큰 ← git 제외
    │
    └── {client}_{project}/         # 네이밍: 영문소문자_언더스코어
```

> **공용(`workflows/`, `tools/`)** 은 모든 프로젝트가 함께 씁니다. 여기를 수정하면 전체에 반영됩니다.  
> **프로젝트별(`projects/*/`)** 은 완전히 독립입니다. 산출물, Figma 리소스, 환경변수가 섞이지 않습니다.

---

## 시작하는 법

### 1. 레포 클론

```bash
git clone https://github.com/{username}/pm-workspace.git
cd pm-workspace
```

### 2. 새 프로젝트 폴더 만들기

```bash
mkdir -p projects/{client}_{project}/outputs
mkdir -p projects/{client}_{project}/assets/figma
mkdir -p projects/{client}_{project}/.tmp
touch projects/{client}_{project}/.env
```

### 3. `.env` 작성 (프로젝트별)

```
FIGMA_TOKEN=your_personal_access_token
FIGMA_FILE_KEY=해당_프로젝트_파일키
```

### 4. Claude Code 실행

```bash
claude
```

Claude Code는 루트의 `CLAUDE.md`를 자동으로 읽고 시니어 기획자 모드로 작동합니다.

---

## 사용 예시

### Figma 시안이 있을 때 프로토타입 만들기

```
Figma 링크야: https://www.figma.com/file/XXXXX/프로젝트명
mensa_homepage 프로젝트 프로토타입 만들어줘.
```

### Figma 시안 없이 기획 기반 프로토타입 만들기

```
mensa_homepage 프로젝트야.
회원가입 / 로그인 / 마이페이지 기능 기준으로 HTML 프로토타입 만들어줘.
```

### 기능정의서 작성

```
mensa_homepage 프로젝트야.
회원관리 기능 기준으로 기능정의서 초안 작성해줘.
클라이언트는 공공기관이고, 일반회원 / 운영자 / 슈퍼관리자 3등급이야.
```

### 기존 프로토타입에 디자인 시안 반영

```
mensa_homepage 프로젝트야.
Figma 시안 이미지 첨부할게. 기존 프로토타입에 디자인 반영해줘.
```

---

## Figma 연동

두 가지 방식을 지원합니다.

| 방식 | 방법 | 특징 |
|---|---|---|
| URL 공유 | Figma 링크 전달 | API로 색상/폰트/레이아웃 자동 추출 |
| 이미지 첨부 | PNG/JPG export 첨부 | 시각 분석으로 구조/비율 재현 |

Figma API 토큰은 각 프로젝트의 `.env`에만 저장합니다. 코드 안에 절대 하드코딩하지 않습니다.

---

## 보안 주의사항

- `.env` 파일은 절대 커밋하지 않습니다 (`.gitignore`로 자동 제외)
- 외부 공유 자료에 내부 코드명, 단가, 계약 조건 포함 금지
- 클라이언트 전달 파일은 `projects/{name}/outputs/` 안의 파일만

```bash
# .gitignore 필수 포함 항목
projects/**/.env
projects/**/.tmp/
credentials.json
token.json
```

---

## 산출물 종류

| 문서 | 형식 | 용도 |
|---|---|---|
| 기능정의서 | `.docx` | 클라이언트 협의, 범위 확정 |
| 화면설계서 / 스토리보드 | `.docx` | 개발팀 전달, 디자이너 협업 |
| 요구사항 정의서 | `.docx` | 프로젝트 킥오프 전 확정 |
| HTML 프로토타입 | `.html` | 클라이언트 시연, 방향성 확인 |
| 개발 전달 스펙 | `.docx` | 개발팀 착수용 |
| 테스트 시나리오 | `.xlsx` | QA, 납품 전 검수 |
| 회의록 / 보고자료 | `.docx` | 클라이언트 커뮤니케이션 |

---

## 관련 파일

- [`CLAUDE.md`](./CLAUDE.md) — Claude 작업 지침 전문 (역할 정의, Figma 연동 방식, 산출물 기준, 운영 규칙)
- `workflows/` — 업무 유형별 단계별 지시서
- `tools/` — 산출물 생성 스크립트