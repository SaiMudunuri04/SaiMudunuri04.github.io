# Sai Mudunuri portfolio

Static portfolio for [Sai Mudunuri](https://www.linkedin.com/in/sai-krishnam-raju-mudunuri-93438520a/). The site presents employment experience separately from independent engineering repositories. Each shipped project links to its source and its single Helm chart under `k8s/helm/<service-name>/`.

Structure: `public/index.html` (page + render script), `public/styles.css` (design system, light/dark themes), `public/projects.js` (single source of truth for the project grid — edit this file to add or update projects). Projects with `"status": "progress"` render an "In progress" badge with no repo link. The Projects section is a blueprint explorer: each project's `flow` (lanes, nodes, edges) is drawn as an end-to-end architecture diagram with a Play-flow walkthrough, a stage inspector, and verified facts from the repo (`proof`); phones get a numbered stage list instead of the diagram. The page is dark-first with a light toggle and includes an animated LangGraph-style agent graph in the hero, a bento grid of measured impact, a scroll-linked experience timeline, cursor-spotlight cards, a ⌘K / Ctrl+K quick-navigation palette, a mobile menu, visible keyboard focus, and reduced-motion support. The only external resource is Google Fonts; the page has no script dependencies.

GitHub Actions publishes `public/` to GitHub Pages after the content check (`scripts/check_site.py`) passes. The public address is [saimudunuri04.github.io](https://saimudunuri04.github.io/). A custom `.com` domain is not registered or configured.

To preview locally, run `python3 -m http.server 8000 --directory public` and open `http://127.0.0.1:8000`.
