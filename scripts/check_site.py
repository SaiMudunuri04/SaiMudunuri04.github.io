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
            "lora-ticket-classifier", "isolation-forest-anomaly-detection",
            "langgraph-support-agent", "mcp-agent-toolkit"}
assert all(f"https://github.com/SaiMudunuri04/{name}" in rendered_urls for name in projects)
k8s_helm = {"customer-churn-service", "demand-forecast-service", "visual-defect-service",
            "evidence-rag-service", "multimodal-search-service", "incident-triage-agent",
            "lora-ticket-classifier"}
assert all(
    f"https://github.com/SaiMudunuri04/{name}/tree/main/k8s/helm/{name}" in rendered_urls
    for name in k8s_helm
), "Each shipped k8s project must link to its single Helm chart"
assert "https://github.com/SaiMudunuri04/isolation-forest-anomaly-detection/tree/main/k8s/helm/isolation-forest" in rendered_urls
assert "https://github.com/SaiMudunuri04/langgraph-support-agent/tree/main/helm/support-agent" in rendered_urls
assert "https://github.com/SaiMudunuri04/mcp-agent-toolkit/tree/main/helm/mcp-toolkit" in rendered_urls

assert 'id="theme-toggle"' in html and 'data-filter="all"' in html
assert "prefers-reduced-motion" in html + css
assert "ai-engineering-projects" not in combined
print("Portfolio links and publication checks passed")
