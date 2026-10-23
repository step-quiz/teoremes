# Project 21 — Teoremes que no t’esperes: specification

Copied from `SPEC-step-quiz-9-projects.md` (2026-10-18): the project section (§14), the shared components it uses
(§5.1–5.3) and the constraints and conventions every new repo follows (§2, §4). §1 (ecosystem) and §3 (bootstrapping)
are summarised at the end. **Where this spec and [`STATE.md`](STATE.md) disagree, `STATE.md` records the decision
taken and wins.**

## 14. Project 21: Teoremes que no t'esperes

**Repo:** `teoremes`. **Depends on:** GeoMotor (Project 17), moved to `step-quiz-commons` (§5.3). **Audience:** teachers and strong Batxillerat students. The register is adult and rigorous, in Catalan, with English names in brackets for searchability.

### 14.1 Intent

For each surprising theorem:
1. **drag**: the figure keeps the theorem true however you move it;
2. **stress test**: 1000 random configurations, with the worst error shown;
3. **climb the hint ladder** to a synthetic proof;
4. **i després**: the generalisation.

This is the upper floor of `geom`.

### 14.2 Theorem record (`data/teoremes/<id>.js`)

```js
{ id: 'napoleo', nom: 'Teorema de Napoleó', historia: '…',
  enunciat: '…',
  construccio: [ /* GeoMotor objects */ ],
  lliures: ['A', 'B', 'C'], limits: { x: [-5, 5], y: [-4, 4] },
  destacat: ['N1', 'N2', 'N3', 'tN'],          // the surprise, drawn emphasised
  invariant: { tipus: 'equilater', objectes: ['N1', 'N2', 'N3'] },
  degenerat: { areaMinima: 0.5 },              // configurations to skip in the stress test
  pistes: { … },                               // §5.1; level 2 may reveal auxiliary objects of the construction
  demostracio: '…',                            // own exposition (KaTeX)
  iDespres: { text: '…', construccioExtra: [ … ] },   // e.g. Fermat point
  referencies: ['…'] }
```

### 14.3 Invariant checkers (pure, relative tolerance, default 1e-9)

`colinears(P, Q, R)`, `concurrents(l1, l2, l3)`, `conciclics(A, B, C, D)`, `equilater(P, Q, R)`, `tangents(c1, c2)` (|d − (r1 ± r2)|), `igualtat(expr1, expr2)` (for Ptolemy: `AC·BD = AB·CD + AD·BC`).

- **Live meter.** While dragging, show the current error on a log-scale bar, e.g. «error: 2·10⁻¹⁵».
- **«Prova de resistència».**
  - Generate 1000 seeded configurations within `limits` and skip the degenerate ones.
  - Report «1000 de 1000 configuracions; error màxim 3·10⁻¹³».
  - Also report one deliberately broken variant to show what failure looks like: for example, Napoleon with isosceles triangles instead of equilateral ones.

### 14.4 Initial list (14; the user approves)

Ordered roughly by difficulty:
1. Varignon.
2. Concurrent perpendicular bisectors (warm-up).
3. Euler line.
4. Nine-point circle.
5. Napoleon (*i després*: Fermat point).
6. Miquel.
7. Simson line.
8. Ptolemy.
9. Butterfly.
10. Pascal on a circle.
11. Monge's three circles.
12. Van Aubel.
13. Morley.
14. Feuerbach (tangency).

Construction notes:
- **Morley:** `trisectriu(A, B, C, k)` rotates ray BA towards BC by `k/3` of the internal angle. Use the internal angle with an orientation-safe implementation, and test it on obtuse and reflex inputs.
- **Monge:** `centre-homotecia` of equal radii is at infinity, so the result is `null`; the stress test must skip those cases.
- **Pascal:** six `punt-sobre` points on one circle. The order of the vertices defines the hexagon; let the user reorder them to see self-intersecting hexagons still satisfy the theorem.
- **Proofs** are written in our own words. For Morley, follow Conway's "backward" idea in an own exposition. Attribute theorems to their authors; never copy proof texts from books or websites.

### 14.5 Tests

- For each theorem, 1000 seeded non-degenerate configurations satisfy the invariant within relative tolerance 1e-8.
- The construction references are valid.
- The hint ladder is complete.
- All KaTeX renders.
- The broken variant **fails** the invariant, which proves the checker can fail.
- No external requests.

