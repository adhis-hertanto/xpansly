# 08 - CTA + Footer

Figma file `Ly0R84ThdJJDDjKsaRWhth`, frame `08-CTA-Footer` `848:24337` (1440 x 1083).
Reference: `ref/08-cta-footer.png` (1440 x 1083, 1x).

## 1. Structure

```
08-CTA-Footer (848:24337)  1440 x 1083, flex col
├─ Background art (848:24333)  "xpansly-wave-ember-dark-dither-pix-1520x980 1"  absolute, 0,0, 1440 x 1083, cover
├─ Scrim (848:24335)  absolute, 1440 x 1082, vertical gradient
├─ 08-CTA (849:153)  1440 x 998, flex col, items centre, padding 184 top / 160 bottom / 80 sides
│  └─ Content / CTA (850:1239)  632 wide, flex col, gap 48, centred (x 404)
│     ├─ Intro (850:1240)  flex col, gap 16, centred text
│     │   ├─ Heading block (850:1241)  flex col, gap 16, items centre
│     │   │   ├─ Chip / Eyebrow (850:1242)
│     │   │   └─ Headline (850:1245)
│     │   └─ Body (850:1246)
│     └─ Glass / Form card (861:138)  632 x 400
│        └─ Form card (850:1247)
│           ├─ Fields (850:1248)
│           │   ├─ Row / Name + Email (850:1249)
│           │   └─ Row / Company + Role (850:1250)
│           └─ Actions (850:1265)
│               ├─ Button / Request early access (850:1266)
│               └─ Caption (850:1268)
└─ 09-Footer (849:154)  1440 x 85, border-top 1px #262626
    └─ Copyright (850:155)
```

Grid: the 632 px content column equals 6 grid columns (12 col, 80 margin, 16 gutter, col 92), i.e. columns 4-9 (x 404 to 1036). Everything inside is centred in it.

## 2. Background art

| Layer | Node | Detail |
|---|---|---|
| Image | `848:24333` | Full frame 1440 x 1083, `object-fit: cover`. It spans CTA and footer (dark ember wave arc with a dithered pixel-square grid in the lower half, warm orange glow on near-black). |
| Scrim | `848:24335` | 1440 x 1082 (inset 0 0 1px 0), `linear-gradient(to bottom, #0A0A0A 0%, rgba(10,10,10,0.6) 19.231%, rgba(10,10,10,0) 47.596%)`. Darkens the top so the chip, headline and body sit on near-black. |

Source raster for the image node (two raw fills on the node):
- `1520 x 980` PNG, RGBA, about 3.4 MB. This matches the layer name "...1520x980" and is the art to use.
- A second raw fill, `380 x 245` PNG (about 237 KB), is a quarter-scale copy of the same art. Treat it as a leftover / preview; not needed.

Cover math: scale = 1083 / 980 = 1.105, rendered about 1680 x 1083, cropped about 120 px each side. The native art is therefore about 0.9x of the 1x display height; there is no headroom for a 2x export, so ship at native resolution. Export as AVIF and WebP (PNG source has dither noise; use a high quality setting, e.g. AVIF q 60-70 / WebP q 85, and compare, since dither/grain compresses poorly and low quality will smear the pixel squares). Use as a CSS background or `next/image` with `fill` + `object-fit: cover`, `priority` not needed (below the fold), and keep `alt=""` (decorative).

The 1083 total height = 998 CTA + 85 footer. The art continues behind the footer, so the footer must be transparent (no background).

## 3. Eyebrow chip

Node `850:1242`, 248 x 38, centred above the headline.
- Fill `rgba(255,255,255,0.06)`, `backdrop-filter: blur(8px)`, 1px border `rgba(255,255,255,0.16)`, radius 999.
- Padding 8 vertical, 12 left, 16 right; gap 8; items centred.
- Marker `850:1243`: 8 x 8 solid square, fill Tertiary/Green `#45B649`, no radius (SVG `M8 0H0V8H8V0Z`).
- Label `850:1244`: `Now opening early access` (uppercase render).

## 4. Heading and body

| Element | Node | Copy | Text style | Font | Size / LH | Paint style | Hex | Align / width |
|---|---|---|---|---|---|---|---|---|
| Headline | 850:1245 | `Be first in.` | Landing page/Display | Recia Medium (500) | 72 / 80, ls 0 | Primary/White | `#FFFFFF` | centre, no wrap, 349 x 80 |
| Body | 850:1246 | `We're opening Xpansly to a small group of B2B tech teams first. Tell us a little about you and we'll be in touch personally.` | Landing page/Body Large | Geist Regular (400) | 20 / 28, ls 0 | Neutral/Neutral 300 | `#D4D4D4` | centre, 568 wide (2 lines), box offset 32 inside 632 |
| Eyebrow label | 850:1244 | `Now opening early access` | Landing page/Label | Geist Mono Regular (400), uppercase | 14 / 20 | Neutral/Neutral 400 | `#A3A3A3` | n/a |

Spacing: chip to headline 16, headline block to body 16, intro to form card 48. Apostrophes are straight.

## 5. Form card (glass wrapped)

Outer `Glass / Form card` `861:138`: same glass recipe as section 07.
- Fill `rgba(255,255,255,0.06)`, blur 8, 1px border `rgba(255,255,255,0.16)`, radius 20, padding 12, width 632.

Inner `Form card` `850:1247`:
- Fill `#171717` (Neutral 900), 1px border `#262626` (Neutral 800), radius 12.
- Padding 32, flex column, gap 24. Width 606 (632 minus 2 x 12 padding minus borders), inner content 540.
- Height 374 (outer glass 400).

