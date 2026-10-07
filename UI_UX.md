# UI/UX Design System — I2Go Employer Portal

This is the single source of truth for how the employer portal looks and behaves.
Every token below exists in code in [`src/app/theme.js`](src/app/theme.js) (`tokens` export, also
emitted as CSS custom properties on `:root`). If a value is not here, don't invent it —
add it here first, then to `theme.js`.

Stack reminder: React 19 + MUI v7 (`sx` + theme overrides) + React Router v7 +
`react-icons/fi` (Feather). No CSS files, no Tailwind.

---

## Design Philosophy

- **Calm, light, blue.** The interface is white and cool-neutral; blue is reserved for
  navigation, primary actions, selection and links. Everything else is neutral.
- **Surfaces, not lines.** Separate content with white cards on a `#F8FAFC` canvas and
  soft shadows. Borders only on inputs, dividers inside cards and outlined buttons.
- **One strong anchor.** The solid blue sidebar is the only large block of colour. Content
  never competes with it (no coloured page backgrounds, no gradients on content).
- **Compact but breathable.** 14px body text, 40px controls, 20–24px card padding,
  24px gaps between cards.
- **Real data only.** Never add UI for something the app can't do (ratings, notifications,
  sort options, view toggles). If the reference shows a pattern we have no data for,
  use the slot for the closest real thing or leave it out.

## Reference Analysis

Reference: `ui-ref/reference-image.png` ("Jobie" talents dashboard). What we take from it:

| Reference trait | How we apply it |
|---|---|
| Solid brand-colour sidebar, logo top-left, icon + label nav | Blue `#2563EB` sidebar, I2Go logo, Feather icons + labels |
| Active nav item is a pill the same colour as the canvas, "cut into" the sidebar | Active item uses `--color-background` with inverted corners so it merges with the content panel |
| Content panel with a large rounded top-left corner overlapping the sidebar | Main panel `border-top-left-radius: 32px` on desktop |
| Header: back arrow + large title, search, icon buttons, avatar + name/role | Header: optional back arrow + page title, account block (avatar, name, "Employer") or Sign in / Create account |
| Breadcrumb under the title (blue current-section link / grey current page) | Breadcrumbs from route meta in `AppShell` |
| One wide white search bar card: location select │ keyword │ FILTER │ FIND | Candidates search bar: name search │ categories │ Filters │ Search |
| "Showing 246 Talents / Based your preferences" results line | "Showing N candidates" + context subtitle |
| Vertical talent cards: centred avatar, orange badge overlapping avatar, name, handle, location, bio, skill bars | Candidate cards: centred avatar, green **Verified** badge overlapping avatar, name, facts, categories, bio, skill level bars |
| "Showing 10 from 160 data" + Previous / soft-pill page numbers / Next | `Pagination` component with the same structure |

What we deliberately do **not** copy: purple palette (replaced by blue), orange rating badge
(we have no ratings), message/notification bells, Newest sort, grid/list toggle,
Fulltime/Freelance/Salary toggles, numeric skill percentages.

## Brand Colors

| Role | Hex | Use |
|---|---|---|
| Primary | `#2563EB` | Sidebar, primary buttons, active states, links, progress fill |
| Primary Light | `#3B82F6` | Sidebar hover, focus rings, secondary accents (never as text on white < 18px) |
| Background | `#F8FAFC` | App canvas, active sidebar pill |
| Surface | `#FFFFFF` | Cards, panels, inputs, header |
| Text Primary | `#1F2937` | Headings, names, important values |
| Text Secondary | `#64748B` | Body support text, labels, metadata |
| Border | `#E2E8F0` | Input borders, dividers |
| Accent / Success | `#10B981` | Verified, success, completed |
| Warning | `#F59E0B` | Warnings, medium-priority |
| Danger | `#EF4444` | Errors, destructive |

The I2Go logo (`public/images/i2go_logo.png`, served as `/images/i2go_logo.png`) is used unchanged. On the blue sidebar it
sits on a 40px white rounded tile so it keeps its own colours.

## Color Tokens

