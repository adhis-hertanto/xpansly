# 01 - Nav + Hero (Figma frame 848:16498, 1440 x 906)

Source: Figma file `Ly0R84ThdJJDDjKsaRWhth`, page frame "xpansly-00-Full-page 1", child "Frame 1" (848:16498).
All values below are read from Figma at the 1440 desktop frame. Only the 1440 frame exists for this section (no tablet/mobile variant in scope).

Reference PNGs: `docs/spec/ref/01-hero.png` and `docs/spec/ref/01-nav.png` could NOT be saved (see "Open issues" at the bottom: the sandbox proxy returns 403 for the Figma asset host `www.figma.com/api/mcp/asset/...`).

---

## 0. Grid and tokens

12-col grid at 1440: margin 80, gutter 16, column = (1280 - 11*16)/12 = 92. Column n starts at x = 80 + (n-1)*108.

| Col start | x | | Span | width |
|---|---|---|---|---|
| 1 | 80 | | 5 cols | 524 |
| 6 | 620 | | 6 cols | 632 |
| 8 | 836 | | 7 cols | 740 |

Important: the Figma layers are named "Column / Left (6 cols)" and "Column / Right (6 cols)" but the real geometry is **left = 740 wide = 7 cols (cols 1-7, x 80-820)**, **right = 524 wide = 5 cols (cols 8-12, x 836-1360)**, gap 16 = gutter. Body/sign-up block is 524 = 5 cols (cols 1-5). Layer names are misleading; follow the geometry.

### Colour tokens (Figma paint styles)
| Style | Hex |
|---|---|
| Primary/White | #FFFFFF |
| Primary/Black | #0A0A0A |
| Neutral/Neutral 300 | #D4D4D4 |
| Neutral/Neutral 400 | #A3A3A3 |
| Neutral/Neutral 700 | #404040 |
| Neutral/Neutral 900 | #171717 |
| Tertiary/Green | #45B649 |

Non-styled raw hexes used inside the mock cards are listed in section 5.

### Text styles
| Style | Font | Size/LH | Notes |
|---|---|---|---|
| Landing page/Display | Recia Medium (500) | 72 / 80, ls 0 | headline |
| Landing page/Body Large | Geist Regular | 20 / 28 | hero body |
| Landing page/Body | Geist Regular | 18 / 28 | button label, input placeholder |
| Landing page/Body Small | Geist Regular | 16 / 24 | nav links |
| Landing page/Label | Geist Mono Regular | 14 / 20, UPPERCASE, ls 0 | eyebrow, caption |

The mock-card texts (sections 5) use raw sizes with no text style: Geist 14, 15, 13; Geist Mono 11; Geist Bold 11.

Fonts needed: **Recia** (Medium), **Geist** (Regular, Bold), **Geist Mono** (Regular). Recia is a commercial/custom face - confirm licence/webfont file.

### Shared "glass" recipe (nav bar, eyebrow chip, 3 mock-card containers)
Fill #FFFFFF @ 6% (rgba(255,255,255,0.06)); 1px INSIDE stroke #FFFFFF @ 16% (rgba(255,255,255,0.16)); Figma effects `GLASS (16)` + `BACKGROUND_BLUR (16)` (= CSS `backdrop-filter: blur(8px)`; Figma blur radius 16 = CSS blur 8px, matching the generated code). The Figma `GLASS` effect also has refraction/depth/dispersion parameters that the API did not expose; approximate in CSS with the blur + fill + border (optionally a subtle inset highlight). No drop shadows anywhere in this section.

---

## 1. Structure tree (semantic)

