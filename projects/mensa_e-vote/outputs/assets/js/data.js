/**
 * ============================================================
 * 샘플 데이터 — PHP 백엔드 연동 시 서버 렌더링으로 교체
 * 
 * [개발자 참고]
 * 이 파일의 모든 데이터는 DB에서 조회한 결과로 대체됩니다.
 * PHP SSR 전환 시: 각 페이지에서 <?php echo json_encode($data); ?>
 * 형태로 인라인 스크립트에 주입하거나, API 엔드포인트로 분리하세요.
 * ============================================================
 */

const SAMPLE_DATA = {
  // ── 관리자 계정 (→ PHP: 세션 기반 인증으로 교체)
  admin: { id: 'admin', pw: '1234' },

  // ── 총회
  assemblies: [
    {
      id: 1,
      name: '2026년 정기총회',
      datetime: '2026-04-25 14:00',
      description: '제15차 멘사코리아 정기총회',
      status: 'voting', // ready | voting | closed
      voting_started_at: '2026-04-25 14:20',
      chairman_name: '박의장',
      chairman_phone: '010-9999-0000',
    },
  ],

  // ── 안건
  agendas: [
    {
      id: 1, assembly_id: 1, number: 1,
      title: '멘사코리아 회원 연회비를 다음과 같이 조정한다.',
      description: '',
      status: 'open', // open | closed
      options: [
        { id: 1, label: '연 7만원' },
        { id: 2, label: '연 8만원' },
        { id: 3, label: '연 9만원' },
        { id: 4, label: '연 10만원' },
      ],
    },
    {
      id: 2, assembly_id: 1, number: 2,
      title: '선출이사의 인수인계를 의무화하고, 연임 제한 조항을 2회로 신설한다.',
      description: '정관 제12조 개정안',
      status: 'open',
      options: [
        { id: 5, label: '찬성' },
        { id: 6, label: '반대' },
        { id: 7, label: '기권' },
      ],
    },
    {
      id: 3, assembly_id: 1, number: 3,
      title: '2025년도 결산보고를 승인한다.',
      description: '',
      status: 'closed',
      options: [
        { id: 8, label: '찬성' },
        { id: 9, label: '반대' },
        { id: 10, label: '기권' },
      ],
    },
    {
      id: 4, assembly_id: 1, number: 4,
      title: '감사 선임의 건',
      description: '후보: 김감사, 이감사',
      status: 'closed',
      options: [
        { id: 11, label: '김감사' },
        { id: 12, label: '이감사' },
        { id: 13, label: '기권' },
      ],
    },
    {
      id: 5, assembly_id: 1, number: 5,
      title: '차기 총회 개최지 선정',
      description: '',
      status: 'closed',
      options: [
        { id: 14, label: '서울' },
        { id: 15, label: '부산' },
        { id: 16, label: '대전' },
      ],
    },
  ],

  // ── 티켓구매자 (참석자)
  tickets: [
    { id: 1, order_number: 'ORD-20260001', name: '김투표', phone: '010-1234-5678', attended: true, attended_at: '2026-04-25 13:45' },
    { id: 2, order_number: 'ORD-20260002', name: '이참석', phone: '010-2345-6789', attended: true, attended_at: '2026-04-25 14:05' },
    { id: 3, order_number: 'ORD-20260003', name: '최불참', phone: '010-3456-7890', attended: false, attended_at: null },
    { id: 4, order_number: 'ORD-20260004', name: '정기권', phone: '010-5678-9012', attended: true, attended_at: '2026-04-25 14:10' },
    { id: 5, order_number: 'ORD-20260005', name: '박의장', phone: '010-9999-0000', attended: true, attended_at: '2026-04-25 13:30' },
  ],

  // ── 위임
  delegations: [
    { id: 1, delegator_id: 3, delegate_id: 5, status: 'active' },
    // 최불참(3) → 박의장(5)에게 위임
  ],

  // ── 투표 — agenda_id 기준
  votes: {
    1: [
      { ticket_id: 1, option_id: 3, voter_id: 1, on_behalf_of: null, submitted_at: '14:22:31' },
      { ticket_id: 2, option_id: 2, voter_id: 2, on_behalf_of: null, submitted_at: '14:25:17' },
      { ticket_id: 4, option_id: 3, voter_id: 4, on_behalf_of: null, submitted_at: '14:23:45' },
      { ticket_id: 5, option_id: 3, voter_id: 5, on_behalf_of: null, submitted_at: '14:24:10' },
      { ticket_id: 3, option_id: 2, voter_id: 5, on_behalf_of: 3, submitted_at: '14:26:05' },
    ],
    2: [
      { ticket_id: 1, option_id: 5, voter_id: 1, on_behalf_of: null, submitted_at: '14:28:11' },
      { ticket_id: 5, option_id: 5, voter_id: 5, on_behalf_of: null, submitted_at: '14:29:30' },
    ],
    3: [
      { ticket_id: 1, option_id: 8, voter_id: 1, on_behalf_of: null, submitted_at: '14:30:00' },
      { ticket_id: 2, option_id: 8, voter_id: 2, on_behalf_of: null, submitted_at: '14:30:15' },
      { ticket_id: 4, option_id: 9, voter_id: 4, on_behalf_of: null, submitted_at: '14:30:30' },
      { ticket_id: 5, option_id: 8, voter_id: 5, on_behalf_of: null, submitted_at: '14:30:45' },
      { ticket_id: 3, option_id: 8, voter_id: 5, on_behalf_of: 3, submitted_at: '14:31:00' },
    ],
    4: [],
    5: [],
  },
};

// ── 헬퍼 함수
function getAssembly(id) {
  return SAMPLE_DATA.assemblies.find(a => a.id === id);
}

function getAgendasByAssembly(assemblyId) {
  return SAMPLE_DATA.agendas
    .filter(a => a.assembly_id === assemblyId)
    .sort((a, b) => a.number - b.number);
}

function getAgenda(id) {
  return SAMPLE_DATA.agendas.find(a => a.id === id);
}

function getTicket(id) {
  return SAMPLE_DATA.tickets.find(t => t.id === id);
}

function getTicketByAuth(name, phone, orderLast5) {
  return SAMPLE_DATA.tickets.find(t =>
    t.name === name && t.phone === phone && t.order_number.slice(-5) === orderLast5
  );
}

function getDelegationsForDelegate(delegateId) {
  return SAMPLE_DATA.delegations.filter(d => d.delegate_id === delegateId && d.status === 'active');
}

function getVotesByAgenda(agendaId) {
  return SAMPLE_DATA.votes[agendaId] || [];
}

function getVote(agendaId, ticketId) {
  const votes = getVotesByAgenda(agendaId);
  return votes.find(v => v.ticket_id === ticketId);
}

function statusLabel(status) {
  const map = { ready: '준비중', voting: '투표 진행중', closed: '종료', open: '열림' };
  return map[status] || status;
}

function statusClass(status) {
  const map = { ready: 'status-ready', voting: 'status-voting', closed: 'status-closed', open: 'status-open' };
  return map[status] || '';
}
