/**
 * ui.js — 전자투표시스템 UI 전용 스크립트
 *
 * [개발자 참고]
 * 이 파일은 순수 UI 인터랙션만 담당합니다.
 * 데이터 조회·저장은 PHP SSR + form POST 로 처리합니다.
 * 이 파일에 API 호출, 데이터 배열, DOM 주입 로직을 추가하지 마세요.
 */

// ── 프로토타입 폼 인터셉터 ───────────────────────────────────
// process/*.php 가 없는 프로토타입 환경에서 폼 제출을 가로채
// data-proto-redirect 경로로 이동하거나 현재 페이지를 리로드한다.
// [개발자] PHP 구현 완료 후 이 블록 전체 삭제
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('form[action*="process/"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var dest = form.dataset.protoRedirect;
      if (dest) {
        window.location.href = dest;
      } else {
        location.reload();
      }
    });
  });
});

// ── 공통 유틸 ────────────────────────────────────────────────

/**
 * 폼 제출 전 confirm 처리
 * 사용: <form onsubmit="return uiConfirm('메시지')">
 */
function uiConfirm(message) {
  return confirm(message);
}

// ── 관리자 공통 ──────────────────────────────────────────────

/**
 * 총회 상태 전환: 투표 시작 더블 컨펌
 * - process/assembly_start_voting.php 로 POST 전송
 */
function confirmStartVoting() {
  if (!confirm(
    '총회를 [투표 진행중]으로 전환합니다.\n\n' +
    '전환 시 자동 처리:\n' +
    '① 위임장 최종 동기화 (1회)\n' +
    '② 검표 기준 위임 자동 취소 판정\n' +
    '③ 투표 모수 확정 (이후 변경 불가)\n' +
    '④ 스프레드시트 연동 차단\n\n' +
    '전환하시겠습니까?'
  )) return false;
  return confirm(
    '한 번 더 확인합니다.\n' +
    '투표 시작 후에는 준비중으로 되돌릴 수 없습니다.\n' +
    '정말 시작하시겠습니까?'
  );
}

/**
 * 총회 종료 더블 컨펌
 * - process/assembly_close.php 로 POST 전송
 */
function confirmCloseAssembly() {
  if (!confirm(
    '총회를 종료합니다.\n' +
    '열려 있는 모든 안건이 강제 마감됩니다.\n\n' +
    '종료하시겠습니까?'
  )) return false;
  return confirm(
    '한 번 더 확인합니다.\n' +
    '종료된 총회는 되돌릴 수 없습니다.\n' +
    '정말 종료하시겠습니까?'
  );
}

/**
 * 안건 닫기 더블 컨펌
 * - process/agenda_toggle.php 로 POST 전송
 */
function confirmCloseAgenda() {
  if (!confirm('해당 안건의 투표를 마감합니다.\n닫으시겠습니까?')) return false;
  return confirm(
    '닫힌 안건은 재오픈할 수 있지만,\n' +
    '재오픈 시 미투표자의 추가 투표로 결과가 변동될 수 있습니다.\n' +
    '정말 닫으시겠습니까?'
  );
}

/**
 * 안건 재오픈 컨펌
 */
function confirmReopenAgenda() {
  return confirm(
    '마감된 안건을 다시 열겠습니다.\n' +
    '재오픈 시 미투표자가 추가 투표할 수 있습니다.\n' +
    '계속하시겠습니까?'
  );
}

/**
 * 의장 일괄 투표 컨펌
 * @param {HTMLFormElement} form
 */
function confirmBulkVote(form) {
  var selected = form.querySelector('input[name="option_id"]:checked');
  if (!selected) { alert('보기를 선택해주세요.'); return false; }
  var label = selected.closest('label') ? selected.closest('label').textContent.trim() : selected.value;
  return confirm('"' + label + '"으로 의장 귀속 위임 건 전체에 투표합니다.\n계속하시겠습니까?');
}

// ── 안건 폼: 보기 추가/삭제 ──────────────────────────────────

/**
 * 보기 추가 버튼 연결
 * agenda-form.html 에서 id="add-option-btn" 버튼에 onclick 으로 호출
 */
