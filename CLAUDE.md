# CLAUDE.md - bugvi.org

## Project Overview

Static website for the Bugvi Family documenting the history, culture, and heritage of Bhera city (Sargodha, Pakistan). Migrated from Webflow to a self-hosted static site deployed on Cloudflare Pages.

## Tech Stack

- **Static HTML/CSS/JS** — no build step, no framework
- **CSS:** Webflow-generated (`/assets/css/bugvi.webflow.css`)
- **JS:** jQuery 3.5.1, Materialize CSS 1.0.0, Webflow runtime, Finsweet CMS Slider, Swiper
- **Fonts:** Google Fonts — Montserrat, Open Sans, Ubuntu, Inter, Noto Nastaliq Urdu, Raleway
- **Hosting:** Cloudflare Pages (auto-deploys from `main` branch)
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
├── wrangler.jsonc           # Cloudflare Pages config
├── .assetsignore            # Excludes .git from Cloudflare deploy
└── .gitignore
```

## Page Count

- **412 HTML pages total**
- 43 English content pages
- 32 Urdu content pages
- 311 gallery image pages
- 18 book pages
- 8 news articles (4 EN + 4 UR)

## Key Patterns

### Language Toggle
- English pages: `/page-name.html`
- Urdu pages: `/urdu/page-name-urdu.html`
- Toggle is a simple `<a>` link with class `toggle` in the navbar — no client-side i18n

### Navigation
- Shared navbar across all pages with dropdowns for: Places, About, Organizations, People, Monuments, Publications, Gallery, News
- Donate button in nav links to `donate-hizb-ul-ansar.html`
- Search form posts to `/search`

### Carousel
- Uses Materialize CSS `.carousel()` with 3D perspective transforms
- Responsive breakpoints at 992px, 768px, 576px
- Active items unblurred, inactive items have grayscale + blur filter

### Forms
- Contact form on `contact-bhera.html` (GET method, fields: name, email, message)
- Forms use Webflow `w-form` classes — **form submission does not work** without Webflow backend

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

- Push to `main` → Cloudflare Pages auto-builds and deploys
- No build command needed (static files served directly)
- `.assetsignore` excludes `.git` from the deploy bundle
- Config in `wrangler.jsonc`

## Known Limitations

- Forms (contact, search, newsletter) don't work — they relied on Webflow's backend
- Some gallery pagination URLs have `?b03d40ee_page=N` in filenames — works but looks odd
- Webflow CSS classes (`w-nav`, `w-dropdown`, etc.) are baked in — editing styles requires understanding Webflow's class system
