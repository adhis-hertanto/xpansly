# 07 - Who it's for

Figma file `Ly0R84ThdJJDDjKsaRWhth`.
Default frame: `07-Who-its-for` `849:152` (1440 x 1132).
Hover states: section `Who it's for states` `863:140`.
- State 1: `860:138` "Hover (B2B SaaS and tech)".
- State 2: `860:970` "Hover (Agencies)".

Reference PNGs (1440 wide, 1x):
- `ref/07-who.png` (default)
- `ref/07-state-1.png` (B2B hovered)
- `ref/07-state-2.png` (Agencies hovered)

## 1. Structure

```
07-Who-its-for (849:152)  1440 x 1132, flex col, padding 160 / 80, page bg #0A0A0A (Neutral 950)
└─ Content (850:4474)  1280 x 812, flex col, gap 64
   ├─ Header (850:4475)  1280 x 128
   │   └─ Heading (850:4479)  2 lines, left aligned, 674 wide
   └─ Body (850:4480)  flex col, gap 40
      ├─ Cards (850:4481)  1280 x 560, flex row, gap 16, overflow clip
      │   ├─ Card / B2B SaaS and tech (850:4482)
      │   │   ├─ Image (850:4483)  full-bleed
      │   │   └─ Glass / Info (862:138)
      │   │       └─ Info (850:4885)  label + title
      │   └─ Card / Agencies (850:4888)
      │       ├─ Image (850:4889)  full-bleed
      │       └─ Glass / Info (862:139)
      │           └─ Info (850:5291)  label + title
      └─ Notes (850:5294)  3 inline notes, gap 32
```

Section vertical padding is 160 top and bottom (content 812 + 320 = 1132).
The frame has no own background fill in the default frame; the hover frames explicitly use `#0A0A0A`. Use `#0A0A0A` as the page background.

## 2. Copy (verbatim)

| Element | Text |
|---|---|
| Heading (2 lines, hard break after "the") | `Built for B2B tech, and the` / `agencies that grow it.` |
| Card 1 label | `B2B SaaS and tech` (rendered uppercase via text-transform; source casing is as written) |
| Card 1 title (Heading 2) | `From founder-led to full marketing teams` |
| Card 1 body (hover only) | `Whether you're a founder running growth without a marketing hire or a marketing leader with a full team, Xpansly gives you one system to win the accounts that matter.` |
| Card 2 label | `Agencies` (rendered uppercase) |
| Card 2 title (Heading 2) | `Growth partners for B2B tech` |
| Card 2 body (hover only) | `Run account-based growth for your B2B tech clients from one system, and show them results they can take to their own board.` |
| Note 1 | `GDPR-native` (uppercase render) |
| Note 2 | `Built in the UK` (uppercase render) |
| Note 3 | `Human approval on every move` (uppercase render) |

Apostrophes in the body copy are straight (`'`) in Figma.

## 3. Text styles and colours

All text colours are paint styles from the Figma file.

| Element | Node ID(s) | Text style | Font | Size / line-height | Paint style | Hex |
|---|---|---|---|---|---|---|
| Heading | 850:4479 | Landing page/Heading 1 | Recia Medium (500) | 54 / 64, ls 0 | Primary/White | `#FFFFFF` |
| Audience label | 850:4886, 850:5292 | Landing page/Label | Geist Mono Regular (400), uppercase | 14 / 20, ls 0 | Neutral/Neutral 400 | `#A3A3A3` |
| Card title | 850:4887, 850:5293 | Landing page/Heading 2 | Recia Medium (500) | 24 / 32, ls 0 | Primary/White | `#FFFFFF` |
| Card body (hover) | 860:969, 860:1801 | Landing page/Body | Geist Regular (400) | 18 / 28, ls 0 | Neutral/Neutral 300 | `#D4D4D4` |
| Note label | 850:5297, 850:5300, 850:5303 | Landing page/Label | Geist Mono Regular, uppercase | 14 / 20 | Neutral/Neutral 400 | `#A3A3A3` |
| Note dot | 850:5296, 850:5299, 850:5302 | n/a | n/a | 8 x 8 square (no radius in code output; metadata says rounded-rectangle, treat as 8px square, radius 0) | Purple/Purple 300 | `#C769FF` |

