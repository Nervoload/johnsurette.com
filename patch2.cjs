const fs = require('fs');
let c = fs.readFileSync('/Users/johnsurette/Documents/Codespace🪐/johnsurette.com/johnsurette.com/src/components/LandingStory/visuals/AspirationTreePlaceholder.tsx', 'utf8');

c = c.replace(
  '\\`\\$\\{SECTION_VIEWPORTS * 100\\}dvh\\`',
  '`${SECTION_VIEWPORTS * 100}dvh`'
);

fs.writeFileSync('/Users/johnsurette/Documents/Codespace🪐/johnsurette.com/johnsurette.com/src/components/LandingStory/visuals/AspirationTreePlaceholder.tsx', c);
console.log('done');
