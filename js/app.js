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

  // Alternate image sizes for visual rhythm
  const imageHeightPattern = [520, 320, 480, 280, 560, 350, 500, 300];

  return `
    <div class="inner-places-cinematic">
      <div class="cinematic-header">
        <span class="cinematic-header-glyph">𓂀</span>
        <h2 class="cinematic-header-title">${isRtl ? 'رحلة الاستكشاف' : '探索之旅'}</h2>
        <div class="cinematic-header-line"></div>
      </div>
      <div class="cinematic-sections">
        ${innerPlacesData.map((p, idx) => {
    const imgUrl = p.images && p.images[0] ? p.images[0] : null;
    const placeNumber = String(idx + 1).padStart(2, '0');
    const isEven = idx % 2 === 0;
    const textFirst = isEven;
    const imgHeight = imageHeightPattern[idx % imageHeightPattern.length];
    const isLargeImage = imgHeight >= 480;

    const label = isRtl ? `مكان ${placeNumber}` : `地点 ${placeNumber}`;
    const moreLabel = isRtl ? 'استكشف المكان' : '探索地点';

    let description = p.text;
    if (description.length > 200) {
      description = description.substring(0, 200) + '...';
    }

    return `
      <div class="cinematic-section cinematic-section-${idx}" data-step="${placeNumber}">
        <div class="cinematic-container">
          ${textFirst ? `
            <div class="cinematic-text-col fade-in-up">
              <div class="cinematic-step-label">${label}</div>
              <h3 class="cinematic-step-title">${p.title}</h3>
              <div class="cinematic-step-desc">${description.replace(/\n/g, '<br>')}</div>
              <button class="cinematic-step-btn" onclick="openInnerPlace('${siteId}', ${idx})">
                <span>${moreLabel}</span>
                <span class="btn-arrow">${isRtl ? '←' : '→'}</span>
              </button>
            </div>
            <div class="cinematic-img-col ${isLargeImage ? 'img-large' : 'img-small'} fade-in-up delay-1">
              <div class="cinematic-img-wrapper" onclick="openInnerPlace('${siteId}', ${idx})">
                ${imgUrl ?
        `<img class="cinematic-img" src="${imgUrl}" alt="${p.title}" style="height: ${imgHeight}px; object-fit: cover;">` :
        `<div class="cinematic-img-placeholder" style="height: ${imgHeight}px;"></div>`
    }
                <div class="cinematic-img-overlay"></div>
                <div class="cinematic-img-number">${placeNumber}</div>
              </div>
            </div>
          ` : `
            <div class="cinematic-img-col ${isLargeImage ? 'img-large' : 'img-small'} fade-in-up">
              <div class="cinematic-img-wrapper" onclick="openInnerPlace('${siteId}', ${idx})">
                ${imgUrl ?
        `<img class="cinematic-img" src="${imgUrl}" alt="${p.title}" style="height: ${imgHeight}px; object-fit: cover;">` :
        `<div class="cinematic-img-placeholder" style="height: ${imgHeight}px;"></div>`
    }
                <div class="cinematic-img-overlay"></div>
                <div class="cinematic-img-number">${placeNumber}</div>
              </div>
            </div>
            <div class="cinematic-text-col fade-in-up delay-1">
              <div class="cinematic-step-label">${label}</div>
              <h3 class="cinematic-step-title">${p.title}</h3>
              <div class="cinematic-step-desc">${description.replace(/\n/g, '<br>')}</div>
              <button class="cinematic-step-btn" onclick="openInnerPlace('${siteId}', ${idx})">
                <span>${moreLabel}</span>
                <span class="btn-arrow">${isRtl ? '←' : '→'}</span>
              </button>
            </div>
          `}
        </div>
      </div>
    `;
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
          <h3>${t.amazing}</h3>
          <ul class="detail-facts">${facts.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>
        <div class="detail-sidebar">
          <h3>${t.siteInfo}</h3>
          <table class="info-table">${info.map(([k, v]) => `<tr><td class="info-label">${k}<\/td><td class="info-value">${v}<\/td><\/tr>`).join('')}<\/table>
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
  if (!document.getElementById('cinematic-styles')) {
    const style = document.createElement('style');
    style.id = 'cinematic-styles';
    style.textContent = `
      /* Cinematic Museum-Style Layout */
      .inner-places-cinematic {
        margin: 3rem 0 2rem;
      }
      
      .cinematic-header {
        text-align: center;
        margin-bottom: 3rem;
        position: relative;
      }
      
      .cinematic-header-glyph {
        font-size: 2.5rem;
        color: var(--gold);
        opacity: 0.7;
        display: block;
        margin-bottom: 0.5rem;
      }
      
      .cinematic-header-title {
        font-family: 'Amiri', serif;
        font-size: 1.8rem;
        color: var(--gold-light);
        letter-spacing: 0.1em;
        margin: 0;
        font-weight: 400;
      }
      
      .cinematic-header-line {
        width: 80px;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
        margin: 1rem auto 0;
      }
      
      .cinematic-section {
        padding: 4rem 0;
        border-bottom: 1px solid rgba(201,168,76,0.08);
      }
      
      .cinematic-section:last-child {
        border-bottom: none;
      }
      
      .cinematic-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        display: grid;
        grid-template-columns: 40% 60%;
        gap: 4rem;
        align-items: center;
      }
      
      .cinematic-text-col {
        padding: 1rem;
      }
      
      .cinematic-step-label {
        font-size: 0.8rem;
        color: var(--gold);
        letter-spacing: 0.2em;
        text-transform: uppercase;
        margin-bottom: 1rem;
        font-weight: 500;
      }
      
      .cinematic-step-title {
        font-family: 'Amiri', serif;
        font-size: 1.8rem;
        color: var(--sand-light);
        margin: 0 0 1.2rem 0;
        line-height: 1.3;
        font-weight: 500;
      }
      
      .cinematic-step-desc {
        font-size: 0.95rem;
        color: var(--sand-dark);
        line-height: 1.8;
        margin-bottom: 1.8rem;
      }
      
      .cinematic-step-btn {
        background: transparent;
        border: 1px solid rgba(201,168,76,0.3);
        padding: 0.7rem 1.5rem;
        color: var(--gold-light);
        font-size: 0.85rem;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.8rem;
        border-radius: 30px;
        font-family: inherit;
      }
      
      .cinematic-step-btn:hover {
        background: rgba(201,168,76,0.15);
        border-color: var(--gold);
        transform: translateX(5px);
      }
      
      .btn-arrow {
        transition: transform 0.3s ease;
      }
      
      .cinematic-step-btn:hover .btn-arrow {
        transform: translateX(3px);
      }
      
      .cinematic-img-col {
        position: relative;
      }
      
      .cinematic-img-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        cursor: pointer;
      }
      
      .cinematic-img {
        width: 100%;
        transition: transform 0.5s ease, filter 0.4s ease;
        filter: sepia(15%) brightness(0.85);
        border-radius: 8px;
      }
      
      .cinematic-img-wrapper:hover .cinematic-img {
        transform: scale(1.03);
        filter: sepia(0%) brightness(0.95);
      }
      
      .cinematic-img-placeholder {
        background: linear-gradient(135deg, #2a251a, #1a1710);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
      }
      
      .placeholder-icon {
        font-size: 4rem;
        opacity: 0.5;
      }
      
      .cinematic-img-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40%;
        background: linear-gradient(to top, rgba(13,10,5,0.6), transparent);
        pointer-events: none;
        border-radius: 8px;
      }
      
      .cinematic-img-number {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        font-family: 'Amiri', serif;
        font-size: 2rem;
        font-weight: bold;
        color: rgba(201,168,76,0.35);
        pointer-events: none;
      }
      
      .img-large .cinematic-img-wrapper {
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }
      
      .img-small .cinematic-img-wrapper {
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        margin: 2rem 0;
      }
      
      .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.8s ease forwards;
      }
      
      .delay-1 {
        animation-delay: 0.2s;
      }
      
      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Inner Place Full Page Styles */
      .inner-place-full {
        width: 100%;
        min-height: 100%;
      }
      
      .inner-place-hero {
        position: relative;
        height: 60vh;
        min-height: 400px;
        overflow: hidden;
        background: #1a1a2e;
      }
      
      .inner-place-hero-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: sepia(15%) brightness(0.75);
        cursor: zoom-in;
      }
      
      .inner-place-hero-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #2a251a, #1a1710);
      }
      
      .inner-place-hero-icon {
        font-size: 5rem;
        opacity: 0.5;
      }
      
      .inner-place-hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(13,10,5,0.3), rgba(13,10,5,0.15) 40%, rgba(13,10,5,0.88) 80%, var(--obsidian));
      }
      
      .inner-place-hero-content {
        position: absolute;
        bottom: 2rem;
        left: 2rem;
        right: 2rem;
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      }
      
      .inner-place-hero-content .inner-place-hero-icon {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 0.5rem;
      }
      
      .inner-place-hero-title {
        font-family: 'Amiri', serif;
        font-size: clamp(1.8rem, 5vw, 3rem);
        color: var(--sand);
        margin: 0;
      }
      
      .inner-place-back-btn {
        position: absolute;
        top: 1.5rem;
        left: 1.5rem;
        z-index: 10;
        background: rgba(13,10,5,0.7);
        border: 1px solid rgba(201,168,76,0.4);
        color: var(--gold-light);
        padding: 0.6rem 1.2rem;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 30px;
        backdrop-filter: blur(5px);
        font-family: inherit;
      }
      
      .inner-place-back-btn:hover {
        background: rgba(201,168,76,0.2);
        border-color: var(--gold);
      }
      
      .inner-place-body {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
      }
      
      .inner-place-description {
        font-size: 1rem;
        color: var(--sand-dark);
        line-height: 2.1;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--stone);
        border: 1px solid rgba(201,168,76,0.12);
        border-radius: 8px;
      }
      
      .inner-place-description p {
        margin-bottom: 1rem;
      }
      
      .inner-place-description p:last-child {
        margin-bottom: 0;
      }
      
      .inner-place-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      
      .inner-place-gallery-img {
        width: 100%;
        aspect-ratio: 4/3;
        object-fit: cover;
        filter: sepia(15%) brightness(0.85);
        transition: filter 0.4s, transform 0.3s;
        border: 1px solid rgba(201,168,76,0.1);
        cursor: zoom-in;
        border-radius: 8px;
      }
      
      .inner-place-gallery-img:hover {
        filter: sepia(0%) brightness(1);
        transform: scale(0.98);
      }
      
      .inner-place-map-section {
        text-align: center;
        padding: 1rem 0 2rem;
      }
      
      .inner-place-map-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.7rem;
        padding: 0.85rem 2rem;
        border: 1px solid var(--gold);
        color: var(--gold-light);
        text-decoration: none;
        font-size: 0.9rem;
        letter-spacing: 0.12em;
        transition: all 0.4s;
        font-family: inherit;
        background: transparent;
        cursor: pointer;
        border-radius: 30px;
      }
      
      .inner-place-map-btn:hover {
        background: var(--gold);
        color: var(--obsidian);
        box-shadow: 0 0 30px rgba(201,168,76,0.2);
      }
      
      /* RTL Support */
      html[data-lang="ar"] .cinematic-step-btn:hover {
        transform: translateX(-5px);
      }
      
      html[data-lang="ar"] .cinematic-step-btn:hover .btn-arrow {
        transform: translateX(-3px);
      }
      
      html[data-lang="ar"] .cinematic-img-number {
        right: auto;
        left: 1rem;
      }
      
      html[data-lang="ar"] .inner-place-back-btn {
        left: auto;
        right: 1.5rem;
      }
      
      /* Responsive */
      @media (max-width: 900px) {
        .cinematic-container {
          grid-template-columns: 1fr;
          gap: 2rem;
          padding: 0 1.5rem;
        }
        
        .cinematic-section {
          padding: 3rem 0;
        }
        
        .cinematic-text-col {
          text-align: center;
          order: 2;
        }
        
        .cinematic-img-col {
          order: 1;
        }
        
        .cinematic-step-title {
          font-size: 1.5rem;
        }
        
        .inner-place-hero {
          height: 50vh;
          min-height: 350px;
        }
        
        .inner-place-body {
          padding: 1.5rem;
        }
      }
      
      @media (max-width: 600px) {
        .cinematic-section {
          padding: 2rem 0;
        }
        
        .cinematic-step-title {
          font-size: 1.3rem;
        }
        
        .inner-place-hero {
          height: 40vh;
          min-height: 300px;
        }
        
        .inner-place-back-btn {
          top: 1rem;
          left: 1rem;
          padding: 0.4rem 1rem;
          font-size: 0.75rem;
        }
        
        html[data-lang="ar"] .inner-place-back-btn {
          left: auto;
          right: 1rem;
        }
      }
      
      /* Keep existing styles */
      .detail-section-hd { display:flex; align-items:center; gap:0.8rem; margin:2.5rem 0 1.2rem; padding-bottom:0.6rem; border-bottom:1px solid rgba(201,168,76,0.18); }
      .detail-section-glyph { font-size:1.3rem; color:var(--gold); }
      .detail-section-hd h2, .detail-section-hd h3 { font-family:'Amiri',serif; font-size:1.4rem; color:var(--gold-light); margin:0; }
      .detail-places-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-bottom:0.5rem; }
      .detail-place-card { background:var(--stone); border:1px solid rgba(201,168,76,0.1); border-right:2px solid var(--gold-dark); padding:1.4rem; transition:border-color 0.3s; }
      .detail-place-card:hover { border-color:rgba(201,168,76,0.35); border-right-color:var(--gold); }
      .detail-place-icon { font-size:1.6rem; display:block; margin-bottom:0.5rem; }
      .detail-place-title { font-family:'Amiri',serif; font-size:1.05rem; color:var(--gold-light); margin-bottom:0.5rem; }
      .detail-place-text { font-size:0.82rem; color:var(--sand-dark); line-height:1.85; }
      .detail-video-wrap { border:1px solid rgba(201,168,76,0.15); overflow:hidden; margin-bottom:0.5rem; }
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
      .arch-elements-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:0.9rem; margin-bottom:0.5rem; }
      .arch-el-card { background:var(--stone); border:1px solid rgba(201,168,76,0.1); border-top:2px solid var(--gold-dark); padding:1.1rem; position:relative; transition:border-color 0.3s, transform 0.3s; }
      .arch-el-card:hover { border-color:rgba(201,168,76,0.4); border-top-color:var(--gold); transform:translateY(-2px); }
      .arch-el-num { position:absolute; top:0.7rem; left:0.8rem; font-size:0.65rem; color:rgba(201,168,76,0.35); letter-spacing:0.15em; font-family:'Amiri',serif; }
      html[data-lang="ar"] .arch-el-num { left:auto; right:0.8rem; }
      .arch-el-icon { font-size:1.5rem; display:block; margin-bottom:0.5rem; text-align:center; }
      .arch-el-title { font-family:'Amiri',serif; font-size:0.95rem; color:var(--gold-light); margin-bottom:0.4rem; text-align:center; }
      .arch-el-desc { font-size:0.75rem; color:var(--sand-dark); line-height:1.7; text-align:center; }
      .king-card { display: flex; gap: 1rem; background: rgba(201,168,76,0.05); padding: 1rem; margin: 1rem 0; border-left: 3px solid var(--gold); }
      .king-seal { font-size: 2rem; }
      .king-name { font-family: 'Amiri', serif; font-size: 1.2rem; color: var(--gold-light); }
      .king-title { font-size: 0.75rem; color: var(--gold-dark); letter-spacing: 0.1em; }
      .king-desc { font-size: 0.85rem; color: var(--sand-dark); margin-top: 0.3rem; }
      .passage-list { display: flex; flex-direction: column; gap: 2rem; }
      .passage-block { display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem; background: var(--stone); border: 1px solid rgba(201,168,76,0.1); padding: 1rem; }
      .passage-block.reverse { direction: rtl; }
      .passage-block.reverse .passage-text-wrap { direction: ltr; text-align: left; }
      .passage-img-wrap { overflow: hidden; background: #1a1a2e; }
      .passage-img { width: 100%; height: 100%; object-fit: cover; filter: sepia(20%) brightness(0.8); transition: transform 0.4s; }
      .passage-block:hover .passage-img { transform: scale(1.02); filter: sepia(0%) brightness(1); }
      .passage-num { font-size: 0.7rem; color: var(--gold-dark); letter-spacing: 0.15em; margin-bottom: 0.2rem; }
      .passage-title { font-family: 'Amiri', serif; font-size: 1.1rem; color: var(--gold-light); margin-bottom: 0.5rem; }
      .passage-body { font-size: 0.85rem; color: var(--sand-dark); line-height: 1.7; margin-bottom: 0.5rem; }
      .passage-tag { font-size: 0.7rem; color: var(--gold); opacity: 0.7; display: inline-block; border-top: 1px solid rgba(201,168,76,0.2); padding-top: 0.3rem; }
      .complex-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; margin: 1rem 0; }
      .complex-card { background: var(--stone); border: 1px solid rgba(201,168,76,0.1); overflow: hidden; }
      .complex-img { width: 100%; height: 180px; object-fit: cover; filter: sepia(15%) brightness(0.8); }
      .complex-body { padding: 1rem; }
      .complex-title { font-family: 'Amiri', serif; font-size: 1rem; color: var(--gold-light); margin-bottom: 0.3rem; }
      .complex-desc { font-size: 0.8rem; color: var(--sand-dark); line-height: 1.6; }
      .sphinx-block { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1rem 0; }
      .sphinx-img { width: 100%; height: 100%; object-fit: cover; filter: sepia(20%) brightness(0.7); }
      .sphinx-info { display: flex; flex-direction: column; gap: 1rem; }
      .sphinx-info-block { border-left: 2px solid var(--gold-dark); padding-left: 1rem; }
      .sphinx-info-title { font-family: 'Amiri', serif; font-size: 1rem; color: var(--gold-light); margin-bottom: 0.3rem; }
      .sphinx-info-text { font-size: 0.8rem; color: var(--sand-dark); line-height: 1.6; }
      
      @media (max-width: 900px) {
        .pyramid-groups-wrap { grid-template-columns:1fr; }
        .pg-img-wrap { height:220px; }
        .sphinx-block { grid-template-columns: 1fr; }
      }
      @media (max-width: 700px) {
        .detail-places-grid { grid-template-columns:1fr 1fr; }
        .arch-elements-grid { grid-template-columns:repeat(2,1fr); }
      }
      @media (max-width: 480px) {
        .detail-places-grid { grid-template-columns:1fr; }
        .arch-elements-grid { grid-template-columns:1fr 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  overlay.classList.add('active');
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
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

  document.getElementById('logo-text').textContent = lang === 'ar' ? 'دُروب' : '途';
  document.getElementById('logo-sub').textContent = lang === 'ar' ? 'حضارات خالدة' : '永恒的文明';
  const mobileLogo = document.getElementById('mobile-logo-text');
  if (mobileLogo) mobileLogo.textContent = lang === 'ar' ? 'دُروب' : '途';

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
  document.getElementById('footer-left').textContent = lang === 'ar' ? '© 2024 دُروب — جميع الحقوق محفوظة' : '© 2024 途 — 版权所有';
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