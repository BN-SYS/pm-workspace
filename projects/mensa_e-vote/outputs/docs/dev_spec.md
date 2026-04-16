# 개발자 전달 스펙 — 전자투표시스템 MVP
> 버전 1.1 · 2026-04-16 · 백엔드 개발자 전달용

---

## 0. 이 문서의 목적

이 문서는 HTML 프로토타입을 PHP SSR로 구현하기 위한 **개발 스펙**입니다.  
프로토타입 각 HTML 파일의 `<!-- [PHP] -->` 주석이 교체 지점입니다.

---

## 1. 환경 구성

| 항목 | 내용 |
|---|---|
| 서버 | 쇼핑몰 기존 서버 (Linux + Apache) |
| 언어 | PHP 7.4 이상 |
| DB | MySQL — 전투표 전용 스키마 별도 생성 |
| 외부 DB | 쇼핑몰 DB — 같은 서버, 직접 쿼리 (별도 API 불필요) |
| 외부 연동 | Google Sheets API v4 (서비스 계정) |
| 인증 키 | `.env` 또는 서버 환경변수에 보관 |
| HTTPS | 필수 (투표 데이터 암호화) |

### 디렉토리 구조 (구현 시)

```
evote/
├── index.php
├── admin/
│   ├── index.php           (A-01 로그인)
│   ├── assemblies.php      (A-02 총회 목록)
│   ├── assembly-form.php   (총회 등록/수정)
│   ├── assembly-detail.php (A-03 총회 상세)
│   ├── agenda-form.php     (A-04 안건 등록/수정)
│   ├── attendance.php      (A-05 출석 관리)
│   ├── delegation.php      (A-06 위임 관리)
│   ├── vote-status.php     (A-07 투표 현황)
│   ├── result.php          (A-08 결과 조회)
│   └── bulk-vote.php       (A-09 의장 일괄 투표)
├── voter/
│   ├── index.php           (V-01 본인 인증)
│   └── vote.php            (V-02 투표 화면)
├── process/                (POST 처리 전용 — 출력 없이 리다이렉트만)
│   ├── admin_login.php
│   ├── admin_logout.php
│   ├── assembly_create.php
│   ├── assembly_update.php
│   ├── assembly_start_voting.php  ← 핵심 (위임 취소 판정 포함)
│   ├── assembly_close.php
│   ├── agenda_save.php
│   ├── agenda_toggle.php
│   ├── delegation_sync.php        ← Google Sheets API 호출
│   ├── delegation_csv.php
│   ├── voter_auth.php
│   ├── vote_submit.php
│   ├── bulk_vote.php
│   └── voter_logout.php
├── includes/
│   ├── db.php              (PDO 연결 — evote DB)
│   ├── db_shop.php         (쇼핑몰 DB 연결 — read-only)
│   ├── auth.php            (세션 체크 함수)
│   └── helpers.php         (h(), status_label() 등 공용 함수)
└── assets/
    ├── css/style.css       (변경 없음)
    └── js/ui.js            (변경 없음)
```

---

## 2. 세션 구조

### 관리자 세션
```php
$_SESSION['admin_id']    // 관리자 DB id (int)
$_SESSION['admin_login'] // 로그인 ID (string)
```

### 투표자 세션
```php
$_SESSION['voter_member_id']  // 쇼핑몰 회원번호 (string)
$_SESSION['voter_name']       // 표시용 이름 (string)
$_SESSION['assembly_id']      // 현재 투표 중인 총회 ID (int)
```

> **세션 만료:** 총회 `status = 'closed'` 전환 시 모든 투표자 세션 강제 만료.  
> 구현: `session_destroy()` 직접이 아닌, vote.php 상단에서 총회 상태 체크 → closed이면 세션 지우고 "총회가 종료되었습니다" 안내 표시.

---

## 3. POST 처리 파일 스펙

### 3-1. `process/admin_login.php`
```
POST name=login_id, password
→ Admin 테이블에서 password_hash 검증 (password_verify)
→ 성공: $_SESSION['admin_id'] 세팅 → admin/assemblies.php 리다이렉트
→ 실패: admin/index.php?error=1 리다이렉트
```

