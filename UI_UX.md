# UI/UX Design System: I2Go employer frontend

The single source of truth for how the employer frontend looks and behaves: the homepage
(`(marketing)`), the employer portal (`(portal)`) and login/signup (`(auth)`). Since Task 14 of
`homepage-redesign-plan.md` they share **one** visual language, taken from the reference site
(plan §1). The admin app (`admin_frontend`) is not covered and keeps its own look.

Every value below lives in `brand` in [`src/app/theme.js`](src/app/theme.js). Components read
`brand` (imported as `b`) or the MUI theme; they never use raw hex. If a value is missing, add it
here first, then to `brand`.

Stack: Next.js 16 app router + React 19 + MUI v7 (`sx` + theme overrides) + `react-icons/fi`
(Feather). No CSS files, no Tailwind.

> **Legacy `tokens`.** `theme.js` still exports the old `tokens` object, but since 14.2 every
> entry is an alias of a `brand` value. New code must not use it. It is removed in 14.7, once the
> last files (`badge.jsx`, `app-shell.jsx`, `skill-bar.jsx`, `wishlist-button.jsx`,
> `candidate-grid.jsx`, the profile, enquiry modal, enquiries and legal views) no longer read it.

---

## 1. Principles

- **Almost monochrome.** Ink and greys on a near-white canvas, one blue accent. Cyan appears only
  on navy.
- **Hairlines, not shadows.** Content is separated by 1px lines and whitespace. Cards have a
  hairline border and a barely visible shadow.
- **Strong type.** Extra-bold (800) headings with tight negative tracking; small labels uppercase
  with wide tracking (the eyebrow).
- **Numbers tell the order.** Two-digit numbers (01, 02…) on sections, steps, link groups and
  form groups. They are `aria-hidden`; screen readers hear only the title.
- **Navy is for highlights.** Dark panels (enquiry CTA, guest employer CTA, guide CTA, the auth
  side panel, the homepage hero and employer section) are the only large dark blocks. The rail,
  header and canvas are light.
- **One gradient on controls.** Only the primary call to action (`cta`) has a gradient.
- **Real data only.** No UI for things the app can't do (ratings, notifications, invented
  percentages or counts). If the reference has a slot we have no data for, use the closest real
  thing or leave it out.
- **No decoration for its own sake.** No illustrations, stock photos or decorative shapes.
  Visuals come from real data and real UI.

## 2. Colour (`brand.*`)

### Light surfaces
| Token | Value | Use |
|---|---|---|
| `ink` | `#0A0F16` | headings |
| `ink2` | `#2C3641` | card titles, strong body, button text |
| `muted` | `#5D6873` | body text, leads, placeholders (5.4:1 on `bg1`) |
| `faint` | `#98A1AB` | icons and decoration only. **Never text** (2.6:1) |
| `line` / `line2` / `lineHover` | `#E2E7EC` / `#CED6DE` / `#9AA7B3` | hairlines and card borders / chips, inputs on hover, soft buttons / hovered borders |
| `bg1` / `bg2` | `#F7F8FA` / `#EFF1F3` | page canvas / alternate band |
| `surface` / `surface2` / `surface3` | `#FFF` / `#FDFDFE` / `#F3F5F7` | cards / resting cards / inset areas, chips, tracks |

### Accent and status
| Token | Value | Use |
|---|---|---|
| `accent` | `#0F8FC7` | borders, ticks, nodes, focus rings, large text. **Not small text** (3.6:1) |
| `accentText` | `#0B6A94` | eyebrows, links, section numbers, counts: all small accent text (6.0:1). MUI `primary.main` |
| `accentInk` / `accentSoft` / `accentLine` | `#06364B` / `#F1F7FA` / `#D3E5EE` | deep accent, hover / soft fill (info boxes) / soft border |
| `ok` / `okText` / `okSoft` | `#12996B` / `#0E7F59` / `#E4F8EF` | ticks and fills / small success text / soft fill |
| `danger` | `#D92D20` | errors, a saved heart |

