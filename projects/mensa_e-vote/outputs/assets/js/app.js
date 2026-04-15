/**
 * 공통 유틸리티
 */

function h(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  const main = document.querySelector('.main-content');
  if (main) main.prepend(alert);
  setTimeout(() => alert.remove(), 3000);
}

// 세션 스토리지 기반 로그인 상태 (→ PHP: $_SESSION으로 교체)
function isAdminLoggedIn() {
  return sessionStorage.getItem('admin_logged_in') === 'true';
}

function adminLogin() {
  sessionStorage.setItem('admin_logged_in', 'true');
}

function adminLogout() {
  sessionStorage.removeItem('admin_logged_in');
}

function requireAdmin() {
  if (!isAdminLoggedIn()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// 투표자 세션 (→ PHP: $_SESSION으로 교체)
function setVoterSession(ticket) {
  sessionStorage.setItem('voter_ticket', JSON.stringify(ticket));
}

function getVoterSession() {
  const data = sessionStorage.getItem('voter_ticket');
  return data ? JSON.parse(data) : null;
}

function clearVoterSession() {
  sessionStorage.removeItem('voter_ticket');
}

// 투표 저장 (로컬 — → PHP: DB INSERT/UPDATE로 교체)
function saveVote(agendaId, ticketId, optionId, voterId, onBehalfOf) {
  if (!SAMPLE_DATA.votes[agendaId]) SAMPLE_DATA.votes[agendaId] = [];
  const existing = SAMPLE_DATA.votes[agendaId].findIndex(v => v.ticket_id === ticketId);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  const vote = { ticket_id: ticketId, option_id: optionId, voter_id: voterId, on_behalf_of: onBehalfOf, submitted_at: timeStr };
  if (existing >= 0) {
    SAMPLE_DATA.votes[agendaId][existing] = vote;
  } else {
    SAMPLE_DATA.votes[agendaId].push(vote);
  }
}
