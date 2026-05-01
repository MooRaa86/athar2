// ===== APP LOGIC - Heritage Sites Guide =====
// Rendering functions, navigation, language switching, detail overlays

// ===== RENDER =====

// --- REGIONS ---
function renderRegions() {
  const l = currentLang;
  const grid = document.getElementById('regionsGrid');
  grid.innerHTML = regions.map(r => {
    const regionSites = sites.filter(s => s.region === r.id);
    const count = regionSites.length;
    const countLbl = l === 'ar' ? `${count} ${count === 1 ? 'موقع أثري' : 'مواقع أثرية'}` : `${count} 个考古遗址`;
    return `
    <div class="region-card" onclick="openRegion('${r.id}')">
      <img class="region-card-img" src="${r.img}" alt="${r.title[l]}" loading="lazy">
      <div class="region-card-overlay"></div>
      <div class="region-card-content">
        <h3 class="region-card-title">${r.title[l]}</h3>
        <p class="region-card-desc">${r.desc[l]}</p>
        <span class="region-card-count">${count > 0 ? countLbl : (l === 'ar' ? 'قريبًا' : '即将推出')}</span>
      </div>
    </div>`;
  }).join('');
}

function openRegion(regionId, skipHash = false) {
  if (!skipHash) { currentRoute = 'region-' + regionId; window.location.hash = currentRoute; }
  const l = currentLang;
  const r = regions.find(x => x.id === regionId);
  if (!r) return;

  const regionSites = sites.filter(s => s.region === regionId);

  // Hide regions view, show sites view
  document.getElementById('regionsView').style.display = 'none';
  const sitesView = document.getElementById('regionSitesView');
  sitesView.style.display = '';

  // Set title and count
  document.getElementById('regionSitesTitle').textContent = r.title[l];
  const count = regionSites.length;
  document.getElementById('regionSitesCount').textContent =
    count > 0
      ? (l === 'ar' ? `${count} ${count === 1 ? 'موقع أثري' : 'مواقع أثرية'}` : `${count} 个考古遗址`)
      : (l === 'ar' ? 'لا توجد مواقع مضافة بعد' : '暂无遗址');

  // Update back button text
  const backSpan = document.querySelector('#regionBackBtn span[data-ar]');
  if (backSpan) backSpan.textContent = l === 'ar' ? backSpan.dataset.ar : backSpan.dataset.zh;

  // Render the sites for this region
  renderSitesForRegion(regionSites);

  // Animate fade-in
  sitesView.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));

  // Store current region for lang switch
  window._currentRegionId = regionId;
}

function showRegions(skipHash = false) {
  if (!skipHash) { currentRoute = 'home'; window.location.hash = currentRoute; }
  document.getElementById('regionSitesView').style.display = 'none';
  document.getElementById('regionsView').style.display = '';
  window._currentRegionId = null;
  renderRegions();
}

