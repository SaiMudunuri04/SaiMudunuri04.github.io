# Sai Mudunuri portfolio

Static portfolio for [Sai Mudunuri](https://www.linkedin.com/in/sai-krishnam-raju-mudunuri-93438520a/). The site presents employment experience separately from seven independent engineering repositories. Each project links to its source and its single Helm chart under `k8s/helm/<service-name>/`.

The entry screen is skippable with a button or Escape. Project filters, dark/light themes, visible keyboard focus, reduced-motion support, responsive layouts, and the standard pointer cursor are built into the page. No external font or script is required.

GitHub Actions publishes `public/` to GitHub Pages after the content check passes. The public address is [saimudunuri04.github.io](https://saimudunuri04.github.io/). A custom `.com` domain is not registered or configured.

To preview locally, run `python3 -m http.server 8000 --directory public` and open `http://127.0.0.1:8000`.
