"""Check links and publication boundaries before deploying the public portfolio.

Project cards are data-driven: links live in public/projects.js (rendered by JS)
and in public/index.html. This check validates both sources together.
"""

import re
from html.parser import HTMLParser
from pathlib import Path


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if "id" in values:
            self.ids.add(values["id"])
        if tag == "a" and "href" in values:
            self.hrefs.append(values["href"])


root = Path(__file__).resolve().parents[1] / "public"
html = (root / "index.html").read_text(encoding="utf-8")
js = (root / "projects.js").read_text(encoding="utf-8")
css = (root / "styles.css").read_text(encoding="utf-8") if (root / "styles.css").exists() else ""
combined = html + "\n" + js

assert "chatgpt.site" not in combined, "Old hosting domain remains in source"
assert "cursor:none" not in html.replace(" ", "").lower(), "Hidden cursor is not allowed"
assert "Independent repos" in html

links = Links()
links.feed(html)
for href in links.hrefs:
    if href.startswith("#"):
        assert href[1:] in links.ids, f"Missing anchor: {href}"
    elif href.startswith("mailto:"):
        continue
    elif not href.startswith("https://"):
        assert (root / href).is_file(), f"Missing local file: {href}"

# Project + Helm-chart URLs may live in index.html or be rendered from projects.js.
rendered_urls = set(re.findall(r"https://github\.com/SaiMudunuri04/[A-Za-z0-9_.\-/]+", combined))
projects = {"customer-churn-service", "demand-forecast-service", "visual-defect-service",
            "evidence-rag-service", "multimodal-search-service", "incident-triage-agent",
            "lora-ticket-classifier"}
assert all(f"https://github.com/SaiMudunuri04/{name}" in rendered_urls for name in projects)
assert all(
    f"https://github.com/SaiMudunuri04/{name}/tree/main/k8s/helm/{name}" in rendered_urls
    for name in projects
), "Each shipped project must link to its single Helm chart"

# Upcoming projects render an "In progress" badge with NO repo link (never link to 404s).
upcoming = {"isolation-forest-anomaly-detection", "langgraph-support-agent", "mcp-agent-toolkit"}
for name in upcoming:
    assert name in js, f"Upcoming project missing from projects.js: {name}"
    assert f"https://github.com/SaiMudunuri04/{name}" not in rendered_urls, \
        f"Upcoming project must not link to a repo that may not exist: {name}"

assert 'id="theme-toggle"' in html and 'data-filter="all"' in html
assert "prefers-reduced-motion" in html + css
assert "ai-engineering-projects" not in combined
print("Portfolio links and publication checks passed")
