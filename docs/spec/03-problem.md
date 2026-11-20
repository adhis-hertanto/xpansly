# 03 — The problem (Figma `849:148`, file `Ly0R84ThdJJDDjKsaRWhth`)

Reference images (all in `docs/spec/ref/`, 1024px max dimension):
- `03-problem.png` — final composed frame `849:148` (1440x986)
- `03-cube-mark.png` — Cube mark `850:4036` alone (800x832, native size)
- `03-scene-1.1.png` ... `03-scene-3.3.png` — the nine scroll keyframes (1440x900 each)

Note: the Figma screenshot host (www.figma.com) is blocked by the session proxy, so PNGs were saved from the MCP's inline base64 blobs (same render, 1024px wide).

---

## 1. Frame structure (1440 x 986, page bg near-black `#0A0A0A`)

```
03-The-problem 849:148            1440x986   (page x0 y906)
├─ Cube mark 850:4036             800x832    x320 y77   (centered: (1440-800)/2, (986-832)/2)
│   └─ Cube mark / vectors 850:2022 > Group 850:2023  (2012 vector nodes)
├─ Scrim 850:4037                 1440x986   x0 y0     (full-bleed rectangle, above cubes, below content)
└─ Content 850:4038               1280x706   x80 y140  (centered vertically: (986-706)/2)
    ├─ Header 850:4039            1280x128   x0 y0
    │   └─ Heading 1 850:4043     1064x128   x108 y0   (centered in the 1280 column)
    └─ Cards / Problems 850:4044  848x530    x216 y176 (centered: (1280-848)/2)
        ├─ Card / The decision is shared   850:4045  848x166  y0
        ├─ Card / The stack is in pieces   850:4051  848x166  y182
        └─ Card / The reporting is activity 850:4057 848x166  y364
```

Z-order bottom to top: Cube mark, Scrim, Content.

Content is a vertical flex column, `align-items: center`, `gap: 48px` (Header to Cards). Because it is centered in the viewport, adding cards makes the whole block grow from the middle (heading moves up) — see scenes 3.x.

## 2. Copy (verbatim)

**Heading 1** (two lines, centered; the first line has a trailing space in the source, a hard break in the layout):
> B2B deals are won by a committee.
> Most tools see one person at a time.

| # | Title | Body |
|---|-------|------|
| 01 | The decision is shared | A B2B purchase involves a group of people, from the budget holder to the people who'll use it every day. Win one and lose the rest, and the deal stalls. |
| 02 | The stack is in pieces | CRM, ads, email, website analytics, enrichment. Each tool sees a slice of the account. None of them sees the whole thing. |
| 03 | The reporting is activity | Clicks, opens and MQLs fill the dashboard. Then the board asks which accounts are actually going to close. |

Apostrophe in "who'll" is a straight `'` in the source.

## 3. Typography and colour (at 1440)

| Element | Style token | Font | Size / line-height | Weight | Colour | Notes |
|---|---|---|---|---|---|---|
| Heading 1 | Landing page/Heading 1 | Recia Medium | 54 / 64px | 500 | `#FFFFFF` (Primary/White) | centered, width 1064px, letter-spacing 0, 2 lines (128px tall) |
| Card index "01-03" | Landing page/Label | Geist Mono Regular | 14 / 20px | 400 | `#FFFFFF` | `text-transform: uppercase`, wrapped in a box with `padding-top: 4px` |
| Card title | Landing page/Heading 2 | Recia Medium | 24 / 32px | 500 | `#FFFFFF` | full width of text column |
| Card body | Landing page/Body | Geist Regular | 18 / 28px | 400 | `#D4D4D4` (Neutral/Neutral 300) | wraps to 2 lines at 733px column |

Page background: `#0A0A0A` (derived from the scrim colour `rgba(10,10,10,...)` and the screenshots; the frames themselves carry no explicit fill in the extract).

## 4. Glass card recipe (all 3 cards identical)

- Width 848 (fills `Cards / Problems`), height 166 (hug content), flex row, `gap: 32px`, `align-items: flex-start`.
- Padding 32px on all sides (index text at x33,y33 inside card = 32 padding + 1 border; Text column at x82 = 1+32+17 index+32 gap).
- Fill: `rgba(255,255,255,0.06)`.
- Border: 1px solid `rgba(255,255,255,0.16)` (inside stroke).
- Corner radius: 12px.
- Backdrop blur: `backdrop-filter: blur(12px)`. The cubes visibly blur behind the cards (see `03-problem.png`).
- `overflow: clip`.
- No shadow.
- Columns inside card: [Index: auto width ~17px, `padding-top: 4px`] [Text: `flex: 1 0 0`, `min-width: 0`, column, `gap: 12px`, 733px wide]. Title 32px tall, body 56px (2 lines), so text block = 100px, card = 100 + 64 padding + 2 border = 166.
- Gap between cards: 16px (card y = 0, 182, 364; stack = 530px).
- Cards container: 848px wide, `flex-direction: column`, `gap: 16px`, centered in the 1280 content column (x216).