## 4. Layout at 1440 and grid placement

Grid: 12 columns, 80 margin, 16 gutter, column width 92. Content width 1280. Column n starts at x = 80 + (n-1) x 108.

Default state:
- Card 1: x 0 to 632 (content-relative), 632 x 560. Spans columns 1-6.
- Card 2: x 648 to 1280, 632 x 560. Spans columns 7-12.
- Gap between cards: 16 (one gutter).
- Both cards `flex: 1 0 0` with `min-width: 1px`, so each is half of the row minus the gap.

Other measurements:
- Heading block: 1280 x 128, text box 674 x 128 (2 lines x 64).
- Header to Body spacing: 64.
- Cards row to Notes: 40 gap. Notes row height 20, y 600 inside Body.
- Notes: three items with gap 32 between them; each is dot (8 x 8) + 8 gap + label, vertically centred. Item widths 109, 142, 252. Note: the notes row is left aligned, 567 wide.

## 5. Card recipe

Card (`Card / ...`):
- Fill `#171717` (Neutral 900), 1px border `#262626` (Neutral 800), radius 16.
- Padding 8, flex column, `justify-content: flex-end`, overflow clip, height 560.
- Image layer (`Image` node) is absolutely positioned at inset -1px (it covers the border box), `object-fit: cover`, no overlay in the code output.
- Glass panel sits in the normal flow at the bottom of the card (inside the 8px padding), i.e. 8px from the left, right and bottom edges of the card (Figma x 9 / y 411 includes the 1px border).

## 6. Glass info panel recipe

Used on both cards and on the form card in section 08.

Outer `Glass / Info`:
- Fill `rgba(255,255,255,0.06)`.
- `backdrop-filter: blur(8px)`.
- 1px border `rgba(255,255,255,0.16)`.
- Radius 20.
- Padding 12 (flex column).
- Default width: fills the card (614 inside a 632 card with 8 padding and 1 border; 100% of the content box).

Inner `Info`:
- Fill `#0A0A0A` (Neutral 950), 1px border `#262626` (Neutral 800), radius 12.
- Padding 24, overflow clip.
- Flex column, items start.
- Default gap 12 (label then title). Hover gap 16 (label, title, body).
- Default height 114 (24 + 20 + 12 + 32 + 24 + borders), glass 140.

The screenshots show a bevelled, light highlight along the glass edge. The MCP code output contains no shadow or gradient-stroke values beyond the 1px rgba border, so the bevel is believed to come from the backdrop blur over the image plus that border. Not verified in Figma effects; flag for visual QA against the PNGs.

## 7. Default vs hover layouts

Hover trigger: pointing at a card expands it and collapses the other. The two states are mirror images. No transition values are specified in Figma (no prototype data read); suggested 300-400ms ease on `flex-basis`/width and opacity, to be confirmed.

| Property | Default | Hovered card | Non-hovered card |
|---|---|---|---|
| Card width | 632 each (flex 1) | 1064 | 200 |
| Column span (col n = 108n - 16 px) | 6 + 6 (cols 1-6 / 7-12) | 10 columns = 1064: cols 1-10 (B2B) or cols 3-12 (Agencies) | 2 columns = 200: cols 11-12 (when B2B hovered) or cols 1-2 (when Agencies hovered) |
| Card height | 560 | 560 | 560 |
| Card opacity | 1 | 1 | 0.40 (whole card, including its image) |
| Card x (content-relative) | 0 / 648 | B2B: 0 / Agencies: 216 | B2B collapsed: 0 / Agencies collapsed: 1080 |
| Glass panel | visible, full card width, 140 high | visible, fixed width 440 (outer), 304 high (B2B) or 272 high (Agencies) | hidden (`hidden="true"`, frame 862:141 / 862:142 retained but not shown) |
| Panel position | bottom, flush inside 8px padding | bottom-left, x 9, y 247 (B2B) / y 279 (Agencies) | n/a |
| Info gap | 12 | 16 | n/a |
| Body copy | not present | present | n/a |

