# Project 21 — Teoremes que no t’esperes: living state

Agent-facing memory between sessions. English. Update it in the same commit as any change.
Spec: [`SPEC.md`](SPEC.md). Where they disagree, this file wins. Mathematical review log: [`REVISIO.md`](REVISIO.md).

## Status (2026-10-23): v1 built, not yet published

| Part | Status |
|---|---|
| GeoMotor moved to `step-quiz-commons/fitxers/geo-motor.js` (+ its tests), `figures` and `teoremes` registered in `comuns.json` | DONE (commons ZIP + figures v2 ZIP delivered with this one) |
| Engines: `invariants.js`, `construccio.js`, `resistencia.js`, `dibuix.js` (pure, Node-tested) | DONE |
| Content: 14 theorems in `data/teoremes/` | DRAFTED; math review by the user PENDING (`REVISIO.md`) |
| UI: `index.html`, `teorema.html` (drag, live verdict, stress test, broken variant, ladder, proof, i després, projector), `fitxa.html` (A4, one sheet per page) | DONE, browser-checked under `file://` (Chromium, 1366 px and 360 px; 14 sheets = 14 A4 pages) |
| Tests (`node tests/run-all.js`) | DONE, all green |
| GitHub bootstrap (`unzip-upload.yml`, `tests.yml`, `comuns.yml`, `_uploads/`), Cloudflare `teoremes.step-quiz.net` | PENDING (user) |
| Card in `ins/index.html`, row in `.github/profile/README.md` | PENDING (after first public release) |

## Decisions approved by the user (2026-10-23)

1. The spec's 14 theorems, in the spec's order.
2. Each theorem has a printable sheet (`fitxa.html?id=…`; `fitxa.html` prints all 14).
3. GeoMotor lives in `step-quiz-commons` (its README widened beyond the programming courses). This repo never
   edits `js/motor/geo-motor.js`; `.prettierignore` excludes it; `tests/geo-motor.test.js` only checks the copy.

4. (2026-10-23, later) **Look and feel copied from `geom`**: paper and ink, Source Serif 4 + JetBrains Mono (local
   woff2 copied from `geom` into `vendor/fonts/`, `css/fonts.css`), no cards or shadows, hairline rules, quiet
   buttons, one UI accent (pencil brown `--llapis`). Figure: one colour, sanguina (`--sanguina`), for the
   emphasised objects and the hint objects, as in `geom` (black = the given figure); aux in faint ink; «I després»
   in soft ink, dash-dot. The two-column layout with the sticky figure stays (the user wants the figure always on
   screen); the home page stays a grid of figures (without card decoration). Text colours used: `--tinta`,
   `--tinta-suau`, `--llapis` (all ≥ 4.5:1 on both papers, light and dark); `--tinta-fluixa` only for lines and
   disabled buttons. UI strings no longer name colours («en blau», «en verd» → the stroke style).

## Technical decisions (agent)

- **Theorem record** follows SPEC §14.2 with these concrete choices:
  - `construccio` is a list of compact tuples `[id, tipus, args, opcions?]` (GeoMotor types and args), expanded by
    `Construccio.munta`. `opcions.rol` ∈ `aux` (thin grey), `pista` (hidden until hint level 2 or the proof starts),
    `invisible` (never drawn); `et` = point label (`false` = none), `d` = label offset. `destacat` ids get the
    emphasised role; `iDespres.construccioExtra` objects get the `extra` role.
  - `trencada: { text, canvis }`: tuples with an existing id replace it in place; new ids are inserted just before
    the next replacement. The invariant is unchanged, so the same checker must fail.
  - `iDespres: { text, construccioExtra, vista? }`: an optional larger view while «I després» is open (Feuerbach's
    excircle).
  - `ordenats` (Ptolemy): points on a circle kept in counter-clockwise order, both by the generator and while
    dragging (a drag that would change the order is ignored), because the identity is for the convex quadrilateral.
  - `nota`: one optional line under the figure (what to drag, what to try).
  - `pistes` = geom's ladder without `iDespres` (it is the separate field); `figura` is a ≤ 3-word caption and
    reveals the `pista` objects. `demostracio` = step-reveal panels `{ text, provaPrimer? }` (SPEC §5.2).
