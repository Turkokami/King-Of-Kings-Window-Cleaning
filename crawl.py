#!/usr/bin/env python3
"""King of Kings Window Cleaning — Keystone Part 9.4 full-site audit sweep."""
import json, os, re, sys, time, hashlib
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup

ROOT = "https://www.kingofkingswindowcleaning.com"
OUT = "/home/claude/kok/archive"
os.makedirs(OUT + "/html", exist_ok=True)

S = requests.Session()
S.headers.update({"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"})

def get(url, **kw):
    return S.get(url, timeout=45, **kw)

def sitemap_urls():
    seen, maps, urls = set(), [ROOT + "/sitemap_index.xml"], []
    while maps:
        m = maps.pop(0)
        if m in seen: continue
        seen.add(m)
        try:
            r = get(m)
        except Exception as e:
            print("SITEMAP FAIL", m, e); continue
        if r.status_code != 200:
            print("SITEMAP", r.status_code, m); continue
        soup = BeautifulSoup(r.text, "xml")
        if soup.find("sitemapindex"):
            for loc in soup.select("sitemap > loc"):
                maps.append(loc.text.strip())
        for loc in soup.select("url > loc"):
            u = loc.text.strip()
            lm = loc.find_next_sibling("lastmod")
            urls.append({"url": u, "lastmod": lm.text.strip() if lm else None, "sitemap": m})
    return urls

WORD = re.compile(r"[A-Za-z0-9'’\-]+")

def analyze(rec):
    url = rec["url"]
    d = dict(rec)
    try:
        r = get(url, allow_redirects=True)
    except Exception as e:
        d["error"] = str(e); return d
    d["status"] = r.status_code
    d["final_url"] = r.url
    d["redirected"] = (r.url.rstrip("/") != url.rstrip("/"))
    d["bytes"] = len(r.content)
    d["elapsed_ms"] = int(r.elapsed.total_seconds() * 1000)
    d["server"] = r.headers.get("server")
    d["x_powered"] = r.headers.get("x-powered-by")
    d["cache"] = r.headers.get("x-cache") or r.headers.get("cf-cache-status") or r.headers.get("x-rocket-nginx-serving-static")
    if r.status_code != 200 or "html" not in r.headers.get("content-type", ""):
        return d
    h = hashlib.md5(url.encode()).hexdigest()[:12]
    slug = re.sub(r"[^a-z0-9]+", "-", urlparse(url).path.strip("/").lower())[:80] or "home"
    open(f"{OUT}/html/{slug}__{h}.html", "w", encoding="utf-8").write(r.text)
    d["html_file"] = f"{slug}__{h}.html"
    soup = BeautifulSoup(r.text, "lxml")

    t = soup.find("title")
    d["title"] = t.text.strip() if t else None
    d["title_len"] = len(d["title"]) if d["title"] else 0
    md = soup.find("meta", attrs={"name": "description"})
    d["meta_description"] = md.get("content", "").strip() if md else None
    d["meta_len"] = len(d["meta_description"]) if d["meta_description"] else 0
    can = soup.find("link", rel=lambda v: v and "canonical" in v)
    d["canonical"] = can.get("href") if can else None
    rb = soup.find("meta", attrs={"name": "robots"})
    d["robots"] = rb.get("content") if rb else None
    og = soup.find("meta", attrs={"property": "og:image"})
    d["og_image"] = og.get("content") if og else None
    d["lang"] = (soup.find("html") or {}).get("lang") if soup.find("html") else None

    h1s = [x.get_text(" ", strip=True) for x in soup.find_all("h1")]
    d["h1_count"] = len(h1s); d["h1"] = h1s
    d["h2"] = [x.get_text(" ", strip=True) for x in soup.find_all("h2")]
    d["h3"] = [x.get_text(" ", strip=True) for x in soup.find_all("h3")]

    body = soup.find("body")
    if body:
        for bad in body(["script", "style", "noscript", "nav", "footer", "header", "form"]):
            bad.decompose()
        text = body.get_text(" ", strip=True)
    else:
        text = ""
    d["word_count"] = len(WORD.findall(text))
    d["text_sample"] = text[:1500]

    imgs = soup.find_all("img")
    d["img_count"] = len(imgs)
    d["img_missing_alt"] = sum(1 for i in imgs if not (i.get("alt") or "").strip())
    d["img_alts"] = [ (i.get("alt") or "").strip() for i in imgs ][:40]
    d["img_srcs"] = [ (i.get("src") or i.get("data-src") or "") for i in imgs ][:40]
    d["webp"] = sum(1 for i in imgs if ".webp" in (i.get("src") or ""))

    nodes, ids, blocks = [], [], []
    for s_ in soup.find_all("script", type="application/ld+json"):
        raw = s_.string or s_.get_text()
        blocks.append((raw or "")[:4000])
        try:
            j = json.loads(raw)
        except Exception:
            continue
        stack = [j]
        while stack:
            o = stack.pop()
            if isinstance(o, list): stack.extend(o); continue
            if not isinstance(o, dict): continue
            if "@graph" in o: stack.extend(o["@graph"] if isinstance(o["@graph"], list) else [o["@graph"]])
            ty = o.get("@type")
            if ty: nodes.append(ty if isinstance(ty, str) else "|".join(ty))
            if o.get("@id"): ids.append(o["@id"])
            for v in o.values():
                if isinstance(v, (dict, list)): stack.append(v)
    d["ld_nodes"] = nodes
    d["ld_ids"] = ids
    d["ld_blocks"] = len(blocks)
    d["ld_raw"] = blocks[:3]
    d["has_faqpage"] = any("FAQPage" in n for n in nodes)
    d["has_speakable"] = "SpeakableSpecification" in r.text
    d["has_breadcrumb"] = any("BreadcrumbList" in n for n in nodes)
    d["has_localbusiness"] = any("LocalBusiness" in n or "HomeAndConstruction" in n for n in nodes)
    d["has_aggregaterating"] = "aggregateRating" in r.text
    d["has_review_schema"] = any(n in ("Review", "AggregateRating") for n in nodes)

    links = set()
    for a in soup.find_all("a", href=True):
        u = urljoin(url, a["href"]).split("#")[0]
        if urlparse(u).netloc.replace("www.", "") == "kingofkingswindowcleaning.com":
            links.add(u)
    d["internal_links_out"] = len(links)
    d["internal_link_targets"] = sorted(links)

    d["plugins"] = sorted(set(re.findall(r"/wp-content/plugins/([a-z0-9\-_]+)/", r.text)))
    d["theme"] = sorted(set(re.findall(r"/wp-content/themes/([a-z0-9\-_]+)/", r.text)))
    d["is_elementor"] = "elementor-page" in r.text
    d["gen"] = [m.get("content") for m in soup.find_all("meta", attrs={"name": "generator"})]
    d["has_phone"] = sorted(set(re.findall(r"(?:\+1[\s\-.]?)?\(?\d{3}\)?[\s\-.]\d{3}[\s\-.]\d{4}", text)))[:5]
    return d

if __name__ == "__main__":
    urls = sitemap_urls()
    print("sitemap urls:", len(urls))
    json.dump(urls, open(OUT + "/sitemap_urls.json", "w"), indent=1)
    with ThreadPoolExecutor(max_workers=6) as ex:
        results = list(ex.map(analyze, urls))
    json.dump(results, open(OUT + "/pages.json", "w"), indent=1)
    print("done", len(results))
