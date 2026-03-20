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
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com/)
- Auto-deploys from the `main` branch

## Local Development

```bash
# Clone the repository
git clone git@github.com:iarhamanwaar/bugvi.org.git
cd bugvi.org

# Serve locally
python3 -m http.server 8080

# Open http://localhost:8080
```

## Project Structure

```
├── index.html              # Homepage
├── urdu/                   # Urdu language pages
├── images/                 # Gallery image pages
├── books/                  # Book detail pages
├── news/                   # News articles (EN)
├── news-urdu/              # News articles (UR)
├── assets/
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript
│   └── gallery/            # Gallery images
├── wrangler.jsonc          # Cloudflare Pages config
└── CLAUDE.md               # Development guide
```

## Deployment

Pushes to `main` automatically deploy to [bugvi.org](https://bugvi.org) via Cloudflare Pages.

## License

All content, images, and text are the property of the Bugvi Family. All rights reserved.

## Contact

- Phone: +92-301-6701340
- Email: bugvi4all@hotmail.com
