# I2Go employer portal

Public website where employers browse live candidates and send enquiries, in German and English. React 19 + Next.js 16 (App Router) + MUI, talking to the same Supabase project as the mobile app.

## Run

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in .next/
npm start        # serve the production build on :3000
npm run lint
```

`.env` (copy `.env.example`; `NEXT_PUBLIC_*` values end up in the browser bundle, so no secrets):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase project and publishable key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for the enquiry form. Leave empty (spam protection is in-house, PLAN.md 6.17) |
| `SITE_URL` | Server only. The one canonical host, e.g. `https://www.i2go.de` (no trailing slash). Used for canonical URLs, hreflang, the sitemap and JSON-LD. **Until it is set, every page is `noindex` and `robots.txt` disallows everything**, so set it on production only |
| `SHOW_DRAFT_GUIDES` | Server only. `true` shows guides marked `draft: true` (for review); leave unset in production |

## Pages

Every URL starts with the language, `/de` (default) or `/en`. A URL without one (`/`, old links such as `/candidates/<uuid>` or `/terms`) is redirected by `src/proxy.js` to the visitor's language (`Accept-Language`, else German). The SEO tree (PLAN.md 11) has translated segments; account and legal pages don't.

| German | English | Who | What |
|---|---|---|---|
| `/de` | `/en` | everyone | Landing page, latest candidates, job links, guides |
| `/de/fachkraefte` | `/en/candidates` | everyone | All candidates: search and filters (name, categories, experience) in the URL. No gender or age filter (AGG) |
| `/de/fachkraefte/[kategorie]` | `/en/candidates/[category]` | everyone | Category landing page: h1, live count, intro text, the list, skill links. `noindex` below 3 live candidates |
| `/de/fachkraefte/[kategorie]/[skill]` | `/en/candidates/[category]/[skill]` | everyone | Candidates of a category with one skill. 404 with no candidates, `noindex` below 3 |
| `/de/fachkraefte/[kategorie]/k-[nr]` | `/en/candidates/[category]/k-[nr]` | everyone | One candidate (`public_no`), always `noindex, follow`. Teaser for guests; full profile for employers who accepted the terms. Other categories and `/…/k-[nr]` redirect to the canonical URL |
| `/de/ratgeber[/thema]` | `/en/guides[/topic]` | everyone | Guides for employers (`src/lib/content/guides/`) |
| `/de/wishlist`, `/de/enquiries` | `/en/…` | employers | Wishlist (`candidate_wishlist`) and enquiries (`my_enquiries()`); guests are sent to sign in |
| `/de/login`, `/de/signup` | `/en/…` | everyone | Optional employer account; signup needs the terms checkbox |
| `/de/terms`, `/de/privacy`, `/de/impressum` | `/en/…` | everyone | Legal pages (details in `src/lib/portal/legal.js`; text English until the lawyer review, German pages say so) |
| `/sitemap.xml`, `/robots.txt` | | crawlers | Home, hubs, guides, and category and skill pages with 3+ candidates; account pages disallowed |

## Data rules

- Candidate data comes **only** from two functions (migration 0014). Anon and employers have no access to the candidate tables; don't query them.
  - `public_candidates()`: the teaser for everyone. "Arjun N.", no photo, video, age or gender, no company or school names.
  - `employer_candidates()`: the full view, only for employers who accepted the terms (`is_employer()`); no rows for anyone else. Each call is logged in `portal_reads` and limited to 500 an hour and 2500 a day (`0018`) per employer (HTTP 429, shown as a message).
  - Both filter, count and page inside the function (`p_search`, `p_category_ids`, `p_skill_ids`, `p_min_experience`, `p_ids`, `p_public_no`, `p_offset`, `p_limit`; `total_count` on every row), with a cap of 50 rows (200 for an id list). `candidate_service` picks the function per request.
  - Since migration 0019 rows carry `public_no` (URLs never show the uuid), and categories, skills and languages carry `name_de`, `slug_de` and `slug_en`. `portal_listing_stats()` gives live counts per category and per category + skill (thin-page rule, sitemap).
  - Listed means complete, visible, **consented in the app** (migration 0015) and not rejected.