```css
:root {
  /* Brand */
  --color-primary:            #2563EB;
  --color-primary-hover:      #1D4ED8; /* pressed/hover for filled buttons (AA on white text) */
  --color-primary-light:      #3B82F6;
  --color-primary-soft:       #EFF6FF; /* selected backgrounds, soft buttons, icon tiles */
  --color-primary-soft-hover: #DBEAFE;

  /* Neutrals */
  --color-background:   #F8FAFC;
  --color-surface:      #FFFFFF;
  --color-surface-muted:#F1F5F9; /* inset areas: skill tiles, input adornments, table header */
  --color-border:       #E2E8F0;
  --color-border-strong:#CBD5E1; /* input hover */

  /* Text */
  --color-text-primary:   #1F2937;
  --color-text-secondary: #64748B;
  --color-text-muted:     #94A3B8; /* placeholders, disabled, captions on cards */
  --color-text-on-primary:#FFFFFF;

  /* Semantic (fg / soft bg / text-on-soft) */
  --color-success: #10B981; --color-success-soft: #ECFDF5; --color-success-text: #047857;
  --color-warning: #F59E0B; --color-warning-soft: #FFFBEB; --color-warning-text: #B45309;
  --color-danger:  #EF4444; --color-danger-soft:  #FEF2F2; --color-danger-text:  #B91C1C;

  /* Sidebar */
  --color-sidebar-bg:          #2563EB;
  --color-sidebar-text:        rgba(255,255,255,0.80);
  --color-sidebar-text-hover:  #FFFFFF;
  --color-sidebar-hover-bg:    rgba(255,255,255,0.10);
  --color-sidebar-active-bg:   var(--color-background);
  --color-sidebar-active-text: var(--color-primary);
}
```

Rules:
- Text on a soft semantic background uses the `*-text` shade, not the base colour.
- Never put Primary Light or Warning as text on white (fails contrast).
- No gradients on content. The only "colour block" allowed outside the sidebar is the auth
  brand panel and the Home welcome card (solid `--color-primary`).

## Typography

Font: **Poppins** (weights 400/500/600/700, self-hosted through `next/font` in `src/app/fonts.js`; never link Google Fonts directly), fallback
`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`.
Base size 14px. Headings use `letter-spacing: -0.01em`; nothing is uppercase except
`overline`.

## Typography Scale

| Token | MUI variant | Size / line-height | Weight | Colour | Use |
|---|---|---|---|---|---|
| `display` | `h2` | 40/48 (28/36 on xs) | 700 | text-primary | Auth panel + Home welcome headline only |
| `page-title` | `h1`/`h4` | 26/34 (20/28 on xs) | 600 | text-primary | Header page title |
| `section-title` | `h6` | 18/26 | 600 | text-primary | Card/section headings, "Showing N candidates" |
| `card-title` | `subtitle1` | 16/24 | 600 | text-primary | Candidate name, entry titles |
| `body` | `body1` | 14/22 | 400 | text-primary | Paragraphs |
| `body-secondary` | `body2` | 13/20 | 400 | text-secondary | Metadata, helper copy |
| `caption` | `caption` | 12/18 | 400 | text-muted / secondary | Footnotes, timestamps |
| `label` | `subtitle2` | 13/20 | 500 | text-secondary | Input labels, small headings |
| `button` | `button` | 14/20 | 600 | — | All buttons, sentence case |
| `badge` | (custom) | 12/16 | 600 | — | Badges, counts |
| `overline` | `overline` | 12/16, +0.08em | 600 | primary | Eyebrow above display headlines |

## Spacing System

4px base grid. MUI `theme.spacing(1) = 8px`, so `sx` values are in units of 8.

| Token | px | MUI `sx` | Typical use |
|---|---|---|---|
| `--space-1` | 4 | `0.5` | Icon–text gap in badges |
| `--space-2` | 8 | `1` | Icon–text gap in buttons, chip gaps |
| `--space-3` | 12 | `1.5` | Gap between controls in a toolbar |
| `--space-4` | 16 | `2` | Mobile page gutter, small card padding, stack gap in forms |
| `--space-5` | 20 | `2.5` | Candidate card padding |
| `--space-6` | 24 | `3` | Card padding (default), grid gap, section gap |
| `--space-8` | 32 | `4` | Gap between page sections, desktop gutter (md) |
| `--space-10` | 40 | `5` | Desktop gutter (lg+) |
| `--space-12` | 48 | `6` | Empty-state vertical padding |