```
Frame 1 (848:16498) 1440x906  -> <section class="hero-wrap"> position:relative, overflow hidden
|- 848:16504 planet bg raster                         -> <img/Image> decorative, alt="", absolute fill
|- 848:16501 Scrim (gradient)                         -> <div aria-hidden> absolute overlay
|- 849:146  01-Nav (1440x102)                         -> <header>
|   `- 848:24727 Nav bar (801x70 glass pill)          -> <nav aria-label="Primary">
|       |- 848:15950 xpansly lockup (133x40)          -> <a href="/" aria-label="Xpansly"> <svg/img>
|       |- 850:142 Nav links (291x24)                 -> <ul> of <a>
|       |   |- 850:143 "How it works"
|       |   |- 850:144 "Mira"
|       |   `- 850:145 "Who it's for"
|       `- 850:146 Button / Join early access (191x52) -> <a|button> primary CTA
`- 849:147  02-Hero (1440x804)                         -> <section aria-labelledby="hero-h1"> (inside <main>)
    `- 850:1942 Hero (1280x608, row gap 16)
        |- 850:1943 Left column (740 x 582)           -> <div>
        |   |- 850:1944 Intro (740x294)
        |   |   |- 850:1945 Chip / Eyebrow            -> <p> chip
        |   |   |   |- 850:1946 dot (8x8 green)       -> decorative
        |   |   |   `- 850:1947 label                 -> text
        |   |   `- 850:1948 Headline                  -> <h1 id="hero-h1">
        |   |- 850:1949 Body                          -> <p>
        |   `- 850:1950 Sign-up (524x96)
        |       |- 850:1951 Form / Early access       -> <form>
        |       |   |- 850:1952 Input / Work email    -> <input type="email"> (+ visually hidden <label>)
        |       |   |   `- 850:1953 Placeholder
        |       |   `- 850:1954 Button / Join early access -> <button type="submit">
        |       `- 850:1956 Caption                   -> <p>
        `- 850:1957 Right column (524 x 608)          -> <div aria-hidden="true"> decorative product mock (see section 5)
            |- 858:141 Glass / Mira message card  (inner 848:21100)
            |- 858:142 Glass / Accounts card      (inner 848:21110)
            |- 858:143 Glass / Next move card     (inner 848:21159)
            `- 848:21173 Cursor "You"
