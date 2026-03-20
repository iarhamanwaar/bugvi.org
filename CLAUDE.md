# CLAUDE.md - bugvi.org

## Project Overview

Static website for the Bugvi Family documenting the history, culture, and heritage of Bhera city (Sargodha, Pakistan). Migrated from Webflow to a self-hosted static site deployed on Cloudflare Pages.

## Tech Stack

- **Static HTML/CSS/JS** — no build step, no framework
- **CSS:** Webflow-generated (`/assets/css/bugvi.webflow.css`)
- **JS:** jQuery 3.5.1, Materialize CSS 1.0.0, Webflow runtime, Finsweet CMS Slider, Swiper
- **Fonts:** Google Fonts — Montserrat, Open Sans, Ubuntu, Inter, Noto Nastaliq Urdu, Raleway
- **Hosting:** Cloudflare Pages (auto-deploys from `main` branch via GitHub)
- **API:** Cloudflare Worker (`bugvi-api`) with D1 database
- **Domain:** bugvi.org (DNS on Cloudflare)
- **Analytics:** Google Analytics (G-GXVMVEZK50)

## Directory Structure

```
/                           # Root — English HTML pages
├── urdu/                   # Urdu translations of all pages
├── images/                 # Individual gallery image pages (311 files)
├── books/                  # Book detail pages (18 files)
├── news/                   # English news articles
├── news-urdu/              # Urdu news articles
├── assets/
│   ├── css/                # Stylesheets (bugvi.webflow.css)
│   ├── js/                 # Webflow runtime JS bundles
│   ├── gallery/            # CMS gallery images (374 files)
│   ├── plugins/            # Webflow placeholder assets
│   └── [hash-named dirs]   # Static images, SVGs, icons
├── worker/
│   ├── index.js            # Cloudflare Worker — contact form + newsletter API
│   ├── wrangler.jsonc      # Worker config (D1 binding, env vars)
│   └── schema.sql          # D1 database schema
├── search.html             # Client-side search page
├── search-index.json       # Pre-built search index (93 pages)
├── wrangler.jsonc          # Cloudflare Pages config
├── .assetsignore           # Excludes .git from Cloudflare deploy
└── .gitignore
```

## Page Count

- **413 HTML pages total** (412 content + 1 search)
- 43 English content pages
- 32 Urdu content pages
- 311 gallery image pages
- 18 book pages
- 8 news articles (4 EN + 4 UR)
- 1 search page

## Key Patterns

### Language Toggle
- English pages: `/page-name.html`
- Urdu pages: `/urdu/page-name-urdu.html`
- Toggle is a simple `<a>` link with class `toggle` in the navbar — no client-side i18n

### Navigation
- Shared navbar across all pages with dropdowns for: Places, About, Organizations, People, Monuments, Publications, Gallery, News
- Donate button in nav links to `donate-hizb-ul-ansar.html`
- Search form on all pages submits GET to `/search.html?query=...`

### Carousel
- Uses Materialize CSS `.carousel()` with 3D perspective transforms
- Responsive breakpoints at 992px, 768px, 576px
- Active items unblurred, inactive items have grayscale + blur filter

### Contact Form
- Pages: `contact-bhera.html` (EN) and `urdu/contact---bhera-urdu.html` (UR)
- Submits via `fetch()` POST to `https://bugvi-api.arhamanwaar.workers.dev/api/contact`
- Fields: name, email (required), message (required)
- On success: hides form, shows `.w-form-done` success message
- On error: shows `.w-form-fail` error message
- Submissions stored in D1 database `bugvi-db` → `contact_messages` table

### Search
- Client-side search at `/search.html`
- Loads `search-index.json` (pre-built from all 93 content pages)
- Searches titles and body text, ranks by relevance, highlights matches
- Supports `?query=` parameter from navbar search forms
- **Regenerating the index:** Run the Python script that builds `search-index.json` (see deployment section)

