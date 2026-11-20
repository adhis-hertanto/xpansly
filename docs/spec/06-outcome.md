# 06 - The outcome (spec @ 1440)

Source: Figma file `Ly0R84ThdJJDDjKsaRWhth`

- Full-page section: `849:151` "06-The-outcome" (page position x0 y4518, 1440 x 2225).
- State artboards live in section `863:139` "Outcome states":
  - State 1 (Reporting): `848:21178`
  - State 2 (Forecast): `856:139`
  - State 3 (Source of truth): `856:234`

References in `docs/spec/ref/`:

- `06-outcome.png` (the section as in the full page, state 1)
- `06-state-1.png`, `06-state-2.png`, `06-state-3.png`

Section height check: 160 pt + 244 header + 64 gap + 1469 columns + 288 pb = 2225.

## 1. Structure tree

```
849:151  06-The-outcome            section, 1440x2225, flex-col, gap 64, pt 160 / pb 288 / px 80
  850:5305  Header                 1280x244, flex-col, gap 32, items-center
    850:5306  Eyebrow + Headline   1280x128 (contains ONLY the headline; no eyebrow text exists in Figma)
      850:5310  Headline           h2 (Heading 1 style)
    850:5311  Body                 p, 632 wide
  850:5312  Columns                1280x1469, flex-row, gap 16
    850:5313  Column / Forecast panel   632 wide, flex-col, gap 20   (STICKY LEFT)
      848:24348  Panel / Pipeline by account   632x540  (panel image, state-dependent)
      850:5379   Tabs                          632x34   (3 tabs)
        850:5380 Tab / Reporting
        850:5382 Tab / Forecast
        850:5384 Tab / Source of truth
    850:5386  Column / Outcomes    632 wide, pl 48, flex-col  (RIGHT, scrolls)
      850:5387  Item / Account-level reporting   584x560
      850:5391  Item / Forecast with confidence  584x560
      850:5395  Item / One source of truth       584x349 (auto height)
```

Semantic roles:

- section `aria-labelledby` headline
- h2 headline
- p lede
- left: a tablist (3 tabs) controlling a panel image (`role="tabpanel"`, image with alt text)
- right: ordered list of 3 items (`ol > li`, each with number / h3 / p)

State artboard node IDs for the same pieces:

| Piece | State 1 (848:21178) | State 2 (856:139) | State 3 (856:234) |
|---|---|---|---|
| Header | 848:24728 | 848:24733 | 848:24738 |
| Columns | 848:21186 | 856:147 | 856:242 |
| Panel container | 848:21188 | 856:149 | 856:244 |
| Panel bg PNG (Frame 158/169) | 848:24338 | 848:24340 | 848:24346 |
| Panel stage image frame (720x560) | 848:22027 | 848:23177 | 848:23942 |
| Tabs | 848:21253 | 856:214 | 856:309 |
| Outcomes column | 848:21260 | 856:221 | 856:316 |

(Full-page equivalents for state 1: panel `848:24348`, bg `848:24349`, stage frame `848:24350`.)

## 2. Copy (verbatim)

Headline (2 lines in Figma, the break is natural wrapping at 1280 wide; the first line is "A pipeline number you can"):

> A pipeline number you can stand behind.

Body:

> Report on accounts and the people deciding, not clicks. When the board asks what's going to close, you'll have the answer and the evidence behind it.

Tabs (labels): `Reporting` | `Forecast` | `Source of truth`

Items:

| # | Title | Body |
|---|---|---|
| 01 | Account-level reporting | See pipeline by account and by committee, with every person's engagement in one view. |
| 02 | Forecast with confidence | Know which accounts are moving towards a decision, and how sure you can be about each one. |
| 03 | One source of truth | One data layer underneath everything, so the numbers match wherever you look. |

Node IDs for the text (full page / state 1 / state 2 / state 3):

| Text | 849:151 | 848:21178 | 856:139 | 856:234 |
|---|---|---|---|---|
| Headline | 850:5310 | 848:24730 | 848:24735 | 848:24740 |
| Body | 850:5311 | 848:24731 | 848:24736 | 848:24741 |
| Item 1 number/title/body | 850:5388/5389/5390 | 848:21262/63/64 | 856:223/224/225 | 856:318/319/320 |
| Item 2 number/title/body | 850:5392/5393/5394 | 848:21266/67/68 | 856:227/228/229 | 856:322/323/324 |
| Item 3 number/title/body | 850:5396/5397/5398 | 848:21270/71/72 | 856:231/232/233 | 856:326/327/328 |

## 3. Layout at 1440 (12-col grid: 80 margin, 16 gutter, col 92)

Column n starts at x = 80 + (n-1)*108. A span of k columns is k*92 + (k-1)*16 wide.