Do not use odd values (e.g. `p: 1.75`, `mt: 0.75`) except `0.5` for tight text pairs.

## Border Radius

| Token | px | Use |
|---|---|---|
| `--radius-xs` | 6 | Progress bars, tiny tags |
| `--radius-sm` | 8 | Chips, menu items, tooltips, icon buttons (small) |
| `--radius-md` | 12 | Buttons, inputs, selects, skill tiles, nav items |
| `--radius-lg` | 16 | Cards, dialogs, popovers |
| `--radius-xl` | 20 | Search bar card, hero/welcome card |
| `--radius-2xl` | 32 | Main content panel's top-left corner |
| `--radius-full` | 999 | Avatars, badges, pagination pills |

## Shadows

```css
--shadow-xs:         0 1px 2px rgba(15,23,42,0.04);
--shadow-card:       0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.04);
--shadow-card-hover: 0 2px 4px rgba(15,23,42,0.04), 0 12px 32px rgba(37,99,235,0.10);
--shadow-popover:    0 12px 32px rgba(15,23,42,0.12);
--shadow-primary:    0 6px 16px rgba(37,99,235,0.24); /* filled primary button hover only */
--focus-ring:        0 0 0 3px rgba(59,130,246,0.25);
```

Cards have **no border** by default — `--shadow-card` separates them from the canvas.

## Layout

```
Desktop (≥ 900px)
┌──────────┬───────────────────────────────────────────────┐
│ Sidebar  │ Header (88px): [←] Title          [account]   │
│ 220px    ├───────────────────────────────────────────────┤
│ blue     │ Breadcrumb                                    │
│          │ Page content (max 1440px, gutter 40px)        │
└──────────┴───────────────────────────────────────────────┘
```

- `AppShell` (`src/components/app-shell/app-shell.jsx`) owns the shell: sidebar, header (title, back,
  breadcrumbs from route meta), candidate-account banner, then the page (`children`).
- Content panel: `bgcolor: --color-background`, `border-top-left-radius: 32px`, sits on the
  blue sidebar colour so the corner reads as "cut out" (desktop only).
- Page gutter: `px: { xs: 2, md: 4, lg: 5 }`; page bottom padding `pb: 3` (under the footer).
- Max content width 1440px, left-aligned (not centred) on very wide screens.
- **Page footer** (`PageFooter` in `app-shell.jsx`), after every page's content (so under the
  pagination on Candidates): one centred line, 12/18 text-muted, items separated by "·" —
  "**I2Go Employer Portal**" (600, text-secondary) · "© {year} I2Go Europe" · "Candidates:
  build your profile in the I2Go Portal app." Plain: 24px above it, no border, no padding;
  the page's bottom padding is 24px. Wraps on narrow screens.
- Pages that read as a document (candidate profile) use a two-column grid
  `minmax(0,1fr) 340px` on `lg`, single column below.
- Auth pages (`/login`, `/signup`) render **outside** the shell as a split screen.

## Sidebar

- Width 220px (`md`+), `--color-sidebar-bg`, full height, `position: sticky; top: 0`.
- Top: logo tile (40×40, white, `--radius-md`) + "I2Go" wordmark (20px/700, white) +
  "Employer portal" caption (12px, 70% white). Padding `32px 24px`.
- Nav list starts 32px below the logo. Items: height 52, 16px left inset, 20px left padding,
  icon 20px + 12px gap + label 15px/500. Logo block and footer use 20px horizontal padding.