```

Suggested landmarks: `<header>` wraps 849:146; `<main>` begins with the hero section. Frame 1 itself is just the background + overlay container (hero + nav share one background, which runs behind the nav).

Heading level: Headline 850:1948 is the page `<h1>`. Eyebrow and caption are `<p>`.

---

## 2. Background layers (848:16498 children, z-order bottom to top)

| z | Node | Type | x,y,w,h | Detail |
|---|---|---|---|---|
| 1 | 848:16504 "xpansly-planet-blue-dark-lines-circuit-1920x1080 1" | Rectangle w/ IMAGE fill, scaleMode FILL | 0,0,1440,889 | Source raster is **1920x1080 PNG**; shown cover-fit (object-fit: cover) in a 1440x889 box. Contains the blue planet, dark lines/circuit art (this is the only "orbit/dither" art in the frame - see section 6). Ends at y=889, 17px above frame bottom (906); the scrim covers to 907 and fades to #0A0A0A so the seam is hidden. |
| 2 | 848:16501 "Scrim" | Rectangle w/ linear gradient | 0,0,1440,907 | Gradient bottom-to-top: stop 0% #0A0A0A @100%, stop 19.231% #0A0A0A @60%, stop 47.596% #0A0A0A @0%. CSS: `linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,.6) 19.231%, rgba(10,10,10,0) 47.596%)`. Page background below the hero should be #0A0A0A. |
| 3 | 849:146 Nav | frame | 0,0,1440,102 | see 3 |
| 3 | 849:147 Hero | frame | 0,102,1440,804 | see 4 |

Frame 1: vertical auto-layout, gap 0, no padding, no fill (background is the page behind). Total 102 + 804 = 906.

---

## 3. Nav (849:146)

### Container 849:146 "01-Nav"
- 1440 x 102 at (0,0). Horizontal auto-layout, padding 16 / 80 / 16 / 80 (T/R/B/L), main+cross axis CENTER, width FILL, height HUG, clips content. No fill (transparent over the planet art).

### Nav bar 848:24727 - floating glass pill
- **Floating / inset, not full-width**: 801 x 70, x = 319.5 (centered: (1440-801)/2), y = 16 (16px from top of viewport/frame). Width is HUG to content, not tied to the 12-col grid (spans 319.5 to 1120.5).
- Glass recipe (section 0), radius **8**, 1px inside stroke.
- Horizontal auto-layout, gap **80**, padding T8 / R8 / B8 / L16, cross-axis CENTER, HUG/HUG.
- Internal widths: 1 (border) + 16 pad + 133 logo + 80 + 291 links + 80 + 191 button + 8 pad + 1 border = 801.
- Children, left to right (x relative to bar, includes the 1px border): logo x17,y15 133x40; links x230,y23 291x24; button x601,y9 191x52.

### Logo 848:15950 "xpansly-2-horizontal-lockup 1"
- 133 x 40, clips content. Contains group "2 Logo" 848:16094 = **Icon mark 848:16095** (0..40.2 wide) + **Wordmark 848:16269** (x 40.2..132.9, y 9.9, 92.7x25.7). All fills #FFFFFF (style Primary/White).
- The frame also contains a hidden/background "1 Construction grid" group (848:15951, #D4D4D4 / #9A9A9A hairlines on a white background rect). That is a brand-sheet artefact; **do not export it**. Export 848:15950 as **SVG** after removing the construction-grid group, or reuse the two exported asset pieces (icon mark SVG + wordmark SVG - design-context returns them as two SVGs, wordmark on a 30.19% left offset).
- Interactive: link to `/`; add `aria-label="Xpansly home"` (the artwork has no text).

### Nav links 850:142
- Frame 291 x 24, horizontal auto-layout, gap **40**, HUG, clips content.
- Each is a text node, style **Landing page/Body Small** (Geist 16/24 Regular), fill **Neutral/Neutral 300 #D4D4D4**, single line (no wrap).

| Node | Copy (verbatim) | x in links | w |
|---|---|---|---|
| 850:143 | `How it works` | 0 | 95 |
| 850:144 | `Mira` | 135 | 33 |
| 850:145 | `Who it's for` (straight apostrophe in Figma) | 208 | 83 |

Link targets are not specified in Figma (assume in-page anchors to later sections). No hover/active state exists in the frame; flag to design.

### Primary button 850:146 "Button / Join early access" (instance; also used at 850:1954)
- 191 x 52 in nav (56 tall in the form - height follows context, FILL in the form row). Fill **Primary/White #FFFFFF**, **radius 4**, no stroke, no effects.
- Horizontal auto-layout, padding 0 / 24 / 0 / 24, center/center, HUG width.
- Label `Join early access`: style **Landing page/Body** (Geist 18/28 Regular), fill **Primary/Black #0A0A0A**, nowrap. Label width 143.
- Only the default state is in the file (no hover/focus/disabled variants seen).

### Mobile / hamburger
**None.** The file contains only the 1440 desktop nav; there is no hamburger, drawer or collapsed state, and nothing in the frame implies one (links are always inline). Mobile nav behaviour is undefined and needs a design decision (suggest: logo + CTA, links in a menu button).

---

## 4. Hero (849:147)

### Container 849:147 "02-Hero"
- 1440 x 804 at (0,102). Vertical auto-layout, gap 0, padding T96 / R80 / B100 / L80. No fill.
- Child 850:1942 "Hero": 1280 x 608 at (80, 198 absolute). Horizontal auto-layout, **gap 16**, align top, clips content. Left column fixed 740 wide, right column FILL (524).
- Hero content ends at y=806; +100 bottom padding = 906.

### Left column 850:1943 (x80, w740 = cols 1-7; h582)
Vertical auto-layout, gap **40**, no padding, fixed width 740, height HUG.

