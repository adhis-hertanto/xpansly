# 05 · Meet Mira

Figma file `Ly0R84ThdJJDDjKsaRWhth`, frame `849:150` "05-Meet-Mira", 1440 x 840 (canvas y=3678).
Reference render: `docs/spec/ref/05-meet-mira.png` (1440 x 840, 1:1).

Grid: 12 columns, 80 margin, 16 gutter, column 92 (content width 1280). The two halves of this row are **not** on the 12-col grid (see below).

## Section frame

| Property | Value |
|---|---|
| Size | 1440 x 840 |
| Background | `Primary/Black` #0A0A0A |
| Padding | 80 top / 80 right / 80 bottom / 80 left (flex col, items-start) |
| Row | `850:157` x80 y80, 1280 x 680 |

## Structure tree

```
849:150  Section / 05-Meet-Mira                         1440x840, bg #0A0A0A, padding 80
└─ 850:157  Row / Meet Mira                             x80 y80 1280x680, flex row, items-center, overflow clip (no gap, halves abut)
   ├─ 850:158  Panel / Photo placeholder                x0   y0 592x680   (media half, left)
   │   ├─ [fill] image (PNG, object-fit cover)           full-bleed background of the panel
   │   └─ 848:16494  ui-component                        412x205, radius 6, centred in panel (x90 y237.5)
   └─ 850:647  Column / Copy                            x592 y0 688x680   bg #0C270E, padding 48, flex col, gap 140, overflow clip
      ├─ 850:648  Heading group                         x48 y48 592x164, flex col, gap 16
      │  ├─ 850:649  Eyebrow                            592.. 100x20, flex row, gap 16, items-center
      │  │   ├─ 850:650  Eyebrow marker                 8x8 square, fill #C6ECC6 (code export shows no radius), x0 y6
      │  │   └─ 850:651  Eyebrow label                  76x20, "Meet Mira"
      │  └─ 850:652  Heading 1                          592x128 (2 lines), y36
      └─ 850:653  Body group                            x48 y352 600x280, flex col, gap 32
         ├─ 850:654  Body                               600x224
         │   └─ 850:655  Body paragraph 1               3 paragraphs separated by a blank 28px line
         └─ 850:657  Caption                            261x24, border-left 1px #C6ECC6, padding-left 16
             └─ 850:658  Caption text                   244x20
```

## Copy (verbatim)

| Node | Role | Text |
|---|---|---|
| 850:651 | Eyebrow | Meet Mira (rendered uppercase via `text-transform`: "MEET MIRA") |
| 850:652 | Heading 1 | The thinking at the centre of it all. |
| 850:655 | Body, paragraph 1 | Mira knows your ideal customers, your buyers and your goals. When a signal comes in, she doesn't just log it. She works out what it means for that account and what should happen next, for every person involved. |
| 850:655 | Body, paragraph 2 | Your team stays in control. Mira recommends, you approve, and every result feeds back in, so the whole system keeps getting smarter. |
| 850:658 | Caption | Mira recommends. You approve. (rendered uppercase: "MIRA RECOMMENDS. YOU APPROVE.") |

The two body paragraphs live in one text node with an empty line between (spacer = zero-width char line, 28px tall); build as two `<p>` with 28px gap (or margin-bottom 28).

No stat numbers or labels in the copy column. The only numbers in the section are inside the placeholder UI component image: New Users 1.39K (147%), Unique Users 1.52K (53%), Week 1 Retention 4.53% (10.7%, red down), Session 0.9 sec (29%), each "VS PREV. 28 DAYS". This is an image (raster), not live text, and reads as placeholder.

## Per-element styles at 1440

