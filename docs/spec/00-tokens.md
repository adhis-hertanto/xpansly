# 00 - Global design tokens (Xpansly landing page)

Source: Figma file `Ly0R84ThdJJDDjKsaRWhth`, page `838:13` "Landing Page", frame `849:145` "xpansly-00-Full-page 1" (1440 x 8958, fill Primary/Black `#0A0A0A`, parent section `863:138` "Landing page").
Extraction method: Figma Plugin API read-only (`getLocalPaintStylesAsync`, `getLocalTextStylesAsync`, `getLocalEffectStylesAsync`, node property dumps). All colour and text-style values below are **exact** from the file's local styles, not inferred, unless marked "INFERRED".

Notes on the file:
- There are **no Figma Variables** (0 variable collections), **no local effect styles** and **no local grid styles**. Everything is paint styles + text styles. Effects (glass etc.) are applied directly on nodes.
- The file also contains text styles in a "Brand Guidelines" group (Headline 1 Recia Semibold 140/140 etc.). They are not used by the landing page frame; ignore them for the build.
- Dark-only design. Page bg is `#0A0A0A`; there is no light theme.

## 1. Colour (paint styles)

### Primary
| Style | Hex |
|---|---|
| Primary/White | `#FFFFFF` |
| Primary/Black | `#0A0A0A` |

All paint styles are solid, opacity 100%. Opacity-based colours (glass fill/border) are applied as node-level paint opacity, not as styles (see section 3).

### Neutral (Neutral/Neutral N)
| Step | Hex |
|---|---|
| 950 | `#0A0A0A` |
| 900 | `#171717` |
| 800 | `#262626` |
| 700 | `#404040` |
| 600 | `#525252` |
| 500 | `#737373` |
| 400 | `#A3A3A3` |
| 300 | `#D4D4D4` |
| 200 | `#E5E5E5` |
| 100 | `#F5F5F5` |
| 50 | `#FAFAFA` |

Neutral 950 equals Primary/Black.

### Secondary / Tertiary named colours (brand picks, each equals a ramp step)
| Style | Hex | Ramp step |
|---|---|---|
| Secondary/Purple | `#7303C0` | Purple 700 |
| Secondary/Blue | `#0052D4` | Blue 700 |
| Secondary/Orange | `#E65C00` | Orange 500 |
| Secondary/Violet | `#EC38BC` | Violet 400 |
| Secondary/Cyan | `#9CECFB` | Cyan 100 |
| Tertiary/Moss | `#605C3C` | Moss 600 |
| Tertiary/Red | `#E52D27` | Red 500 |
| Tertiary/Green | `#45B649` | Green 400 |
| Tertiary/Yellow | `#F9D423` | Yellow 300 |

### Colour ramps (50-900)
Style names are `<Ramp>/<Ramp> <step>`.

| Step | Purple | Blue | Orange | Violet | Cyan | Moss | Red | Green | Yellow |
|---|---|---|---|---|---|---|---|---|---|
| 900 | `#420079` | `#0A2B61` | `#461604` | `#510636` | `#083044` | `#201F13` | `#480907` | `#0C270E` | `#422206` |
| 800 | `#62049F` | `#0846A0` | `#82310C` | `#84175D` | `#174A62` | `#3D3C2A` | `#831C19` | `#1F4821` | `#704213` |
| 700 | `#7303C0` | `#0052D4` | `#A1390B` | `#9E166E` | `#165974` | `#46442E` | `#9E1A16` | `#245726` | `#84500F` |
| 600 | `#8C00F4` | `#0063FF` | `#CC4902` | `#BF1785` | `#0F6C8F` | `#605C3C` | `#C01A15` | `#286D2B` | `#A06608` |
| 500 | `#A00AFF` | `#007BFF` | `#E65C00` | `#DD25A3` | `#0987B1` | `#6E6842` | `#E52D27` | `#308933` | `#C98F05` |
| 400 | `#B231FF` | `#149DFF` | `#FF7F0A` | `#EC38BC` | `#07AAD3` | `#8C8456` | `#F6433D` | `#45B649` | `#E9B809` |
| 300 | `#C769FF` | `#40BFFF` | `#FF9D32` | `#F571D6` | `#23C7ED` | `#A89F73` | `#FE706B` | `#65C368` | `#F9D423` |
| 200 | `#DCA4FF` | `#7DD8FF` | `#FFC26D` | `#FAA7E8` | `#68DFF8` | `#C0B896` | `#FFA4A1` | `#99DC9B` | `#FCE448` |
| 100 | `#EBCCFF` | `#B2E6FF` | `#FFDCA5` | `#FBCFF3` | `#9CECFB` | `#D9D4BD` | `#FFCAC8` | `#C6ECC6` | `#FDF28B` |
| 50 | `#F4E3FF` | `#D4F0FF` | `#FFF0D3` | `#FCE7F8` | `#CFF7FE` | `#EBE8DC` | `#FFE2E1` | `#E2F6E2` | `#FEFBC3` |

