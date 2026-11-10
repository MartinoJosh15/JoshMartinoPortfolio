"""Copy the portfolio to the dedicated Sites checkout, preserving its identity."""
from pathlib import Path
import shutil
import json

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / 'sites' / 'josh-martino'
DIST = TARGET / 'dist'
SITE_URL = 'https://josh-martino-engineering.martinojosh15.chatgpt.site'
OLD_URL = 'https://martinojosh15.github.io/JoshMartinoPortfolio'
if not (TARGET / '.openai' / 'hosting.json').exists():
    raise SystemExit('Missing persisted Sites identity; refusing to create a duplicate Site.')
DIST.mkdir(parents=True, exist_ok=True)
files = list(ROOT.glob('*.html')) + [ROOT / name for name in ['styles-premium.css', 'script.js', 'theme-init.js', 'robots.txt', 'sitemap.xml']]
for source in files:
    text = source.read_text(encoding='utf-8').replace(OLD_URL, SITE_URL)
    (DIST / source.name).write_text(text, encoding='utf-8')
shutil.copytree(ROOT / 'assets', DIST / 'assets', dirs_exist_ok=True)
shutil.copytree(ROOT / 'projects', DIST / 'projects', dirs_exist_ok=True)
for page in (DIST / 'projects').glob('*.html'):
    page.write_text(page.read_text(encoding='utf-8').replace(OLD_URL, SITE_URL), encoding='utf-8')
(TARGET / '.gitignore').write_text('.sites-runtime/\nnode_modules/\n', encoding='utf-8')
print(json.dumps({'prepared': str(DIST), 'files': len([p for p in DIST.rglob('*') if p.is_file()])}))