### Dark surfaces (cyan lives only here)
| Token | Value | Use |
|---|---|---|
| `navy` → `navy2` | `#03070C` → `#060D15` | the `darkSection` gradient (homepage hero) |
| `graphite` | `#0B1420` | selected page / chip / rail item, number circles, icon tiles, tooltips, toasts |
| `cyan` | `#1FC8FF` | numerals and icons on graphite or navy, glow, focus rings on dark |
| `gold` | `#FFC94D` | "European Employers" in the hero H1 only |
| `onDark.text` / `.bodyStrong` / `.body` / `.subtle` | white / 78% / 64% / 50% | headings / small text over photos / body / small meta. Nothing below 50% is text |
| `onDark.line` / `.border` / `.ring` / `.hover` | white 7% / 10% / 16% / 4.5% | hairlines / panel borders / node rings / hover fill |

Backgrounds: `darkSection` (hero), `darkPanel` (navy panel with a cyan radial), `darkPanelBase`
(the same without the radial, for panels that add a moving `DriftGlow`), border `darkPanelBorder`,
shadow `shadowDarkPanel`, `glow` (static cyan radial behind the hero card).

### Pairing rules
- Small text on white: `ink`, `ink2`, `muted`, `accentText`, `okText`. Never `faint`, `accent`, `ok`.
- Graphite or navy surface → its numeral or icon is `cyan`.
- Selected state = graphite with white or cyan; never a blue fill.
- Status is never colour only: pills and progress always carry text.

## 3. Typography

Font: **Plus Jakarta Sans** (variable 500–800, self-hosted via `next/font`: `jakarta` in
`src/app/fonts.js`, CSS variable `--font-jakarta`, set on `<html>` in `[lang]/layout.jsx`).
`brand.fontFamily` refers to it. Poppins is gone.

| Role | Size / line height | Weight | Tracking | Where |
|---|---|---|---|---|
| Hero H1, chapter H2 | 48 / 1.08 (32 below 900px) | 800 | -1.8px (-0.8px) | homepage |
| Landing H1 | 40 / 1.1 (30 below 900px) | 800 | -1.4px (-0.8px) | category, skill pages (`LandingHeader`) |
| Shell H1 | 32 / 38px (20 / 26px on phones) | 800 | -1px (-0.4px) | portal page title in the header |
| Step / panel title | 26–28 / 1.15–1.2 (22 on phones) | 800 | -0.7 to -0.8px | dark panels, homepage steps |
| Section H2 | 18–20 | 800 | -0.4px | profile sections, link sections, guides |
| Stat figure | 23 / 1.2 | 800 | -0.7px | `StatBlock` |
| Lead | 16 / 1.65 (15 on phones) | 500 | 0 | `PageIntro`, landing intro; measure 640–680px |
| Body | 14.5–15 / 1.6–1.65 | 500 | 0 | |
| Small, captions | 12.5–13 / 1.55 | 600 | 0 | |
| Eyebrow | 11 / 1.4, uppercase | 800 | 0.14em | `Eyebrow`; `accentText` on light, `cyan` on dark |
| Section number | 11 | 800 | 0.14em | two digits, `accentText`, tabular numerals, `aria-hidden` |
| Button | 15 (14 small) | 800 (ghost, soft 700) | -0.2px | |

Headings follow the pattern **eyebrow → 800 heading → muted lead**. Use `fontVariantNumeric:
'tabular-nums'` for counts and ranges. Sentence case everywhere.

## 4. Spacing, radii, shadows

Spacing is the MUI 8px scale. Page gutter 16px on phones, 32px from 900px, 40px from 1200px.
Card padding 20–24px (16px on phones); dark panels 24px (phones) to 32–44px. Gaps between cards
16–24px; between page sections 40–56px.

| Token | Value | Use |
|---|---|---|
| `radiusSm` | 10 | small tiles, rail items, menu items |
| `radiusButton` | 14 | buttons (cta small 12); pills and chips 999 |
| `radiusMd` | 16 | cards, inputs, stat blocks |
| `radiusPanel` | 18 | dark panels |
| `radiusLg` / `radiusXl` | 20 / 26 | dialogs / large panels |
| `shadow1` | `0 1px 2px` (navy tint) | resting card |
| `shadow2` | `0 8px 20px` | hovered card, focused search |
| `shadow3` | `0 18px 44px` | dialogs, menus, popovers |
| `shadowDarkPanel` | `0 12px 32px` | dark panels |
| `ctaShadow` | gradient button only | |