### Colours actually used on the landing page (text roles)
Resolved from every text node under `849:145`:
| Role | Colour | Source |
|---|---|---|
| Headings, nav button label on dark, eyebrow label | `#FFFFFF` | Primary/White |
| Body copy (most sections) | `#D4D4D4` | Neutral 300 |
| Nav links, muted/secondary body, captions, input placeholders | `#A3A3A3` (links use `#D4D4D4`) | Neutral 400 (nav links Neutral 300) |
| Primary button label | `#0A0A0A` | Primary/Black |
| Hero body paragraph (850:1949) | `#C4C4C4` | **raw colour, no style** (Figma shows fill style Primary/White but the paint is `#C4C4C4`). Treat as a one-off; closest token is Neutral 300 `#D4D4D4`. Decide whether to keep `#C4C4C4` literal. |
| Section 06 highlighted outcome text ("Eyebrow label", "Heading 1", "Body paragraph 1") | `#C6ECC6` | Green 100 |
| Hero mock UI text (inside glass cards, no styles) | `#FFFFFF`, `#A3A3A3`, `#6B6B6B`, `#E5E5E5`, `#0A0A0A` | raw paints |
| Mock UI status colours | Engaged `#4ADE80`, New signal `#B9A3FA`, Deciding/Warming `#F9D423` (Yellow 300) | raw paints, **not in the palette** (`#4ADE80`, `#B9A3FA` are off-palette) |
| Illustration colour fields (section 04, 06) | `#6B3FD6`, `#3A2470`, `#241640`, `#3B6CF6`, `#111111` | raw gradient stops inside illustrations, off-palette; these live inside exported image/vector art |

## 2. Text styles (group "Landing page")

Letter spacing is 0% on every style, no text decoration, no paragraph spacing. Weights below are the Figma style names (Recia "Medium" = 500, Geist/Geist Mono "Regular" = 400 with variable `wght` 400).

| Style | Family | Weight | Size / Line height | Letter spacing | Case |
|---|---|---|---|---|---|
| Display | Recia | Medium | 72 / 80 | 0 | none |
| Heading 1 | Recia | Medium | 54 / 64 | 0 | none |
| Heading 2 | Recia | Medium | 24 / 32 | 0 | none |
| Body Large | Geist | Regular (400) | 20 / 28 | 0 | none |
| Body | Geist | Regular (400) | 18 / 28 | 0 | none |
| Body Small | Geist | Regular (400) | 16 / 24 | 0 | none |
| Caption | Geist | Regular (400) | 14 / 20 | 0 | none |
| Label | Geist Mono | Regular (400) | 14 / 20 | 0 | UPPERCASE |
| Label Small | Geist Mono | Regular (400) | 14 / 20 | 0 | none (as typed) |
| Label XS | Geist Mono | Regular (400) | 13 / 16 | 0 | none (as typed) |

**Differences vs expected values: none.** All ten match exactly. Note: Label is the only one with uppercase transform; Label Small and Label XS are not uppercase in the style (their text content may be typed uppercase; not verified).

Usage observed (style : typical use):
- Display: hero Headline (white). Heading 1: section headlines (white; section 06 one in Green 100). Heading 2: card/item titles (white, or Neutral 400 for inactive items).
- Body Large: hero paragraph, section intros and item bodies (Neutral 300, or Neutral 400 for inactive, Green 100 in section 06).
- Body (18/28): button label, form input placeholders (Neutral 400), some card body (Neutral 300).
- Body Small (16/24): nav links (Neutral 300).
- Label (mono caps 14/20): eyebrow chip text (white), index/item numbers, form field labels (Neutral 300/400), captions (Neutral 400).
- Label Small: tab labels (white active, Neutral 400 inactive).
- Caption/Label XS: mostly inside mock UI. Many mock-UI text nodes (43 + 19 + 27 + ...) have no text style attached (mixed/none) - these are inside the hero glass cards / illustrations (850/858/848 groups); another agent covering those nodes should read font sizes from the nodes directly.
- Display/H1 use Recia (a licensed/commercial serif; font files are not in Figma-accessible form, need to be supplied). Geist and Geist Mono are open source (Vercel).