- No footer text in the sidebar (it's the page footer now, see AppShell).
- Drawer version only (below `md`, where the header has no account controls): an account
  card pinned to the bottom (white 10% bg, `--radius-lg`, 16px padding) — guests get
  Create account (white) + Sign in (white 12%); signed-in users get avatar, name, Sign out.

## Header

- Height 88px desktop / 64px mobile, transparent (sits on the canvas), not sticky on desktop;
  sticky with white 90% + blur on mobile.
- Left: optional back `IconButton` (`FiArrowLeft`, 40px) then `h1` page title.
- Right (desktop): signed in → 40px avatar + name (14/600) + role line "Employer" (12px,
  text-secondary) + chevron; click opens account menu (email, Sign out). Guest → text
  button "Sign in" + primary "Create account".
- Right (mobile): menu `IconButton` opening the sidebar as a drawer.
- Breadcrumbs sit under the header, 13px: ancestors in `--color-primary` 500 weight, current
  page `--color-text-muted`, separator `/`.

## Navigation

Items come from `navItems(...)` in `app-shell.jsx` — never hard-code extra items.

| Item | Icon (Feather) | Visible to |
|---|---|---|
| Home | `FiHome` | everyone |
| Candidates | `FiUsers` | everyone |
| Wishlist | `FiHeart` | guests + employers (guests are sent to sign in); count badge for employers |
| My enquiries | `FiInbox` | employers |

States:
- Default: `--color-sidebar-text`.
- Hover: white text, `--color-sidebar-hover-bg`, `border-radius: 12px 0 0 12px`.
- Count badge (Wishlist): 22px pill pushed right, 12/600, white 18% bg + white text;
  on the active item `--color-primary-soft-hover` bg + primary text.
- Active (`NavLink .active`): `--color-sidebar-active-bg` background, `--color-primary` text +
  icon, 600 weight, `border-radius: 999px 0 0 999px`, extends to the sidebar's right edge with
  16px inverted corners top and bottom (pseudo-elements with a box-shadow in the canvas
  colour). "Candidates" is also active on `/candidates/:id`. "Home" uses `end`.
- Focus-visible: 2px white outline offset −2px.

## Buttons

All buttons: height 40 (`medium`), 36 (`small`), 48 (`large`); radius `--radius-md`;
14px/600 sentence case; icon 16–18px with 8px gap; `transition: background-color,
box-shadow, border-color, color 150ms ease`.

| Variant | MUI | Default | Hover | Use |
|---|---|---|---|---|
| Primary | `variant="contained"` | `--color-primary` bg, white | `--color-primary-hover` + `--shadow-primary` | One per view: Send enquiry, Search, Create account |
| Secondary (soft) | `variant="soft"` (custom) | `--color-primary-soft` bg, primary text | `--color-primary-soft-hover` | Filters, Clear filters, secondary page actions |
| Outline | `variant="outlined"` | white bg, `--color-border` border, text-primary | border `--color-border-strong`, bg `--color-surface-muted` | Previous/Next, Sign out, alternative actions |
| Ghost | `variant="text"` | transparent, primary text | `--color-primary-soft` bg | "See all", inline actions |
| Destructive | `color="error"` contained | `--color-danger` | darken 8% | Irreversible actions (none today) |
| Icon-only | `IconButton` | 40×40, radius `--radius-md`, text-secondary | `--color-surface-muted` bg | Wishlist heart, back, menu |

- Disabled: 45% opacity of the variant's colours (contained: `--color-border` bg,
  `--color-text-muted` text). Cursor `not-allowed`.
- Loading: keep the label width, swap the start icon for `CircularProgress size={16}`,
  change label to the "-ing…" form ("Sending…"), and disable.
- Pressed: `transform: scale(0.98)` on `:active` (contained and soft only).
- Don't put more than one contained button side by side.

## Inputs

- Outlined `TextField`, white bg, 1px `--color-border`, `--radius-md`, height 40
  (`small`, default) or 48 (`medium`, auth forms only).
- Hover border `--color-border-strong`; focus border `--color-primary` 1px +
  `--focus-ring`. No label float animation changes beyond MUI default.
- Placeholder `--color-text-muted`. Label 14px text-secondary; focused label primary.
- Error: border `--color-danger`, helper text 12px `--color-danger-text`. Helper text
  otherwise 12px text-secondary, 4px top margin.
- Start adornment icons: 18px, `--color-text-muted`.
- Forms stack with 16px gap; paired fields go side by side from `sm` up.

## Selects

Use `TextField select` (same chrome as inputs). Menu: `--radius-lg`, `--shadow-popover`,
6px inner padding, items 36px tall, `--radius-sm`, hover `--color-surface-muted`,
selected `--color-primary-soft` + primary text 500.
Multi-select with chips: `Autocomplete`, tags use the Chip style below.

## Search

The Candidates search bar replicates the reference's single white bar:

- Container: white, `--radius-xl`, `--shadow-card`, padding 8px (12px left) on desktop /
  16px on mobile, `display: flex; gap: 12px; align-items: center`. Fields and buttons are
  40px tall on desktop (bar ≈ 56px total) and 48px on mobile (touch targets).
