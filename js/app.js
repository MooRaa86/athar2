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

  document.getElementById('regionsView').style.display = 'none';
  const sitesView = document.getElementById('regionSitesView');
  sitesView.style.display = '';

  document.getElementById('regionSitesTitle').textContent = r.title[l];
  const count = regionSites.length;
  document.getElementById('regionSitesCount').textContent =
      count > 0
          ? (l === 'ar' ? `${count} ${count === 1 ? 'موقع أثري' : 'مواقع أثرية'}` : `${count} 个考古遗址`)
          : (l === 'ar' ? 'لا توجد مواقع مضافة بعد' : '暂无遗址');

  const backSpan = document.querySelector('#regionBackBtn span[data-ar]');
  if (backSpan) backSpan.textContent = l === 'ar' ? backSpan.dataset.ar : backSpan.dataset.zh;

  renderSitesForRegion(regionSites);
  sitesView.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
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

function renderTeam() {
  const l = currentLang;
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  grid.innerHTML = teamMembers.map((member, i) => `
    <div class="team-card">
      <div class="team-img-wrap">
        <img class="team-img" src="${member.img}" alt="${member.nameAr} - ${member.nameZh}" loading="lazy">
        <div class="team-img-overlay"></div>
      </div>
      <div class="team-body">
        <div class="team-name-ar">${member.nameAr}</div>
        <div class="team-divider"></div>
        <div class="team-name-zh">${member.nameZh}</div>
      </div>
    </div>
  `).join('');
}

// Helper: Convert text with \n to HTML paragraphs
function formatTextWithLineBreaks(text) {
  if (!text) return '';
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.map(p => {
    const formattedPara = p.replace(/\n/g, '<br>');
    return `<p>${formattedPara}</p>`;
  }).join('');
}

// Global variables for inner place navigation
let currentSiteId = null;
let currentInnerPlaceIndex = null;
let isViewingInnerPlace = false;

// ===== OPEN INNER PLACE AS FULL PAGE (inside detail overlay) =====
function openInnerPlace(siteId, placeIdx) {
  const s = sites.find(x => x.id === siteId);
  if (!s || !s.innerPlaces) return;
  const l = currentLang;
  const place = s.innerPlaces[l][placeIdx];
  if (!place) return;

  // Store current location for back button
  currentSiteId = siteId;
  currentInnerPlaceIndex = placeIdx;
  isViewingInnerPlace = true;

  // Update hash for browser navigation
  currentRoute = 'innerplace-' + siteId + '-' + placeIdx;
  window.location.hash = currentRoute;

  // Back label removed - user navigates back manually
  const galleryLbl = l === 'ar' ? 'معرض الصور' : '图片画廊';
  const locLbl = l === 'ar' ? 'الموقع على الخريطة' : '地图位置';
  const mapLbl = l === 'ar' ? '📍 عرض الموقع على الخريطة' : '📍 在地图上查看位置';

  const formattedDescription = formatTextWithLineBreaks(place.text);

  // Get all images including the first one
  const allImages = place.images || [];

  // Build gallery images (all images including first)
  const galleryHtml = allImages.length > 0 ? `
    <div class="detail-section-hd">
      <span class="detail-section-glyph">📸</span>
      <h3>${galleryLbl}</h3>
    </div>
    <div class="inner-place-gallery">
      ${allImages.map((img, idx) =>
      `<img class="inner-place-gallery-img" src="${img}" loading="lazy" alt="${place.title}" onclick="openLightbox([${allImages.map(img => `'${img}'`).join(',')}], ${idx})">`
  ).join('')}
    </div>
  ` : '';

  // Build full page content
  const fullContent = `
    <div class="inner-place-full">
      <div class="inner-place-hero">
        ${allImages.length > 0 ?
      `<img class="inner-place-hero-img" src="${allImages[0]}" alt="${place.title}" onclick="openLightbox([${allImages.map(img => `'${img}'`).join(',')}], 0)">` :
      `<div class="inner-place-hero-placeholder"></div>`
  }
        <div class="inner-place-hero-overlay"></div>
        <div class="inner-place-hero-content">
          <h1 class="inner-place-hero-title">${place.title}</h1>
        </div>

      </div>
      <div class="inner-place-body">
        <div class="inner-place-description">
          ${formattedDescription}
        </div>
        
        ${galleryHtml}
        
        ${place.mapUrl ? `
          <div class="detail-section-hd">
            <span class="detail-section-glyph">🗺</span>
            <h3>${locLbl}</h3>
          </div>
          <div class="inner-place-map-section">
            <a href="${place.mapUrl}" target="_blank" rel="noopener" class="inner-place-map-btn">${mapLbl}</a>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Replace detail content with inner place content
  document.getElementById('detailContent').innerHTML = fullContent;

  // Scroll to top
  const overlay = document.getElementById('detailOverlay');
  if (overlay) overlay.scrollTop = 0;
}

