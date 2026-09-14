"""Check links and publication boundaries before deploying the public portfolio."""

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
assert "chatgpt.site" not in html, "Old hosting domain remains in source"
assert "cursor:none" not in html.replace(" ", "").lower(), "Hidden cursor is not allowed"
assert "Independent repos" in html
links = Links()
links.feed(html)
for href in links.hrefs:
    if href.startswith("#"):
        assert href[1:] in links.ids, f"Missing anchor: {href}"
    elif not href.startswith(("https://", "mailto:")):
        assert (root / href).is_file(), f"Missing local file: {href}"
projects = {"customer-churn-service", "demand-forecast-service", "visual-defect-service",
            "evidence-rag-service", "multimodal-search-service", "incident-triage-agent",
            "lora-ticket-classifier"}
assert all(f"https://github.com/SaiMudunuri04/{name}" in links.hrefs for name in projects)
assert all(
    f"https://github.com/SaiMudunuri04/{name}/tree/main/k8s/helm/{name}" in links.hrefs
    for name in projects
), "Each project must link to its single Helm chart"
assert 'id="theme-toggle"' in html and 'data-filter="all"' in html
assert 'prefers-reduced-motion:reduce' in html
assert "ai-engineering-projects" not in html
print("Portfolio links and publication checks passed")