- Segments separated by a 1px × 24px `--color-border` vertical divider (desktop only):
  1. Name search: borderless input, `FiSearch` 18px primary icon, flex 1.
  2. Job categories: borderless `Autocomplete`, `FiBriefcase` icon, width 240 (`md`) / 360 (`lg`+).
  3. **Filters** soft button (`FiSliders`), shows active count `Filters · 2`; becomes
     contained-soft-active (`--color-primary-soft-hover` bg) while the panel is open.
  4. **Search** primary button (`FiSearch`) — submits the name immediately (same as the
     400ms debounce firing early).
- Desktop (`md`+): the bar sits in the header row beside the account controls. On this page
  the header is `position: sticky; top: 0; z-index: 10` with 16px vertical padding and a
  **frosted glass** fill: `tokens.glassBg` (`rgba(248,250,252,0.72)`) +
  `backdrop-filter: blur(16px) saturate(180%)` (`tokens.glassBlur`). The bar itself is a
  translucent panel — `tokens.glassSurface` (`rgba(255,255,255,0.62)`), 1px
  `tokens.glassBorder` (`rgba(255,255,255,0.8)`) and an inset top highlight — and has **no
  backdrop-filter of its own** (a nested backdrop-filter can't see past its blurred parent).
  Once the page has scrolled (`scrollY > 8`) the bar's shadow becomes `--shadow-popover`
  plus a faint border ring. Not sticky below `md` (too tall when stacked), and the bar is a
  plain white card there.
- Name and categories fields share the free width (`flex: 1 1 0`, categories max 360px).
  Below 1360px the Filters and Search buttons are icon-only 40×40 (Filters keeps its active
  count next to the icon; both keep `aria-label`s), categories show 1 tag instead of 2, and
  the signed-in account shows the avatar only. From 1360px they show their labels.
- Mobile: segments stack vertically with 12px gap; borderless inputs get
  `--color-surface-muted` bg so they still read as fields.
- Expanded filters appear **inside the same card** under a 1px divider, 16px top padding,
  4 equal columns on `md`, 2 on `sm`, 1 on `xs`.

## Filters

- Only real filters: categories, gender, min experience, min/max age, name.
- Active state: Filters button shows the count; results line shows a soft "Clear filters"
  button. Filters live in the URL (unchanged behaviour).
- Never add sort/view toggles until the API supports them.

## Cards

| Variant | Spec | Where |
|---|---|---|
| Standard | white, `--radius-lg`, `--shadow-card`, padding 24 (20 on xs) | Profile sections, enquiry list container |
| Interactive | Standard + hover `--shadow-card-hover` + `translateY(-2px)`, 200ms; whole card is the link | `CandidateCard` |
| Search / toolbar | white, `--radius-xl`, padding 12 | Candidates search bar |
| Info (step) | Standard + 44px icon tile (`--color-primary-soft` bg, primary icon, `--radius-md`) | Home "How it works" |
| Highlight | solid `--color-primary`, white text, `--radius-xl`, padding 32–40 | Home welcome, profile CTA |
| Form | Standard, padding 32 desktop | Auth forms (inside split screen), dialog content |
| Empty/warning | Standard, centred, `py: 6`, 64px soft icon circle | `EmptyState` |

**Candidate card** (vertical, as the reference talent card), text centred, `overflow: hidden`.
Target height ≈ 385px at 267px wide (1440px screen, 4 per row):
1. **Cover band** 56px tall, `--color-primary-soft` with a faint dot grid
   (`radial-gradient(rgba(37,99,235,0.14) 1px, transparent 1px)`, 12px grid). Decorative only.
2. Wishlist heart top-right on a white 85% + blur tile (where the reference has the kebab).
3. Avatar 72px overlapping the band (`mt: -36px`), 4px white ring + soft shadow; initials
   fallback primary on white. Scales to 1.04 on card hover.
4. Verified badge (small: 22px tall, 11/600) pinned **top-left** of the card (14px inset),
   mirroring the wishlist heart top-right; only if verified. `pointer-events: none`, so
   clicks reach the card link. Nothing reserves space under the avatar.
5. Name 17/600, one line, 10px below the avatar. Then up to 2 job categories as `primary` Badges
   (+N neutral), 6px below.
6. **Stat strip** 12px below: `--color-background` box, 1px `--color-border`, `--radius-md`,
   three equal cells split by 1px dividers (8px inset top/bottom), 6px vertical cell padding —
   value 13/18 600, label 11/14 text-muted, no gap between them (strip ≈ 44px tall):
   Age · Gender · Experience ("7 yrs"). Missing values show "–".
7. Bio 13/20 text-secondary, 2-line clamp, **always 40px tall** (so the skills below line up
   across a row), 12px top margin.
8. Skills 16px below the bio, above a 1px `--color-border` divider (14px gap): the top **2**
   `SkillMeter` rows (name left, four 14×6px pill segments right; filled = primary, empty =
   `--color-primary-soft-hover`; beginner→1 … expert→4), 8px apart. "+N more skills" caption
   (12px, muted, left) below them only when there are more than 2. No "Top skills" eyebrow.
9. No footer row: the whole card is the link to the profile.
- Hover: `translateY(-3px)`, `--shadow-card-hover` plus a 1px `--color-primary-soft-hover`
  ring, avatar scales to 1.04. No MUI ripple overlay; keyboard focus shows an inset 2px
  Primary Light ring.
- `GridSkeleton` mirrors this layout (56px band, 72px circle, name, pill, 44px stat box,
  two lines, two meter rows).
- The profile page keeps the Verified badge under the large avatar (it isn't a card).

## Tables

No tabular data exists today. If one is added: white Standard card container, header row
`--color-surface-muted` 12px/600 uppercase text-secondary 44px tall, body rows 64px, 1px
`--color-border` row dividers only (no vertical lines), hover `--color-background`, first
column 24px left padding, numeric columns right-aligned, actions in a trailing 48px column.

## Lists

- **Row list** (My enquiries): one Standard card, rows separated by 1px dividers, row
  padding 20px 24px. Row = avatar 44px + name (16/600 link) + meta line, status badge right,
  message preview (2-line clamp) and status explanation below, aligned with the name.
- **Entry list** (work, education, languages): 16px vertical gap, 1px dividers, an icon tile
  (36px, `--color-primary-soft`, `--radius-md`) on the left of each entry.

## Badges

Height 24, padding `0 10px`, `--radius-full`, 12px/600, optional 14px icon with 4px gap.

| Tone | Bg | Text |
|---|---|---|
| `neutral` | `--color-surface-muted` | `--color-text-secondary` |
| `primary` | `--color-primary-soft` | `--color-primary` |
| `success` | `--color-success-soft` | `--color-success-text` |
| `warning` | `--color-warning-soft` | `--color-warning-text` |
| `danger` | `--color-danger-soft` | `--color-danger-text` |

The **Verified** badge on candidate cards is the one solid badge: `--color-success` bg, white
text, `FiCheck` icon, 2px white ring — it plays the role of the reference's orange rating
pill. Enquiry status: received → `warning` (awaiting review), forwarded → `primary`, closed → `neutral`.
Category chips use `primary` tone (MUI `Chip` styled to match).

## Modals

- `Dialog`: `--radius-lg`, `--shadow-popover`, max width `sm` (600px), full-screen below `sm`.
- Title 18/600 with 24px padding; content 24px horizontal; actions right-aligned, 24px
  padding, 12px gap, primary action last.
- Backdrop `rgba(15,23,42,0.40)`. Enter: fade + 8px upward slide, 200ms.

## Dropdowns

Menus/popovers: `--radius-lg`, `--shadow-popover`, 1px `--color-border`, 6px padding,
min width 220. Account menu header: name 14/600 + email 12px secondary, then divider,
then items with 18px icons.

## Toasts

MUI `Snackbar` bottom-center (bottom-left on desktop), dark `#1F2937` bg, white 14px text,
`--radius-md`, 4s auto-hide. Use for transient failures (e.g. save toggle). Persistent
errors use inline `Alert`, not toasts.

## Empty States

`EmptyState` component: Standard card, centred, `py: 6`, 64px circle
(`--color-primary-soft`, primary 28px icon), title 18/600, message 14px secondary
max-width 420, optional single action (contained) 20px below. Copy explains *why* it's empty
and what to do next.

## Loading States

- Lists/grids: skeletons with the same geometry as the real cards (`GridSkeleton` mirrors the
  centred candidate card). Skeleton colour `--color-surface-muted`, wave animation.
- Whole-page auth gate: centred 32px `CircularProgress`.
- Buttons: see Buttons → Loading.
- Never show "Loading…" text alone for content that has a known shape.

## Error States

Inline `Alert` (`--radius-md`, soft semantic bg, `*-text` colour, 1px border in the base
colour at 20% opacity) placed where the content would be, with a **Retry** text button when
the action can be retried. Form field errors go in helper text; form-level errors in an Alert
above the submit button.

## Responsive Design

Desktop-first. Design at 1440, verify at 1280, 1024, 900, 768, 390.

## Breakpoints

MUI defaults: `xs 0`, `sm 600`, `md 900`, `lg 1200`, `xl 1536`.

| Range | Name |
|---|---|
| ≥ 1200 | Desktop |
| 900–1199 | Laptop / small desktop |
| 600–899 | Tablet |
| < 600 | Mobile |

## Mobile Behavior (< 600)

- Sidebar becomes a left `Drawer` (same blue styling, 280px) opened from the header menu
  button; closes on navigation.
- Header sticky, 64px, white 90% + blur, bottom border; page title 20px.
- Content panel has no rounded corner; gutter 16px.
- Candidate grid 1 column; search bar segments stacked; pagination collapses to
  Previous / "Page 3 of 9" / Next.
- Candidate profile: sticky bottom action bar (Save + Send enquiry), single column.
- Dialogs full-screen.

## Tablet Behavior (600–899)

- Same drawer navigation and sticky 64px header as mobile.
- Candidate grid `auto-fill, minmax(260px, 1fr)` (2 columns at 768); search bar segments
  stacked, Filters + Search side by side at equal width.
- Gutter 16px; candidate profile header goes back to a row layout from `sm`.

## Desktop Behavior (≥ 900)

- Persistent sidebar (220px), content panel with 32px top-left radius.
- Candidate grid `repeat(auto-fill, minmax(260px, 1fr))` → 2 cols at 900, 3 at 1200, 4 at 1440,
  5 at 1920 (as the reference).
- Candidate profile two-column from `lg`.

## Animation & Transitions

Subtle and fast. Easing `cubic-bezier(0.2, 0, 0, 1)`.

| What | Duration | Effect |
|---|---|---|
| Hover colour/border changes | 150ms | colour |
| Card hover | 200ms | shadow + `translateY(-2px)` |
| Button press | 100ms | `scale(0.98)` |
| Filters panel | MUI `Collapse` 200ms | height |
| Dialog / menu | 200ms / 150ms | fade + 8px slide / fade + scale(0.98) |
| Page content | 200ms | fade-in + 4px rise on route change (`key={pathname}`) |

Respect `prefers-reduced-motion: reduce` — disable transforms and page fade.

## Accessibility

- Text contrast ≥ 4.5:1 (body) / 3:1 (≥ 18px or 14px bold). `#64748B` on `#F8FAFC` passes
  (4.6:1); `#94A3B8` is only for placeholders/decoration and non-essential captions.
- Every icon-only button has `aria-label` and a `Tooltip`.
- Visible focus: `--focus-ring` on inputs/buttons; white outline on sidebar items.
- One `h1` per page (the header title). Section titles are `h2`.
- Hit targets ≥ 40×40 (36 allowed for dense `small` buttons on desktop).
- Status is never colour-only: badges always have text.

## Component Rules

| Component | File | Notes |
|---|---|---|
| `AppShell` (sidebar, header, breadcrumbs) | `components/app-shell/app-shell.jsx` | Route meta map for title/back/crumbs |
| `CandidateCard`, `VerifiedBadge` | `app/(portal)/client/components/candidate-card.jsx` | Card spec above |
| `CandidateGrid`, `GridSkeleton` | `app/(portal)/client/components/candidate-grid.jsx` | auto-fill grid |
| `SkillBar`, `SkillMeter` | `app/(portal)/client/components/skill-bar.jsx` | `SkillBar` (profile page): level label + bar at 25/50/75/100%. `SkillMeter` (cards): four-step segmented meter. Never show a numeric % |
| `Badge` | `components/badge.jsx` | Tones above |
| `Pagination` | `components/pagination.jsx` | Wraps MUI `usePagination` |
| `EmptyState` | `components/empty-state.jsx` | |
| `PageIntro` | `components/page-intro.jsx` | Subtitle line + optional actions under the breadcrumb |
| `WishlistButton` | `app/(portal)/client/components/wishlist-button.jsx` | Heart (`FiHeart`). `variant="icon"` on cards / phone bar, `variant="button"` (outlined, "Add to wishlist" / "In wishlist") on the profile header. Filled `--color-danger` when in the list; pops (scale 1.3, 320ms) on add; toast "Added to your wishlist" + View link (portalled). Guests → `/login?next=…`; hidden for signed-in non-employers |
| `EnquiryDialog`, `Turnstile` | `app/(portal)/client/candidate-profile/enquiry-modal.jsx`, `turnstile.jsx` | restyled via theme |

- Colours/radii/shadows come from `tokens` in `theme.js` — no raw hex in components.
- Prefer theme overrides over per-instance `sx` for anything used twice.
- Icons: **Feather only** (`react-icons/fi`), sizes 14 (inline meta), 16 (buttons),
  18 (inputs), 20 (nav, header).

## Page-specific UI Rules

- **Home `/`**: inside the shell. Highlight welcome card (overline, display headline,
  supporting text, Browse candidates (white button) + Create a free account (outline-white)),
  then "How it works" 3 Info cards, then "Latest candidates" grid with "See all" ghost button.
- **Candidates**: no visible header title, breadcrumb, greeting or intro copy (route meta
  `hideTitle` + `headerSearch`; the `h1` stays visually hidden for screen readers).
  Desktop: the header row *is* the search row — the page portals its search bar into
  AppShell's header slot (`HeaderSlotContext` in `app-shell/header-slot.js`), account controls on the right
  (centred in a 56px box). Phones: logo + "I2Go" in the header, search bar inline below it.
  Then: results line (`Showing N candidates` 16/600 +
  13px secondary context; Clear filters soft button right) → grid → pagination row
  (`Showing 13–24 of 57` left, pager right).
- **Candidate profile**: back arrow in header. Hero card (avatar 112 + verified badge, name
  h2 26/600, facts, category chips, Save + Send enquiry right). Main column: About, Intro
  video, Work experience, Education. Side column: Skills (SkillBars), Languages, CTA
  Highlight card (not sticky: the side column can be taller than the viewport).
  Phone sticky action bar kept.
- **Wishlist** (`/wishlist`, old `/saved` redirects): PageIntro copy + "Browse more candidates"
  soft button → candidate grid (newest added first) → note if some are no longer listed.
  Empty state: heart icon, "Your wishlist is empty".
- **My enquiries**: PageIntro copy → row list.
- **Login / Sign up**: split screen. Left 45% blue panel (logo, display headline, 3
  benefit rows with Feather icons in 40px white-10% tiles) hidden below `md`. Right: centred
  form column max 400px, logo shown above the form on mobile.

## Do / Don't

**Do**
- Use `tokens.*` and theme variants; keep one primary button per view.
- Reuse `Badge`, `EmptyState`, `Pagination`, `SkillBar` rather than restyling chips ad hoc.
- Keep card internals aligned to the same left edge (or centre, for candidate cards).
- Keep copy short and sentence case.

**Don't**
- Don't add gradients, coloured page backgrounds or more than one solid-blue block per view.
- Don't add borders to cards, or shadows to inputs.
- Don't mix icon libraries or use filled icons.
- Don't fabricate data (ratings, percentages, counts) to fill the reference's slots.
- Don't change routes, API calls, auth or URL-based filter state while restyling.

## Implementation Guidelines

1. Start from `theme.js`: if a new value is needed, add a token there and here.
2. New page: put it in a route group whose layout renders `AppShell` (add a route meta entry for title/crumbs/back), start
   with `PageIntro`, use Standard cards with 24px gaps, `EmptyState` for empties,
   skeletons matching the final layout, inline `Alert` + Retry for errors.
3. New list of things → card grid (`CandidateGrid` pattern) if visual, row list if
   text/status heavy, table only for ≥ 4 comparable columns.
4. Check at 1440, 1024, 768 and 390 widths before calling it done.
5. Run `npm run lint` and `npm run build`.