- Photos and videos are private storage paths; the portal signs them for one hour with the visitor's session. Storage only allows that for employers with accepted terms (and the candidate and admins).
- The terms version is `TERMS_VERSION` in `src/lib/portal/legal.js`. Bump it when the terms change; employers on an older version see the teaser and a banner until they accept again.
- Enquiries go through the `submit-enquiry` edge function (validation, rate limits, duplicate check, Turnstile). A signed-in employer's token links the enquiry to their account.
- Signup sends no `account_type`, so the database creates an employer row in `public.users`. Candidate accounts (from the app) can sign in but are treated as guests.

## Layout

The folder structure and layering rules are in `ARCHITECTURE.md`; follow it for new or moved code. In short:

```
src/
  proxy.js                           language redirects + session refresh
  app/
    sitemap.js, robots.js            SEO files (PLAN.md 11.10)
    providers.jsx, theme.js, fonts.js
    modules/candidates/              backend: _0-database repos (Supabase queries) → _1-domain services (rules, signed URLs, slugs, counts)
    [lang]/layout.jsx                root layout: <html lang>, metadata, dictionary and slug maps for the client, JSON-LD
    [lang]/opengraph-image.jsx       default share image
    [lang]/(portal)/(pages)/         sidebar pages. fachkraefte/ and candidates/, ratgeber/ and guides/ are thin per-language
                                     route folders around the modules in _tree/ (hub, category, skill or candidate, guides);
                                     plus wishlist, enquiries, legal pages, not-found and the [...missing] catch-all
    [lang]/(portal)/client/          their views and components (card, grid, enquiry modal, landing header, guide view…)
    [lang]/(auth)/(pages)/, client/  login and signup (full-screen)
  components/                        app-wide UI: app-shell/ (sidebar, header, header search slot), breadcrumbs, json-ld, badge…
  features/auth/                     session, employer profile, wishlist ids, RequireEmployer, sign-in helpers; import via index.js
  features/i18n/                     I18nProvider, useI18n() ({ lang, t, p }), LanguageSwitcher; import via index.js
  lib/i18n/                          locales, Accept-Language matching, dictionaries/ (de.js, en.js), routes.js (every URL per language)
  lib/seo/                           SITE_URL and the thin-page threshold, metadata and JSON-LD builders
  lib/content/guides/                guide texts, one file per guide with both languages
  lib/                               supabase/ (browser, server and public clients), portal/ (format helpers, filters, PAGE_SIZE), config.js
```

- **Text.** Every UI string is in `lib/i18n/dictionaries/de.js` and `en.js` (same keys). Server code uses `getDictionary(lang)`; client components `useI18n().t`. Placeholders use `{name}`, filled with `format()` / `plural()` from `lib/i18n/config.js`. Build URLs with `paths(lang)` and `candidateHref(lang, candidate)` from `lib/i18n/routes.js`, never by hand.
- **Category and skill names** come from the database (`name_de` on German pages, via `localName()`); slugs are frozen once set, and renamed slugs redirect (`slug_redirects`, migration 0019).

- The session is kept in cookies (`@supabase/ssr`). `src/proxy.js` refreshes it before each page renders, and the server client (`lib/supabase/server.js`) acts as the visitor, so server pages and actions render the guest or employer view.
- Wishlist rows, `my_enquiries()`, sending an enquiry and sign-in/up/out still run in the browser (same cookie session), isolated in `features/auth/`, `use-my-enquiries.js` and `submit-enquiry.js`.
- Browser storage is limited to what is strictly necessary and is listed on `/privacy` (keep that list in step with the code).
- Old paths (`/candidates`, `/candidates/<uuid>`, `/saved`, `/people`) redirect in `src/proxy.js`.

## Design

`UI_UX.md` is the source of truth for the look: tokens, components, page rules and breakpoints. Read it before building or changing a page.
