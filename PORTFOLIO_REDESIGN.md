# Portfolio redesign

The previous portfolio had substantial engineering evidence, but its long hero statement, repeated technology lists, and similarly weighted project rows made the work harder to scan. Dense architecture diagrams asked visitors to understand implementation details before they understood each project's purpose.

The redesigned homepage introduces Josh with a shorter editorial headline, followed by three clearly named disciplines. An asymmetric project grid gives the independent GPT-2 implementation more room and pairs it with compact JACart and SentinelNet case-study previews. Each preview communicates the engineering idea before linking to the complete original case study. Architecture illustrations are conceptual; they do not claim live telemetry or unverified benchmark results.

The visual system uses cool off-white, slate, and restrained indigo, with Space Grotesk headings and DM Sans body text. Both fonts are served from local assets. A persistent theme preference, visible keyboard focus, reduced-motion support, mobile navigation, a skip link, and functional links without JavaScript support the presentation. The animated point-cloud illustration pauses when offscreen or when the browser is hidden; visitors can pause it explicitly.

Project filters, a three-stage transformer explorer, contextual case-study navigation, reading progress, hover feedback, and a working copy-email button provide useful interactions. The existing résumé, contact endpoint, projects, and professional links are preserved. No contact messages were submitted during verification.

## Source

- `index.html`: editorial homepage and project grid.
- `styles-premium.css`: responsive visual system and light/dark tokens.
- `script.js`: interactive behavior and procedural canvas artwork.
- `theme-init.js`: applies the stored theme before first paint.
- `projects.html`, `projects/*.html`, `about.html`, `activities.html`, `contact.html`: matching layouts with the original technical content.
- `scripts/prepare-sites.py`: synchronizes the public files into the dedicated Sites checkout and updates its absolute metadata URLs.

The existing GitHub Pages metadata is retained in the root source. The separate Sites publication uses its own origin in canonical, Open Graph, structured data, sitemap, and robots metadata. Sites begins private, as required by the publishing workflow.

On this Windows installation, the Sites source helper needs `C:/Program Files/Git/bin` prepended to the process PATH and `TAR_OPTIONS=--force-local` so its Bash packager handles drive-letter paths. A process-scoped Git `safe.directory` entry for the exact Sites checkout resolves the ownership difference between the sandbox and the desktop account without changing global Git configuration. Credentials are passed only through the helper's hidden stdin prompt.

## Verification

Browser checks cover 10 pages at widths of 1440, 768, 375, and 320 pixels, project filtering, all model stages, motion controls, theme persistence across navigation, mobile menu behavior and Escape focus restoration, form validation, clipboard copying, case-study anchors, keyboard skip navigation, and navigation with JavaScript disabled. Static checks cover 184 local file and fragment references and JavaScript syntax. The external contact service is preserved but delivery was not tested.