**Intro 850:1944** (740 x 294, vertical, gap **16**, clips): chip then headline.

1. **Eyebrow chip 850:1945** - 248 x 38 (HUG), at (0,0).
   - Glass recipe; radius **999** (pill); padding T8 R16 B8 L12; horizontal, gap 8, items centered; clips content.
   - Dot 850:1946: 8 x 8 vector circle, fill **Tertiary/Green #45B649**.
   - Label 850:1947: `Now opening early access`, style **Landing page/Label** (Geist Mono 14/20), **UPPERCASE** (text-transform; source text is mixed case), fill **#FFFFFF**, nowrap.
2. **Headline 850:1948** - 740 x 240 (fixed width, hug height), y=54 in Intro. Style **Landing page/Display** (Recia Medium 72/80, ls 0), fill **#FFFFFF**, left aligned.
   Copy (verbatim, from the Figma text; one soft line break with a trailing space after "everything."):
   `Orchestrate everything. ` / `Own the outcome.`
   Box height 240 = 3 lines x 80, so at 740 width Recia very likely wraps to **3 lines** ("Orchestrate / everything. / Own the outcome."?) - verify against the screenshot (could not be downloaded). In HTML use `<h1>Orchestrate everything. <br/>Own the outcome.</h1>` or two spans with `display:block`, max-width 740.