Widths add up: 1064 + 16 + 200 = 1280.

Hovered panel details:
- Outer glass width 440 (inner Info 414 wide, text column 364 wide after 24 padding + borders).
- Label (20) + 16 + title (B2B: 2 lines = 64; Agencies: 1 line = 32) + 16 + body (4 lines = 112 for both, 364 wide).
- B2B: Info height 278, glass 304.
- Agencies: Info height 246, glass 272.
- Title wraps within 364: "From founder-led to full / marketing teams" (2 lines), "Growth partners for B2B tech" (1 line).

Header and Notes are identical in all three states.

State node IDs:

| Item | State 1 (B2B hovered) | State 2 (Agencies hovered) |
|---|---|---|
| Frame | 860:138 | 860:970 |
| Card / B2B SaaS and tech | 860:147 (1064 wide) | 860:979 (200 wide, opacity 0.4) |
| Card / Agencies | 860:553 (200 wide, opacity 0.4) | 860:1385 (1064 wide) |
| Glass / Info visible | 862:140 | 862:143 |
| Glass / Info hidden | 862:141 | 862:142 |
| Card body | 860:969 | 860:1801 |

## 8. Images (full-bleed card backgrounds)

| Card | Image node (default) | Image node (hover states) | Fit |
|---|---|---|---|
| B2B SaaS and tech | `850:4483` | 860:148 (hovered), 860:980 (collapsed) | `object-fit: cover`, centre |
| Agencies | `850:4889` | 860:1386 (hovered), 860:554 (collapsed) | `object-fit: cover`, centre |

Source rasters (Figma raw fills):
- B2B SaaS and tech: JPEG, **1264 x 711** native (two men in discussion at a table, glass wall behind).
- Agencies: JPEG, **1263 x 837** native (people in a meeting room with a glass partition).

Render sizes:
- Default box: 632 x 560 (plus 1px bleed each side, 634 x 562 effective). Cover scales by max(634/1264, 562/711) = 0.79 for B2B; the image is therefore displayed height-fitted and cropped horizontally.
- Hovered box: 1064 x 560. B2B scale 0.84, Agencies scale 0.84.
- Because the same element resizes between 632 and 1064, use one `<img>` with `object-fit: cover` and animate the container, not two separate images.

Export guidance:
- Native resolution is below a true 2x of the 1064 x 560 hovered box (2128 x 1120). Do not upscale. Export WebP and AVIF at native resolution (1264 x 711 and 1263 x 837), which gives about 1.19x on the 1064-wide hovered box, with `sizes` set accordingly. If crisper assets are wanted for retina, ask design for 2128 x 1120+ originals.
- Different crop alignments appear between states in the screenshots (B2B shows more of the image when expanded). That is just `cover` with a different box aspect ratio; both states reference the same fill. Verify the focal point (both subjects sit roughly centre) and set `object-position: center`.
- Alt text: Figma has `alt=""` (decorative). Keep decorative since the labels carry the meaning.

## 9. Implementation notes

- The hover expansion should also be focus/keyboard reachable (cards are not interactive links in the design; consider `tabindex=0` with `:focus-visible` mirroring hover). Touch/mobile behaviour is not designed; propose stacking cards with the full panel visible below 768px.
- Glass panel in default state is full width of the card; in hover state it is a fixed 440 box anchored bottom-left. Animate width 100% to 440px and show/hide body copy with opacity.
- Heading wraps by explicit line break at 1440; on narrower viewports let it wrap naturally.