Fields `850:1248`: flex column, gap 24, two rows.
- Row `Name + Email` `850:1249`, row `Company + Role` `850:1250`: flex row, gap 24, each field `flex: 1 0 0` (258 wide each, 540 total), row height 84.
- Each field: flex column, gap 8, label above input.

| Field | Node | Label (verbatim, Figma casing) | Control | Placeholder |
|---|---|---|---|---|
| Name | 850:1251 / input 850:1253 | `Name` | text input | none in Figma (empty) |
| Work email | 850:1254 / input 850:1256 | `Work email` | text input (use `type="email"`) | none in Figma (empty) |
| Company | 850:1257 / input 850:1259 | `Company` | text input | none in Figma (empty) |
| Role | 850:1260 / input 850:1262 | `Your role` (note: label text is "Your role", frame/layer name says "Role") | **select** (dropdown with chevron) | `Choose your role` |

Notes:
- Role is a select / combobox: it has a right-aligned chevron and a placeholder-styled value. The option list is not designed; copy for options is not in Figma and must come from the client. Use a native `<select>` (or accessible custom listbox) with a disabled empty option reading "Choose your role".
- The three text fields show no placeholder in the design; keep empty (labels carry the meaning).
- No error, focus, filled or disabled states are designed. Suggest focus ring using white or `#A3A3A3` border; flag for design review.

Label style (all four): `Landing page/Label` (Label Small), Geist Mono Regular 14 / 20, uppercase, Neutral/Neutral 300 `#D4D4D4`, nodes 850:1252, 850:1255, 850:1258, 850:1261.

Input styling (`Input / ...`, 258 x 56):
- Fill `#171717` (Neutral 900), 1px border `#404040` (Neutral 700), radius 8.
- Height 56, horizontal padding 16, content centred vertically.
- Entered text style is not shown (inputs are empty). Reasonable default: Landing page/Body (Geist 18/28) in white; confirm with design.
- Role select placeholder `850:1263`: Landing page/Body, Geist Regular 18 / 28, Neutral/Neutral 400 `#A3A3A3`, at x 17.
- Chevron `850:1264`: 10 x 5 stroke-only vector, stroke `#A3A3A3`, 1.5 px, right aligned with 16 px padding (`justify-between`). Path: `M0.53033 0.53033L5.53033 5.53033L10.5303 0.53033`, viewBox 11.06 x 6.59. Inline SVG.

## 6. Actions

`Actions` `850:1265`: flex column, gap 20, width 540.

Primary button `Button / Request early access` `850:1266` (component instance):
- Full width 540 x 52, fill `#FFFFFF` (white), radius 4, padding 0 / 24, label centred.
- Label `Request early access`, text node `I850:1266;849:156`: Landing page/Body, Geist Regular 18 / 28, Primary/Black `#0A0A0A`.
- This is the "Primary" button variant (the same component used elsewhere on the page; there is also `ref/button.png`).
- Hover/focus/disabled states not part of this extraction.

Caption `850:1268`:
- Copy `No spam. Just a personal note when your place is ready.`
- Landing page/Label (Label Small), Geist Mono Regular 14 / 20, Neutral/Neutral 400 `#A3A3A3`, centred, full width, not uppercase.

## 7. Footer

Frame `09-Footer` `849:154`: 1440 x 85, flex row, centred, padding 32 / 80, border-top 1px `#262626` (Neutral 800), transparent fill (art shows through).

Copyright `850:155`, one text node with three runs:
`© 2026 Xpansly · GDPR-native · Built in the UK · Privacy Policy`
- Runs in Figma: `© 2026 Xpansly · GDPR-native · Built in the UK ` / `· ` / `Privacy Policy`. Joined, the verbatim string is exactly as above (middle dot `·`, U+00B7, single spaces).
- Style: Landing page/Label (Label Small), Geist Mono Regular 14 / 20, Neutral/Neutral 400 `#A3A3A3`, not uppercase, centred (text box 529 x 20).
- `Privacy Policy` has no distinct link styling in the design; build as a link to the privacy page with the same colour, underline or `#FFFFFF` on hover (not designed).
- **No footer logo exists in the Figma frame.** There is no logo node in 08-CTA-Footer; do not add one.

## 8. Colour and style summary (section 08)

| Token | Hex |
|---|---|
| Primary/White | `#FFFFFF` |
| Primary/Black | `#0A0A0A` |
| Neutral/Neutral 300 | `#D4D4D4` |
| Neutral/Neutral 400 | `#A3A3A3` |
| Neutral/Neutral 700 | `#404040` |
| Neutral/Neutral 800 | `#262626` |
| Neutral/Neutral 900 | `#171717` |
| Tertiary/Green | `#45B649` |
| Glass fill / border | `rgba(255,255,255,0.06)` / `rgba(255,255,255,0.16)`, blur 8 |

Text styles used: Landing page/Display (Recia Medium 72/80), Landing page/Body Large (Geist 20/28), Landing page/Body (Geist 18/28), Landing page/Label and Label Small (Geist Mono 14/20, identical metrics).

## 9. Implementation notes

- Form submission target, validation and success state are not designed; the page needs a handler (early-access list) and a confirmation message.
- Fields stay two-up at 1440. Stack to one column on mobile (inputs full width, role select stays a select).
- Recia is Medium 500 only; Geist Regular 400 only; Geist Mono Regular 400 only.