### 3-2. `process/assembly_start_voting.php` ★ 핵심
```
POST assembly_id
처리 순서:
1. 안건 0건 체크 → 0이면 중단, assembly-detail.php?id=...&msg=no_agenda
2. Google Sheets API 강제 동기화 1회 (최대 3회 재시도)
   - 실패 시: assembly-detail.php?id=...&msg=sync_failed (CSV 업로드 안내 표시)
   - last_sync_at 이 있으면 "마지막 성공 데이터로 진행" 옵션 제공
3. 위임 취소 판정:
   - UPDATE delegations SET status='cancelled', cancelled_reason='delegator_attended'
   - WHERE assembly_id=? AND status='active'
   - AND delegator_member_id IN (
       SELECT member_id FROM [쇼핑몰 DB].tickets
       WHERE check_time IS NOT NULL AND check_time < NOW()
     )
4. eligible_count 확정:
   - 출석 본인 수: 검표 완료 + 위임 X
   - 유효 위임 수: delegations.status = 'active' (수임인 지정 + 의장 귀속 합산)
   - UPDATE assemblies SET eligible_count = (출석+위임), voting_started_at = NOW()
5. assemblies.status = 'voting' 으로 변경
→ assembly-detail.php?id=... 리다이렉트
```

### 3-3. `process/assembly_close.php`
```
POST assembly_id
1. UPDATE agendas SET status='closed' WHERE assembly_id=? AND status='open'
2. UPDATE assemblies SET status='closed', closed_at=NOW() WHERE id=?
→ assembly-detail.php?id=... 리다이렉트
```

### 3-4. `process/agenda_toggle.php`
```
POST agenda_id, assembly_id
- assembly.status !== 'voting' → 차단
- 현재 status = 'open' → 'closed' (닫기. 열기/닫기 이력 로그 기록)
- 현재 status = 'closed' → 'open' (재오픈)
- 현재 status = 'draft' → 'open' (최초 열기. 이후 보기 수정 불가)
→ assembly-detail.php?id=... 리다이렉트
```

### 3-5. `process/delegation_sync.php`
```
POST assembly_id
- assembly.status === 'voting' → 차단 (400)
- Google Sheets API 호출 → 행 파싱
- 7개 검증 규칙 적용:
  1. delegator 회원번호 매칭 + 정회원 체크
  2. 수임인 공란(D·E·F 모두) → delegatee_member_id = NULL (의장 귀속)
  3. delegator = delegatee → status='invalid_same'
  4. 중복 delegator (같은 C열) → 마지막 행만 유효, 이전 행 status='invalid_duplicate'
  5. delegatee 회원번호 매칭 + 정회원 체크 → 실패 시 status='invalid_grade'
  6. 매칭 자체 실패 → status='invalid_match'
  7. 수임인 1인당 수임 건수 제한 없음 (카운터만 표시)
- UPSERT INTO delegations (assembly_id, delegator_member_id, ...)
- UPDATE assemblies SET last_sync_at = NOW()
→ delegation.php?assembly_id=... 리다이렉트
```

### 3-6. `process/vote_submit.php`
```
POST agenda_id, voter_member_id, option_id
- 세션 체크: voter_member_id === $_SESSION['voter_member_id'] 또는 위임받은 voter
- agenda.status === 'open' 체크 → closed이면 차단
- voter_member_id가 현재 세션 사용자의 투표 권한 범위인지 검증
  (본인 또는 delegations.delegatee_member_id = session.voter_member_id인 위임인만 가능)
- INSERT INTO votes (agenda_id, option_id, voter_member_id, voted_by, voted_at)
  ON DUPLICATE KEY UPDATE option_id=VALUES(option_id), voted_by=VALUES(voted_by), voted_at=NOW()
  (UNIQUE KEY: agenda_id + voter_member_id)
→ voter/vote.php?target=voter_member_id 리다이렉트 (또는 JSON 응답)
```

### 3-7. `process/bulk_vote.php`
```
POST assembly_id, agenda_id, option_id
- 관리자 세션 체크
- assembly.status === 'voting' + agenda.status === 'open' 체크
- 의장 귀속 위임 조회: SELECT * FROM delegations WHERE assembly_id=? AND delegatee_member_id IS NULL AND status='active'
- 각 delegator_member_id 에 대해:
  INSERT INTO votes (agenda_id, option_id, voter_member_id, voted_by, voted_at)
  ON DUPLICATE KEY UPDATE option_id=VALUES(option_id), voted_at=NOW()
  (voted_by = 관리자 ID)
→ bulk-vote.php?assembly_id=... 리다이렉트
```

