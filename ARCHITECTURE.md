# Employer portal: folder structure and layering

_Added 2026-10-06. Rules to follow for all new and moved code in `employer_frontend/`. Part 1 is the general guide. Part 2 applies it to this project; its mapping was approved on 2026-10-06 and is carried out in PLAN.md 9.7._

---

## Part 1: The guide

This project already has its own plans, features and SEO setup. Do NOT change what the app does.
Your job is to organize the code into the folder structure below. Fit existing pages, components,
data access and SEO files into it. Supabase stays as the backend; don't change how it is configured.
(This is Next.js App Router. Check `node_modules/next/dist/docs/` for the installed version's conventions.)

### Core idea

The app is split into MODULES (e.g. `marketing`, `dashboard`, `auth`, `shared`; choose names that match
this project's features). Each module has two halves that are kept strictly apart:

- **Backend** → `app/modules/<module>/` (data access + business logic, no UI)
- **Frontend** → `app/(<module>)/` route group, containing `(pages)` (routes) and `client` (UI)

### Structure

```
app/
  layout.tsx                         # root layout, global providers, default metadata
  globals.css
  sitemap.ts, robots.ts, manifest.ts # app-wide SEO files stay at the app root
  modules/                           # ===== BACKEND =====
    <module>/
      _0-database/<entity>_repo.ts       # Layer 0: Supabase queries only
      _1-domain/<entity>_service.ts      # Layer 1: business logic
    shared/                              # cross-module repos/services (users, settings…)
  (<module>)/                        # ===== FRONTEND (route group, not in URL) =====
    (pages)/                         # routes only
      <route>/page.tsx               # server component: auth check, fetch via services, export metadata
      <route>/actions.ts             # "use server" actions for this route
      <route>/[slug]/page.tsx        # dynamic routes + generateMetadata / generateStaticParams
      layout.tsx                     # module layout (sidebar/header shell) if needed
    client/                          # all UI for this module
      <feature>/<feature>-view.tsx   # main "use client" view, receives data via props
      <feature>/<entity>-modal.tsx   # feature-specific modals, forms, cards, panels
      <feature>/widgets/<widget>/    # larger sub-areas: index.tsx, types.ts, utils.ts, parts
      components/                    # components shared across this module's features
      index.ts                       # optional barrel exporting the views
  api/<resource>/route.ts            # Route Handlers only for webhooks, file downloads/uploads, exports
components/                          # truly app-wide UI only (root header/footer, avatar, buttons)
features/auth/                       # self-contained auth module; import only through its index.ts
lib/                                 # pure helpers & constants (no UI, no DB)
  supabase/                          # Supabase client factories (server/browser), keep existing setup
  seo/                               # shared metadata helpers, JSON-LD builders, site config
  <module>/                          # module-specific constants
types/
```

### Layer rules (dependencies only flow downward)

`page.tsx` / `actions.ts` → `_1-domain` service → `_0-database` repo → Supabase

- **_0-database repos**: only Supabase queries (select/insert/update/delete, filters, column shapes).
  Return data or throw. No business rules, no auth decisions, no UI.
- **_1-domain services**: business logic, rules and validation. They import only repos from their own module
  or `modules/shared`. No React or Next imports. They throw `Error` on invalid state.
- **page.tsx** (server component): check the session/redirect, await `params`/`searchParams`, fetch through
  SERVICES (use `Promise.all` for parallel calls), export `metadata`/`generateMetadata` for SEO, then
  render `<Feature>View` from `client/` and pass data as props.
- **actions.ts** (`"use server"`): check the session, read input, call SERVICES, `revalidatePath`, return
  `{ success?: boolean; error?: string }` and never throw to the client.
- **client/** (`"use client"`): UI only. It receives data via props and mutates by importing server actions
  from `(pages)/<route>/actions.ts`. It never calls repos or services, and never queries Supabase directly
  unless something needs a browser-only Supabase feature (e.g. realtime/auth listeners). Keep that code
  isolated in a hook in the feature folder.
- Pages and client never import `_0-database` (type-only imports are fine).

### Where SEO goes

- Per-page metadata: `export const metadata` or `generateMetadata` in that route's `page.tsx`.
- Shared defaults: `app/layout.tsx`, using helpers from `lib/seo/`.
- `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`: at `app/` root or inside the route folder they belong to.
- JSON-LD: build it in `lib/seo/` and render it from the page (server component).

### Naming

- Backend files: snake_case → `post_repo.ts`, `post_service.ts`.
- Frontend files: kebab-case → `posts-view.tsx`, `post-modal.tsx`.
- Views/components use default exports; repos/services use named function exports (no classes).
- Repo functions: `findX`, `findXById`, `countX`, `createX`, `updateX`, `deleteX`.
  Service functions: `getX`, `getXById`, `createX`, `updateX`, `deleteX`.
  Alias imports when names clash (`createPost as dbCreatePost`, `createPost as svcCreate`).

### Adding a feature (checklist)

`<entity>_repo.ts` → `<entity>_service.ts` → `(pages)/<route>/page.tsx` (+ metadata) + `actions.ts`
→ `client/<feature>/<feature>-view.tsx` (+ modals/widgets) → nav link.

### How to proceed

1. Read the existing code, plans and SEO setup first. Then propose a mapping (old path → new path)
   per module and wait for approval before moving files.
2. Move code in small steps, one module at a time, and fix imports. URLs must stay the same:
   route groups `( )` don't change URLs, so existing routes and SEO paths keep working.
3. Don't add new libraries, and don't change Supabase config, the auth flow or the app's behavior.

---

## Part 2: How it applies to this portal

### Project-specific rules

These follow from Part 1's own constraints (no new libraries, same auth flow, same behaviour):

1. **JavaScript, not TypeScript** (PLAN.md 9.1). Same names with `.js` / `.jsx` instead of `.ts` / `.tsx`. No `types/` folder; use JSDoc where a shape needs documenting.
2. **Cookie sessions (since PLAN.md 10.4).** The session lives in cookies (`@supabase/ssr`); `src/proxy.js` refreshes it. Saving to the wishlist, submitting an enquiry, `my_enquiries()` and sign-in/up/out still use the browser Supabase client, isolated in hooks (`features/auth/`, or a `use-*.js` in the feature folder); they can move to server actions when they next change.
3. **Server repos act as the visitor** (`createServerSupabase()` in `lib/supabase/server.js`, async, reads the session cookies). The database decides what each visitor sees: `public_candidates()` for everyone, `employer_candidates()` and media signing for employers with accepted terms.
4. **One frontend module for the shell.** Home, candidates, profile, wishlist and enquiries share the sidebar layout, so they live in one route group, `(portal)`. Splitting them into several groups would remount the shell when moving between them, which resets the Back arrow and the drawer and changes behaviour. Backend modules are still split by entity.
5. **No `globals.css` for now.** All styling is the MUI theme (`sx` + `theme.js`); add the file only when a global rule is needed.
6. **SEO files** (Phase 11): `app/sitemap.js` and `app/robots.js` at the app root; metadata and JSON-LD builders in `lib/seo/`; the OG image renderer in `(pages)/_tree/og-image.jsx`; `JsonLd` and `Breadcrumbs` in `components/`.
7. **Languages (Phase 11).** Everything lives under `app/[lang]/` (German `/de`, English `/en`), whose `layout.jsx` is the root layout. `src/proxy.js` redirects URLs without a language. UI strings come from `lib/i18n/dictionaries/` (server: `getDictionary(lang)`; client: `useI18n()` from `features/i18n`); URLs from `paths(lang)` in `lib/i18n/routes.js`. Repos and services stay language-free: they return both `name` and `name_de`, and error *kinds* (`readErrorKind`), which pages word in the page language.
8. **Translated route segments.** The SEO tree has a folder per language (`fachkraefte/` and `candidates/`, `ratgeber/` and `guides/`). Each is a thin `page.jsx` that renders a shared module from the private folder `(pages)/_tree/` with `only="de"` or `"en"`; the module returns 404 when the URL's language doesn't match its folder. Put logic in `_tree/`, never in the wrappers.
9. **Content files.** Guide texts live in `lib/content/guides/` (one file per guide, both languages), not in the database.

### Mapping (approved 2026-10-06)

**Backend: `src/app/modules/`**

| New | From | Contents |
|---|---|---|
| `candidates/_0-database/candidate_repo.js` | `services/portal.js` | `findLiveCandidates(filters, range)`, `findLiveCandidatesByIds`, `findLiveCandidateById` (all via `public_candidates()`) |
| `candidates/_0-database/candidate_media_repo.js` | `services/portal.js` | `createSignedPhotoUrls(paths)`, `createSignedVideoUrl(path)` |
| `candidates/_0-database/category_repo.js` | `services/portal.js` | `findActiveCategories` |
| `candidates/_1-domain/candidate_service.js` | `services/portal.js` | `getCandidates(filters)` (paging, LIKE escaping, photo URLs), `getCandidatesByIds`, `getCandidateById`. **The single place that picks the data source** (9.7.3; later `employer_candidates()` for 10.4) |
| `candidates/_1-domain/category_service.js` | `services/portal.js` | `getCategories` |

**Frontend: `src/app/(portal)/`** (sidebar shell)

| New | From |
|---|---|
| `(pages)/layout.jsx` | `app/(shell)/layout.jsx` |
| `(pages)/page.jsx` | `app/(shell)/page.jsx`; now fetches the latest candidates on the server |
| `(pages)/candidates/page.jsx` | `app/(shell)/candidates/page.jsx`; awaits `searchParams`, fetches the list + categories |
| `(pages)/candidates/[id]/page.jsx` | `app/(shell)/candidates/[id]/page.jsx`; fetches the profile, `generateMetadata` replaces the `document.title` effect |
| `(pages)/wishlist/page.jsx` + `actions.js` | `app/(shell)/wishlist/page.jsx`; action `getWishlistCandidates(ids)` replaces the browser call to `getCandidatesByIds` |
| `(pages)/enquiries/page.jsx` + `actions.js` | `app/(shell)/enquiries/page.jsx`; action `getEnquiryCandidates(ids)` for the candidate details |
| `client/home/home-view.jsx` | `views/Home.jsx` |
| `client/candidates/candidates-view.jsx` | `views/Candidates.jsx` |
| `client/candidate-profile/candidate-profile-view.jsx` | `views/CandidateDetail.jsx` |
| `client/candidate-profile/enquiry-modal.jsx` | `components/EnquiryDialog.jsx` |
| `client/candidate-profile/turnstile.jsx` | `components/Turnstile.jsx` |
| `client/candidate-profile/submit-enquiry.js` | `submitEnquiry` from `services/portal.js` (browser, sends the session token; a plain function, not a hook) |
| `client/candidate-profile/enquiry-storage.js` | `services/enquiryStorage.js` |
| `client/wishlist/wishlist-view.jsx` | `views/Wishlist.jsx` |
| `client/enquiries/enquiries-view.jsx` | `views/MyEnquiries.jsx` |
| `client/enquiries/use-my-enquiries.js` | `useMyEnquiries()`: `my_enquiries()` with the browser session, plus the server action for candidate details |
| `client/components/candidate-card.jsx` | `components/CandidateCard.jsx` |
| `client/components/candidate-grid.jsx` | `components/CandidateGrid.jsx` |
| `client/components/skill-bar.jsx` | `components/SkillBar.jsx` |
| `client/components/wishlist-button.jsx` | `components/WishlistButton.jsx` |

**Frontend: `src/app/(auth)/`**

| New | From |
|---|---|
| `(pages)/login/page.jsx`, `(pages)/signup/page.jsx` | `app/(auth)/login`, `app/(auth)/signup` |
| `client/login/login-view.jsx` | `Login` in `views/AuthPages.jsx` |
| `client/signup/signup-view.jsx` | `Signup` in `views/AuthPages.jsx` |
| `client/components/auth-card.jsx` | `AuthCard`, `LogoMark`, benefits list in `views/AuthPages.jsx` |

**App-wide**

| New | From |
|---|---|
| `src/app/layout.jsx`, `fonts.js`, `providers.jsx` | same files (`Providers.jsx` renamed) |
| `src/app/theme.js` | `src/theme.js` |
| `src/app/not-found.jsx` | same file; `views/NotFound.jsx` → `components/not-found-view.jsx` |
| `src/components/app-shell/app-shell.jsx` | `components/Layout.jsx` (also used by `not-found`) |
| `src/components/app-shell/header-slot.js` | `HeaderSlotContext` from `components/navigation.jsx` |
| `src/components/badge.jsx`, `empty-state.jsx`, `page-intro.jsx`, `pagination.jsx` | `components/Badge.jsx`, `EmptyState.jsx`, `PageIntro.jsx`, `Pagination.jsx` |
| `src/features/auth/index.js` | new barrel: `AuthProvider`, `useAuth`, `RequireEmployer`, `Redirect`, `SignInButton`, `loginHref`, `signIn`, `signUp`, `signOut` |
| `src/features/auth/auth-provider.jsx`, `use-auth.js` | `auth/AuthContext.jsx`, `auth/useAuth.js` |
| `src/features/auth/require-employer.jsx` | `RequireEmployer` in `views/AuthPages.jsx` |
| `src/features/auth/redirect.jsx`, `sign-in-button.jsx` | `Redirect`, `SignInButton`, `loginHref` in `components/navigation.jsx` |
| `src/features/auth/session.js` | the `supabase.auth.*` calls in `AuthContext.jsx` and `views/AuthPages.jsx` |
| `src/features/auth/wishlist.js` | `getSavedIds`, `saveCandidate`, `unsaveCandidate` from `services/portal.js` (browser, session) |
| `src/lib/supabase/browser.js` | `services/supabase.js` (unchanged setup) |
| `src/lib/supabase/server.js` | new: anon client, no session (9.7.1) |
| `src/lib/config.js` | `services/config.js` |
| `src/lib/portal/format.js` | `GENDERS`, `levelLabel`, `yearsLabel`, `monthLabel`, `initials` from `services/portal.js` |
| `src/lib/portal/constants.js` | `PAGE_SIZE` |
| `src/lib/portal/filters.js` | `readFilters` from `views/Candidates.jsx`, as `parseFilters` (shared by the page and the view) |
| `public/images/i2go_logo.png` | `assets/logo/i2go_logo.png` |

Removed afterwards: `src/views/`, `src/services/`, `src/auth/`, `src/assets/`, `src/app/(shell)/`.

### Behaviour notes for the move

- Every page that shows candidates renders per request (home uses `await connection()`; `/candidates` and profiles read `searchParams`/`params`). Their HTML carries signed photo URLs that expire after an hour, so a cached or stale page could show broken photos. Caching comes back once photos have stable URLs (PLAN.md Backlog).
- Filter changes still push a URL; the server renders the new list, and the view shows its skeleton while that's pending (a transition), as it does today.
- No `loading.jsx` on pages that matter for SEO: it makes Next stream the page, and clients without JavaScript (crawlers, link previews) then see only the skeleton. Checked again 2026-10-07 on Next 16.3: Googlebot gets the same streamed HTML, with the content in a hidden `<div>`. Instead, the shell shows the skeleton itself: `components/app-shell/use-pending-path.js` notices a click on an internal link, and the shell switches the menu and title to it at once and, if the page takes more than 120 ms (it wasn't prefetched), shows the matching skeleton from `client/components/page-skeletons.jsx` until it arrives. A new server-rendered route adds its skeleton in `pendingSkeleton()` in `app-shell.jsx`.
- After the move, turn `react-hooks/set-state-in-effect` back on (9.1 note): the data-loading effects are gone.
