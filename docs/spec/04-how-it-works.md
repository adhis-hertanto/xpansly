# 04 · How it works

Figma file `Ly0R84ThdJJDDjKsaRWhth`, frame `849:149` "04-How-it-works", 1440 x 1786 (canvas y=1892).
Reference render: `docs/spec/ref/04-how-it-works.png` (1440 x 1786, 1:1).

Grid used throughout: 12 columns, 80 margin, 16 gutter, column 92 (content width 1280; col N starts at x = 80 + (N-1)*108).

## Section frame

| Property | Value |
|---|---|
| Size | 1440 x 1786 |
| Background | Page background, `Primary/Black` #0A0A0A (the root frame fill was not read directly; the sibling 05 section is #0A0A0A and the render is identical black) |
| Padding top | 160 (Header y=160) |
| Header to grid gap | 64 (Header 160..288, Grid starts y=352) |
| Grid | y=352, h=1274 (ends 1626) |
| Padding bottom | 160 (1626 -> 1786) |
| Side margin | 80 |

## Structure tree

```
849:149  Section / 04-How-it-works                      1440x1786
├─ 850:5399  Header                                     x80 y160 1280x128   (flex col, items-center)
│  └─ 850:5403  Headline  [h2 semantic, visually Heading 1]  x108 (abs 188) w1064 h128
│        "One system. Every account. " / (line break) / "Everyone in the room."
└─ 850:5404  Grid                                       x80 y352 1280x1274
   └─ 850:5405  Row 1  (flex-wrap, gap 16, 2 columns x 2 rows)   1280x1274
      ├─ 850:5407  Card 1  "Map the committee"           x0   y0   632x643
      ├─ 848:16660 Card 2  "Read the signals"            x648 y0   632x643
      ├─ 848:16719 Card 3  "Coordinate the next move"    x0   y659 632x615
      └─ 848:16778 Card 4  "Learn from every outcome"    x648 y659 632x615
```

All four cards are named "Card / Map the committee" in Figma (copy-paste naming); treat them as one component `HowItWorksCard` with props `{title, body, illustration}`.

### Card internal structure (identical for all four)

```
Card                       bg #171717 (Neutral/Neutral 900), 1px inside border #262626 (Neutral/Neutral 800), radius 12, overflow clip, flex col, no gap
├─ Text                    x1 y1, 630 wide, padding 28, flex col, gap 12
│  ├─ Title                Heading 2, white
│  └─ Body                 Body Large, #D4D4D4
├─ Divider                 1px high, full width, fill #262626
└─ Illustration            630x456, padding 28 all sides
   └─ mockup stage         574x400, radius 20, overflow clip  (see Mockups)
```

Card heights are content-driven: Text block is 184 tall when body wraps to 3 lines (cards 1, 2), 156 when 2 lines (cards 3, 4). Card = 1 (border) + Text + 1 (divider) + 456 + 1 (border): 643 and 615. Row gap = 16 (row 2 starts y=659). Cards are top aligned (`items-start`), not stretched, so row 1 cards are 643 tall each and row 2 are 615 each.

### Copy (verbatim)

| Node | Role | Text |
|---|---|---|
| 850:5403 | Section headline | `One system. Every account. ` + line break + `Everyone in the room.` (trailing space after "account." then hard break) |
| 850:6266 | Card 1 title | Map the committee |
| 850:6267 | Card 1 body | Xpansly builds a live picture of each target account: who's involved in the decision, what they care about and how engaged they are. |
| 848:16662 | Card 2 title | Read the signals |
| 848:16663 | Card 2 body | Website visits, replies, content and ad engagement, new hires. Mira reads them together and works out what they mean for each account. |
| 848:16721 | Card 3 title | Coordinate the next move |
| 848:16722 | Card 3 body | Mira plans what should happen next for each person, across email, LinkedIn, paid media and your website. |
| 848:16780 | Card 4 title | Learn from every outcome |
| 848:16781 | Card 4 body | Every campaign teaches the system something, so its decisions get sharper the longer you use it. |

There are no numbers, eyebrows or labels on the cards themselves (no "01/02/03/04"). The numbering only appears in the illustration layer names.

## Per-element styles at 1440