function renderSitesForRegion(regionSites) {
  const l = currentLang;
  const grid = document.getElementById('sitesGrid');

  if (regionSites.length === 0) {
    grid.innerHTML = `
      <div class="empty-region-msg">
        <span class="empty-region-icon">🏗</span>
        <p>${l === 'ar' ? 'سيتم إضافة المواقع الأثرية لهذا المكان قريبًا' : '此地区的考古遗址即将添加'}</p>
      </div>`;
    return;
  }

  grid.innerHTML = regionSites.map(s => `
    <div class="site-card${s.wide ? ' wide' : ''}${s.tall ? ' tall' : ''}" onclick="openDetail('${s.id}')">
      <img class="card-img" src="${s.heroImg}" alt="${typeof s.title === 'object' ? s.title[l] : s.title}" loading="lazy">
      <div class="card-overlay"></div>
      <span class="card-glyph">${s.glyph}</span>
      <div class="card-arrow">↗</div>
      <span class="card-cat">${typeof s.catLabel === 'object' ? s.catLabel[l] : s.catLabel}</span>
      <div class="card-content">
        <span class="card-era">${typeof s.era === 'object' ? s.era[l] : s.era}</span>
        <h3 class="card-title">${typeof s.title === 'object' ? s.title[l] : s.title}</h3>
        <p class="card-loc">📍 ${typeof s.loc === 'object' ? s.loc[l] : s.loc}</p>
        <div class="card-meta">
          ${s.meta.map(m => `<div><div class="meta-v">${typeof m.v === 'object' ? m.v[l] : m.v}</div><div class="meta-l">${typeof m.l === 'object' ? m.l[l] : m.l}</div></div>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function renderCivs() {
  const l = currentLang;
  document.getElementById('civCards').innerHTML = civs.map(c => `
    <div class="civ-card">
      <span class="civ-glyph">${c.glyph}</span>
      <div class="civ-name">${c.name[l]}</div>
      <div class="civ-era">${c.era[l]}</div>
      <p class="civ-desc">${c.desc[l]}</p>
      <div class="civ-sites">${c.sites[l].map(s => `<span class="civ-site-tag">${s}</span>`).join('')}</div>
      <div class="civ-bar"></div>
    </div>
  `).join('');
}

function renderMuseums() {
  const l = currentLang;
  document.getElementById('museumList').innerHTML = museums.map((m, i) => `
    <div class="museum-card">
      <div class="museum-num">0${i + 1}</div>
      <div class="museum-info">
        <div class="museum-name">${m.n[l]}</div>
        <div class="museum-loc">📍 ${m.loc[l]}</div>
        <p class="museum-desc">${m.desc[l]}</p>
        <div>${m.tags[l].map(t => `<span class="museum-tag">${t}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
}

function openDetail(id, skipHash = false) {
  if (!skipHash) { currentRoute = 'site-' + id; window.location.hash = currentRoute; }
  const s = sites.find(x => x.id === id);
  const l = currentLang;
  const t = T[l];
  const overlay = document.getElementById('detailOverlay');

  const tl = typeof s.title === 'object' ? s.title[l] : s.title;
  const era = typeof s.era === 'object' ? s.era[l] : s.era;
  const descTxt = typeof s.desc === 'object' ? s.desc[l] : s.desc;
  const parts = descTxt.split('\n\n');
  const quoteTxt = typeof s.quote === 'object' ? s.quote[l] : s.quote;
  const quoteSrc = typeof s.quoteSrc === 'object' ? s.quoteSrc[l] : s.quoteSrc;
  const facts = typeof s.facts === 'object' ? s.facts[l] : s.facts;
  const info = typeof s.info === 'object' ? s.info[l] : s.info;
  const tl2 = typeof s.timeline === 'object' ? s.timeline[l] : s.timeline;
  const places = s.innerPlaces ? (s.innerPlaces[l] || s.innerPlaces) : null;

  // Labels
  const lbl = {
    ar: {
      desc: 'تعريف بالمكان', arch: 'الوصف المعماري والنقوش', places: 'أهم الأماكن داخل الموقع',
      video: 'جولة مصورة', src: 'المصادر'
    },
    zh: {
      desc: '地点介绍', arch: '建筑描述与铭文', places: '遗址内重要地点',
      video: '视频导览', src: '参考资料'
    }
  }[l];

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-hero">
      <img class="detail-hero-img" src="${s.heroImg}" alt="${tl}">
      <div class="detail-hero-overlay"></div>
      <div class="detail-hero-content">
        <span class="detail-era-tag">${era}</span>
        <h1 class="detail-title">${tl}</h1>
      </div>
    </div>
    <div class="detail-body">

      <!-- STATS -->
      <div class="detail-stats">
        ${s.stats.map(st => `
          <div class="stat-box">
            <span class="stat-icon">${st.icon}</span>
            <span class="stat-value">${typeof st.v === 'object' ? st.v[l] : st.v}</span>
            <span class="stat-label">${typeof st.l === 'object' ? st.l[l] : st.l}</span>
          </div>`).join('')}
      </div>

      <!-- MAIN GRID: description + sidebar -->
      <div class="detail-grid">
        <div class="detail-description">
          <h3>${lbl.desc}</h3>
          ${parts.map(p => `<p>${p}</p>`).join('')}
          <div class="quote-block">
            <p class="quote-text">${quoteTxt}</p>
            <p class="quote-source">${quoteSrc}</p>
          </div>
          <h3>${t.amazing}</h3>
          <ul class="detail-facts">${facts.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>
        <div class="detail-sidebar">
          <h3>${t.siteInfo}</h3>
          <table class="info-table">${info.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
          <div class="timeline-section">
            <h3 style="margin-top:2rem">${t.timeline}</h3>
            ${tl2.map(item => `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div>
                  <div class="timeline-year">${item.y || item.year}</div>
                  <div class="timeline-event">${item.e || item.event}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- INNER PLACES -->
      ${places ? `
      <div class="detail-section-hd"><span class="detail-section-glyph">𓉐</span><h3>${lbl.places}</h3></div>
      <div class="detail-places-grid">
        ${places.map((p, idx) => `
          <div class="detail-place-card clickable" onclick="openInnerPlace('${s.id}', ${idx})">
            ${p.images && p.images[0] ? `<div class="place-card-img-wrap"><img class="place-card-img" src="${p.images[0]}" loading="lazy" alt="${p.title}"><div class="place-card-img-overlay"></div></div>` : ''}
            <div class="place-card-body">
              <span class="detail-place-icon">${p.icon}</span>
              <div class="detail-place-title">${p.title}</div>
              <p class="detail-place-text">${p.text.substring(0, 100)}${p.text.length > 100 ? '...' : ''}</p>
              <span class="place-card-cta">${currentLang === 'ar' ? 'عرض التفاصيل ←' : '查看详情 →'}</span>
            </div>
          </div>`).join('')}
      </div>` : ''}

      <!-- PYRAMID GROUPS (Giza only) -->
      ${s.pyramidGroups ? (() => {
      const groups = s.pyramidGroups[l];
      const groupLbl = l === 'ar' ? 'المجموعات الهرمية الملكية الثلاث' : '三座王室金字塔建筑群';
      return `
      <div class="detail-section-hd"><span class="detail-section-glyph">𓇼</span><h3>${groupLbl}</h3></div>
      <div class="pyramid-groups-wrap">
        ${groups.map(g => `
          <div class="pyramid-group-card">
            <div class="pg-img-wrap">
              <img src="${g.img}" class="pg-img" loading="lazy" alt="${g.king}">
              <div class="pg-img-overlay"></div>
              <div class="pg-king-badge">${g.king}</div>
            </div>
            <div class="pg-body">
              <div class="pg-king-title">${g.kingTitle}</div>
              <p class="pg-king-desc">${g.kingDesc}</p>
              <div class="pg-elements">
                ${g.elements.map(el => `
                  <div class="pg-el">
                    <span class="pg-el-name">◈ ${el.name}</span>
                    <span class="pg-el-detail">${el.detail}</span>
                  </div>`).join('')}
              </div>
            </div>
          </div>`).join('')}
      </div>`;
    })() : ''}

      <!-- ARCH ELEMENTS GRID (Giza only) -->
      ${s.archElements ? (() => {
      const elems = s.archElements[l];
      const archLbl = l === 'ar' ? 'العناصر المعمارية الثلاثة عشر للمجمع' : '建筑群13个建筑元素';
      return `
      <div class="detail-section-hd"><span class="detail-section-glyph">𓉐</span><h3>${archLbl}</h3></div>
      <div class="arch-elements-grid">
        ${elems.map(el => `
          <div class="arch-el-card">
            <div class="arch-el-num">${el.num}</div>
            <div class="arch-el-icon">${el.icon}</div>
            <div class="arch-el-title">${el.title}</div>
            <p class="arch-el-desc">${el.desc}</p>
          </div>`).join('')}
      </div>`;
    })() : ''}

      <!-- PYRAMID PASSAGES DETAILED SECTION -->
      ${s.pyramidPassages ? (() => {
      const pp = s.pyramidPassages[l];
      const lbls = {
        ar: { title: 'التخطيط الداخلي التفصيلي للأهرامات', khufu: 'المجموعة الهرمية للملك خوفو — الهرم الأكبر', khafre: 'المجموعة الهرمية للملك خفرع — الهرم الثاني', menkaure: 'المجموعة الهرمية للملك منكاورع — الهرم الثالث', sphinx: 'تمثال أبو الهول — الحارس الصامت', passages: 'الممرات والحجرات الداخلية', complex: 'مجموعة المعابد والطريق الصاعد', sphinxSec: 'أبعاد ومعلومات' },
        zh: { title: '金字塔详细内部规划', khufu: '胡夫法老金字塔建筑群 — 大金字塔', khafre: '卡夫拉法老金字塔建筑群 — 第二金字塔', menkaure: '孟卡拉法老金字塔建筑群 — 第三金字塔', sphinx: '狮身人面像 — 沉默的守护者', passages: '内部通道与墓室', complex: '神庙群与上升通道', sphinxSec: '尺寸与信息' }
      }[l];

      function renderKing(data) {
        return `<div class="king-card">
            <div class="king-seal">𓇼</div>
            <div>
              <div class="king-name">${data.king}</div>
              <div class="king-title">${data.kingTitle}</div>
              <p class="king-desc">${data.kingDesc}</p>
            </div>
          </div>`;
      }

      function renderPassages(passages) {
        return `<div class="passage-list">${passages.map(p => `
            <div class="passage-block${p.reverse ? ' reverse' : ''}">
              <div class="passage-img-wrap">
                <img class="passage-img" src="${p.img}" loading="lazy" alt="${p.title}">
              </div>
              <div class="passage-text-wrap">
                <div class="passage-num">الممر ${p.num}</div>
                <div class="passage-title">${p.title}</div>
                <p class="passage-body">${p.body}</p>
                <span class="passage-tag">${p.tag}</span>
              </div>
            </div>`).join('')}</div>`;
      }

      function renderComplex(items) {
        return `<div class="complex-grid">${items.map(c => `
            <div class="complex-card">
              <div class="complex-img-wrap"><img class="complex-img" src="${c.img}" loading="lazy" alt="${c.title}"></div>
              <div class="complex-body">
                <div class="complex-title">${c.title}</div>
                <p class="complex-desc">${c.desc}</p>
              </div>
            </div>`).join('')}</div>`;
      }

      function renderSphinx(data) {
        return `<div class="sphinx-block">
            <div class="sphinx-img-wrap"><img class="sphinx-img" src="images/sphinx_wide.jpg" loading="lazy" alt="${data.king}"></div>
            <div class="sphinx-info">
              ${data.desc.map(d => `<div class="sphinx-info-block"><div class="sphinx-info-title">${d.title}</div><p class="sphinx-info-text">${d.text}</p></div>`).join('')}
            </div>
          </div>`;
      }

      return `
      <div class="detail-section-hd"><span class="detail-section-glyph">𓇼</span><h3>${lbls.title}</h3></div>

      <div class="pyr-section">
        <div class="pyr-section-hd"><span class="pyr-section-glyph">𓇼</span><div><h2>${lbls.khufu}</h2></div></div>
        ${renderKing(pp.khufu)}
        <div class="detail-section-hd" style="margin-top:1rem"><span class="detail-section-glyph">𓂀</span><h3>${lbls.passages}</h3></div>
        ${renderPassages(pp.khufu.passages)}
      </div>

      <div class="pyr-section">
        <div class="pyr-section-hd"><span class="pyr-section-glyph">𓇼</span><div><h2>${lbls.khafre}</h2></div></div>
        ${renderKing(pp.khafre)}
        <div class="detail-section-hd" style="margin-top:1rem"><span class="detail-section-glyph">𓂀</span><h3>${lbls.passages}</h3></div>
        ${renderPassages(pp.khafre.passages)}
        <div class="detail-section-hd" style="margin-top:1rem"><span class="detail-section-glyph">𓉐</span><h3>${lbls.complex}</h3></div>
        ${renderComplex(pp.khafre.complex)}
      </div>

      <div class="pyr-section">
        <div class="pyr-section-hd"><span class="pyr-section-glyph">𓇼</span><div><h2>${lbls.menkaure}</h2></div></div>
        ${renderKing(pp.menkaure)}
        <div class="detail-section-hd" style="margin-top:1rem"><span class="detail-section-glyph">𓂀</span><h3>${lbls.passages}</h3></div>
        ${renderPassages(pp.menkaure.passages)}
      </div>

      <div class="pyr-section">
        <div class="pyr-section-hd"><span class="pyr-section-glyph">𓁿</span><div><h2>${lbls.sphinx}</h2></div></div>
        ${renderKing(pp.sphinx)}
        ${renderSphinx(pp.sphinx)}
      </div>`;
    })() : ''}

      <!-- VIDEO -->
      ${s.videoSrc ? `
      <div class="detail-section-hd"><span class="detail-section-glyph">𓅱</span><h3>${lbl.video}</h3></div>
      <div class="detail-video-wrap">
        <video controls poster="${s.heroImg}" style="width:100%;max-height:480px;object-fit:cover;display:block;filter:sepia(10%) brightness(0.95);">
          <source src="${s.videoSrc}" type="video/mp4">
        </video>
      </div>` : ''}

      <!-- GALLERY -->
      <div class="detail-section-hd"><span class="detail-section-glyph">𓃀</span><h3>${t.gallery}</h3></div>
      <div class="detail-gallery">${s.gallery.map(img => `<img class="gallery-img" src="${img}" loading="lazy">`).join('')}</div>

    </div>
  `;

  // inject extra CSS for new elements if not yet added
  if (!document.getElementById('detail-extra-styles')) {
    const style = document.createElement('style');
    style.id = 'detail-extra-styles';
    style.textContent = `
      .detail-section-hd { display:flex; align-items:center; gap:0.8rem; margin:2.5rem 0 1.2rem; padding-bottom:0.6rem; border-bottom:1px solid rgba(201,168,76,0.18); }
      .detail-section-glyph { font-size:1.3rem; color:var(--gold); }
      .detail-section-hd h3 { font-family:'Amiri',serif; font-size:1.4rem; color:var(--gold-light); }
      .detail-places-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-bottom:0.5rem; }
      .detail-place-card { background:var(--stone); border:1px solid rgba(201,168,76,0.1); border-right:2px solid var(--gold-dark); padding:1.4rem; transition:border-color 0.3s; }
      .detail-place-card:hover { border-color:rgba(201,168,76,0.35); border-right-color:var(--gold); }
      .detail-place-icon { font-size:1.6rem; display:block; margin-bottom:0.5rem; }
      .detail-place-title { font-family:'Amiri',serif; font-size:1.05rem; color:var(--gold-light); margin-bottom:0.5rem; }
      .detail-place-text { font-size:0.82rem; color:var(--sand-dark); line-height:1.85; }
      .detail-video-wrap { border:1px solid rgba(201,168,76,0.15); overflow:hidden; margin-bottom:0.5rem; }
      /* ===== PYRAMID GROUPS ===== */
      .pyramid-groups-wrap { display:grid; grid-template-columns:repeat(3,1fr); gap:1.2rem; margin-bottom:0.5rem; }
      .pyramid-group-card { background:var(--stone); border:1px solid rgba(201,168,76,0.12); overflow:hidden; transition:border-color 0.4s, transform 0.3s; }
      .pyramid-group-card:hover { border-color:rgba(201,168,76,0.45); transform:translateY(-3px); }
      .pg-img-wrap { position:relative; height:180px; overflow:hidden; }
      .pg-img { width:100%; height:100%; object-fit:cover; filter:sepia(25%) brightness(0.75); transition:filter 0.5s, transform 0.5s; }
      .pyramid-group-card:hover .pg-img { filter:sepia(10%) brightness(0.88); transform:scale(1.05); }
      .pg-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(13,10,5,0.9),transparent 60%); }
      .pg-king-badge { position:absolute; bottom:0.8rem; right:0.8rem; font-family:'Amiri',serif; font-size:1.1rem; color:var(--gold-light); text-shadow:0 1px 6px rgba(0,0,0,0.8); }
      .pg-body { padding:1.2rem; }
      .pg-king-title { font-size:0.7rem; color:var(--gold-dark); letter-spacing:0.12em; margin-bottom:0.6rem; border-bottom:1px solid rgba(201,168,76,0.12); padding-bottom:0.5rem; }
      .pg-king-desc { font-size:0.82rem; color:var(--sand-dark); line-height:1.75; margin-bottom:1rem; }
      .pg-elements { display:flex; flex-direction:column; gap:0.45rem; }
      .pg-el { display:flex; flex-direction:column; gap:0.1rem; padding:0.45rem 0; border-bottom:1px solid rgba(201,168,76,0.06); }
      .pg-el-name { font-size:0.8rem; color:var(--sand); }
      .pg-el-detail { font-size:0.7rem; color:var(--gold-dark); letter-spacing:0.05em; }
      /* ===== ARCH ELEMENTS 13 ===== */
      .arch-elements-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:0.9rem; margin-bottom:0.5rem; }
      .arch-el-card { background:var(--stone); border:1px solid rgba(201,168,76,0.1); border-top:2px solid var(--gold-dark); padding:1.1rem; position:relative; transition:border-color 0.3s, transform 0.3s; }
      .arch-el-card:hover { border-color:rgba(201,168,76,0.4); border-top-color:var(--gold); transform:translateY(-2px); }
      .arch-el-num { position:absolute; top:0.7rem; left:0.8rem; font-size:0.65rem; color:rgba(201,168,76,0.35); letter-spacing:0.15em; font-family:'Amiri',serif; }
      html[data-lang="ar"] .arch-el-num { left:auto; right:0.8rem; }
      .arch-el-icon { font-size:1.5rem; display:block; margin-bottom:0.5rem; text-align:center; }
      .arch-el-title { font-family:'Amiri',serif; font-size:0.95rem; color:var(--gold-light); margin-bottom:0.4rem; text-align:center; }
      .arch-el-desc { font-size:0.75rem; color:var(--sand-dark); line-height:1.7; text-align:center; }
      @media(max-width:900px){
        .pyramid-groups-wrap { grid-template-columns:1fr; }
        .pg-img-wrap { height:220px; }
      }
      @media(max-width:700px){
        .detail-places-grid { grid-template-columns:1fr 1fr; }
        .arch-elements-grid { grid-template-columns:repeat(2,1fr); }
      }
      @media(max-width:480px){
        .detail-places-grid { grid-template-columns:1fr; }
        .arch-elements-grid { grid-template-columns:1fr 1fr; }
      }
      /* ===== CLICKABLE INNER PLACES ===== */
      .detail-place-card.clickable { cursor:pointer; padding:0; overflow:hidden; display:flex; flex-direction:column; transition:border-color 0.4s, transform 0.4s, box-shadow 0.4s; }
      .detail-place-card.clickable:hover { transform:translateY(-5px); box-shadow:0 8px 30px rgba(201,168,76,0.12); }
      .place-card-img-wrap { position:relative; height:160px; overflow:hidden; }
      .place-card-img { width:100%; height:100%; object-fit:cover; filter:sepia(20%) brightness(0.78); transition:filter 0.5s, transform 0.5s; }
      .detail-place-card.clickable:hover .place-card-img { filter:sepia(5%) brightness(0.92); transform:scale(1.06); }
      .place-card-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(13,10,5,0.7),transparent 50%); }
      .place-card-body { padding:1.2rem; flex:1; display:flex; flex-direction:column; }
      .place-card-body .detail-place-text { flex:1; }
      .place-card-cta { display:inline-block; margin-top:0.8rem; font-size:0.75rem; color:var(--gold); letter-spacing:0.1em; transition:color 0.3s; }
      .detail-place-card.clickable:hover .place-card-cta { color:var(--gold-light); }
      /* ===== INNER PLACE DETAIL PANEL ===== */
      .inner-place-panel { position:fixed; inset:0; background:var(--obsidian); z-index:700; overflow-y:auto; opacity:0; pointer-events:none; transition:opacity 0.4s; }
      .inner-place-panel.active { opacity:1; pointer-events:all; }
      .ipp-close { position:fixed; top:1.2rem; left:1.5rem; z-index:800; width:44px; height:44px; border:1px solid rgba(201,168,76,0.5); background:rgba(13,10,5,0.85); color:var(--gold-light); font-size:1.2rem; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.3s; }
      .ipp-close:hover { background:var(--gold); color:var(--obsidian); }
      .ipp-hero { position:relative; height:50vh; min-height:300px; overflow:hidden; }
      .ipp-hero-img { width:100%; height:100%; object-fit:cover; filter:sepia(15%) brightness(0.75); }
      .ipp-hero-overlay { position:absolute; inset:0; background:linear-gradient(to bottom,rgba(13,10,5,0.3),rgba(13,10,5,0.15) 40%,rgba(13,10,5,0.88) 80%,var(--obsidian)); }
      .ipp-hero-content { position:absolute; bottom:2rem; right:3rem; left:3rem; }
      .ipp-hero-icon { font-size:2.5rem; display:block; margin-bottom:0.6rem; }
      .ipp-hero-title { font-family:'Amiri',serif; font-size:clamp(1.8rem,4vw,3rem); color:var(--sand); text-shadow:0 2px 15px rgba(0,0,0,0.7); }
      .ipp-body { max-width:1000px; margin:0 auto; padding:2.5rem; }
      .ipp-desc { font-size:1rem; color:var(--sand-dark); line-height:2.1; margin-bottom:2.5rem; padding:1.5rem 2rem; background:var(--stone); border:1px solid rgba(201,168,76,0.12); border-right:3px solid var(--gold-dark); }
      .ipp-gallery { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:0.8rem; margin-bottom:2.5rem; }
      .ipp-gallery-img { width:100%; aspect-ratio:4/3; object-fit:cover; filter:sepia(15%) brightness(0.85); transition:filter 0.4s, transform 0.3s; border:1px solid rgba(201,168,76,0.1); }
      .ipp-gallery-img:hover { filter:sepia(0%) brightness(1); transform:scale(0.98); }
      .ipp-map-btn { display:inline-flex; align-items:center; gap:0.7rem; padding:0.85rem 2rem; border:1px solid var(--gold); color:var(--gold-light); text-decoration:none; font-size:0.9rem; letter-spacing:0.12em; transition:all 0.4s; font-family:inherit; background:transparent; cursor:pointer; }
      .ipp-map-btn:hover { background:var(--gold); color:var(--obsidian); box-shadow:0 0 30px rgba(201,168,76,0.2); }
      .ipp-map-section { text-align:center; padding:2rem 0; }
      .ipp-back-btn { display:inline-flex; align-items:center; gap:0.5rem; padding:0.6rem 1.5rem; border:1px solid rgba(201,168,76,0.3); color:var(--sand-dark); text-decoration:none; font-size:0.8rem; letter-spacing:0.1em; transition:all 0.3s; font-family:inherit; background:transparent; cursor:pointer; margin-bottom:2rem; }
      .ipp-back-btn:hover { border-color:var(--gold); color:var(--gold-light); }
      @media(max-width:780px) {
        .ipp-hero { height:40vh; min-height:250px; }
        .ipp-hero-content { right:1.5rem; left:1.5rem; bottom:1.5rem; }
        .ipp-body { padding:1.5rem; }
        .ipp-gallery { grid-template-columns:1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  overlay.classList.add('active');
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function openInnerPlace(siteId, placeIdx) {
  const s = sites.find(x => x.id === siteId);
  if (!s || !s.innerPlaces) return;
  const l = currentLang;
  const place = s.innerPlaces[l][placeIdx];
  if (!place) return;

  const mapLbl = l === 'ar' ? '📍 عرض الموقع على الخريطة' : '📍 在地图上查看位置';
  const backLbl = l === 'ar' ? '→ العودة' : '← 返回';
  const galleryLbl = l === 'ar' ? 'معرض الصور' : '图片画廊';
  const locLbl = l === 'ar' ? 'الموقع على الخريطة' : '地图位置';

  let panel = document.getElementById('innerPlacePanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'inner-place-panel';
    panel.id = 'innerPlacePanel';
    document.body.appendChild(panel);
  }

  panel.innerHTML = `
        <button class="ipp-close" onclick="closeInnerPlace()">✕</button>
        <div class="ipp-hero" style="${(place.images && place.images.length > 0) ? '' : 'background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); min-height: 250px;'}">
          ${place.images && place.images.length > 0 ? `<img class="ipp-hero-img" src="${place.images[0]}" alt="${place.title}">` : ''}
          <div class="ipp-hero-overlay"></div>
          <div class="ipp-hero-content">
            <span class="ipp-hero-icon" style="${(place.images && place.images.length > 0) ? '' : 'font-size: 64px; display: block; margin-bottom: 15px;'}">${place.icon}</span>
            <h1 class="ipp-hero-title">${place.title}</h1>
          </div>
        </div>
        <div class="ipp-body">
          <button class="ipp-back-btn" onclick="closeInnerPlace()">${backLbl}</button>
          <div class="ipp-desc">${place.text}</div>
          ${(place.images || []).length > 0 ? `
            <div class="detail-section-hd"><span class="detail-section-glyph">📸</span><h3>${galleryLbl}</h3></div>
            <div class="ipp-gallery">
              ${place.images.map(img => `<img class="ipp-gallery-img" src="${img}" loading="lazy" alt="${place.title}">`).join('')}
            </div>
          ` : ''}
          ${place.mapUrl ? `
            <div class="detail-section-hd"><span class="detail-section-glyph">🗺</span><h3>${locLbl}</h3></div>
            <div class="ipp-map-section">
              <a href="${place.mapUrl}" target="_blank" rel="noopener" class="ipp-map-btn">${mapLbl}</a>
            </div>
          ` : ''}
        </div>
      `;

  panel.classList.add('active');
  panel.scrollTop = 0;
}

function closeInnerPlace() {
  const panel = document.getElementById('innerPlacePanel');
  if (panel) panel.classList.remove('active');
}

function closeDetail() {
  document.getElementById('detailOverlay').classList.remove('active');
  document.body.style.overflow = '';
  
  // Try to go back safely without ruining history if we came directly
  const sId = window.location.hash.replace('#site-', '');
  const s = sites.find(x => x.id === sId);
  if (s) {
    currentRoute = 'region-' + s.region; window.location.hash = currentRoute;
  } else {
    currentRoute = 'home'; window.location.hash = currentRoute;
  }
}

// ===== SECTION NAV =====
function showSection(name, skipHash = false) {
  if (!skipHash) { currentRoute = name; window.location.hash = currentRoute; }
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  const idx = { home: 0, civs: 1, museums: 2, about: 3 }[name];
  document.querySelectorAll('.nav-link')[idx]?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // trigger fade-ins
  setTimeout(() => {
    document.querySelectorAll('#sec-' + name + ' .fade-in').forEach(el => el.classList.add('visible'));
  }, 100);
  if (name === 'home') showRegions(true);
  if (name === 'civs') renderCivs();
  if (name === 'museums') renderMuseums();
}

// ===== LANGUAGE =====
function setLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim() === (lang === 'ar' ? 'عربي' : '中文'));
  });

  // Update logo
  document.getElementById('logo-text').textContent = lang === 'ar' ? 'أثـر' : '遗 迹';
  document.getElementById('logo-sub').textContent = lang === 'ar' ? 'حضارات خالدة' : '永恒的文明';

  // Update nav links
  document.querySelectorAll('[data-ar]').forEach(el => {
    if (el.tagName === 'A' || el.classList.contains('nav-link')) {
      el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.zh;
    }
  });

  // Update all data-ar / data-zh elements
  document.querySelectorAll('[data-ar]').forEach(el => {
    if (el.tagName !== 'BUTTON') {
      el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.zh;
    }
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.textContent = lang === 'ar' ? b.dataset.ar : b.dataset.zh;
  });

  // Footer
  document.getElementById('footer-left').textContent = lang === 'ar' ? '© 2024 أثر — جميع الحقوق محفوظة' : '© 2024 Athar — 版权所有';
  document.getElementById('footer-right').textContent = lang === 'ar' ? 'صُنع بشغف للحضارة' : '为文明而生';

  // Re-render regions or current region sites
  if (window._currentRegionId) {
    openRegion(window._currentRegionId);
  } else {
    renderRegions();
  }

  // Re-render current section
  const activeSec = document.querySelector('.page-section.active')?.id?.replace('sec-', '');
  if (activeSec === 'civs') renderCivs();
  if (activeSec === 'museums') renderMuseums();
}

// ===== INIT =====
renderRegions();

// ===== ROUTER =====
let currentRoute = "";
function handleRoute() {
  const hash = window.location.hash.replace('#', '');
  if (hash === currentRoute) return;
  currentRoute = hash;
  if (!hash) {
    showSection('home', true);
    return;
  }
  
  // Close any open innerPlace if we are navigating backwards
  closeInnerPlace();

  if (['home', 'civs', 'museums', 'about'].includes(hash)) {
    document.getElementById('detailOverlay').classList.remove('active');
    document.body.style.overflow = '';
    showSection(hash, true);
  } else if (hash.startsWith('region-')) {
    document.getElementById('detailOverlay').classList.remove('active');
    document.body.style.overflow = '';
    const rId = hash.replace('region-', '');
    showSection('home', true);
    openRegion(rId, true);
  } else if (hash.startsWith('site-')) {
    const sId = hash.replace('site-', '');
    const s = sites.find(x => x.id === sId);
    if (s) {
      showSection('home', true);
      openRegion(s.region, true);
      openDetail(sId, true);
    }
  }
}

window.addEventListener('hashchange', handleRoute);
// Trigger on initial load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    handleRoute();
  }
});

// Scroll effects
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 60));

// Scroll animations
const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// Hero CTA
document.querySelector('.hero-cta')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('sites').scrollIntoView({ behavior: 'smooth' });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const lb = document.getElementById('lightboxOverlay');
    if (lb && lb.classList.contains('active')) {
      closeLightbox();
      return;
    }
    const ipp = document.getElementById('innerPlacePanel');
    if (ipp && ipp.classList.contains('active')) { closeInnerPlace(); }
    else { closeDetail(); }
  }
});

// ===== GLOBAL LIGHTBOX FOR IMAGES =====
let currentLightboxGallery = [];
let currentLightboxIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

function openLightbox(src, gallery = null, index = 0) {
  const lb = document.getElementById('lightboxOverlay');
  const img = document.getElementById('lightboxImg');
  if (lb && img) {
    if (gallery && gallery.length > 0) {
      currentLightboxGallery = gallery;
      currentLightboxIndex = index;
    } else {
      const clickedImg = Array.from(document.querySelectorAll('img[src*="images/"]')).find(img => img.src === src);
      if (clickedImg) {
        const parent = clickedImg.closest('.detail-gallery, .ipp-gallery, .inner-place-panel, .gallery-grid');
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll('img[src*="images/"]'));
          currentLightboxGallery = siblings.map(img => img.src);
          currentLightboxIndex = currentLightboxGallery.indexOf(src);
        } else {
          currentLightboxGallery = [src];
          currentLightboxIndex = 0;
        }
      } else {
        currentLightboxGallery = [src];
        currentLightboxIndex = 0;
      }
    }
    
    img.src = src;
    lb.classList.add('active');
    updateLightboxUI();
  }
}

function navigateLightbox(direction) {
  if (currentLightboxGallery.length <= 1) return;
  const newIndex = currentLightboxIndex + direction;
  if (newIndex >= 0 && newIndex < currentLightboxGallery.length) {
    currentLightboxIndex = newIndex;
    const img = document.getElementById('lightboxImg');
    if (img) {
      img.style.opacity = '0.5';
      setTimeout(() => {
        img.src = currentLightboxGallery[currentLightboxIndex];
        img.style.opacity = '1';
      }, 150);
    }
    updateLightboxUI();
  }
}

function updateLightboxUI() {
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const counter = document.getElementById('lightboxCounter');
  if (prevBtn) prevBtn.disabled = currentLightboxIndex <= 0;
  if (nextBtn) nextBtn.disabled = currentLightboxIndex >= currentLightboxGallery.length - 1;
  if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxGallery.length}`;
}

function closeLightbox() {
  const lb = document.getElementById('lightboxOverlay');
  if (lb) {
    lb.classList.remove('active');
    setTimeout(() => {
      document.getElementById('lightboxImg').src = '';
      currentLightboxGallery = [];
      currentLightboxIndex = 0;
    }, 300);
  }
}

document.addEventListener('click', e => {
  if (e.target.tagName === 'IMG' && e.target.src && e.target.src.includes('images/')) {
    if (!e.target.closest('.lightbox-overlay')) {
      openLightbox(e.target.src);
    }
  }
});

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightboxOverlay');
  if (lb && lb.classList.contains('active')) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateLightbox(1);
    }
  }
});

document.addEventListener('touchstart', e => {
  const lb = document.getElementById('lightboxOverlay');
  if (lb && lb.classList.contains('active')) {
    touchStartX = e.changedTouches[0].screenX;
  }
}, { passive: true });

document.addEventListener('touchend', e => {
  const lb = document.getElementById('lightboxOverlay');
  if (lb && lb.classList.contains('active')) {
    touchEndX = e.changedTouches[0].screenX;
    handleLightboxSwipe();
  }
}, { passive: true });

function handleLightboxSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      navigateLightbox(1);
    } else {
      navigateLightbox(-1);
    }
  }
}