## 5. Layout

- **Breakpoints**: MUI defaults; the main one is **900px** (`md`). `sm` 600 hides the phone bar.
- **Widths**: `contentMax` 1080 (homepage sections), `wideMax` 1440 (nav, hero, portal `<main>`),
  `readingMax` 820 (guides, legal).
- **Portal shell** (`components/app-shell/app-shell.jsx`):
  - Desktop: a light rail on the left, 248px (88px collapsed), white with a hairline edge; items
    are grey icon tiles with two-digit numbers; the active item is a graphite pill with a cyan
    icon. The page is one light `bg1` canvas.
  - Header: eyebrow ("Employer portal") over the H1, 112px tall. On pages with the header search
    (candidate list, categories, skills) it is 88px, sticky, and uses the homepage nav's white
    glass (`rgba(252,254,255,0.72)`, `blur(16px)`); its `rgba(13,42,66,0.06)` hairline appears
    only after 8px of scroll.
  - Phones: a 64px sticky top bar, white 86% with `blur(14px) saturate(180%)` and a `line`
    hairline; the rail becomes a drawer behind the menu button.
  - The footer is `MarketingFooter`, after `<main>`, so it sits at the bottom of short pages.
- **Homepage nav** (`marketing-nav.jsx`): 78px (64px on phones), transparent over the hero, white
  glass once scrolled, dark glass (`rgba(6,13,21,0.72)`) over sections marked
  `data-nav-tone="dark"`.
- **Auth** (`(auth)/client/components/auth-card.jsx`): from 900px a navy side panel with the
  homepage's `HeroBackground` and the benefits as a numbered hairline list; the form column has
  an eyebrow and an 800 H1.

## 6. Components

### Buttons (MUI variants in `theme.js`)
| Variant | Look | Use |
|---|---|---|
| `cta` | `ctaGradient`, white 15/800, radius 14, 50px (40px `small`). The `endIcon` becomes a 28px round chip (white 18%) | the one primary action per view area. `CtaButton` adds the arrow and handles links |
| `contained` | same gradient and weight, no chip unless an `endIcon` is passed | primary actions inside forms and cards |
| `soft` | `surface3`, `line2` hairline, `ink2` 700 | secondary actions: Previous/Next, Clear filters, Filters |
| `ghost` | transparent, `ink2` 14/700, hover `rgba(13,42,66,0.05)` | a quiet action next to a `cta` (Cancel, Login) |
| `outlined` | white, `line2` border | rare; prefer `soft` |

Hover lifts 1–2px; disabled `cta` fades to 60%. One `cta` per view area.

### Focus
Every interactive element gets a 2px outline 3px out: `focusRing` (accent) on light,
`focusRingDark` (cyan) on dark. `cta`, `ghost` and `contained` read `var(--focus-color)`; dark
panels set `--focus-color: b.cyan`. Cyan on white is under 3:1, so it never rings on light.

### Cards
White, 1px `line` border, `radiusMd`, `shadow1` (the `MuiCard` default). Hover: lift 1px, border
`lineHover`, `shadow2`, 280ms. Candidate cards (`candidate-card.jsx`, shared pieces in
`candidate-card-parts.jsx`) are left-aligned: avatar, name with a green tick, `accentText`
category, current role, German-first language chips, a 2-line bio, the top two `SkillMeter`s.

### Dark panel
`darkPanelBase` + `darkPanelBorder` + `shadowDarkPanel`, radius `radiusPanel`, a cyan `DriftGlow`,
`isolation: isolate`, `--focus-color: cyan`. Inside: optional hairline icon tile with a cyan
icon, 800 white heading, `onDark.body` text, a `cta`. Used by the profile enquiry panel,
`EmployerCta` (homepage; on portal list pages for guests via `GuestEmployerCta`), the guide CTA.

