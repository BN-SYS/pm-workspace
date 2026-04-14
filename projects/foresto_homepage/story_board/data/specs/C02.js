/**
 * C02 — 권한 정책표
 * 그룹: 0. 공통 정의 / 섹션: doc
 * 작성일: 2026-04-14
 */

window.SPECS       = window.SPECS       || {};
window.ANNOTATIONS = window.ANNOTATIONS || {};

window.ANNOTATIONS['C02'] = [];

window.SPECS['C02'] = `

<!-- ── 목적 ──────────────────────────────────────── -->
<h3>목적</h3>
<p>
  사이트 내 모든 기능에 대한 4단계 권한별 접근 정책을 정의한다.
  개발팀은 이 표를 기준으로 미들웨어·컨트롤러·프론트엔드 조건부 렌더링을 구현한다.
</p>

<!-- ── 권한 등급 정의 ─────────────────────────────── -->
<h3>권한 등급 정의</h3>
<table>
  <thead><tr><th>등급</th><th>코드값 (role)</th><th>조건</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>비회원</td><td>guest</td><td>미로그인 상태</td><td>세션 없음</td></tr>
    <tr><td>일반회원</td><td>member</td><td>로그인 완료, 정회원 미승인</td><td>가입 즉시 부여</td></tr>
    <tr><td>정회원</td><td>fullMember</td><td>관리자가 정회원 신청 승인 완료</td><td>A11·A12에서 승인 처리</td></tr>
    <tr><td>관리자</td><td>admin</td><td>관리자 페이지 접근 가능 계정</td><td>DB에서 role=admin 직접 설정</td></tr>
  </tbody>
</table>

<!-- ── 기능별 권한 매트릭스 ──────────────────────── -->
<h3>기능별 권한 매트릭스</h3>
<p>○ = 허용 / ✕ = 차단 / △ = 조건부</p>
<table>
  <thead>
    <tr>
      <th>분류</th>
      <th>기능</th>
      <th>비회원</th>
      <th>일반회원</th>
      <th>정회원</th>
      <th>관리자</th>
      <th>차단 처리</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">T1 정적 페이지</td>
      <td>열람</td>
      <td>○</td><td>○</td><td>○</td><td>○</td>
      <td>—</td>
    </tr>
    <tr>
      <td>콘텐츠 관리</td>
      <td>✕</td><td>✕</td><td>✕</td><td>○</td>
      <td>관리자 페이지(A20~A22)로 이동</td>
    </tr>

    <tr>
      <td rowspan="4">T2 교육과정 (기초·자격취득·역량강화)</td>
      <td>목록·상세 열람</td>
      <td>○</td><td>○</td><td>○</td><td>○</td>
      <td>—</td>
    </tr>
    <tr>
      <td>신청하기 클릭</td>
      <td>△</td><td>○</td><td>○</td><td>○</td>
      <td>비회원: "로그인 후 이용 가능합니다" 토스트 → U53</td>
    </tr>
    <tr>
      <td>신청 취소</td>
      <td>✕</td><td>○</td><td>○</td><td>○</td>
      <td>마이페이지(U56-2) 신청내역에서만 취소</td>
    </tr>
    <tr>
      <td>수료증 발급</td>
      <td>✕</td><td>○</td><td>○</td><td>○</td>
      <td>신청내역 완료 상태에서만 버튼 노출</td>
    </tr>

    <tr>
      <td rowspan="3">T2 회원아카데미 (특강·강좌·멘토링)</td>
      <td>목록·상세 열람</td>
      <td>✕</td><td>✕</td><td>○</td><td>○</td>
      <td>비회원·일반회원: "정회원만 이용 가능한 서비스입니다." 토스트 → T1-DIFF(정회원가입안내)</td>
    </tr>
    <tr>
      <td>신청하기</td>
      <td>✕</td><td>✕</td><td>○</td><td>○</td>
      <td>위 동일</td>
    </tr>
    <tr>
      <td>신청 취소</td>
      <td>✕</td><td>✕</td><td>○</td><td>○</td>
      <td>마이페이지 신청내역에서만</td>
    </tr>

    <tr>
      <td rowspan="2">T2 강사 신청</td>
      <td>목록·상세 열람</td>
      <td>✕</td><td>✕</td><td>○</td><td>○</td>
      <td>비회원·일반회원: 위 동일</td>
    </tr>
    <tr>
      <td>신청하기</td>
      <td>✕</td><td>✕</td><td>○</td><td>○</td>
      <td>위 동일</td>
    </tr>

    <tr>
      <td rowspan="4">T3 일반 게시판 (공지·자료실·언론보도·협회지)</td>
      <td>목록·상세 열람</td>
      <td>○</td><td>○</td><td>○</td><td>○</td>
      <td>—</td>
    </tr>
    <tr>
      <td>글쓰기·수정</td>
      <td>✕</td><td>✕</td><td>✕</td><td>○</td>
      <td>관리자만 가능 (A20~A22)</td>
    </tr>
    <tr>
      <td>내 글 수정·삭제</td>
      <td>✕</td><td>○</td><td>○</td><td>○</td>
      <td>본인 글 판단: post.user_id = session.user_id</td>
    </tr>
    <tr>
      <td>모든 글 삭제</td>
      <td>✕</td><td>✕</td><td>✕</td><td>○</td>
      <td>관리자만</td>
    </tr>

    <tr>
      <td rowspan="2">T3 숲일터</td>
      <td>목록·상세 열람</td>
      <td>✕</td><td>✕</td><td>○</td><td>○</td>
      <td>비회원·일반회원: "정회원만 이용 가능한 서비스입니다." 토스트</td>
    </tr>
    <tr>
      <td>글쓰기</td>
      <td>✕</td><td>✕</td><td>✕</td><td>○</td>
      <td>관리자만</td>
    </tr>

    <tr>
      <td rowspan="3">T4 사공단·동아리단</td>
      <td>소개·소식 열람</td>
      <td>✕</td><td>✕</td><td>○</td><td>○</td>
      <td>비회원·일반회원: 페이지 접근 차단 → 정회원 가입 안내</td>
    </tr>
    <tr>
      <td>소식 등록·수정</td>
      <td>✕</td><td>✕</td><td>○</td><td>○</td>
      <td>본인 글만 수정, 삭제는 본인·관리자</td>
    </tr>
    <tr>
      <td>소식 삭제 (모든 글)</td>
      <td>✕</td><td>✕</td><td>✕</td><td>○</td>
      <td>관리자만</td>
    </tr>

    <tr>
      <td rowspan="2">T5 갤러리</td>
      <td>목록·상세 열람</td>
      <td>○</td><td>○</td><td>○</td><td>○</td>
      <td>—</td>
    </tr>
    <tr>
      <td>글쓰기·수정·삭제</td>
      <td>✕</td><td>△</td><td>○</td><td>○</td>
      <td>일반회원: 본인 글쓰기·수정·삭제. 비회원: 미표시.</td>
    </tr>

    <tr>
      <td rowspan="3">마이페이지</td>
      <td>접근</td>
      <td>✕</td><td>○</td><td>○</td><td>○</td>
      <td>비회원: 로그인 페이지(U53) 리다이렉트</td>
    </tr>
    <tr>
      <td>후기 작성</td>
      <td>✕</td><td>○</td><td>○</td><td>○</td>
      <td>완료 상태 강좌만 작성 가능</td>
    </tr>
    <tr>
      <td>증명서 발급</td>
      <td>✕</td><td>○</td><td>○</td><td>○</td>
      <td>완료 상태 강좌만</td>
    </tr>

    <tr>
      <td>관리자 페이지</td>
      <td>접근</td>
      <td>✕</td><td>✕</td><td>✕</td><td>○</td>
      <td>미들웨어: role != admin → 로그인 페이지 리다이렉트</td>
    </tr>
  </tbody>
</table>

<!-- ── 권한 차단 공통 규칙 ────────────────────────── -->
<h3>권한 차단 공통 규칙</h3>
<table>
  <thead><tr><th>상황</th><th>처리</th></tr></thead>
  <tbody>
    <tr>
      <td>비로그인 → 로그인 필요 페이지 직접 접근 (URL 입력)</td>
      <td>로그인 페이지(U53)로 리다이렉트. 로그인 완료 후 원래 URL 복귀.</td>
    </tr>
    <tr>
      <td>비로그인 → 로그인 필요 버튼 클릭</td>
      <td>"로그인 후 이용 가능합니다." 토스트 → U53으로 이동.</td>
    </tr>
    <tr>
      <td>일반회원 → 정회원 전용 페이지 접근</td>
      <td>"정회원만 이용 가능한 서비스입니다." 토스트 → 정회원 가입 안내(T1-DIFF) 이동.</td>
    </tr>
    <tr>
      <td>비관리자 → 관리자 페이지 URL 직접 접근</td>
      <td>Laravel 미들웨어에서 차단 → 로그인 페이지 리다이렉트.</td>
    </tr>
  </tbody>
</table>

<!-- ── 연관 화면 ─────────────────────────────────── -->
<h3>연관 화면</h3>
<table>
  <thead><tr><th>관계</th><th>ID</th><th>화면명</th></tr></thead>
  <tbody>
    <tr><td>공통 컴포넌트</td><td>C01</td><td>공통 컴포넌트 + NAV 매핑</td></tr>
    <tr><td>상태 처리</td><td>C03</td><td>상태별 처리</td></tr>
    <tr><td>정회원 가입 안내</td><td>T1-DIFF</td><td>T1 차이점 명세표 (정회원가입안내 행)</td></tr>
    <tr><td>정회원 신청 폼</td><td>U49</td><td>정회원 가입 신청 폼</td></tr>
    <tr><td>로그인</td><td>U53</td><td>로그인</td></tr>
  </tbody>
</table>

`;
