const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

// Add currentRoute variable before handleRoute
if (!code.includes('let currentRoute =')) {
  code = code.replace('function handleRoute() {', 'let currentRoute = "";\nfunction handleRoute() {');
}

// Update handleRoute to check and update currentRoute
code = code.replace(/function handleRoute\(\) \{\s+const hash = window.location.hash.replace\('#', ''\);/, 
  'function handleRoute() {\n  const hash = window.location.hash.replace(\'#\', \'\');\n  if (hash === currentRoute) return;\n  currentRoute = hash;');

// Update openDetail
code = code.replace(/if \(\!skipHash\) window\.location\.hash = 'site-' \+ id;/, 
  'if (!skipHash) { currentRoute = \'site-\' + id; window.location.hash = currentRoute; }');

// Update openRegion
code = code.replace(/if \(\!skipHash\) window\.location\.hash = 'region-' \+ regionId;/, 
  'if (!skipHash) { currentRoute = \'region-\' + regionId; window.location.hash = currentRoute; }');

// Update showSection
code = code.replace(/if \(\!skipHash\) window\.location\.hash = name;/, 
  'if (!skipHash) { currentRoute = name; window.location.hash = currentRoute; }');

// Update showRegions
code = code.replace(/if \(\!skipHash\) window\.location\.hash = 'home';/, 
  'if (!skipHash) { currentRoute = \'home\'; window.location.hash = currentRoute; }');

// Update closeDetail
code = code.replace(/window\.location\.hash = 'region-' \+ s\.region;/g, 
  'currentRoute = \'region-\' + s.region; window.location.hash = currentRoute;');
code = code.replace(/window\.location\.hash = 'home';/g, 
  'currentRoute = \'home\'; window.location.hash = currentRoute;');

fs.writeFileSync('js/app.js', code, 'utf8');