### Chips and pills
- Link and filter chips: `surface3`, `line2` hairline, 13.5/700 `ink2`, count in 11.5/800
  `accentText`; lift on hover (`seo-links.jsx`, the hero category chips).
- Selected / active filter chips: graphite with white text, removable (×, Enter, Delete).
- Status pills (`enquiries/enquiry-status.jsx` `StatusPill`): neutral `surface3`, hairline, `ink2`
  text, a dot that is accent while open and `faint` once closed. No coloured status fills.

### Numbered things
- Section headings: two-digit `accentText` number before the 800 title, counted over the sections
  actually shown.
- Circles: 26px graphite with an 11.5/800 cyan numeral (enquiry form groups), or ring nodes on
  dark (auth benefits, homepage timeline).
- Progress: `StatusProgress`, the step rail's 15px ring nodes on light (accent; the current node
  solid with an `accentLine` halo), an `<ol>` with `aria-current="step"`.

### Lists
Hairline `ul/li` rows (`line` between rows), `faint` icons, no `Divider`, no icon tiles. FAQ is a
hairline `dl`. "On this page" in guides is a two-column numbered hairline list.

### Inputs and search
Inputs: white, `line` border, `line2` on hover, accent border and a soft accent ring on focus,
radius 16, `muted` placeholders. The candidate search is the homepage hero search: a white
hairline panel, `faint` icons, `shadow1` (`shadow2` once scrolled or focused), `cta` Search.

### Pagination
`components/pagination.jsx`: a `surface3` track with a `line2` hairline; the selected page is
graphite with a cyan 800 numeral; other pages `ink2` with a white hover; `soft` Previous/Next at
40px; the range text bold `ink`, tabular.

### Empty, loading, error
- `EmptyState`: a 56px graphite tile with a cyan icon, an 800 title, a muted 15px line, the action
  centred (`CtaButton` for "Browse candidates", `soft` for "Clear filters").
- Skeletons match the final layout (`page-skeletons.jsx`, `GridSkeleton`) on `surface3`.
- Errors: inline `Alert` + Retry. Info boxes are `accentSoft` with an `accentLine` hairline.

### Dialogs, menus, tooltips, toasts
Dialogs: `radiusLg`, `shadow3`, hairline, 19/800 title, navy 48% backdrop; full screen on phones
where the content is long. Menus and autocomplete: `radiusLg`, `shadow3`, hairline. Tooltips and
toasts: graphite.

### Phone action bar
The candidate profile has a bar fixed to the bottom below 600px: the phone top bar's glass, a
`line` top hairline, safe-area padding, the wishlist heart and the enquiry action as `cta`. The
page adds matching bottom padding.

## 7. Shared building blocks

| Component | File | Notes |
|---|---|---|
| `AppShell` | `components/app-shell/app-shell.jsx` | rail, header, route meta (title, back, crumbs, `headerSearch`, `hideTitle`) |
| `PageIntro` | `components/page-intro.jsx` | the lead under the shell title, optional actions |
| `Eyebrow` | `(marketing)/client/components/eyebrow.jsx` | `tone="dark"` for cyan |
| `CtaButton` | `(marketing)/client/components/cta-button.jsx` | `cta` + arrow chip; `href` makes it a link |
| `Reveal`, `STAGGER` | `(marketing)/client/components/reveal.jsx` | entrance motion, see §8 |
| `DriftGlow` | `(marketing)/client/components/drift-glow.jsx` | moving cyan glow in dark panels |
| `StatBlock` | `(marketing)/client/components/stat-block.jsx` | `bare` for a row of figures |
| `EmployerCta` | `(marketing)/client/home/employer-cta.jsx` | `headingLevel`, `sx` |
| `GuestEmployerCta` | `(portal)/client/components/guest-employer-cta.jsx` | `EmployerCta` for confirmed guests only |
| `LandingHeader`, `LinkSection` | `(portal)/client/seo/landing-header.jsx` | category and skill page tops, numbered link groups |
| `JobLinks` | `(portal)/client/components/seo-links.jsx` | crawlable chip links |
| `CandidateCard`, `CandidateGrid` | `(portal)/client/components/` | the grid staggers cards by column |
| `SkillBar`, `SkillMeter` | `(portal)/client/components/skill-bar.jsx` | level label + bar; never a numeric % |
| `StatusPill`, `StatusProgress` | `(portal)/client/enquiries/enquiry-status.jsx` | |
| `EmptyState`, `Pagination` | `components/` | |
| `WishlistButton` | `(portal)/client/components/wishlist-button.jsx` | heart; `danger` when saved; guests go to login |
| `MarketingFooter` | `(marketing)/client/components/marketing-footer.jsx` | homepage and portal |