## 5. Scrim

### 5a. Final-state scrim, node `850:4037` (frame 849:148 only)
- Type: **linear gradient, horizontal (left to right)**, rectangle 1440x986 at 0,0.
- Colour `#0A0A0A` throughout, varying alpha:
  | Stop | Alpha |
  |---|---|
  | 0% | 0.92 |
  | 38% | 0.60 |
  | 62% | 0.00 |
  | 100% | 0.00 (transparent) |
- Layer opacity 100%.
- CSS: `linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.6) 38%, rgba(10,10,10,0) 62%)`.
- Effect: dims the left/bottom-left cube tail so only the right-hand cube streak reads behind the cards.

### 5b. Scroll-scene scrim, "Scrim / Heading" (in all 9 scenes, hidden only in 1.1-1.3)
- Type: **radial gradient (ellipse), centered on the viewport centre (720, 450)**; ellipse radii rx = 720, ry = 450 (i.e. `ellipse 720px 450px at 50% 50%`) on a 1440x900 full-frame rectangle.
- Stops (colour `rgb(10,10,10)`): offset 0 alpha **0.75**; offset 0.45 alpha **0.35**; offset 0.75 alpha **0**.
- CSS: `radial-gradient(ellipse 720px 450px at 50% 50%, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.35) 45%, rgba(10,10,10,0) 75%)`.
- Layer opacity 100% in all scenes where visible. Purpose: darken cubes behind the centred heading for legibility.
- The identical node (same gradient) appears in scenes 2.1 to 3.3; it is `hidden` in 1.1, 1.2, 1.3. Note that 849:148 (the final composed frame) uses the different linear scrim in 5a, not this radial one. Open question below.

## 6. Cube mark (`850:4036`)

- Frame 800x832 at x320 y77 in the 1440x986 frame (x320 y34 in the 1440x900 scene frames). Inner frame `Cube mark / vectors` 799.9x831.8, containing one `Group` of **2012 vector nodes**. Each isometric cube = 3 vectors (left face, top face, right face) so roughly 670 cubes (not an exact multiple of 3, a few extra/partial vectors). No auto-layout, absolute positions.
- Look (see `03-cube-mark.png`): monochrome greyscale voxel/cube cloud forming a large 4-point star / arrow-like shape pointing to the upper right. A dense lattice of small cubes forms a diamond-ish body in the lower middle; a streak of cubes (the "tail"/arrow shaft) runs diagonally from the bottom-left corner to the top-right corner. Single cubes straggle along the shaft at the bottom-left and a couple at the left edge (~x150,y243) and top-right edge.
- Single cube: each cube is about 32 x 24px overall (e.g. face vectors 12x24 left face, 31x2 top edge, 21x23 right face; top cap is a thin sliver because the view is nearly front-on). Cubes sit on a roughly 24px grid in the lattice body, with slight rotation/perspective variation (the lattice is a 3D voxel field rendered through perspective, not an exact 2D grid).
- Per-cube shading uses 3 greys (confirmed on the first cube, nodes 850:2024-2026): left face `#525252` (Neutral 600), top edge `#171717` (Neutral 900), right face `#A3A3A3` (Neutral 400). Other cubes vary from near-black to near-white (`#E5E5E5`-ish highlights at the arrow tip area), so per-cube brightness varies with a light direction. Individual fill values for the other ~660 cubes were not extracted (response too large; not worth shipping as 2012 DOM nodes). Recommendation: export the mark as a single SVG or PNG sprite, or reproduce with WebGL/instanced cubes sampled from these positions.
- The mark is the end state; scenes 2.1 to 2.2 show the same cubes scattered/converging (see below).

## 7. Scroll keyframes (section `865:138`, "Problem scroll states")

Section 4920x3300 on the canvas. 3 rows x 3 columns, each scene 1440x900 (Heading block is **vertically centred**; viewport centre y = 450). All scene frames share: Cube mark 800x832 at x320 y34, Scrim / Heading 1440x900 at 0,0, Content at x80, width 1280.

Row 1 = heading reveal (black). Row 2 = cube assembly. Row 3 = cards stack in.

