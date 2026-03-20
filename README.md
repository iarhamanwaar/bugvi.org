# bugvi.org

Official website of the Bugvi Family — documenting the history, culture, and heritage of Bhera, a historic city in Sargodha District, Punjab, Pakistan.

## About

Bhera, derived from Sanskrit meaning "Abode of Peace," has been a center of knowledge, craftsmanship, and culture for centuries. This website preserves and shares:

- **History & Heritage** — Bhera's rich past, its eight historic gates, bazaars, temples, mosques, and architectural monuments
- **Bugvi Family** — Genealogy and contributions of the Bugvi family, custodians of the Sher Shah Jamia Masjid Bugvia
- **Majlis Hizb-ul-Ansar** — A welfare organization supporting education, healthcare, and social services for the community
- **Al-Iftikhar Bugvia Foundation** — Philanthropic initiatives serving Bhera and surrounding areas
- **Publications** — A digital library of books on Bhera's history, traditions, and notable personalities
- **Gallery** — 300+ photographs documenting Bhera's landmarks, events, and people

The site is fully bilingual in **English** and **Urdu**.

## Tech Stack

- Static HTML/CSS/JS (migrated from Webflow)
- [Cloudflare Pages](https://pages.cloudflare.com/) for hosting (auto-deploys from GitHub)
- [Cloudflare Workers](https://workers.cloudflare.com/) + [D1](https://developers.cloudflare.com/d1/) for contact form API
- Client-side search powered by a pre-built JSON index

## Local Development

```bash
# Clone the repository
git clone git@github.com:iarhamanwaar/bugvi.org.git
cd bugvi.org

# Serve locally
python3 -m http.server 8080

# Open http://localhost:8080
```

### Worker Development

The contact form API runs as a Cloudflare Worker in the `worker/` directory:

```bash
cd worker

# Run locally
npx wrangler dev

# Deploy
CLOUDFLARE_ACCOUNT_ID=f89a20cb29dcfc73dcf4816d589252da npx wrangler deploy
```

## Project Structure

```
├── index.html              # Homepage
├── search.html             # Client-side search page
├── search-index.json       # Pre-built search index
├── urdu/                   # Urdu language pages
├── images/                 # Gallery image pages (311)
├── books/                  # Book detail pages (18)
├── news/                   # News articles (EN)
├── news-urdu/              # News articles (UR)
├── assets/
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript
│   └── gallery/            # Gallery images
├── worker/
│   ├── index.js            # Cloudflare Worker (contact + newsletter API)
│   ├── wrangler.jsonc      # Worker config
│   └── schema.sql          # D1 database schema
├── wrangler.jsonc          # Cloudflare Pages config
└── CLAUDE.md               # Development guide
```

## Features

- **413 pages** across English and Urdu
- **Contact form** — submissions stored in Cloudflare D1 database
- **Full-text search** — client-side search across all content pages
- **Newsletter API** — endpoint ready for future subscription form
- **Gallery** — 300+ photographs with individual detail pages

## Deployment

- **Static site:** Pushes to `main` automatically deploy to [bugvi.org](https://bugvi.org) via Cloudflare Pages
- **API Worker:** Deploy manually with `npx wrangler deploy` from `worker/`

## License

All content, images, and text are the property of the Bugvi Family. All rights reserved.

## Contact

- Phone: +92-301-6701340
- Email: bugvi4all@hotmail.com
