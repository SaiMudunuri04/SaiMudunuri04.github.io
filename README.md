# Sai Mudunuri portfolio

Static portfolio for [Sai Mudunuri](https://www.linkedin.com/in/sai-krishnam-raju-mudunuri-93438520a/). The site presents employment experience separately from independent engineering repositories. Each shipped project links to its source and its single Helm chart under `k8s/helm/<service-name>/`.

Structure: `public/index.html` (page + render script), `public/styles.css` (design system, light/dark themes), `public/projects.js` (single source of truth for the project grid — edit this file to add or update projects). Projects with `"status": "progress"` render an "In progress" badge with no repo link. Sticky nav, hero with career stats, experience timeline, project filters, dark/light theme toggle, visible keyboard focus, reduced-motion support, and responsive mobile-first layouts are built in. No external font or script is required.

GitHub Actions publishes `public/` to GitHub Pages after the content check (`scripts/check_site.py`) passes. The public address is [saimudunuri04.github.io](https://saimudunuri04.github.io/). A custom `.com` domain is not registered or configured.

To preview locally, run `python3 -m http.server 8000 --directory public` and open `http://127.0.0.1:8000`.