| Element | Grid placement | Position / size | Style |
|---|---|---|---|
| Row | cols 1-12 | x80 y80 1280x680 | flex row, `items-center`, overflow clip |
| Photo panel 850:158 | starts col 1; width 592 (about 5.5 columns, off-grid) | x0 592x680 | Image fill cover (PNG, includes blurred green/red photo plus baked-in white 8px dither dots). Container flex col, centre/centre, overflow clip. No border, no radius, no overlay colour |
| ui-component 848:16494 | centred inside panel | 412x205, radius 6 | PNG image, object-cover. White card with soft shadow baked into image |
| Copy column 850:647 | right half; x592 width 688 (off-grid, hugs content: 600 body + 2x48 padding = 696, clipped to 688) | 688x680 | fill `Green/Green 900` #0C270E; padding 48; gap 140 between heading group and body group; overflow clip |
| Heading group | inside column | x48 y48, 592x164 | flex col gap 16 |
| Eyebrow | | 100x20 | flex row gap 16, items-center |
| Eyebrow marker | | 8x8 at y6 | fill `Green/Green 100` #C6ECC6 |
| Eyebrow label | | 76x20 | `Landing page/Label`: Geist Mono Regular 14 / 20, ls 0, uppercase, colour #C6ECC6 |
| Heading 1 | | w592 h128 at y36 | `Landing page/Heading 1`: Recia Medium 54 / 64, ls 0, colour #C6ECC6, left aligned, wraps to 2 lines ("The thinking at the" / "centre of it all.") |
| Body | | x0 w600 h224 | `Landing page/Body Large`: Geist Regular 20 / 28, colour #C6ECC6, 8 lines total incl. spacer |
| Caption | | h24, w261 | border-left 1px solid #C6ECC6, padding-left 16, flex items-center |
| Caption text | | 244x20 | `Landing page/Label` (Geist Mono 14/20, uppercase), colour #C6ECC6 |

Vertical rhythm in copy column: padding top 48 -> heading group (164) -> gap 140 -> body group (280) -> padding bottom 48 = 680 total (48+164+140+280+48). Body group = Body 224 + gap 32 + Caption 24.

Overflow note: body is 600 wide but the column inner width is 592, so the body text block overflows by 8px on the right (clipped, visually harmless as text wraps inside 600). Use max-width 592 or 600; wrapping in the render matches 600 (line 1 ends "...goals."; line breaks: "Mira knows your ideal customers, your buyers and your goals." / "When a signal comes in, she doesn't just log it. She works out" / "what it means for that account and what should happen next, for" / "every person involved."). If you use 592, re-check the wrapping.

Paint styles: `Primary/Black` #0A0A0A (section bg), `Green/Green 900` #0C270E (copy column bg), `Green/Green 100` #C6ECC6 (all copy, marker, caption rule). No glass, blur, shadow, or border on the section-level elements (the only shadow is baked into the ui-component image). Status colours (green #4ade80 / amber #f9d423 / Mira purple) do not appear in this section.

## Mockup illustration / images

This section has no vector mockup stage. Both visuals are raster PNGs in Figma:

| Node | Name | Size | Export recommendation |
|---|---|---|---|
| 850:158 (fill) | Panel / Photo placeholder (background photo, with baked dither dots) | 592 x 680 | AVIF + WebP @2x (1184 x 1360), `object-fit: cover`. Low complexity (photo). Name says "placeholder": likely to be replaced by a real photo; if the dither dot overlay should stay, export it separately (or keep baked) |
| 848:16494 | ui-component (KPI card) | 412 x 205, r6 | PNG/WebP @2x (824 x 410) with transparency for the soft shadow, or rebuild in HTML (low complexity: 2x2 KPI grid, four icons, text) if the content is kept. Also placeholder content (generic analytics metrics unrelated to Mira) |

Neither sits in a glass container. The KPI card is a plain white card floating on the photo.

## Responsive notes (not in Figma)

Only 1440 designed. Suggested: stack to one column below about 900 with the panel above the copy (aspect about 592:680 or cropped to 4:3), copy padding 48 -> 24, Heading 1 54/64 -> about 36/44; gap 140 -> 48.

## Unresolved questions

1. Panel and ui-component are named "placeholder" / "ui-component": confirm whether the final art is a real photo and a real Mira UI or this stock KPI card.
2. Halves are 592 / 688 (not 6/6 columns and the code export marks both `flex: 1`); confirm intended split (592/688 as built, versus 640/640).
3. Eyebrow marker corner radius: metadata says rounded-rectangle but the code export shows none (8x8 square); verify (renders as a square in the reference).
4. Button/CTA: none in this section.