## 3. Effects

No effect styles exist. Effects are node-level. The "glass" recipe is **identical** on all glass surfaces, only radius, padding, and blur radius vary as listed.

### Glass recipe
- Fill: solid `#FFFFFF` at **6%** opacity (paint opacity 0.06).
- Stroke: solid `#FFFFFF` at **16%** opacity, **1px, INSIDE** alignment.
- Effects, in order: (1) Figma `GLASS` effect: radius **16** (24 on problem cards), refraction **0.4**, depth **12**, light angle **-45 deg**, light intensity **0.4**, dispersion **0.1** (the extra GLASS params were read from the nav bar; the other nodes show the same radius value, refraction etc. not re-read individually - INFERRED identical). (2) `BACKGROUND_BLUR` radius **16** (24 on problem cards), type NORMAL.
- No drop shadows or inner shadows anywhere on the landing page (all other nodes have `effects=[]`).
- CSS approximation (no true equivalent of Figma Glass refraction/depth/dispersion): `background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.16); backdrop-filter: blur(16px);` with `box-sizing: border-box` (inside stroke). Optional faint top-left inner highlight to mimic the light angle -45 deg at 0.4 intensity - this is a build decision, not specified in Figma beyond those parameters.

### Surfaces using the recipe
| Node | Name | Size | Radius | Padding (L,T,R,B) | Blur | Other |
|---|---|---|---|---|---|---|
| `848:24727` | Nav bar (inside 849:146) | 801 x 70, x=320 (centred in 1440) | 8 | 16, 8, 8, 8 | 16 | horizontal auto-layout, gap 80, items centre-aligned: logo, nav links (gap 40), button |
| `850:1945` | Chip / Eyebrow (hero; same on CTA `850:1242`) | 248 x 38 (hug width) | 999 (pill) | 12, 8, 16, 8 | 16 | horizontal, gap 8, centre-aligned; text Label white |
| `858:141` | Glass / Mira message card (hero right) | 477 x 125 | 20 | 12 all | 16 | contains group of mock UI |
| `858:142` | Glass / Accounts card (hero right) | 502 x 271 | 20 | 12 all | 16 | |
| `858:143` | Glass / Next move card (hero right) | 302 x 176 | 20 | 12 all | 16 | contains an extra vector `848:21162` with linear gradient white 6% to white 0% |
| `850:4045`, `850:4051`, `850:4057` | Card / The decision is shared / The stack is in pieces / The reporting is activity (section 03) | 848 x 166 each | 12 | 32 all | **24** (glass radius also 24) | vertical stack, gap 16, centred column of 848 width in 1280 content |
| `862:138`, `862:139` | Glass / Info (section 07 cards, overlays image 632x560) | 614 x 140 | 20 | 12 all | 16 | |
| `861:138` | Glass / Form card (CTA) | 632 x 400 | 20 | 12 all | 16 | |

Hero right column (`850:1957`, 524 x 608) is a free-positioned (NONE layout) composition: Mira message card at (25,0), Accounts card at (13,143), Next move card at (123,432), plus a "Cursor You" group at (235,559). Desktop-only absolute composition.

### Scrims and gradients
All scrims are full-width rectangles filled with `#0A0A0A` (Primary/Black) at varying alpha, over a photographic/art background image. Direction inferred from the gradient transform matrices (computed: t = y for 848:24335, t = 1 - y for 848:16501, t = x for 850:4037) - treat direction as **INFERRED but consistent with the visuals**.