| # | Node ID | Name | Heading opacity | Heading block (Content y / h) | Cubes (Cube mark frame) | Radial heading scrim | Cards visible |
|---|---|---|---|---|---|---|---|
| 1.1 | `865:139` | Scene 1.1 / Black | 0 (Header `opacity-0`) | y386, h128 (heading only, centred) | **hidden** (not rendered) | **hidden** | none (Cards container hidden) |
| 1.2 | `865:2178` | Scene 1.2 / Heading fading in | 0.4 (Header `opacity-40`) | y386, h128 | **hidden** | **hidden** | none |
| 1.3 | `865:4217` | Scene 1.3 / Heading in | 1.0 | y386, h128 | **hidden** | **hidden** | none |
| 2.1 | `865:6256` | Scene 2.1 / Cubes scattered | 1.0 | y386, h128 | visible; cubes **scattered**: sparse, widely spread across the whole 1440x900 viewport (incl. well outside the 800x832 mark box, to the edges), small and dim, low visual density, no recognisable shape (same ~670 cubes as every other scene; every scene's Cube mark holds 2012 vectors) | visible | none |
| 2.2 | `865:8295` | Scene 2.2 / Cubes converging | 1.0 | y386, h128 | visible; cubes **converging**: much denser, still loose clouds, a hollow in the centre behind the heading, roughly pulled toward a central/diagonal mass; cubes larger and brighter than 2.1; some still near the frame edges | visible | none |
| 2.3 | `865:10334` | Scene 2.3 / Logo formed | 1.0 | y386, h128 | visible; **locked** into the final 4-point star/arrow mark (identical to `03-cube-mark.png`), centred behind heading | visible | none |
| 3.1 | `865:12373` | Scene 3.1 / Card 1 slides in | 1.0 | **y279**, h342 | locked (final) | visible | Card 01 only, opacity 1 |
| 3.2 | `865:14412` | Scene 3.2 / Card 2 slides in | 1.0 | **y188**, h524 | locked (final) | visible | Cards 01 + 02 |
| 3.3 | `865:16451` | Scene 3.3 / Card 3 slides in | 1.0 | **y97**, h706 | locked (final) | visible | Cards 01 + 02 + 03 |

Layout detail for row 3 (the cards container is positioned by auto-layout, not individual offsets; "slides in" means the block grows and the entire block re-centres):
- Header always at Content y+0 (128 tall), then 48px gap, then cards container at Content y+176.
- 3.1: cards container 848x166 (1 card). Content y279. Heading top = 279, Card 01 top = 279+176 = 455 (viewport).
- 3.2: cards container 848x348 (2 cards, 16 gap). Content y188. Heading top 188; card 01 at 364, card 02 at 546.
- 3.3: container 848x530. Content y97. Heading top 97; cards at 273 / 455 / 637 (viewport). Cards end at 803, i.e. 97 above bottom.
- The heading therefore travels 386 -> 279 -> 188 -> 97 (about -107, -91, -91) as cards enter; in implementation animate the Content block's translateY (or let a sticky flex column recentre) while each card animates in.
- The Figma file does not encode a card entry offset or fade: the keyframes only show the cards at full opacity (1.0) in their resting position. The slide-in transition (direction, distance, opacity) is not specified; suggest translateY(24-40px) + opacity 0 -> 1 per card, to be confirmed with design.

Properties not recoverable from the extract: exact cube scale/opacity values in 2.1/2.2 (the Cube mark frames hold individual per-cube positions that differ between scenes). If the timeline needs exact per-cube positions: scene 2.3/3.x positions equal the 850:2023 group; 2.1 and 2.2 are separate vector groups (per-cube x/y in `865:6257` and `865:8296`, 2012 vectors each, same count as the final mark) and can be mapped cube-by-cube by index order.

### Suggested scroll timeline (one pinned 100vh stage, progress 0 to 1)

| Progress | Scene | Heading opacity | Heading translateY | Cubes | Scrim (radial) | Cards |
|---|---|---|---|---|---|---|
| 0.00 | 1.1 | 0 | 0 | off | 0 | none |
| 0.08 | 1.2 | 0.4 | 0 | off | 0 | none |
| 0.16 | 1.3 | 1 | 0 | off | 0 | none |
| 0.28 | 2.1 | 1 | 0 | fade in, scattered | on (1) | none |
| 0.40 | 2.2 | 1 | 0 | converging | 1 | none |
| 0.52 | 2.3 | 1 | 0 | locked to logo | 1 | none |
| 0.64 | 3.1 | 1 | -107px | locked | 1 | card 1 in |
| 0.78 | 3.2 | 1 | -198px | locked | 1 | cards 1-2 |
| 0.90-1.00 | 3.3 | 1 | -289px | locked | 1 (then cross to linear scrim of the final frame) | cards 1-3, release pin |

(Progress breakpoints are a suggestion; Figma defines only the order and states.) translateY values are relative to the 1.x centred position (y386 -> 279 -> 188 -> 97).

## 8. Open questions
1. 849:148 uses a left-to-right linear scrim; the scroll scenes use a centred radial "Scrim / Heading". Which is the resting state after scroll? (Likely the radial during 2.x-3.3, with 849:148 as the static fallback/exit state.)
2. Card slide-in motion (distance, easing, opacity) is not defined in Figma.
3. Heading 1 in the static frame sits at y140 of 986 while 3.3 sits at y97 of 900; both are vertically centred, so they are consistent. Viewport height 900 vs 986 changes the centring only.
4. Cube mark per-cube fills and 2.1/2.2 positions not extracted (2012 vectors per state). Needs a pre-rendered asset or a targeted vector export.
5. Fonts: Recia Medium (Heading 1/2) and Geist / Geist Mono must be licensed/loaded; Recia is not a Google font.