| Element | Box (section-relative) | Grid |
|---|---|---|
| Section | 1440 x 2225, bg page (#0A0A0A, as the page shows; not a section fill in this node) | full bleed |
| Header | x80 y160, 1280x244 | cols 1-12 |
| Headline | x0 y0 of header, 1280x128, centred | cols 1-12 |
| Body | header-relative x324 y160, 632x84, centred, 3 lines | cols 4-9 (6 cols = 632) |
| Columns | x80 y468, 1280x1469, gap 16 | cols 1-12 |
| Left column (panel + tabs) | x0 of columns, 632 wide | cols 1-6 (6 cols = 632) |
| Right column | x648 of columns, 632 wide, pl 48 | cols 7-12 |
| Right item content | x696 (648+48), 584 wide | inset 48 inside cols 7-12 |

Vertical rhythm:

- Section padding: top 160, bottom 288, sides 80.
- Gaps: 32 (headline to body), 64 (header to columns), 20 (panel to tabs), 16 between tabs, 16 between number/title/body.
- Item (outcomes) heights: 560, 560, 349 (the last is auto: 1 border + 208 pt + 20 + 16 + 32 + 16 + 56 = 349).

## 4. Typography and colour

All colours are Figma paint styles, with hex values read from the design.

| Element | Text style | Colour (paint style, hex) | Notes |
|---|---|---|---|
| Headline | Landing page/Heading 1: Recia Medium 54/64, ls 0 | Primary/White #FFFFFF | centred |
| Body | Landing page/Body Large: Geist Regular 20/28, ls 0 | Neutral/Neutral 300 #D4D4D4 | centred, 632 wide |
| Tab label | Landing page/Label Small (Geist Mono Regular 14/20, ls 0); also used as "Landing page/Label" on the state 1 tabs | active White #FFFFFF; inactive Neutral 400 #A3A3A3 | not uppercase, nowrap |
| Item number | Geist Mono Regular 14/20 (Label Small), UPPERCASE | active White #FFFFFF; inactive Neutral 400 #A3A3A3 | "01" etc. |
| Item title | Landing page/Heading 2: Recia Medium 24/32 | active White #FFFFFF; inactive Neutral 400 #A3A3A3 | |
| Item body | Landing page/Body Large: Geist Regular 20/28 | active Neutral 300 #D4D4D4; inactive Neutral 400 #A3A3A3 | |

Fonts: Recia (Medium 500) for headings, Geist (Regular 400) for body, Geist Mono (Regular 400) for labels and tabs.

## 5. Left sticky panel

Container recipe, `Panel / Pipeline by account` (848:24348 on the full page):

- Size 632 x 540, `border-radius: 12px`, `overflow: hidden`, `padding: 32px`.
- Fill Neutral/Neutral 900 `#171717`; border 1px solid Neutral/Neutral 800 `#262626`.
- No blur, shadow or glass effect on the container (the "glass" look is baked into the raster bg).
- Layers inside (the full-page node IDs; the state artboards use the IDs in the table in section 1):
  1. Frame 158 (`848:24349`): absolute at -1,-1, 633x540, a PNG fill with `object-fit: cover`. Source raster is 1520x1520 RGBA and about 4.9 MB (heavy: dithered noise and colour glow). This is the state-dependent coloured background (purple/blue in state 1, blue in state 2, green in state 3).
  2. Stage image frame (`848:24350`, 720x560, `overflow: clip`) placed in the padding box at offset 33,33. It contains the faux app UI, which is **cropped by the panel**: the visible region is 599x507, and the right and bottom edges bleed off the panel on purpose (this is the intended look; see `06-outcome.png`). The stage card is `#111111` fill, `#1F1F1F` 1px stroke, radius about 20.
- Mock UI palette (baked, for reference): header strip with the purple sparkle Mira avatar (22x22), status pill with a `#4ADE80` Geist Mono 11 label, dither squares 6x6 on an 8px pitch, inner window bg near-black with `#6B6B6B` mono URL text, row labels `#A3A3A3` / white, "You" cursor tag white pill with `#0A0A0A` 12px text.

Sticky behaviour (inferred; there are no prototype links in the file):

- The panel + tabs column (632 x 594) is sticky. In the state artboards the panel moves to y=560 (state 2) and y=1120 (state 3) inside the column, i.e. its top lines up with the top border of the active item. Each right item is a 560px "step", and the panel (540) is vertically centred against the text block of the active item (text block centre at about 270).
- Recommend `position: sticky; top: <(100vh - 594)/2 or ~ 80-120px>` on the left column, with the active item determined by an IntersectionObserver on the three items. Tabs also act as controls (click scrolls to the matching item).

### Panel image to export, per state

| State | Panel node to export (state artboard) | Equivalent in full page | Stage frame only (720x560, clipped to 599x507) | What differs |
|---|---|---|---|---|
| 1 Reporting | `848:21188` (or `848:24348`) | `848:24348` | `848:22027` / `848:24350` | Bg purple/blue. Header: "Weekly reporting" (white) + "· Mira is compiling" (#A3A3A3), pill "Live" (green dot, #4ADE80). URL `app.xpansly.com/reports`. Sidebar active "Reports". Table "Pipeline by account", dropdown "This quarter", button "Export", cols "Account" / "Buying committee engaged", rows Northwind 4 of 6, Argo Data 5 of 6, Helix Cloud 2 of 6, Pallas AI 1 of 6, footer "4 accounts · 12 of 24 people engaged", "You" cursor tag. |
| 2 Forecast | `856:149` | n/a | `848:23177` | Bg blue. Header "Quarterly forecast" + "· Mira is scoring", pill "Updated 8:02 AM". URL `app.xpansly.com/forecast`, sidebar active "Forecast". Title "Forecast · This quarter", legend "Committed" / "Forecast range", bar chart (Oct, Nov, Dec; "Today" marker; y labels £1.2m, £600k). Rows Northwind £420k "from Medium" High (green pill); Helix Cloud £180k Medium (yellow); Pallas AI £95k Low (orange). Note card: "Mira 8:02 AM" "Northwind moved from Medium to High after the CFO replied." |
| 3 Source of truth | `856:244` | n/a | `848:23942` | Bg green. Header "Data sync" + "· Mira is reconciling", pill "5 sources synced". URL `app.xpansly.com/data`. Title "Connected sources", "Last sync 8:02 AM". Source chips CRM, Ads, Email, Website, LinkedIn connected by curves into the "Xpansly / Data layer" node ("1 model · 5 sources"), then the "Pipeline · Northwind £420k" card with "Matches CRM" chip and rows "Forecast £420k", "Board report £420k". |

Shared across states: panel size and position inside the column, container recipe, header strip structure and Mira avatar, stage card, window chrome (title bar with three dots and URL pill), dither strip at the top right.

Export recommendation (do not embed text as live HTML; it is illustration):

- Export each of the three panel nodes above as one **raster @2x** (1264 x 1080), **AVIF with WebP fallback** (e.g. `outcome-panel-1|2|3.avif/.webp`). The background PNG is 1520x1520 noise (about 4.9 MB raw) and would blow up an SVG, so SVG for the full panel is not recommended.
- Apply the container `border-radius: 12px` and `overflow: hidden` in CSS. The 1px #262626 border is also in the node, so either crop it at export or keep the CSS border and export without it (inset 1px) to avoid a double border.
- Alternative, if finer control is wanted: bg = Frame 158 / 169 / 158 (`848:24349` / `848:24340` / `848:24346`) as AVIF/WebP, and the stage = SVG export of `848:24350` / `848:23177` / `848:23942` (Geist text is live `<text>`, so outline text or embed the font). Overlay at left 33 top 33 inside the 632x540 box.
- Provide meaningful `alt` text per state (e.g. "Pipeline by account report listing Northwind, Argo Data, Helix Cloud and Pallas AI by buying-committee engagement").
- Crossfade between the three images on state change (the Figma file gives no timing; suggest 300ms opacity). Only preload state 1 eagerly.

## 6. Tabs under the panel

`Tabs` (850:5379), 632x34, flex-row, gap 16, three equal tabs (flex 1, 200 wide each). Each tab:

- `border-top: 2px solid`, `padding-top: 12px`, label 20px line height (total height 34), no fill, no radius, no side or bottom border.
- Active: border-top White `#FFFFFF`, label White `#FFFFFF`.
- Inactive: border-top Neutral/Neutral 700 `#404040`, label Neutral/Neutral 400 `#A3A3A3`.
- Label: Geist Mono Regular 14/20 (Label Small).
- Active tab per state: state 1 = Reporting (`850:5380`), state 2 = Forecast (`856:217`), state 3 = Source of truth (`856:314`). Hover and focus styles are not designed; suggest hover label to #D4D4D4 and a visible focus ring.

## 7. Right-hand items

Each item (`Item / ...`): `border-top: 1px solid #262626` (Neutral 800), `padding-top: 208px`, flex-col, gap 16, `overflow: clip`, width 584 inside the 632 column (pl 48). Heights 560 / 560 / 349. All three keep the same divider colour in every state.

Active vs inactive (confirmed from `850:5387` state 1, `856:226` state 2, `856:325` state 3):

| Part | Active | Inactive |
|---|---|---|
| Number | White `#FFFFFF` | Neutral 400 `#A3A3A3` |
| Title | White `#FFFFFF` | Neutral 400 `#A3A3A3` |
| Body | Neutral 300 `#D4D4D4` | Neutral 400 `#A3A3A3` |

**Discrepancy with the brief:** the active number is **White, not Purple 300**. No purple paint style is used anywhere in this section's text (the only purple is baked into the panel imagery). Use White for the active number.

Active item per state: state 1 = item 01, state 2 = item 02, state 3 = item 03. Transitions are not specified in Figma (suggest 200 to 300 ms colour transition).

## 8. Implementation notes and open points

- No eyebrow text is present in this section despite the layer name "Eyebrow + Headline"; do not add one.
- Left column in the state-2 and state-3 artboards is taller (1154 / 1714) only because the panel is moved down to show the sticky position; the real layout is a single 594-high sticky block.
- The right items' fixed 560px height means the section scrolls about 1469px; panel state changes at each 560px boundary.
- Responsive behaviour below 1440 is not designed in this file; at tablet and mobile suggest a stacked layout with the panel on top and the tab bar acting as the state selector.