function addOptionRow() {
  var rows = document.querySelectorAll('[data-option-row]');
  var num = rows.length + 1;
  var div = document.createElement('div');
  div.className = 'form-group';
  div.style.cssText = 'display:flex;gap:8px;align-items:center;';
  div.setAttribute('data-option-row', '');
  div.innerHTML =
    '<span style="font-size:13px;color:var(--gray-400);width:20px;">' + num + '</span>' +
    '<input type="text" name="options[]" class="form-control" placeholder="보기 입력" value="">' +
    '<button type="button" class="btn btn-outline btn-sm" style="color:var(--danger);flex-shrink:0;" ' +
      'onclick="this.closest(\'[data-option-row]\').remove(); renumberOptions();">삭제</button>';
  var btn = document.getElementById('add-option-btn');
  if (btn) btn.before(div);
  renumberOptions();
}

function renumberOptions() {
  document.querySelectorAll('[data-option-row]').forEach(function(row, i) {
    var span = row.querySelector('span');
    if (span) span.textContent = i + 1;
  });
}

// ── 투표자 화면 ───────────────────────────────────────────────

/**
 * 라디오 보기 선택 UI
 * @param {HTMLElement} el  클릭된 .option-item
 * @param {string} groupName  라디오 name 속성값
 */
function selectOption(el) {
  el.closest('.option-list').querySelectorAll('.option-item').forEach(function(item) {
    item.classList.remove('selected');
    var radio = item.querySelector('input[type="radio"]');
    if (radio) radio.checked = false;
  });
  el.classList.add('selected');
  var radio = el.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;
}

/**
 * 투표 제출 전: hidden option_id 세팅 + confirm
 * @param {HTMLFormElement} form
 * @param {string} groupName  라디오 name 속성값
 * @param {string} hiddenId   hidden input id
 */
function prepareSubmit(form, groupName, hiddenId) {
  var selected = form.querySelector('input[name="' + groupName + '"]:checked');
  if (!selected) { alert('선택지를 선택해주세요.'); return false; }
  var hiddenEl = document.getElementById(hiddenId);
  if (hiddenEl) hiddenEl.value = selected.value;
  return confirm(
    '투표를 제출합니다.\n' +
    '안건이 열려 있는 동안 수정할 수 있습니다.\n' +
    '제출하시겠습니까?'
  );
}

/**
 * 투표 수정 모드 활성화 (카드 내 옵션 enable)
 * @param {HTMLButtonElement} btn  수정 버튼
 * @param {string} groupName
 * @param {string} hiddenId
 */
function enableEdit(btn, groupName, hiddenId) {
  var card = btn.closest('.agenda-card');
  card.querySelectorAll('.option-item').forEach(function(item) {
    item.classList.remove('disabled');
    var radio = item.querySelector('input[type="radio"]');
    if (radio) radio.disabled = false;
    item.onclick = function() { selectOption(this, groupName); };
  });
  // 수정 버튼 → 제출 버튼으로 교체
  btn.textContent = '수정 제출';
  btn.className = 'btn btn-accent btn-sm';
  btn.onclick = function() {
    var form = card.querySelector('form');
    if (!prepareSubmit(form, groupName, hiddenId)) return;
    form.submit();
  };
  card.classList.remove('is-voted');
  card.classList.add('is-open');
}

/**
 * 수임인 드롭다운 전환 (PHP SSR: URL 파라미터로 리로드)
 * @param {string} memberId  선택한 명의 회원번호
 */
function switchVotingTarget(memberId) {
  var url = new URL(location.href);
  url.searchParams.set('target', memberId);
  location.href = url.toString();
}

// ── 투표자: 이탈 경고 ──────────────────────────────────────────
// [PHP] 미완료 명의가 있으면 body에 data-has-incomplete="true" 부여
// [개발자] vote.php 렌더링 시 $incomplete_targets > 0 이면 body 태그에 속성 추가
window.addEventListener('beforeunload', function (e) {
  if (document.body.dataset.hasIncomplete !== 'true') return;
  e.preventDefault();
});
