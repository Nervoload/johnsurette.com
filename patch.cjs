const fs = require('fs');
let content = fs.readFileSync('/Users/johnsurette/Documents/Codespace🪐/johnsurette.com/johnsurette.com/src/components/LandingStory/visuals/AspirationTreePlaceholder.tsx', 'utf8');

content = content.replace(
  'const AspirationTreePlaceholder: React.FC<AspirationTreePlaceholderProps> = ({',
  'const AspirationTreeInner: React.FC<AspirationTreePlaceholderProps> = ({'
);

content = content.replace(
  /  const \[containerReady, setContainerReady\] = useState\(false\);\n  useEffect\(\(\) => \{\n    if \(scrollContainerRef\.current\) setContainerReady\(true\);\n  \}, \[scrollContainerRef\]\);\n/g,
  ''
);

content = content.replace(
  /  if \(\!containerReady\) \{\n    return <div className=\"theme-story-contrast-label relative\" style=\{\{ height\: \`\$\{SECTION_VIEWPORTS \* 100\}dvh\` \}\} ref=\{sectionRef as React\.RefObject<HTMLDivElement>\} \/>;\n  \}\n/g,
  ''
);

const newFooter = `const AspirationTreePlaceholder: React.FC<AspirationTreePlaceholderProps> = (props) => {
  const { scrollContainerRef } = useLandingStoryRuntime();
  const [containerReady, setContainerReady] = useState(false);

  useEffect(() => {
    if (scrollContainerRef?.current) {
      setContainerReady(true);
    } else {
      const interval = setInterval(() => {
        if (scrollContainerRef?.current) {
          setContainerReady(true);
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [scrollContainerRef]);

  if (!containerReady) {
    return <div className="theme-story-contrast-label relative" style={{ height: \\\`\\$\\{SECTION_VIEWPORTS * 100\\}dvh\\\` }} />;
  }

  return <AspirationTreeInner {...props} />;
};

export default AspirationTreePlaceholder;`;

content = content.replace(
  'export default AspirationTreePlaceholder;',
  newFooter
);

fs.writeFileSync('/Users/johnsurette/Documents/Codespace🪐/johnsurette.com/johnsurette.com/src/components/LandingStory/visuals/AspirationTreePlaceholder.tsx', content);
console.log('done');
