/* =============================================
   admin-apply-regular.js | 정회원신청 관리
   신청 폼 목록 조회 + 검색/필터 + 상세보기(읽기 전용)
   ============================================= */
'use strict';

const RegularApply = {

  _data:     [],
  _filtered: [],
  _page:     1,
  _pageSize: 10,

  /* ════════════════════════════════
     초기화
  ════════════════════════════════ */
  init() {
    this._data     = this._generateSampleData();
    this._filtered = [...this._data];
    this.render();
  },

  /* 샘플 데이터 (실제 구현 시 API 교체) */
  _generateSampleData() {
    const names   = ['김숲해설','이초록','박자연','최나무','정바람','윤하늘','강숲속','조생태','신나뭇잎','한자연',
                     '문청산','류이슬','백솔밭','안햇살','송나비','임물결','권하늘','오구름','황봄비','노꽃길'];
    const regions = ['서울','경기','인천','부산','대구','서울','경기','서울','인천','기타'];
    const careers = [
      '숲해설가 활동 3년 (도봉구 초등학교 연계 프로그램)',
      '환경부 자연환경해설사 2년',
      '국립공원 자원봉사 해설 5년',
      '유아숲지도사로 어린이집 연계 활동 2년',
      '숲체험지도사 자격 취득 후 주민센터 강의 1년',
    ];
    const certs = [
      '숲해설가 자격증 (한국산림복지진흥원)',
      '자연환경해설사 (환경부)',
      '유아숲지도사 2급',
      '숲체험지도사 1급',
      '산림치유지도사 2급',
    ];
    const docSets = [
      ['재직증명서', '신분증 사본', '자격증 사본'],
      ['활동확인서', '신분증 사본'],
      ['자격증 사본', '재직증명서'],
      ['신분증 사본', '경력기술서'],
    ];
    const motivations = [
      '협회 활동을 통해 더 많은 분들과 숲의 소중함을 나누고 싶어 정회원에 지원합니다.',
      '지역 숲해설 네트워크를 넓히고 전문성을 강화하고자 정회원 전환을 신청합니다.',
      '환경교육 분야에서 오랫동안 활동해왔으며, 협회와 함께 성장하고 싶습니다.',
      '숲 생태 교육에 대한 열정으로 준회원 활동을 해왔고, 이제 더 깊이 참여하고 싶습니다.',
    ];

    return names.map((name, i) => {
      const mo  = String(((i % 11) + 1)).padStart(2, '0');
      const day = String(((i % 20) + 1)).padStart(2, '0');
      return {
        id:         1000 + i,
        name,
        email:      `user${1000 + i}@example.com`,
        phone:      `010-${String(1000 + i).padStart(4, '0')}-${String(2000 + i).padStart(4, '0')}`,
        region:     regions[i % regions.length],
        birth:      `${1975 + (i % 20)}-${mo}-${day}`,
        applyDate:  `2026-0${(i % 3) + 1}-${day}`,
        career:     careers[i % careers.length],
        cert:       certs[i % certs.length],
        docs:       docSets[i % docSets.length],
        motivation: motivations[i % motivations.length],
        agree:      true,
      };
    });
  },

  /* ════════════════════════════════
     검색 / 필터
  ════════════════════════════════ */
  search() {
    const dateFrom = document.getElementById('filterDateFrom')?.value  || '';
    const dateTo   = document.getElementById('filterDateTo')?.value    || '';
    const region   = document.querySelector('input[name="filterRegion"]:checked')?.value || '';
    const kwType   = document.getElementById('filterSearchType')?.value || 'all';
    const keyword  = (document.getElementById('filterKeyword')?.value  || '').trim().toLowerCase();

    this._filtered = this._data.filter(d => {
      if (dateFrom && d.applyDate < dateFrom) return false;
      if (dateTo   && d.applyDate > dateTo)   return false;
      if (region   && d.region !== region)    return false;
      if (keyword) {
        const inName  = d.name.toLowerCase().includes(keyword);
        const inEmail = d.email.toLowerCase().includes(keyword);
        if (kwType === 'name'  && !inName)            return false;
        if (kwType === 'email' && !inEmail)            return false;
        if (kwType === 'all'   && !inName && !inEmail) return false;
      }
      return true;
    });

    this._page = 1;
    this.render();
  },

  setDatePreset(range) {
    const to = new Date(), from = new Date();
    if (range !== 'today') from.setDate(from.getDate() - range);
    const fmt = d => d.toISOString().split('T')[0];
    document.getElementById('filterDateFrom').value = fmt(from);
    document.getElementById('filterDateTo').value   = fmt(to);
    this.search();
  },

  reset() {
    document.getElementById('filterDateFrom').value   = '';
    document.getElementById('filterDateTo').value     = '';
    document.getElementById('filterKeyword').value    = '';
    document.getElementById('filterSearchType').value = 'all';
    document.querySelector('input[name="filterRegion"][value=""]').checked = true;
    this._filtered = [...this._data];
    this._page = 1;
    this.render();
  },

  changePageSize(size) {
    this._pageSize = size;
    this._page     = 1;
    this.render();
  },

  /* ════════════════════════════════
     목록 렌더
  ════════════════════════════════ */
  render() {
    const total = this._filtered.length;
    const slice = this._filtered.slice(
      (this._page - 1) * this._pageSize,
      this._page * this._pageSize
    );

    const countEl = document.getElementById('applyCount');
    if (countEl) countEl.textContent = total.toLocaleString();

    const tbody = document.getElementById('applyTableBody');
    if (!tbody) return;

    if (!slice.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:#8a9e84">검색 결과가 없습니다.</td></tr>`;
      App.renderPagination('applyPagination', 1, 1, () => {});
      return;
    }

    tbody.innerHTML = slice.map((d, i) => {
      const seq = total - (this._page - 1) * this._pageSize - i;
      return `<tr class="apply-row" onclick="RegularApply.openDetail(${d.id})">
        <td>${seq}</td>
        <td><span style="font-weight:600">${d.name}</span></td>
        <td style="text-align:center;font-size:13px">${d.region}</td>
        <td style="text-align:center;font-size:13px">${d.email}</td>
        <td style="text-align:center;font-size:13px">${d.phone}</td>
        <td style="text-align:center;font-size:13px">${d.applyDate}</td>
      </tr>`;
    }).join('');

    App.renderPagination(
      'applyPagination', this._page,
      Math.ceil(total / this._pageSize) || 1,
      p => { this._page = p; this.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    );
  },

  /* ════════════════════════════════
     상세보기 모달 (읽기 전용)
  ════════════════════════════════ */
  openDetail(id) {
    const d = this._data.find(x => x.id === id);
    if (!d) return;

    const docTags = d.docs.map(doc =>
      `<span class="doc-tag">${doc}</span>`
    ).join('');

    document.getElementById('applyDetailBody').innerHTML = `
      <p class="detail-section-title">기본 정보</p>
      <div class="detail-row">
        <span class="detail-key">이름</span>
        <span class="detail-val">${d.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">생년월일</span>
        <span class="detail-val">${d.birth}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">이메일</span>
        <span class="detail-val">${d.email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">연락처</span>
        <span class="detail-val">${d.phone}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">지역</span>
        <span class="detail-val">${d.region}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">신청일</span>
        <span class="detail-val">${d.applyDate}</span>
      </div>

      <p class="detail-section-title">신청 내용</p>
      <div class="detail-row">
        <span class="detail-key">활동 경력</span>
        <span class="detail-val">${d.career}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">자격 사항</span>
        <span class="detail-val">${d.cert}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">지원 동기</span>
        <span class="detail-val" style="line-height:1.7">${d.motivation}</span>
      </div>

      <p class="detail-section-title">제출 서류</p>
      <div class="detail-row">
        <span class="detail-key">첨부 서류</span>
        <span class="detail-val">${docTags}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">개인정보 동의</span>
        <span class="detail-val">${d.agree ? '동의함' : '미동의'}</span>
      </div>
    `;

    App.openModal('applyDetailModal');
  },

  /* 엑셀 다운로드 (실제 구현 시 서버 API 연동) */
  exportExcel() {
    App.toast('정회원신청 목록 엑셀 다운로드를 시작합니다.');
  },
};