**Body 850:1949** - 524 x 112 (cols 1-5), y=334 (= 294 intro + 40 gap). Style **Landing page/Body Large** (Geist 20/28), fill white (styled text segment #FFFFFF; the wrapper node reports #C4C4C4 but the only text run is #FFFFFF - treat as **#FFFFFF**, see open issues). 4 lines at 524 wide.
Copy (verbatim, single paragraph):
> The GTM Operating System for B2B tech. Xpansly brings your accounts, people, channels and data into one system, then coordinates everyone involved in the buying decision until the deal is done.

(The Figma code splits it into two spans: "The GTM Operating System for B2B tech." and " Xpansly brings ... deal is done." - both white; no emphasis difference. Optionally the first sentence is a lead-in, but there is no style difference.)

**Sign-up 850:1950** - 524 x 96, y=486, vertical auto-layout, gap **20**, clips.
- **Form 850:1951** 524 x 56, horizontal, gap **16**, items top-aligned, width FILL.
  - **Input 850:1952** "Input / Work email": x0, **317 x 56** (FILL width, fixed height 56), fill **Neutral/Neutral 900 #171717**, 1px INSIDE stroke **Neutral/Neutral 700 #404040**, **radius 8**, horizontal padding 16 (0/16/0/16), text vertically centered, clips. No shadow/blur. Placeholder 850:1953: `Your work email`, style **Landing page/Body** (Geist 18/28), fill **Neutral/Neutral 400 #A3A3A3**. Input text colour (typed) not designed; suggest #FFFFFF. Focus/error/filled states are not in the file.
  - **Button 850:1954**: x333, 191 x 56 (HUG width x FILL height), same spec as nav button: white fill, radius 4, label Body 18/28 #0A0A0A, `Join early access`.
  - Column maths: input 317 + 16 + button 191 = 524 = 5 cols.
- **Caption 850:1956** 524 x 20, y=76 (56 + 20 gap): `For B2B SaaS and tech teams, and the agencies that grow them`, style **Landing page/Label** (Geist Mono 14/20), **UPPERCASE**, fill **Neutral/Neutral 400 #A3A3A3**, width FILL (one line at 524).

Form semantics: `<form>` with `<label class="sr-only" for="email">Work email</label>`, `<input id="email" type="email" name="email" autocomplete="email" required placeholder="Your work email">`, `<button type="submit">Join early access</button>`. Endpoint/success/error UX not specified in Figma.

### Right column 850:1957 (x836, w524 = cols 8-12; h608)
Fixed-position composition (children are absolutely positioned; no auto-layout), clips content, no fill. All coordinates below are **relative to the column's top-left (836, 198 absolute)**. See section 5 for the cards.

---

## 5. Right-column illustration (decorative product mock)

Treat as decorative (`aria-hidden="true"`): it shows the product (Mira) UI. Three glass cards + a cursor, staggered to form a cascade. Z-order (bottom to top): Mira message, Accounts, Next move, Cursor.

Each card is a **Glass container** (frame, glass recipe, **radius 20**, 12px padding + 1px stroke, so inner card starts at +13,+13) holding an **Inner card** (a Figma group of flattened vectors + text, 14px radius surface).

| # | Glass container (export candidate: not exported, rebuild as CSS) | Inner card (export candidate) | Glass x,y (col-relative) | Glass size | Inner size |
|---|---|---|---|---|---|
| 1 | **858:141** "Glass / Mira message card" | **848:21100** "Mira message card" | 25, 0 | 477 x 125 | 451 x 99 |
| 2 | **858:142** "Glass / Accounts card" | **848:21110** "Accounts card" | 13, 143 | 502 x 271 | 476 x 245 |
| 3 | **858:143** "Glass / Next move card" | **848:21159** "Next move card" | 123, 432 | 302 x 176 | 276 x 150 |
| - | cursor (no container) | **848:21173** "Cursor You" | 235, 559 | 50 x 34 | - |

Absolute at 1440: Mira glass (861,198), Accounts glass (849,341), Next-move glass (959,630), cursor (1071,757). Column-grid note: Mira card spans x 861-1338, Accounts 849-1351, Next move 959-1261 - staggered within cols 8-12 (836-1360); they are not column-snapped.

Glass containers: identical glass recipe; blur/refraction applies to the planet art behind. Inner card surfaces are mostly opaque dark (#161616) so the glass reads only as a 12px frosted rim around each card.

### 5.1 Mira message card (inner 848:21100; vector bg 848:21101)
- Surface: 451 x 99, radius 14, fill **#161616**, 1px stroke **#2A2A2A**.
- Header 848:21102 (119 x 22, at inner +19.5,+17.5): avatar circle 22x22 **#6B3FD6** (purple) with 11.88 white (#FFFFFF) glyph (848:21103/21104); name `Mira` (Geist 14, #FFFFFF, 848:21105); time `8:02 AM` (Geist Mono 11, **#6B6B6B**, 848:21106).
- Message 848:21107 (inner +19.5,+46.5), Geist **15**, #FFFFFF, two pre-broken lines (20px line box, 22px pitch):
  - 848:21108 `Morning. Two of your accounts moved overnight, so I`
  - 848:21109 `mapped who’s engaged and drafted next moves.` (typographic apostrophe U+2019)
  Joined: "Morning. Two of your accounts moved overnight, so I mapped who’s engaged and drafted next moves."

### 5.2 Accounts card (inner 848:21110; vector bg 848:21111)
- Surface 476 x 245 (bg vector 475 wide), radius 14, fill **#161616**, stroke **#2A2A2A** 1px.
- Header 848:21112: title `Accounts in motion` (Geist 14, #FFFFFF, 848:21113, 20px from left). Right: "Live" pill 848:21114 (92 x 22, fully rounded r=11, fill **#1F1F1F**, stroke **#2A2A2A**) containing green dot 848:21115 (6x6, **#4ADE80**) and `Live · 4` (Geist Mono 11, **#A3A3A3**, 848:21116). Divider 848:21117: 476 x 1, **#2A2A2A**.
- Rows 848:21118 (452 wide, inset 12; 4 rows, 38 tall, pitch 46 = 8 gap), each: bg row vector (radius 8), 16px company icon at x12, company name (Geist 14 #FFFFFF at x40), two grey "skeleton" bars (6 tall; **#3A3A3A** at x148 and **#2C2C2C**), and a status pill on the right (22 tall, fully rounded, right edge at x442) with status icon/dot + Geist Mono 11 label.

| Row (node) | Name (verbatim) | Row bg | Icon | Status pill bg / stroke | Status text | Status colour |
|---|---|---|---|---|---|---|
| 848:21119 | `Northwind` | #122016 (green tint) | 16px circle **#4ADE80** with #0A0A0A 1.6px check | #12261A | `Engaged` | **#4ADE80** (check icon stroke 1.5 same) |
| 848:21129 | `Helix Cloud` | #1A1330 + stroke #2E2350 (purple tint) | 16px **#6B3FD6** with 8px white square | #241640 | `New signal` | text **#B9A3FA**, dot **#8B5CF6** |
| 848:21139 | `Pallas AI` | #1A1A1A | 14.5px ring stroke **#F9D423** + yellow bar | #2A2306 / stroke #3D3410 | `Deciding` | **#F9D423** (pause-style icon) |
| 848:21150 | `Argo Data` | #1A1A1A | 14.5px ring stroke **#6B6B6B** | #1F1F1F / stroke #2A2A2A | `Researching` | text **#A3A3A3**, ring **#6B6B6B** |

Skeleton bar widths per row (decorative): Northwind 96/44, Helix 72/52, Pallas 88/36, Argo 64/48. Pill widths: 80, 100, 87, 107 (hug-to-text + 10px left pad + icon).

**Status colour summary (used in the mock UI):** green #4ADE80 (Engaged / Live; row bg #122016, pill #12261A), purple #8B5CF6 dot / #B9A3FA text / #6B3FD6 avatar (New signal, Mira; row #1A1330, pill #241640, border #2E2350), yellow #F9D423 (Deciding; pill #2A2306, border #3D3410), grey #6B6B6B / #A3A3A3 (Researching; pill #1F1F1F). Surfaces #161616 / #1A1A1A / #1B1B1B / #1F1F1F, borders #2A2A2A. Note #4ADE80 and #F9D423 are not the brand "Tertiary/Green #45B649" - they are one-off mock colours, not paint styles.

### 5.3 Next move card (inner 848:21159)
- Outer surface 848:21160: 276 x 150, radius **20**, fill **#0A0A0A @ 55%** (dark scrim under card).
- Surface 848:21161: 263 x 137 at inner (6.5,6.5), radius 14, fill **#1B1B1B**, stroke **#2A2A2A** 1px.
- Top sheen 848:21162: 262 x 40 at (7,7), linear gradient white @6% to white @0% (top to bottom), same top radius.
- Label 848:21163: 6px dot **#A3A3A3** + `Next move · Northwind` (Geist Mono 11, #A3A3A3, 848:21165).
- Copy 848:21166 (Geist 14): `Send the CFO the ROI brief` (#FFFFFF, 848:21167) / `and loop in IT Security.` (#A3A3A3, 848:21168).
- Buttons 848:21169 (160 x 28): primary pill 848:21170 90x28 radius 14 fill **#FFFFFF** with `Approve` (Geist 13, #0A0A0A, 848:21171); ghost text `Edit plan` (Geist 13, **#6B6B6B**, 848:21172) with no background.

### 5.4 Cursor "You" (848:21173)
- 50 x 34 group at (235,559) in column: arrow pointer 848:21174 (12.4 x 18.4, fill #0A0A0A, 1.5px stroke #FFFFFF), label pill 848:21175 (36 x 20, #FFFFFF, fully rounded) with `You` (Geist **Bold** 11, #0A0A0A, 848:21176, centered). It overlaps the lower-left of the Next move card area (card spans y 432-608).

### Recommended exports

Text in the mocks is real product copy but purely decorative; two valid approaches: (A) **rebuild in HTML/CSS** (recommended: crisp at any DPR, copy not in image, cards are simple rectangles/pills) - use the spec above; or (B) export the inner groups as SVG. If exporting, export the **inner cards without their glass containers** and re-create the glass in CSS.

| Asset | Node ID | Format | Notes |
|---|---|---|---|
| Planet / circuit background | **848:16504** | **WebP (and/or AVIF) at 1920x1080 source, ship @1x 1920 w and @2x 3840 w if available**; the Figma source is only 1920x1080 so @2x is an upscale - keep the original 1920x1080 as the master and serve cover-fit | Raster (PNG fill, 1920x1080), photographic/gradient; heavy as PNG. Priority image (LCP) - `priority`/preload. Place full-bleed behind nav+hero, `object-fit: cover`, container 1440x889 at top; scrim overlays. |
| Scrim | 848:16501 | **CSS gradient** (no export) | `linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,.6) 19.231%, rgba(10,10,10,0) 47.596%)` |
| Logo lockup | 848:15950 (icon mark 848:16095, wordmark 848:16269) | **SVG** | Exclude "1 Construction grid" 848:15951. Fills are white. |
| Mira message inner card | **848:21100** | SVG (flattened vectors + live text -> prefer HTML) | 451x99 |
| Accounts inner card | **848:21110** | SVG (prefer HTML/CSS) | 476x245; rows/pills are simple rounded rects |
| Next move inner card | **848:21159** | SVG (prefer HTML/CSS) | 276x150 (includes radius-20 #0A0A0A@55% underlay) |
| Cursor "You" | 848:21173 | SVG | 50x34 |
| Glass containers | 858:141, 858:142, 858:143 | **Do not export** - build in CSS (glass recipe, radius 20, padding 12) | - |

Because the inner cards are flattened vector groups with text, exporting them to SVG may outline or embed the text; if SVG is used, mark `aria-hidden` and ensure the text is not the only source of the product claim.

---

## 6. Orbit lines / dither art

The Hero frame contains **no separate orbit-line or dither layers**. The right column (850:1957) only holds the three glass cards and the cursor (no vector rings, no dither/noise nodes). All decorative planet/lines/circuit artwork is baked into the single raster 848:16504 ("planet blue dark lines circuit"). Export recommendation: just that one raster (WebP/AVIF). If separate orbit/dither layers were expected from the design, they are not in this frame (they may exist in the original generated art / another frame) - flag to design.

---

## 7. Responsive notes (inferred, none in Figma)

- Nav floats centered with 16px top offset and is content-width (801); at narrower viewports it needs max-width + a mobile pattern (not designed).
- Hero is a 12-col row: left cols 1-7, right cols 8-12; the right mock composition is a fixed 524x608 absolute stage - scale or hide below ~1024.
- Headline has fixed 740 width and 72/80 type; needs fluid sizing for smaller viewports (not designed).

---

## Open issues

1. **Screenshots not saved**: `curl` to `https://www.figma.com/api/mcp/asset/...png` fails with `CONNECT tunnel failed, response 403` from the agent proxy (host www.figma.com/api/mcp/asset not allowed). `ref/01-hero.png` and `ref/01-nav.png` do not exist. Figma screenshot URLs generated (short-lived): hero 848:16498 (1440x907 PNG), nav 849:146 (1440x102 PNG); regenerate after the network allowlist includes the host. All asset (SVG/PNG) downloads from the same host are blocked for the same reason.
2. **Headline line count** (2 vs 3 lines) not visually verified (no screenshot); node height 240 suggests 3 lines at 740 width.
3. **Body text colour**: wrapper reports #C4C4C4 under style "Primary/White" while the only text run is #FFFFFF; spec uses #FFFFFF.
4. **Figma `GLASS` effect parameters** (refraction, depth, dispersion) not available via API; CSS approximation only.
5. No hover/focus/error/disabled states for the button, input or nav links; no link targets; no form submit behaviour; no mobile design.
6. "6 cols" layer names vs real 7 + 5 column geometry (section 0).
7. Recia font licence/webfont file needed.
