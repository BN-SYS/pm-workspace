# mensa_e-vote — 멘사코리아 전자투표 시스템

## 프로젝트 개요
총회 안건별 온라인 투표 시스템. 관리자와 투표자(회원) 2개 역할.

## 현재 상태
- 모듈: 05_dev_handoff (개발 전달 직전 단계)
- 프로토타입 방식: PHP SSR 대응 정적 HTML (data.js 의존성 제거 완료)
- 프로토타입: outputs/ 폴더
- 개발 전달 스펙: outputs/docs/dev_spec.md

## 페이지 구성
| 화면 ID | 파일 | 설명 |
|---|---|---|
| root | outputs/index.html | 역할 선택 랜딩 |
| A-01 | outputs/admin/index.html | 관리자 로그인 |
| A-02 | outputs/admin/assemblies.html | 총회 목록 |
| — | outputs/admin/assembly-form.html | 총회 등록/수정 |
| A-03 | outputs/admin/assembly-detail.html | 총회 상세 (안건+상태제어) |
| A-04 | outputs/admin/agenda-form.html | 안건 등록/수정 |
| A-05 | outputs/admin/attendance.html | 출석 현황 |
| A-06 | outputs/admin/delegation.html | 위임 관리 |
| **A-07** | **outputs/admin/vote-status.html** | **투표 현황 (신규)** |
| A-08 | outputs/admin/result.html | 결과 조회 |
| **A-09** | **outputs/admin/bulk-vote.html** | **의장 일괄 투표 (신규)** |
| V-01 | outputs/voter/index.html | 본인 인증 |
| V-02 | outputs/voter/vote.html | 투표 화면 |

## PHP SSR 전환 규칙
- HTML 내 `<!-- [PHP] -->` 주석이 교체 지점
- 폼 action은 `process/xxx.php` 로 연결 (POST 처리 전용)
- JS는 UI 인터랙션 전용 (assets/js/ui.js) — 데이터 로직 없음
- data.js 삭제됨 (PHP 전환 후 불필요)

## 디자인 시스템
- 관리자: 네이비(#001A2E) + 화이트 기반, PC 우선
- 투표자: 화이트 기반, 모바일 우선
- 공통: assets/css/style.css, assets/js/ui.js

## 개발 전달 패키지
- outputs/docs/dev_spec.md — 처리 파일 스펙, 세션 구조, DB 인덱스, 보안 체크리스트
- 미확인 사항: 쇼핑몰 DB 구조 (최범선 부장님 4/17), Google 서비스 계정 키 (고객사 4/17)