### 3-8. `process/voter_auth.php`
```
POST name, phone, order_last5
- 총회 상태 체크: status = 'voting'인 총회 존재 여부
- 쇼핑몰 DB 쿼리:
  SELECT member_id, name FROM [shop_db].tickets
  WHERE name=? AND phone=? AND RIGHT(order_number,5)=?
  LIMIT 1
- 매칭 실패: voter/index.php?error=1 리다이렉트
- 매칭 성공:
  - $_SESSION['voter_member_id'] = member_id
  - $_SESSION['voter_name'] = name
  - voter/vote.php 리다이렉트
```

---

## 4. 주요 페이지 PHP 구현 포인트

### `voter/vote.php` ★ 핵심
```php
// 1. 세션 체크
// 2. 총회 종료 여부 체크 → closed이면 세션 파기 + 종료 메시지
// 3. 수임인 드롭다운: GET['target'] 파라미터로 현재 선택 명의 결정
//    - 기본값: 본인($_SESSION['voter_member_id'])
//    - 허용 범위: delegations.delegatee_member_id = session.voter_member_id 인 건
// 4. 각 안건별 기존 투표 조회:
//    SELECT option_id FROM votes WHERE agenda_id=? AND voter_member_id=?
//    (현재 선택 명의 기준)
// 5. 미완료 명의 여부: 모든 명의에서 open 안건 미투표 건이 있으면
//    <body data-has-incomplete="true"> → JS이탈 경고 활성화
```

### `admin/vote-status.php`
```php
// 10초 자동 갱신: PHP에서 <meta http-equiv="refresh" content="10"> 삽입
// 또는 JS setInterval(()=>location.reload(), 10000)
// voting 상태일 때만 갱신. closed 이후 갱신 중단.
```

### `admin/delegation.php`
```php
// 동기화 실패 메시지 처리: GET['msg'] 파라미터로 오류 상태 표시
// - sync_failed: "동기화에 3회 실패했습니다. CSV 업로드를 이용해주세요."
// - sync_partial: "일부 행 검증 실패. 상세 목록 참고."
```

---

## 5. DB 스키마

> **전체 스키마 정의는 README.md 섹션 7 참고.** 아래는 인덱스·제약 조건 추가 사항.

```sql
-- assemblies
ALTER TABLE assemblies ADD INDEX idx_status (status);

-- agendas
ALTER TABLE agendas ADD INDEX idx_assembly (assembly_id, sort_order);

-- votes
ALTER TABLE votes ADD UNIQUE KEY uq_vote (agenda_id, voter_member_id);
ALTER TABLE votes ADD INDEX idx_voted_by (voted_by);

-- delegations
ALTER TABLE delegations
  ADD INDEX idx_delegatee (assembly_id, delegatee_member_id),
  ADD INDEX idx_delegator (assembly_id, delegator_member_id);
```

---

## 6. 쇼핑몰 DB 연동 (확인 필요)

> **확인 담당: 최범선 부장님 / 기한: 4/17**

| 확인 항목 | 내용 |
|---|---|
| 티켓 테이블명 | 미확인 — DB 스키마 공유 요청 |
| check_time 컬럼 | 검표 시각. NULL이면 미검표. |
| 회원 등급 컬럼 | 정회원 판단 기준 컬럼명·값 |
| DB 접근 권한 | evote 스키마에서 shop DB SELECT 권한 필요 |

```php
// includes/db_shop.php 예시
// 쇼핑몰 DB는 READ ONLY 접근만 사용
$shop_pdo = new PDO('mysql:host=localhost;dbname=shop_db;charset=utf8mb4', $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
// 실제 테이블명·컬럼명은 최범선 부장님 확인 후 교체
```

---

## 7. Google Sheets API 연동

```
인증 방식: 서비스 계정 JSON 키 (서버 환경변수 GOOGLE_CREDENTIALS_PATH 에 경로 저장)
스프레드시트 컬럼 순서:
  A: 위임자명  B: 위임자휴대폰  C: 위임자회원번호
  D: 수임자명  E: 수임자휴대폰  F: 수임자회원번호
범위: Sheet1!A2:F (헤더 행 제외)
```

```php
// process/delegation_sync.php 의 Sheets 호출 예시
$credentials = json_decode(file_get_contents(getenv('GOOGLE_CREDENTIALS_PATH')), true);
$client = new Google_Client();
$client->setAuthConfig($credentials);
$client->addScope(Google_Service_Sheets::SPREADSHEETS_READONLY);
$service = new Google_Service_Sheets($client);
$response = $service->spreadsheets_values->get($spreadsheet_id, 'Sheet1!A2:F');
$rows = $response->getValues();
```