- **Errors are relative** (`invariants.js`): distances divided by the figure size (max distance between free
  points), circle errors by the radius, equalities by the larger side. Tolerance 1e-9 for «es compleix»; the stress
  test asserts ≤ 1e-8 (spec). A checker returns `null` for degenerate input (coincident points, three parallel
  lines…). Observed maxima over 1000 configurations: 0 (Varignon) to 2·10⁻¹² (butterfly).
- **Stress test** (`resistencia.js`): seed `teoremes:<id>`; free points uniform in `limits`, points on a circle at a
  uniform angle, on a segment t ∈ [0,05, 0,95]. Degenerate rules per theorem (`areaMinima`, `angleMinim`,
  `distMinima`, `maxCoord`, default 1000) plus nulls; generates until 1000 good ones (cap 20 000 attempts). The broken
  variant uses the same seed. Report: «1000 de 1000 configuracions compleixen el teorema», discarded count (no reasons
  listed), broken variant «0 de 1000 configuracions…». `prova()` still returns `errorMax`, `errorMedia` and `pitjor`
  for the tests, but the UI shows none of them (the «pitjor configuració» button was removed).
- **Broken variants**: Varignon/mediatrius at one third instead of the midpoint; Euler with the incentre; nine points
  with midpoints of AG…; Napoleon with 50° isosceles; Miquel with E on the median; Simson, Ptolemy, Pascal with one
  point on a concentric circle of radius 5/4·R (or radius 5 vs 4); butterfly with M at 4/10; Monge with one internal
  centre; Van Aubel with equilateral apexes; Morley with the bisector at A instead of the trisector next to AB;
  Feuerbach with the circle centred at G tangent to BC. Tests: ≤ 10 of 1000 satisfy it and the mean error > 1e-3.
- **Independence** (spec §4.7): `teoremes.test.js` §4 recomputes Euler (O, G, H by Cramer), the nine-point radius
  (abc/4K), Napoleon's centres, Morley's side (8R sin sin sin), Feuerbach (NI = R/2 − r) and Van Aubel's centres
  without GeoMotor. The «I després» numerical claims (Fermat concurrence, Miquel centres similar to ABC, Simson
  through the midpoint of PH, Monge E12–I13–I23, Feuerbach excircle tangency, Varignon centroid, the butterfly
  relation with sign) were checked numerically before being written (not kept as tests).
- **Rendering** (`dibuix.js`): SVG text inserted with `innerHTML`; world coordinates with y flipped, lines clipped to
  the view (Liang–Barsky), strokes with `vector-effect: non-scaling-stroke` and CSS classes `r-<role>`; label and
  point sizes scale with the view width (base 16 cm). Free points get a transparent hit circle (`.toc`, r 0,45 cm,
  `tabindex=0`, `role=button`). No `xmlns` (inline SVG; keeps the "no http string" repo test).
- **Interaction triad**: drag (pointer capture on the figure container, `touch-action: none` only there); tap a
  point then tap the target (then it is deselected); keyboard (Tab, arrows 0,1 cm / 2°, Shift ×5, Enter selects,
  Esc deselects). During a drag GeoMotor gets `anterior` (branch continuity); on release `fixaBranques`.
- **No error figures on screen** (user decision, 2026-10-23): the live meter (log-scale bar + «error: 2·10⁻¹⁵»), the
  note about 10⁻⁹ and the «error màxim / mitjà» of the stress test were removed. Under the figure there is only the
  verdict (`#veredicte`: «Es compleix ✓», «No es compleix ✗» or «Configuració degenerada…»). Rationale: a correct
  proof guarantees the result; any representation carries measurement error. Tolerances live only in code and tests.
- **Storage**: only `teoremes:v1:pistes` ({ id: hints opened }), in try/catch.
- **Default figures** were tuned so that everything (except some hint objects) fits the view; Pascal's default
  hexagon is self-intersecting so that X, Y, Z are visible (searched numerically).
- **References** are books and articles without URLs (the repo test forbids http strings in `data/`). Section numbers
  were left out on purpose (not verified).

## Acceptance criteria (spec §14.6)

- [x] 14 theorems with drag, stress test, ladder, proof and *i després*.
- [x] GeoMotor consumed from commons, not copied by hand (synced by `sincronitza.py`; daily `comuns.yml`).
- [x] Projector mode (`?projector=1` or the button).

## Pending

- User: review the mathematics (`REVISIO.md`).
- User: create the repo workflows and Cloudflare project (steps given in the delivery message).
- After release: `ins` card and profile row.