| Element | Grid placement | Position / size | Style |
|---|---|---|---|
| Headline 850:5403 | cols 2-11 (x108 within row = 188 abs; 10 cols = 1064) | w1064 h128, two lines, centred | `Landing page/Heading 1`: Recia Medium 54 / 64, ls 0, colour `Primary/White` #FFFFFF, `text-align: center`. Header frame is flex col, `items-center` |
| Card 1 | cols 1-6 | x0 y0, 632x643 | see card recipe |
| Card 2 | cols 7-12 | x648 y0, 632x643 | |
| Card 3 | cols 1-6 | x0 y659, 632x615 | |
| Card 4 | cols 7-12 | x648 y659, 632x615 | |
| Card title | within card | x28 y28 (inside Text), w574 h32 | `Landing page/Heading 2`: Recia Medium 24 / 32, colour #FFFFFF |
| Card body | within card | x28 y72, w574, 84 (3 lines) or 56 (2 lines) | `Landing page/Body Large`: Geist Regular 20 / 28, colour #D4D4D4 (Neutral/Neutral 300) |
| Divider | card full width | y185 (cards 1-2) / y157 (cards 3-4), h1 | fill #262626 |
| Illustration well | card full width | y186 / y158, 630x456 | padding 28, no fill of its own (shows card #171717) |

Card recipe: `background #171717; border 1px solid #262626; border-radius 12px; overflow hidden`. No shadow, no blur, no backdrop-filter on the cards. No hover/interaction state exists in Figma.

Auto-layout summary: Grid = flex col; Row 1 = `flex-wrap`, gap 16, cards fixed `width: 632`; Card = flex col; Text = flex col, gap 12, padding 28.

Text styles / paint styles used in this section: `Landing page/Heading 1`, `Landing page/Heading 2`, `Landing page/Body Large`; `Primary/White` #FFFFFF, `Neutral/Neutral 300` #D4D4D4, `Neutral/Neutral 800` #262626, `Neutral/Neutral 900` #171717.

Fonts: Recia Medium (display serif), Geist Regular, Geist Mono Regular (mockups only).

## Mockups (illustrations)

Each illustration is a pre-composed 574 x 400 stage, radius 20, clipped. They are NOT glass containers: no backdrop blur and no translucent fills. Each stage = a saturated gradient "colour field" + 8px dither squares + a noise texture frame (raster PNG) + a dark "window" (a rounded dark UI panel with its own drop shadow) + floating chips. The dark windows are opaque near-black panels (about #0f0f0f to #161616, 1px lighter border), not glass.

Everything inside the stages is already flattened to vector/raster in Figma (text is live in Figma but rendered as vectors in the code export; the design-context export lists hundreds of `Vector` nodes), so do not rebuild in HTML. Export the whole stage node.

| # | Stage node (export this) | Layer name | Vectors / nodes | Contents | Palette |
|---|---|---|---|---|---|
| 1 | `848:17178` | 02-how-01-map-the-committee 1 | 301 vectors / 346 nodes | Gradient field (indigo -> violet -> magenta/pink top right). Window `848:17437` "Northwind · Buying committee" with traffic-light dots, progress bar "4 of 6 engaged" (5 green segments + 1 grey), 6 rows. Floating chip `848:17510` "Mira added IT Security" with purple Mira icon and "8:02 AM", overlapping window top right | Green #4ade80 (Engaged), amber #f9d423 (Warming), grey #6b6b6b / #a3a3a3 (No signal yet, "New" tag in purple), purple Mira avatar and "New" badge |
| 2 | `848:17835` | 03-how-02-read-the-signals 1 | 278 / 320 | Gradient field (deep navy -> electric blue centre -> cyan/white bottom, noisy). Window `848:18090` "Signals · Northwind · Today", "4 new", 4 signal rows + 1 skeleton row. Overlapping Mira summary card `848:18133` | Per-channel dot colours: Website blue, Email cyan, LinkedIn purple/blue, Hiring purple; green "Saved to account" chip; purple Mira icon |
| 3 | `848:18711` | 04-how-03-coordinate-next-move 1 | 507 / 562 | Gradient field (olive/dark green with yellow-green and white glow at bottom, noisy). Slack-like channel window `848:19192` (left rail with logo/home/DM/activity icons, "# northwind" header, Mira message, plan card with 3 rows, composer), floating approval bar `848:19255` ("3 moves ready", "Edit plan", white "Approve" pill), cursor "You" `848:19265` | Channel dots: Email grey, LinkedIn blue, Website cyan; white Approve pill with #0a0a0a text; purple Mira avatar |
| 4 | `848:19802` | 05-how-04-learn-from-every-outcome 1 | 496 / 526 | Gradient field (burnt orange / copper, dark brown edges, noisy, streak highlights). Memory window `848:20283` ("Mira" "Memory" "Northwind" chip, user message, "Saved to memory" green chip, "Decision confidence" 10-segment bar "Low → High"), floating suggestion card `848:20322` ("Suggestion from Mira", "Not now", white "Update" pill) | Green #4ade80 (Saved to memory), white Update pill, purple Mira avatar |

Sub-layers common to each stage (all children of the stage node): `Stage` (outer clip / base), `Colour field` (2 gradient vectors), `Dither` (8x8 squares at 8px pitch, covering the top-right quadrant, about 200 to 450 tiny vectors), `Frame 158/169/170` (noise PNG overlay: `848:24312`, `848:24314`, `848:24320`, `848:24316`), the window, floating chips, `Stage border`/`Stage outline` (0.5px inset hairline, rendered as vector).

Mockup text styles (for alt text / for a possible DOM rebuild): UI sans = Geist Regular 11-15 (most 13) white; mono labels = Geist Mono Regular 9-12 (timestamps/status 11), colours #6b6b6b (timestamps, placeholder), #a3a3a3 (tags, labels), #e5e5e5 (initials), status green #4ade80 / amber #f9d423; Approve/Update/You labels #0a0a0a on white.

Mockup-internal copy (verbatim, for alt text):
- 1: Northwind · Buying committee; 4 of 6 engaged; rows CFO (MR) Engaged, CTO (JT) Warming, Head of Marketing (SK) Engaged, RevOps lead (DL) Engaged, IT Security (AP) [New] No signal yet, End users (+9) Engaged; chip: Mira added IT Security 8:02 AM
- 2: Signals · Northwind · Today; 4 new; 8:02 AM Pricing page, three visits [Website]; 7:48 AM Reply from the CFO [Email]; 7:15 AM Ad engagement, Head of Marketing [LinkedIn]; 6:30 AM New RevOps lead hired [Hiring]; summary: Mira 8:04 AM, Account summary, "Northwind is moving towards a decision." "Finance and marketing are engaged." [Saved to account] From 4 signals
- 3: # northwind (3 members); Mira APP 8:02 AM "Next moves for Northwind are ready. Send RevOps the integration guide and retarget IT Security on LinkedIn."; plan rows RevOps lead [Email], IT Security [LinkedIn], CFO [Website]; composer "Message #northwind"; approval bar: 3 moves ready, Edit plan, Approve; cursor label "You"
- 4: Mira, Memory, Northwind; user message "FYI, Northwind's CFO only replies to pricing content."; Saved to memory; Decision confidence, Low → High; suggestion: "Suggestion from Mira" / "Lead CFO outreach with pricing content?" Not now / Update

### Export recommendation

Recommend **raster export, AVIF with WebP fallback, at @2x (1148 x 800), one image per stage**, with the 20px radius applied in CSS (`border-radius: 20px; overflow: hidden`) or baked in with transparent corners (prefer CSS). Rationale: each stage contains 280 to 510 tiny vector tiles plus a noise PNG overlay and large soft gradients with window drop shadows; a single SVG would be several hundred KB to over 1 MB with filter effects and would rasterise inconsistently. Complexity: high for all four (3 and 4 highest). Fallback if crispness of text matters: export the stage at @3x. Do not export as SVG unless the noise overlay (`Frame 15x`) is dropped. Use `next/image` with explicit 574x400 and `sizes` so mobile can scale; add meaningful `alt` text from the mockup-internal copy above. Window drop shadow is inside the export (no CSS shadow needed).

Optional higher-fidelity path (not recommended): export `Colour field` + `Dither` as a background raster and rebuild the window UI in HTML/CSS, to get live text and a11y. Tokens needed would be: window bg approx #121212, border #262626, text styles as above.

## Responsive notes (not in Figma; only 1440 designed)

Only the 1440 desktop frame exists. Reasonable defaults: cards collapse to 1 column below about 900; keep the 28 padding and keep the 574:400 aspect ratio on the stage; reduce Heading 1 54/64 and Heading 2 24/32 proportionally.

## Unresolved / assumptions

1. Root fill of frame 849:149 not read directly (assumed #0A0A0A).
2. Exact hex values of the gradient fields, window panel fills, and the purple Mira colour are baked into flattened vectors (no paint style); they are visible only in the render. Sample from the exported images if needed (Mira purple appears approx #6D3FD9).
3. Card 3 and 4 stage nodes have Stage width 574, but cards 1 and 2 `Stage` vector is 640 wide and clipped to 574 (design artefact; export the 574 x 400 parent only).
4. Illustrations ship as flattened art; no hover/animation specified. Confirm whether the dither or windows are meant to animate on scroll.
5. Screenshot PNG is a direct canvas render at 1440 wide (capped well within the maxDimension request).
