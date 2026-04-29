const fs = require('fs');
const file = 'js/app.js';
let appCode = fs.readFileSync(file, 'utf8');

// 1. Inject Lazy Loading Styles
const lazyStyle = `
// Inject Lazy Loading Styles
if (!document.getElementById('lazy-styles')) {
  const s = document.createElement('style');
  s.id = 'lazy-styles';
  s.textContent = \`
    img[data-src] {
      filter: blur(10px) sepia(20%);
      opacity: 0.4;
      transition: filter 0.5s ease-out, opacity 0.5s ease-out;
      background: rgba(201,168,76,0.1);
    }
    img.loaded {
      filter: blur(0) sepia(10%);
      opacity: 1;
    }
  \`;
  document.head.appendChild(s);
}
`;

if (!appCode.includes('lazy-styles')) {
  appCode = lazyStyle + '\n' + appCode;
}

// 2. Add the IntersectionObserver logic
const lazyLogic = `
// ===== LAZY LOAD OBSERVER =====
window.lazyImgObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        // Preload in memory to cache it
        const temp = new Image();
        temp.onload = () => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
        };
        temp.src = img.dataset.src;
      }
      observer.unobserve(img);
    }
  });
}, { rootMargin: '200px' });

window.triggerLazyLoad = function() {
  setTimeout(() => {
    document.querySelectorAll('img[data-src]').forEach(el => window.lazyImgObserver.observe(el));
  }, 50);
};
`;

if (!appCode.includes('window.lazyImgObserver')) {
  appCode = appCode + '\n' + lazyLogic;
}

// 3. Safely replace src with data-src in templates
// Match all `<img ... src="${something}" ...>`
appCode = appCode.replace(/<img([^>]*)src="\$\{([^}]+)\}"([^>]*)>/g, '<img$1src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="${$2}"$3>');

// Match `<img class="card-img" src="${s.heroImg}"` -> handled by above

// Match `<img class="gallery-img" src="${img}"` -> handled by above

// Match `<img class="ipp-gallery-img" src="${img}"` -> handled by above

// 4. Inject triggerLazyLoad() after innerHTML assignments
appCode = appCode.replace(/grid\.innerHTML = regions\.map([\s\S]*?)\.join\(''\);/g, 'grid.innerHTML = regions.map$1.join(\'\');\n  if (window.triggerLazyLoad) window.triggerLazyLoad();');
appCode = appCode.replace(/grid\.innerHTML = regionSites\.map([\s\S]*?)\.join\(''\);/g, 'grid.innerHTML = regionSites.map$1.join(\'\');\n  if (window.triggerLazyLoad) window.triggerLazyLoad();');
appCode = appCode.replace(/document\.getElementById\('detailContent'\)\.innerHTML = `([\s\S]*?)`;/g, 'document.getElementById(\'detailContent\').innerHTML = `$1`;\n  if (window.triggerLazyLoad) window.triggerLazyLoad();');
appCode = appCode.replace(/panel\.innerHTML = `([\s\S]*?)`;/g, 'panel.innerHTML = `$1`;\n  if (window.triggerLazyLoad) window.triggerLazyLoad();');

fs.writeFileSync(file, appCode, 'utf8');
console.log('App.js updated with lazy loading logic.');