function closeInnerPlace() {
  // Re-render the original site detail
  if (currentSiteId) {
    isViewingInnerPlace = false;
    // Update hash back to site
    currentRoute = 'site-' + currentSiteId;
    window.location.hash = currentRoute;
    openDetail(currentSiteId, true);
    currentSiteId = null;
    currentInnerPlaceIndex = null;
  }
}

// ===== CINEMATIC MUSEUM-STYLE VERTICAL SECTIONS FOR INNER PLACES =====
function renderInnerPlaces(siteId, innerPlacesData, lang) {
  if (!innerPlacesData || !innerPlacesData.length) return '';
  const isRtl = lang === 'ar';

  return `
    <div class="inner-places-cinematic">
      <div class="cinematic-header">
        <span class="cinematic-header-glyph">𓂀</span>
        <h2 class="cinematic-header-title">${isRtl ? 'رحلة الاستكشاف' : '探索之旅'}</h2>
        <div class="cinematic-header-line"></div>
      </div>
      <div class="passage-list">
        ${innerPlacesData.map((p, idx) => {
    const imgUrl = p.images && p.images[0] ? p.images[0] : null;
    const placeNum = String(idx + 1).padStart(2, '0');
    const isReverse = idx % 2 !== 0;
    const label     = isRtl ? `مكان ${placeNum}` : `地点 ${placeNum}`;
    const moreLabel = isRtl ? 'استكشف المكان' : '探索地点';


    // اقتطع الوصف بنفس طريقة passage-body
    let description = p.text || '';
    if (description.length > 300) description = description.substring(0, 300) + '...';


    return `
          <div class="passage-block${isReverse ? ' reverse' : ''}">
            <div class="passage-img-wrap">
              ${imgUrl
        ? `<img class="passage-img" src="${imgUrl}" loading="lazy" alt="${p.title}"
                       onclick="openInnerPlace('${siteId}', ${idx})">`
        : `<div class="passage-img-placeholder"></div>`
    }
            </div>
            <div class="passage-text-wrap">
              <div class="passage-num">${label}</div>
              <div class="passage-title">${p.title}</div>
              <p class="passage-body">${description.replace(/\n/g, '<br>')}</p>
              <button class="cinematic-step-btn" onclick="openInnerPlace('${siteId}', ${idx})">
                <span>${moreLabel}</span>
                <span class="btn-arrow">${isRtl ? '←' : '→'}</span>
              </button>
            </div>
          </div>`;
  }).join('')}
      </div>
    </div>
  `;
}