### 14.6 Acceptance criteria

- [ ] 14 theorems with drag, stress test, ladder, proof and *i després*.
- [ ] GeoMotor consumed from commons, not copied by hand.
- [ ] Projector mode.

**Open questions for the user:**
- Approve the list.
- Should each theorem link to a printable sheet (figure + statement + ladder), as `geom` does?

## Shared components used here

### 5.1 Hint ladder (Projects 11, 19, 21; optionally 2 and 3)

Port the pattern from `geom` (`js/ui/detall.js`, data in `js/data/guies-dades.js`). Do not depend on `geom` at runtime: copy the code and note the origin in the file header.

```js
pistes: {
  encarrec:  '…',   // 0 · reformulate the task: what must you produce?
  concreta:  '…',   // 1 · particularise: try numbers, a special case
  figura:    'img/…' | { construccio: [...] },  // 2 · the key picture, ≤ 3 words
  tanca:     '…',   // 3 · what to look at, never the conclusion
  comprovacio: '…', // numerical prediction to check one's own answer
  iDespres:  '…'    // generalisation / next question
}
```

Levels are revealed one at a time and the revealed level is remembered per item.

### 5.2 Step reveal ("veure" panels)

Same mechanism as `geom`'s demos: a sequence of panels revealed one at a time, each with an optional "Prova-ho primer al paper" prompt before the content.

### 5.3 GeoMotor: dynamic-geometry engine (Projects 17 and 21)

Specified in detail in §12.2.
- **Where it is developed:** in `figures/js/motor/geo-motor.js`.
- **When Project 21 starts:** move it to `step-quiz-commons/fitxers/geo-motor.js`. Register both webs in `comuns.json` and add `comuns.yml` (template `plantilles/comuns.yml`) to both. Move its tests to commons as well.
- **Ask the user first.** Commons is currently described as "files shared by the programming courses", so its README must be updated to widen the scope.

## 2. Non-negotiable constraints

These are the user's standing rules and are encoded in the shared `CLAUDE.md` block of every repo.