| Node | Where | Size | Stops (position: alpha) | Direction |
|---|---|---|---|---|
| `848:16501` "Scrim" | Hero (`848:16498` Frame 1), above bg image `848:16504` (1440 x 889, image `xpansly-planet-blue-dark-lines-circuit-1920x1080`, scale mode FILL, rotation 180) | 1440 x 907 | 0%: 1.00, 19%: 0.60, 48%: 0.00 (all #0A0A0A) | **bottom to top** (opaque at bottom edge, clear by ~52% height from bottom) |
| `850:4037` "Scrim" | Section 03 problem (`849:148`), above "Cube mark" `850:4036` (800 x 832 at x=320) | 1440 x 986 | 0%: 0.92, 38%: 0.60, 62%: 0.00 | **left to right** (INFERRED from identity transform) |
| `848:24335` "Scrim" | Section 08 CTA-Footer (`848:24337`), above bg image `848:24333` (1440 x 1083, image `xpansly-wave-ember-dark-dither-pix-1520x980`, FILL, rotation 180) | 1440 x 1082 | 0%: 1.00, 19%: 0.60, 48%: 0.00 | **top to bottom** (opaque at top, clear by 48%) |
| `848:21162` | Vector inside Next move card | 262 x 40 | linear, white 6% at 0%, white 0% at 100% | n/a, subtle sheen |

Illustration gradients (radial colour fields in section 04 cards `848:17182`, `848:17183`, `848:17839`, `848:17840`, `848:18718`, `848:18719`, `848:19809`, `848:19810`, section 06 `848:24364-24366`): radial `#6B3FD6` 42% -> `#3A2470` 22% -> `#241640` 0%, and radial `#3B6CF6` 14% -> 0%; section 06 variant starts `#6B3FD6` 55% / `#3A2470` 35%, plus linear `#241640` -> `#111111` base. These are baked into illustration art; export the illustration frames as images rather than rebuilding in CSS.

Image fills (should be exported as assets): `848:16504` (hero bg), `848:24333` (CTA bg), plus `Frame 158/169/170` (848:24312, 848:24314, 848:24320, 848:24316) in section 04, `848:24349` section 06, `850:158` + `848:16494` section 05, `850:4483` + `850:4889` section 07.

## 4. Button component set "Landing page/Button" (`853:140`)

Set properties: `Type` = `Primary | Secondary` (variant), `Label` text property (default "Join early access"). **Only two variants exist; no hover, pressed, focus or disabled states are defined in Figma.** Hover/active/focus/disabled treatment is a build decision (suggest: Primary hover to Neutral 200 `#E5E5E5` or similar, Secondary hover to Neutral 800 `#262626`, visible focus ring) - mark as INVENTED if applied.

| Property | Primary (`849:155`) | Secondary (`853:138`) |
|---|---|---|
| Size | 191 x 52 (hug width, fixed height 52) | 191 x 52 |
| Layout | horizontal auto-layout, centred both axes, gap 0 | same |
| Padding | 24 left / 24 right, 0 top / 0 bottom (height 52 comes from fixed height; text line 28) | same |
| Radius | **4** | **4** |
| Fill | `#FFFFFF` (Primary/White) | `#171717` (Neutral 900) |
| Label colour | `#0A0A0A` (Primary/Black) | `#FFFFFF` (Primary/White) |
| Label style | Landing page/Body: Geist Regular 18 / 28, 0 tracking, no transform | same |
| Border | none | none |
| Shadow | none | none |
| Icon | none | none |

Instances: nav button `850:146` (in `848:24727`), hero form "Form / Early access" `850:1951` (524 x 56, gap 16 - an input plus a button, not the same component size: check the form node in the hero/CTA section specs), CTA form. Screenshot: `docs/spec/ref/button.png` (430 x 84, both variants side by side on mid-grey canvas).
The component set wrapper itself is 430 x 84, gap 16, padding 16, radius 5 - this is only the Figma set container, not part of the button.

## 5. Layout grid and vertical rhythm

### Layout grid on `849:145` (1440 wide frame)
- Columns grid: **12 columns**, **gutter 16**, **offset (margin) 80** each side, alignment STRETCH. Column width = (1440 - 160 - 11 x 16) / 12 = **92**. Content width **1280**. Grid is set to hidden (visible=false) but defined.
- Second grid: 4px square grid (pattern GRID, sectionSize 4), also hidden. Use a 4px spacing base.
- The frame itself is vertical auto-layout, sections stacked with **gap 0**, full-bleed backgrounds.
- Hero columns: "Left (6 cols)" 740 wide and "Right (6 cols)" 524 wide at x=756, hero gap 16. Layer names say "6 cols" each, but the measured widths (740 and 524) are not an even 6/6 split (which would be 632 each). Use the measured widths. Two-column panels in sections 05-07 use 632 + 16 gap + 632.

### Section stack (y positions are in frame `849:145`; 849:146 and 849:147 live inside "Frame 1" `848:16498`, 1440 x 906)
| Order | Node | y | Height | Padding T / R / B / L | Inner gap | Notes |
|---|---|---|---|---|---|---|
| 01 Nav | `849:146` | 0 | 102 | 16 / 80 / 16 / 80 | 20 | centres the 801 x 70 glass bar (x=320) |
| 02 Hero | `849:147` | 102 | 804 | 96 / 80 / 100 / 80 | 0 | hero row 1280 x 608, gap 16 |
| 03 The problem | `849:148` | 906 | 986 | 140 / 80 / 140 / 80 | content gap 48 | header (gap 16) then cards (848 wide, gap 16) |
| 04 How it works | `849:149` | 1892 | 1786 | 160 / 80 / 160 / 80 | 64 (header to grid) | header gap 24; grid gap 16, row of cards gap 16 |
| 05 Meet Mira | `849:150` | 3678 | 840 | 80 / 80 / 80 / 80 | 0 | row 1280 x 680: photo panel 592 + copy column 688 (inner padding 48, gap 140) |
| 06 The outcome | `849:151` | 4518 | 2225 | 160 / 80 / **288** / 80 | 64 | header gap 32; columns gap 16; right column padding-left 48 |
| 07 Who it's for | `849:152` | 6743 | 1132 | 160 / 80 / 160 / 80 | 64 | header gap 16; body gap 40; cards 632 x 560 |
| 08 CTA | `849:153` (in `848:24337`) | 7875 | 998 | 184 / 80 / 160 / 80 | 48 | centred 632-wide content; form card 632 x 400 |
| 09 Footer | `849:154` | 8873 | 85 | 32 / 80 / 32 / 80 | 20 | centred copyright text (Label style) |

Rhythm summary: standard section padding is **160 top and bottom** (sections 04, 07; 06 has an extra-large 288 bottom; 03 uses 140; 05 uses 80; hero 96/100; CTA 184/160). Header-to-body gap is **64** (48 in section 03). Card gutters **16**. Side margin **80** throughout. Section 08 + 09 share one background (`848:24337`, 1440 x 1083).

Responsive behaviour is **not designed** in this file (desktop 1440 only; page 838:13 has no tablet/mobile frames). Breakpoints must be decided in the build.

## 6. Logo, favicon, export node IDs

Xpansly logo (in the current design `849:145`):
- Nav: `848:15950` "xpansly-2-horizontal-lockup 1", frame 133 x 40, inside Nav bar `848:24727`. Children: `848:16094` group "2 Logo" > `848:16095` "Icon mark" (40 x 40) + `848:16269` "Wordmark" (93 x 26 at x=40, y=10). Also `848:15951` "1 Construction grid" (guide layers: `848:15952` Background, `848:15953` minor lines, `848:16075` major lines) is **inside the lockup frame - it must NOT be exported/rendered** (hide that layer when exporting). All logo vectors are solid `#FFFFFF`.
- **Footer (`849:154`) contains no logo**, only the copyright text `850:155`. (The older reference frame `838:82` "Landing page / Desktop / From Client" has footer logo `838:230` "Logo/Dither Star" 22 x 22 and nav logo `838:84`, and a 264 x 264 mark `838:173`; that is an older client version, not the current design.)
- Export recommendation: export `848:16095` (icon mark) and `848:16269` (wordmark) separately as SVG, and `848:16094` as the full lockup SVG, white.
- Existing exportSettings: only `849:145` has one (PNG 1x). No node has explicit export settings for logo, favicon or OG.

Favicon / app icon / OG image: **none exist** on page 838:13 (name search for favicon, app icon, og, open graph, social, share, thumbnail found nothing relevant). Top-level page children: `838:82` (older frame 1440 x 5592), `853:140` (Button set), `863:138` section "Landing page" (1640 x 9259, contains 849:145), `863:139` "Outcome states", `863:140` "Who it's for states", `865:138` "Problem scroll states". Favicon must be derived from the icon mark `848:16095` (40 x 40, white on transparent; needs a background for a favicon since it is white); OG image must be created (suggest hero screenshot `848:16498` 1440 x 906 cropped to 1200 x 630).

Other node IDs to export as assets: see "Image fills" list in section 3. Cube mark `850:4036` (800 x 832, vector group `850:2022`) is decorative art on the problem section.

Out-of-scope pages worth a look by the other agents: "Problem scroll states" `865:138` (scroll-driven animation frames "Scene 2.3 / Logo formed" `865:10334`), "Outcome states" `863:139`, "Who it's for states" `863:140` - the build includes interaction/scroll states not visible in the static frame.