// ===== UPDATED openDetail FUNCTION =====
function openDetail(id, skipHash = false) {
  if (!skipHash) {
    currentRoute = 'site-' + id;
    window.location.hash = currentRoute;
  }
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

  let innerPlacesHtml = '';
  if (s.innerPlaces) {
    const placesData = s.innerPlaces[l] || s.innerPlaces;
    if (placesData && placesData.length) {
      innerPlacesHtml = renderInnerPlaces(s.id, placesData, l);
    }
  }

  const lbl = {
    ar: { desc: 'تعريف بالمكان', video: 'جولة مصورة', src: 'المصادر' },
    zh: { desc: '地点介绍', video: '视频导览', src: '参考资料' }
  }[l];

  const fullContent = `
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
          ${facts && facts.length ? `<h3>${t.amazing}</h3>
          <ul class="detail-facts">${facts.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
        </div>
        <div class="detail-sidebar">
          ${info && info.length ? `<h3>${t.siteInfo}</h3>
          <table class="info-table">${info.map(([k, v]) => `<tr><td class="info-label">${k}<\/td><td class="info-value">${v}<\/td><\/tr>`).join('')}<\/table>` : ''}
          ${tl2 && tl2.length ? `<div class="timeline-section">
            <h3 style="margin-top:2rem">${t.timeline}</h3>
            ${tl2.map(item => `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div>
                  <div class="timeline-year">${item.y || item.year}</div>
                  <div class="timeline-event">${item.e || item.event}</div>
                </div>
              </div>`).join('')}
          </div>` : ''}
        </div>
      </div>

      <!-- CINEMATIC INNER PLACES SECTIONS -->
      ${innerPlacesHtml}

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

      <!-- PYRAMID PASSAGES -->
      ${s.pyramidPassages ? (() => {
    const pp = s.pyramidPassages[l];
    const lbls = {
      ar: { title: 'التخطيط الداخلي التفصيلي للأهرامات', khufu: 'المجموعة الهرمية للملك خوفو — الهرم الأكبر', khafre: 'المجموعة الهرمية للملك خفرع — الهرم الثاني', menkaure: 'المجموعة الهرمية للملك منكاورع — الهرم الثالث', sphinx: 'تمثال أبو الهول — الحارس الصامت', passages: 'الممرات والحجرات الداخلية', complex: 'مجموعة المعابد والطريق الصاعد', sphinxSec: 'أبعاد ومعلومات' },
      zh: { title: '金字塔详细内部规划', khufu: '胡夫法老金字塔建筑群 — 大金字塔', khafre: '卡夫拉法老金字塔建筑群 — 第二金字塔', menkaure: '孟卡拉法老金字塔建筑群 — 第三金字塔', sphinx: '狮身人面像 — 沉默的守护者', passages: '内部通道与墓室', complex: '神庙群与上升通道', sphinxSec: '尺寸与信息' }
    }[l];

    function renderKing(data) {
      return `<div class="king-card"><div class="king-seal">𓇼</div><div><div class="king-name">${data.king}</div><div class="king-title">${data.kingTitle}</div><p class="king-desc">${data.kingDesc}</p></div></div>`;
    }
    function renderPassages(passages) {
      return `<div class="passage-list">${passages.map(p => `
            <div class="passage-block${p.reverse ? ' reverse' : ''}">
              <div class="passage-img-wrap"><img class="passage-img" src="${p.img}" loading="lazy" alt="${p.title}"></div>
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
              <div class="complex-body"><div class="complex-title">${c.title}</div><p class="complex-desc">${c.desc}</p></div>
            </div>`).join('')}</div>`;
    }
    function renderSphinx(data) {
      return `<div class="sphinx-block"><div class="sphinx-img-wrap"><img class="sphinx-img" src="images/sphinx_wide.jpg" loading="lazy" alt="${data.king}"></div><div class="sphinx-info">${data.desc.map(d => `<div class="sphinx-info-block"><div class="sphinx-info-title">${d.title}</div><p class="sphinx-info-text">${d.text}</p></div>`).join('')}</div></div>`;
    }
    return `
          <div class="detail-section-hd"><span class="detail-section-glyph">𓇼</span><h3>${lbls.title}</h3></div>
          <div class="pyr-section"><div class="pyr-section-hd"><span class="pyr-section-glyph">𓇼</span><div><h2>${lbls.khufu}</h2></div></div>${renderKing(pp.khufu)}<div class="detail-section-hd" style="margin-top:1rem"><span class="detail-section-glyph">𓂀</span><h3>${lbls.passages}</h3></div>${renderPassages(pp.khufu.passages)}</div>
          <div class="pyr-section"><div class="pyr-section-hd"><span class="pyr-section-glyph">𓇼</span><div><h2>${lbls.khafre}</h2></div></div>${renderKing(pp.khafre)}<div class="detail-section-hd" style="margin-top:1rem"><span class="detail-section-glyph">𓂀</span><h3>${lbls.passages}</h3></div>${renderPassages(pp.khafre.passages)}<div class="detail-section-hd" style="margin-top:1rem"><span class="detail-section-glyph">𓉐</span><h3>${lbls.complex}</h3></div>${renderComplex(pp.khafre.complex)}</div>
          <div class="pyr-section"><div class="pyr-section-hd"><span class="pyr-section-glyph">𓇼</span><div><h2>${lbls.menkaure}</h2></div></div>${renderKing(pp.menkaure)}<div class="detail-section-hd" style="margin-top:1rem"><span class="detail-section-glyph">𓂀</span><h3>${lbls.passages}</h3></div>${renderPassages(pp.menkaure.passages)}</div>
          <div class="pyr-section"><div class="pyr-section-hd"><span class="pyr-section-glyph">𓁿</span><div><h2>${lbls.sphinx}</h2></div></div>${renderKing(pp.sphinx)}${renderSphinx(pp.sphinx)}</div>`;
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
      <div class="detail-gallery">${s.gallery.map(img => `<img class="gallery-img" src="${img}" loading="lazy" onclick="openLightbox([${s.gallery.map(img => `'${img}'`).join(',')}], ${s.gallery.findIndex(i => i === img)})" style="cursor: zoom-in;">`).join('')}</div>

    </div>
  `;

  document.getElementById('detailContent').innerHTML = fullContent;

  // Inject CSS if not already present


  overlay.classList.add('active');
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  // If viewing an inner place, go back to the parent site detail (one step back)
  if (isViewingInnerPlace) {
    closeInnerPlace();
    return;
  }
  document.getElementById('detailOverlay').classList.remove('active');
  document.body.style.overflow = '';
  const sId = window.location.hash.replace('#site-', '');
  const s = sites.find(x => x.id === sId);
  if (s) {
    currentRoute = 'region-' + s.region; window.location.hash = currentRoute;
  } else {
    currentRoute = 'home'; window.location.hash = currentRoute;
  }
  // Reset inner place navigation variables
  currentSiteId = null;
  currentInnerPlaceIndex = null;
  isViewingInnerPlace = false;
}

// Open lightbox with gallery array
function openLightbox(galleryArray, startIndex = 0) {
  if (!galleryArray || galleryArray.length === 0) return;
  lbGallery = [...galleryArray];
  lbIndex = startIndex;
  const imgEl = document.getElementById('lightboxImg');
  if (imgEl) {
    imgEl.src = lbGallery[lbIndex];
  }
  const overlay = document.getElementById('lightboxOverlay');
  if (overlay) {
    overlay.classList.add('active');
  }
  document.body.style.overflow = 'hidden';
  updateLightboxButtons();
}

// ===== SECTION NAV, LANGUAGE, MOBILE MENU, LIGHTBOX, ROUTER =====
function showSection(name, skipHash = false) {
  if (!skipHash) { currentRoute = name; window.location.hash = currentRoute; }
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  const idx = { home: 0, civs: 1, museums: 2, about: 3, team: 4 }[name];
  document.querySelectorAll('.nav-link')[idx]?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    document.querySelectorAll('#sec-' + name + ' .fade-in').forEach(el => el.classList.add('visible'));
  }, 100);
  if (name === 'home') showRegions(true);
  if (name === 'civs') renderCivs();
  if (name === 'museums') renderMuseums();
  if (name === 'team') renderTeam();
}

function setLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim() === (lang === 'ar' ? 'عربي' : '中文'));
  });

  document.getElementById('logo-text').textContent = lang === 'ar' ? 'رفيق كيميت' : '古埃及旅伴';
  document.getElementById('logo-sub').textContent = lang === 'ar' ? 'حضارات خالدة' : '永恒的文明';
  const mobileLogo = document.getElementById('mobile-logo-text');
  if (mobileLogo) mobileLogo.textContent = lang === 'ar' ? 'رفيق كيميت' : '古埃及旅伴';

  document.querySelectorAll('[data-ar]').forEach(el => {
    if (el.tagName === 'A' || el.classList.contains('nav-link') || el.classList.contains('mobile-nav-link')) {
      el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.zh;
    }
  });
  document.querySelectorAll('[data-ar]').forEach(el => {
    if (el.tagName !== 'BUTTON') {
      el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.zh;
    }
  });
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.textContent = lang === 'ar' ? b.dataset.ar : b.dataset.zh;
  });
  document.getElementById('footer-left').textContent = lang === 'ar' ? '© 2024 رفيق كيميت — جميع الحقوق محفوظة' : '© 2024 古埃及旅伴 — 版权所有';
  document.getElementById('footer-right').textContent = lang === 'ar' ? 'صُنع بشغف للحضارة' : '为文明而生';

  if (window._currentRegionId) {
    openRegion(window._currentRegionId);
  } else {
    renderRegions();
  }
  const activeSec = document.querySelector('.page-section.active')?.id?.replace('sec-', '');
  if (activeSec === 'civs') renderCivs();
  if (activeSec === 'museums') renderMuseums();
  if (activeSec === 'team') renderTeam();
}

function toggleMobileMenu() {
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('mobileOverlay');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    if (menuBtn) menuBtn.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

let lbGallery = [];
let lbIndex = 0;
let lbTouchStart = 0;
let lbTouchEnd = 0;

function navigateLightbox(direction) {
  if (lbGallery.length <= 1) return;
  let newIndex = lbIndex + direction;
  if (newIndex < 0) newIndex = lbGallery.length - 1;
  if (newIndex >= lbGallery.length) newIndex = 0;
  lbIndex = newIndex;
  const imgEl = document.getElementById('lightboxImg');
  if (imgEl) {
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = lbGallery[lbIndex];
      imgEl.style.opacity = '1';
    }, 150);
  }
  updateLightboxButtons();
}

function updateLightboxButtons() {
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const counter = document.getElementById('lightboxCounter');
  if (prevBtn) {
    if (lbGallery.length <= 1) {
      prevBtn.style.opacity = '0.3';
      nextBtn.style.opacity = '0.3';
      prevBtn.style.pointerEvents = 'none';
      nextBtn.style.pointerEvents = 'none';
    } else {
      prevBtn.style.opacity = '1';
      nextBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'auto';
      nextBtn.style.pointerEvents = 'auto';
    }
  }
  if (counter && lbGallery.length > 0) {
    counter.textContent = `${lbIndex + 1} / ${lbGallery.length}`;
  }
}

function closeLightbox() {
  const overlay = document.getElementById('lightboxOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lbGallery = [];
      lbIndex = 0;
    }, 200);
  }
}

function handleLightboxTouchStart(e) {
  const lb = document.getElementById('lightboxOverlay');
  if (lb && lb.classList.contains('active')) {
    lbTouchStart = e.changedTouches[0].screenX;
  }
}
function handleLightboxTouchEnd(e) {
  const lb = document.getElementById('lightboxOverlay');
  if (lb && lb.classList.contains('active')) {
    lbTouchEnd = e.changedTouches[0].screenX;
    const diff = lbTouchStart - lbTouchEnd;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) navigateLightbox(1);
      else navigateLightbox(-1);
    }
  }
}

let currentRoute = "";
function handleRoute() {
  const hash = window.location.hash.replace('#', '');
  if (hash === currentRoute) return;
  currentRoute = hash;
  if (!hash) {
    showSection('home', true);
    return;
  }
  if (['home', 'civs', 'museums', 'about', 'team'].includes(hash)) {
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
  } else if (hash.startsWith('innerplace-')) {
    // Handle direct navigation to inner place
    const remainder = hash.replace('innerplace-', '');
    const lastDash = remainder.lastIndexOf('-');
    const siteId = remainder.substring(0, lastDash);
    const placeIdx = parseInt(remainder.substring(lastDash + 1));
    const s = sites.find(x => x.id === siteId);
    if (s) {
      showSection('home', true);
      openRegion(s.region, true);
      openDetail(siteId, true);
      setTimeout(() => {
        openInnerPlace(siteId, placeIdx);
      }, 100);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('touchstart', handleLightboxTouchStart);
  document.addEventListener('touchend', handleLightboxTouchEnd);
  if (window.location.hash) handleRoute();
  renderRegions();
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 60));
  const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  document.querySelector('.hero-cta')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('sites').scrollIntoView({ behavior: 'smooth' });
  });
});

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightboxOverlay');
  if (lb && lb.classList.contains('active')) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); navigateLightbox(-1); return; }
    else if (e.key === 'ArrowRight') { e.preventDefault(); navigateLightbox(1); return; }
  }
  if (e.key === 'Escape') {
    const lb = document.getElementById('lightboxOverlay');
    if (lb && lb.classList.contains('active')) { closeLightbox(); return; }
    else {
      const detailOverlay = document.getElementById('detailOverlay');
      if (detailOverlay && detailOverlay.classList.contains('active')) {
        if (isViewingInnerPlace) {
          closeInnerPlace();
        } else {
          closeDetail();
        }
      }
    }
  }
});

window.addEventListener('hashchange', handleRoute);