1. **Static only.** HTML + CSS + vanilla JavaScript. No framework, no bundler, no build step for the site itself, and no server or backend. Generated files (data tables, a single-file analyser) are allowed if a script in `tools/` regenerates them deterministically and a test checks they are up to date.
2. **No network at runtime.** No CDN, no Google Fonts, no analytics, no external API. The school's web filter blocks CDNs (documented in `recu`). Vendor libraries locally (KaTeX: copy `operacions/vendor/katex-0.16.11/` including fonts). Use a system font stack or local `woff2` files, as `geom` does.
3. **Privacy.** No student personal data in any repo, no cookies, and nothing sent anywhere. Progress lives in `localStorage` only, and every access is wrapped in `try/catch`. The page must work when storage is unavailable. Anything students hand in goes through the teacher's Google Form, outside the site.
4. **Language.** Everything a student or teacher sees is in **Catalan**. Identifiers and comments are in Catalan, following `operacions/CONTRIBUTING.md` (English technical terms allowed). `README.md` is in Catalan. Agent-facing documents (`docs/STATE.md`, `docs/SPEC.md`, handoff notes) are in English. In `CLAUDE.md`, the shared block stays in Catalan verbatim.
5. **Licence.** Pedagogical content is CC BY-NC-SA 4.0; code is MIT. Every repo has `LICENSE` and `LLICENCIA.md`, copied from `step-quiz-commons/fitxers/`. Project 19 differs: see §13.1.
6. **Commits.** No commit message may ever contain `[skip ci]`, `[ci skip]` or `[cf-pages-skip]`, including commits made by workflows: Cloudflare Pages would not publish that commit.
7. **Tests before delivery.** Run the repo's tests and report the result to the user. A green result that silently skipped checks is a failure (see `repas`). Report skipped suites in yellow.
8. **Docs follow code.** If behaviour changes, update `README.md` and the describing documents in the same commit. Where possible, add a `docs_vs_codi.py` test that checks the numbers and paths the README quotes.
9. **Pedagogical style** (the user's motto: *keep it simple, step by step, learn by doing, enjoy the beauty of maths*), as design rules:
   - **One action per screen state.** The student does something before reading an explanation.
   - **Short text.** At most about 40 words of instructions visible at once on student screens (fewer in PI profiles).
   - **Feedback names the mistake, never just "incorrecte".** Show at most 2 feedback messages at a time.
   - **No gamification noise.** Stars and progress dots are fine; no leaderboards, streak pressure or loud animations.
   - **Every route ends in a "beauty moment"**: a surprising regularity, a generalisation, or a historical note.
   - **Hints never give the answer.** If a hint reveals the result it is not a hint (the `sol`/`geom` rule).

## 4. Shared technical conventions for all new repos

### 4.1 Module pattern and `file://`

The user and his colleagues often open pages by double-clicking, from a USB stick or a Chromebook download folder. **New repos must work under `file://`.** That rules out:
- ES modules (Chrome blocks module scripts on `file://`; `operacions` needs a local server for this reason);
- `fetch()` of local JSON;
- Web Workers loaded from files.

Use classic scripts with one namespace per file, as `inaba`, `geom`, `recu` and `prova1eso` do. Pure logic modules (no DOM) must also load in Node for tests. Use this dual export:

```js
/**
 * ============================================================================
 * PROJECTE: <repo> (Step Quiz, vanilla JS)
 * FITXER: js/motor/geo-motor.js
 * ROL: …
 * ARQUITECTURA: … (pur, sense DOM; el fan servir … i els tests de Node)
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.GeoMotor = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    // … codi privat …
    return { /* API pública */ };
});
```

- Data files: `window.CAMINA_REPTES = [...]`. Tests load them with `vm.runInNewContext` and a fake `window`, or with the same dual-export wrapper.
- Script order is explicit in the HTML: vendor → data → pure engines → renderers → controller. A test should parse each HTML and check that every referenced local file exists.
- Use Prettier settings compatible with `operacions/.prettierrc.json` (4 spaces, single quotes, 120 columns). Linting is optional for new repos; tests are not.

**Exception:** Project 12 lives in `operacions` and must follow that repo's ES-module architecture and lint rules exactly.

### 4.2 Seeded randomness and URL state

- Copy the RNG from `prova1eso/assets/js/atzar.js` (FNV-1a string hash → mulberry32; `enter(a,b)`, `tria`, `barreja`). **Never use `Math.random` for anything that must be reproducible.**
- Serialise shareable state in the URL hash (`#n=5&seed=K7M2P&…`). Readers must tolerate missing or garbage parameters and fall back to defaults. That a malformed URL breaks nothing should be a test.
- If generated content must stay stable across code changes (saved links), add fingerprint tests as in `combinades/tests/empremtes.json`. Changing a generator then means adding a new generator version, never silently changing old output.

### 4.3 Storage

- Key format: `<repo>:v<N>:<what>`, e.g. `geopla:v1:taula`.
- Wrap every read and write in `try/catch`. Treat a missing or corrupt value as "empty".
- Store per-viewer conveniences only. The site must be fully usable with storage disabled.

### 4.4 Catalan mathematical typography

| Thing | Rule |
|---|---|
| Decimal separator | Comma. Plain text `3,5`. In KaTeX write `3{,}5` (the braces stop KaTeX adding punctuation space). **Inputs accept both `,` and `.`.** |
| Thousands | No separator for 4 digits. For ≥ 5 digits use U+202F (narrow no-break space): `12 345`. Check what `repas`/`operacions` do and stay consistent. |
| Multiplication / division (ESO) | `·` (U+00B7, `\cdot`) and `:`. Never `x` or `*` in student-facing text. Batxillerat may use `\cdot` and fractions. |
| Quotes, apostrophe, *l·l* | `«…»`; typographic apostrophe `’` in prose (escape `'` inside JS single-quoted strings); `l·l` with U+00B7. |
| Units | Non-breaking space between number and unit: `5 m`, `10 s`. |
| Points, segments, angles | Points are upper-case italic (`$A$`). Segment `\overline{AB}`, length $AB$, angle `\widehat{ABC}`. |
| Intervals | Catalan school convention `[a, b]`, `(a, b)`; check `operacions/js/asimptotes` for the exact style used. |

### 4.5 Interaction, accessibility, devices

- **The interaction triad (from `inaba`).** Every drag interaction also works by tap-then-tap (select, then target) and by keyboard (Tab/arrows to move focus, Enter/Space to act, Esc to cancel, Backspace/Delete to remove).
- **Pointer events.** Use Pointer Events with `setPointerCapture`. Put `touch-action: none` **only** on manipulable surfaces, so the page still scrolls elsewhere.
- **Target sizes.** At least 44 × 44 CSS px on touch, at least 24 px with a mouse (WCAG 2.5.8).
- **Feedback regions.** Use `aria-live="polite"`. Colour is never the only carrier of meaning (add an icon or a word). Text contrast is at least 4.5:1.
- **Motion.** Animations of 300 ms or less; disable them under `prefers-reduced-motion: reduce`.
- **Dark mode.** Tokens on `:root`, overridden under `@media (prefers-color-scheme: dark)`. **Print is always black on white.**
- **Target viewports.** 360 px phone (portrait), 768 px tablet, 1366 × 768 school Chromebook, 1280 × 720 projector. Offer a projector mode where it makes sense: large type, no chrome (as in `geom`).
- **Print.** `@page { size: A4; margin: 15mm; }`. Show a one-time note telling the user to untick the browser's "Headers and footers" (the `prova1eso`/`recu` wording).

### 4.6 Cache busting

Browsers keep old CSS/JS after a deploy (`combinades` was bitten by this). Reference assets with `?v=<hash>`. Compute the hash from file content with a `tools/versio.py` script (as `geom/actualitza_versio_css.py` does), and add a test that fails when a `?v=` is stale.

### 4.7 Tests philosophy

- **Independence.** Tests recompute results independently of the code under test (`repas` principle: using the engine to check the engine lets a bug pass on both sides).
- **Runner.** `node tests/run-all.js` runs everything and exits 1 on any failure. Core tests need zero installs. Browser tests (Playwright) are optional locally; in CI install them explicitly (`npm install --no-save playwright && npx playwright install --with-deps chromium`).
- **Always include:**
  - data validation;
  - determinism;
  - "every referenced file exists";
  - "no external URL in `src`/`href` of scripts, styles or images" (static scan);
  - `docs_vs_codi.py` (README numbers match the data).

### 4.8 Git workflow with direct access

1. Work on a branch `claude/<repo>-<topic>`. Commit in small logical steps. Commit messages are **in Catalan** and say what and why; no skip-CI tokens.
2. Push, open a pull request, and wait for `tests.yml` to pass. Give the user the Cloudflare preview URL (*Cloudflare → project → Deployments*, or the PR check). He reviews on his own devices.
3. Merge only with the user's OK. Never force-push `main`.
4. If push access fails, fall back to the user's ZIP workflow. ZIP root = repo root, no wrapping folder, nothing under `.github/`. He uploads it to `_uploads/`.
5. When the user must do something (pull, push, commit, upload a ZIP, compile), explain it **in Catalan, in numbered steps, with copy-paste command blocks, saying what each command does** (his standing preference).

## Summary of §1 and §3

- About 27 public static repos under `github.com/step-quiz`, each published by Cloudflare Pages from `main` to
  `<repo>.step-quiz.net`. `geom` is the model for the hint ladder, projector mode and print sheets; `figures`
  (Project 17) developed GeoMotor, now in `step-quiz-commons` (`fitxers/geo-motor.js`, synced daily by each web's
  `.github/workflows/comuns.yml` running `sincronitza.py`).
- New repo skeleton: `index.html`, `css/tokens.css`, `css/<repo>.css`, `js/…`, `data/*.js`, `vendor/katex-0.16.11/`,
  `tests/run-all.js`, `tests/*.test.js`, `tests/docs_vs_codi.py`, `tools/`, `docs/SPEC.md`, `docs/STATE.md`,
  `README.md` (Catalan, ends with the attribution block), `CLAUDE.md` (shared block verbatim + repo section),
  `LICENSE`, `LLICENCIA.md`, `_headers`, `_uploads/.gitkeep`, `.gitignore`, `.github/workflows/tests.yml`,
  `.github/workflows/unzip-upload.yml`, `favicon.svg`.
- After the first public release: a card in `ins/index.html` and a row in `.github/profile/README.md`.
