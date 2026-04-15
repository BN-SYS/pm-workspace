# mensa_e-vote — 멘사코리아 전자투표 시스템

## 프로젝트 개요
총회 안건별 온라인 투표 시스템. 관리자와 투표자(회원) 2개 역할.

## 현재 상태
- 모듈: 04_storyboard (프로토타입 제작 중)
- 프로토타입: outputs/ 폴더

## 페이지 구성
| ID | 파일 | 설명 |
|---|---|---|
| root | outputs/index.html | 역할 선택 랜딩 |
| A-01 | outputs/admin/index.html | 관리자 로그인 |
| A-02 | outputs/admin/assemblies.html | 총회 목록 |
| A-03 | outputs/admin/assembly-form.html | 총회 등록/수정 |
| A-04 | outputs/admin/assembly-detail.html | 총회 상세 (안건+상태제어) |
| A-05 | outputs/admin/agenda-form.html | 안건 등록/수정 |
| A-06 | outputs/admin/result.html | 투표 결과 |
| A-07 | outputs/admin/attendance.html | 출석 현황 |
| A-08 | outputs/admin/delegation.html | 위임 관리 |
| U-01 | outputs/voter/index.html | 본인 인증 |
| U-02 | outputs/voter/vote.html | 투표 화면 |

## 디자인 시스템
- 관리자: 다크 네이비 (#0b1220) + 골드 (#d4af37) 테마
- 투표자: 밝은 화이트 기반, 모바일 우선
- 공통: assets/css/style.css, assets/js/app.js

## 데이터 구조 (PHP 교체 지점)
- assets/js/data.js: 샘플 데이터 → 실서버에서 PHP/JSON API로 교체