---

## 8. 상태 머신 요약

### 총회 상태 전환
```
preparing ──[투표 시작]──► voting ──[총회 종료]──► closed
   ↑ 안건 CRUD 가능          ↑ 안건 열기/닫기 가능      읽기 전용
   ↑ 위임 동기화 가능         ↑ 의장 일괄 투표 가능
```

### 안건 상태 전환
```
draft ──[열기]──► open ──[닫기]──► closed
                    ↑               │
                    └──[재오픈]──────┘
```

| 안건 상태 | 관리자 | 투표자 |
|---|---|---|
| draft | 수정/삭제 가능, 열기 불가 | "예정" 표시, 비활성화 |
| open | 닫기 가능, 수정/삭제 불가 | 투표/수정 가능 |
| closed | 재오픈 가능, 결과 조회 가능 | "마감" 표시, 결과 미표시 |

---

## 9. 익명성 원칙

- `votes` 테이블에 `voter_member_id + option_id` 저장됨 (중복 방지 목적)
- **모든 UI에서 "누가 무엇을 선택했는지" 미표시**
- 관리자도 투표 수/미투표 수만 확인 가능
- DB 직접 조회 권한 보유자만 매핑 확인 가능
- result.html 의 "투표 참여 현황" 테이블: 투표 여부 + 투표 시각 + 투표 주체만 표시

---

## 10. 보안 체크리스트

- [ ] 모든 POST 입력값 `PDO::prepare` + bind_param 사용 (SQL Injection 방지)
- [ ] 출력값 전체 `htmlspecialchars()` 적용
- [ ] 관리자 페이지 전체 `$_SESSION['admin_id']` 체크
- [ ] 투표 페이지: voter_member_id 범위 검증 (본인 + 위임받은 건만 허용)
- [ ] `vote_submit.php`: agenda.status === 'open' 서버 사이드 재검증
- [ ] Google 서비스 계정 JSON 키 절대 소스코드 내 하드코딩 금지
- [ ] `.env` 파일 `.htaccess` 또는 웹루트 외부 위치에 보관
- [ ] HTTPS 강제 (`.htaccess` RewriteRule)

---

## 11. 미확인 사항 (개발 착수 전 필수 확인)

| # | 항목 | 담당 | 기한 |
|---|---|---|---|
| 1 | 쇼핑몰 DB 테이블명·컬럼명 | 최범선 부장님 | 4/17 |
| 2 | 회원 등급 판단 쿼리 (정회원 필터) | 최범선 부장님 | 4/17 |
| 3 | 쇼핑몰 DB에서 evote 스키마 SELECT 권한 부여 | 최범선 부장님 | 4/17 |
| 4 | Google 서비스 계정 JSON 키 전달 | 고객사 | 4/16~17 |
| 5 | 구글 스프레드시트 ID + 공유 설정 | 고객사 | 4/16~17 |

---

## 12. 화면-파일 매핑 (프로토타입 → 구현)

| 화면 ID | 프로토타입 HTML | 구현 PHP | 비고 |
|---|---|---|---|
| A-01 | admin/index.html | admin/index.php | 로그인 |
| A-02 | admin/assemblies.html | admin/assemblies.php | 총회 목록 |
| — | admin/assembly-form.html | admin/assembly-form.php | 총회 등록/수정 |
| A-03 | admin/assembly-detail.html | admin/assembly-detail.php | 총회 상세 + 상태 |
| A-04 | admin/agenda-form.html | admin/agenda-form.php | 안건 등록/수정 |
| A-05 | admin/attendance.html | admin/attendance.php | 출석 현황 |
| A-06 | admin/delegation.html | admin/delegation.php | 위임 관리 |
| **A-07** | **admin/vote-status.html** | admin/vote-status.php | **신규 — 투표 현황** |
| A-08 | admin/result.html | admin/result.php | 결과 조회 |
| **A-09** | **admin/bulk-vote.html** | admin/bulk-vote.php | **신규 — 의장 일괄** |
| V-01 | voter/index.html | voter/index.php | 본인 인증 |
| V-02 | voter/vote.html | voter/vote.php | 투표 화면 |

---

*전자투표시스템 MVP v1.1 · 개발자 전달 스펙 · 2026-04-16*
