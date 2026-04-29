
const fs = require('fs');
let css = fs.readFileSync('css/styles.css', 'utf8');

// remove lines with cursor: none;
css = css.replace(/cursor:\s*none;?/g, '');

// remove cursor block entirely
css = css.replace(/\.cursor\s*{[^}]*}/g, '');
css = css.replace(/\.cursor\.hover\s*{[^}]*}/g, '');

fs.writeFileSync('css/styles.css', css, 'utf8');