Icons: **Feather only** (`react-icons/fi`), 14 (inline meta), 16 (buttons), 18 (inputs), 20 (nav).

## 8. Motion

Easing `brand.ease` = `cubic-bezier(0.16, 1, 0.3, 1)`.

| What | Duration | Effect |
|---|---|---|
| Entrance (`Reveal`) | 500ms | fade in from `translateY(22px)`, once; siblings stagger by `STAGGER` (60ms) |
| Card / chip hover | 280ms | lift 1px, border `lineHover`, `shadow2` |
| `cta` hover | 280–300ms | lift 2px, chip moves 2px right |
| Header hairline | 250ms | fades in after 8px of scroll |
| Rail collapse | 200ms | width |
| Glow on dark panels | 18s alternate | slow drift, decorative |

Content is visible without JavaScript: `useInView` hides a block only after JS has run and found
it below the fold. `prefers-reduced-motion` turns all motion off (the `MuiCssBaseline` rule and
the hooks).

## 9. Accessibility

- Contrast: body text ≥ 4.5:1, large text (≥ 18px, or 14px bold) ≥ 3:1. See the pairing rules
  in §2.
- One `h1` per page (the shell title, or the landing / auth H1). Section titles are `h2`;
  `EmployerCta` is `h3` on the homepage and `h2` in the portal.
- Every icon-only button has an `aria-label` and a `Tooltip`.
- Visible focus everywhere (§6 Focus).
- Hit targets ≥ 40×40; 44px for chips on phones.
- Decorative numbers and glows are `aria-hidden`.

## 10. Page rules

- **Candidate list** (`/candidates`, `/fachkraefte`): the H1 is visually hidden; the desktop header
  row is the search bar (portalled via `HeaderSlotContext`). Results line, active filter chips,
  grid, pagination, then `GuestEmployerCta` for guests.
- **Category and skill pages**: `LandingHeader` (eyebrow, landing H1, real figures in `StatBlock`s,
  intro, hairline), the grid, numbered `LinkSection`s with chips, `GuestEmployerCta`.
- **Candidate profile**: back arrow; hero card; sections in `Reveal` cards with numbered headings
  and hairline rows; the dark enquiry panel; the phone action bar.
- **Wishlist, recently viewed**: `PageIntro` + candidate grid; `EmptyState` when empty.
- **My enquiries**: rows with `StatusPill` and `StatusProgress`.
- **Guides and legal**: 820px reading column, eyebrow, 800 H1, hairline sections; guides end with
  the dark CTA panel.
- **Login, signup**: see §5 Auth.

## 11. Do / Don't

**Do**
- Use `brand` and the theme variants; one `cta` per view area.
- Reuse the blocks in §7 before writing new styles.
- Keep the eyebrow → heading → lead pattern and hairline separation.
- Check 390px and 1440px (plus 768 and 1024 for grids), DE and EN, before calling a page done.
- Run `npm run lint` and `npm run build`.

**Don't**
- Don't use `tokens`, raw hex, Poppins or the old portal blue (`#2563EB`).
- Don't put cyan on a light surface, or use `faint`, `accent` or `ok` for small text.
- Don't add coloured page backgrounds, extra gradients on controls, or heavy shadows.
- Don't use coloured status fills; status is a neutral pill with text.
- Don't fabricate data (ratings, percentages, counts) to fill a slot.
- Don't mix icon libraries or use filled icons.
- Don't change routes, API calls, auth or URL-based filter state while restyling.