### Newsletter API
- Endpoint: `POST /api/newsletter` on the Worker
- Stores emails in D1 `newsletter_subscribers` table
- Currently no frontend form — ready for future use

### Assets
- All images are local (migrated from Webflow CDN)
- Image paths use `/assets/` prefix
- Gallery images use `/assets/gallery/` prefix
- Responsive image variants exist with `-p-500`, `-p-800`, `-p-1080`, `-p-1600` suffixes

## External CDN Dependencies

These are still loaded from external CDNs:
- jQuery: `d3e54v103j8qbb.cloudfront.net`
- Materialize JS: `cdnjs.cloudflare.com`
- Swiper CSS: `unpkg.com`
- Finsweet CMS Slider: `cdn.jsdelivr.net`
- Google Fonts: `fonts.googleapis.com`
- Google Analytics: `googletagmanager.com`
- Weblocks: `weblocks.io`

## Deployment

### Static Site (Cloudflare Pages)
- Push to `main` → Cloudflare Pages auto-builds and deploys from GitHub
- No build command needed (static files served directly)
- `.assetsignore` excludes `.git` from the deploy bundle
- Config in `wrangler.jsonc`

### API Worker
- Deployed separately as a Cloudflare Worker (`bugvi-api`)
- To deploy worker changes:
  ```bash
  cd worker
  CLOUDFLARE_ACCOUNT_ID=f89a20cb29dcfc73dcf4816d589252da npx wrangler deploy
  ```
- Worker URL: `https://bugvi-api.arhamanwaar.workers.dev`

### D1 Database
- Database: `bugvi-db` (ID: `83634646-309d-4a9c-917f-cb6747bff61f`)
- Tables: `contact_messages`, `newsletter_subscribers`
- Query messages:
  ```bash
  cd worker
  CLOUDFLARE_ACCOUNT_ID=f89a20cb29dcfc73dcf4816d589252da npx wrangler d1 execute bugvi-db --remote --command="SELECT * FROM contact_messages"
  ```
- Query newsletter subscribers:
  ```bash
  cd worker
  CLOUDFLARE_ACCOUNT_ID=f89a20cb29dcfc73dcf4816d589252da npx wrangler d1 execute bugvi-db --remote --command="SELECT * FROM newsletter_subscribers"
  ```

### Regenerating Search Index
If pages are added or content changes, regenerate `search-index.json`:
```bash
python3 -c "
import re, os, json, html
pages = []
def extract(fp, prefix=''):
    with open(fp,'r',encoding='utf-8',errors='ignore') as f: c=f.read()
    t=re.search(r'<title>([^<]+)</title>',c)
    title=t.group(1) if t else os.path.basename(fp)
    text=re.sub(r'<script[^>]*>.*?</script>','',c,flags=re.DOTALL)
    text=re.sub(r'<style[^>]*>.*?</style>','',text,flags=re.DOTALL)
    text=html.unescape(re.sub(r'<[^>]+>',' ',text))
    text=re.sub(r'\s+',' ',text).strip()
    return {'title':title,'url':prefix+os.path.basename(fp),'text':text[:2000],'snippet':text[:300]}
for f in sorted(os.listdir('.')):
    if f.endswith('.html') and f!='search.html' and '?' not in f: pages.append(extract(f,'/'))
for d in ['urdu','books','news','news-urdu']:
    if os.path.isdir(d):
        for f in sorted(os.listdir(d)):
            if f.endswith('.html'): pages.append(extract(os.path.join(d,f),'/'+d+'/'))
json.dump(pages,open('search-index.json','w',encoding='utf-8'),ensure_ascii=False)
print(f'Indexed {len(pages)} pages')
"
```

## Known Limitations

- Some gallery pagination URLs have `?b03d40ee_page=N` in filenames — works but looks odd
- Webflow CSS classes (`w-nav`, `w-dropdown`, etc.) are baked in — editing styles requires understanding Webflow's class system
- Book filter form on `books-main-page.html` uses Finsweet CMS filter — may not work without Webflow CMS backend
