# Teoremes que no t’esperes

Catorze teoremes de geometria que costa creure, per a professorat i alumnat fort de batxillerat. És el pis de dalt de [geom](https://geom.step-quiz.net).

Web: https://teoremes.step-quiz.net

Cada teorema té quatre esglaons:

1. **Arrossega.** Una figura dinàmica: mous els punts lliures i el teorema continua sent cert. No hi ha cap veredicte de l’ordinador (ni xifres d’error ni «es compleix»): el que assegura el teorema és la demostració, no la mesura.
2. **Trenca una hipòtesi.** El botó «Variant trencada» canvia una hipòtesi (un teorema fals que s’hi assembla) i una frase diu què es perd; a la figura es veu què canvia.
3. **Demostra-ho.** L’**escala de pistes** de geom (què has de fer, un cas concret, la figura, on mirar, comprovació; cap pista no dona la resposta) i una **demostració** pas a pas, amb «Prova-ho primer al paper» abans d’alguns passos.
4. **I després?** La generalització o la pregunta següent, sovint amb objectes nous a la figura.

Hi ha **mode projector** i una **fitxa per imprimir** de cada teorema (figura, enunciat, escala de pistes i espai per a la demostració).

## Els 14 teoremes

| Id | Teorema | Què es comprova |
|---|---|---|
| `varignon` | Teorema de Varignon | paral·lelogram |
| `mediatrius` | Les tres mediatrius | tres rectes concurrents |
| `euler` | La recta d’Euler | tres punts alineats |
| `nou-punts` | La circumferència dels nou punts | punts concíclics |
| `napoleo` | Teorema de Napoleó | triangle equilàter |
| `miquel` | Teorema de Miquel | punts concíclics |
| `simson` | La recta de Simson | tres punts alineats |
| `ptolemeu` | Teorema de Ptolemeu | una igualtat de longituds |
| `papallona` | Teorema de la papallona | una igualtat de longituds |
| `pascal` | Teorema de Pascal | tres punts alineats |
| `monge` | Teorema de Monge | tres punts alineats |
| `van-aubel` | Teorema de Van Aubel | segments iguals i perpendiculars |
| `morley` | Teorema de Morley | triangle equilàter |
| `feuerbach` | Teorema de Feuerbach | circumferències tangents |

Les demostracions les ha redactat la IA amb paraules pròpies i **les revisa el professor** (`docs/REVISIO.md`). Les figures són construccions dibuixades per codi en aquest web; els teoremes es diuen pel nom dels seus autors.

## Cap veredicte de l’ordinador a la pantalla

El web **no mostra mai** errors, distàncies residuals, toleràncies, «es compleix ✓/✗» ni recomptes del tipus «1000 de 1000»: la demostració sintètica és la que assegura el resultat, precisament per deixar enrere els errors de mesura, i cap raonament empíric o estadístic no la substitueix.

Per dins, els tests (només per al desenvolupament) sí que fan servir números: calculen un error relatiu (per a tres punts alineats, la distància del tercer a la recta dels altres dos, dividida per la mida de la figura) i fan la **prova de resistència**: 1000 configuracions a l’atzar (amb llavor) per teorema, que han de complir-lo, i la variant trencada, que ha de fallar. Així es comprova que les construccions del codi estan ben fetes. Es descarten les configuracions degenerades (triangles gairebé plans, punts massa junts, talls gairebé a l’infinit).

## Com es mou la figura

- **Arrossegant** un punt gros (amb el ratolí o el dit).
- **Tocant** un punt i després el lloc on ha d’anar.
- Amb el **teclat**: Tab fins al punt, les fletxes el mouen (Maj: més de pressa), Retorn el tria, Esc el deixa.

## Adreces

- `teorema.html?id=napoleo`: un teorema. També `?projector=1` (mode projector).
- `fitxa.html?id=napoleo`: la fitxa per imprimir d’un teorema; `fitxa.html`, totes.

Només es desa en aquest navegador quantes pistes has obert de cada teorema (`teoremes:v1:pistes`); si no es pot, funciona igual.

## Com provar-ho a l’ordinador

No cal instal·lar res: obre `index.html` amb doble clic. No fa cap petició a internet: KaTeX (les fórmules) és dins del repositori.

## Com es veu

L’aspecte és el de [geom](https://geom.step-quiz.net): paper i tinta, lletra de llibre, sense targetes ni ombres, separadors fins i botons discrets. A la interfície hi ha un sol color, el marró llapis. A la figura n’hi ha un altre, la sanguina: el negre és la figura de l’enunciat, i la sanguina és la sorpresa (el que el teorema diu) i el que s’hi afegeix a les pistes. El color no és mai l’única pista: el destacat és més gruixut, les pistes són discontínues i «I després» té un traç de ratlla i punt. La figura és a l’esquerra i no se’n va de la pantalla mentre llegeixes les pistes i la demostració (a l’ordinador); al mòbil, tot va en una columna.

## Com està fet

HTML, CSS i JavaScript sense compilació, amb scripts clàssics perquè funcioni amb doble clic.

```
index.html               la portada
teorema.html             un teorema: figura, variant trencada, pistes, demostració, i després
fitxa.html               les fitxes per imprimir
css/fonts.css            les lletres (Source Serif 4 i JetBrains Mono, les de geom)
css/tokens.css           colors (clar i fosc), també els de la figura
css/teoremes.css         estils, mode projector i impressió
data/teoremes/*.js       un fitxer per teorema
vendor/katex-0.16.11/    KaTeX (llicència MIT), només les fonts woff2
vendor/fonts/            les lletres en woff2 (llicència SIL OFL 1.1)
js/motor/geo-motor.js    GeoMotor, el motor de geometria dinàmica (FITXER COMÚ)
js/motor/atzar.js        atzar amb llavor (el de prova1eso)
js/motor/text.js         separa el text i les fórmules entre $…$
js/motor/invariants.js   els comprovadors (alineats, concurrents, concíclics…)
js/motor/construccio.js  de les dades d’un teorema a una figura de GeoMotor
js/motor/resistencia.js  configuracions a l’atzar i la prova de resistència dels tests (1000 configuracions)
js/motor/dibuix.js       la figura en SVG
js/ui/textos.js          els textos de la interfície
js/ui/comu.js            fórmules amb KaTeX, pistes desades
js/ui/index.js           la portada
js/ui/teorema.js         la pàgina d’un teorema
js/ui/fitxa.js           les fitxes
```

El **GeoMotor** és el mateix de [figures](https://figures.step-quiz.net): ve de `step-quiz-commons` i el workflow «Fitxers comuns» (`.github/workflows/comuns.yml`) el posa al dia cada dia. No s’edita aquí, sinó a `step-quiz-commons`, on hi ha els seus tests.

### Com és un teorema

Cada fitxer de `data/teoremes/` té l’enunciat, la història, la construcció (una llista d’objectes de GeoMotor, cadascun amb el seu paper: normal, auxiliar, pista, invisible), els punts lliures, l’invariant (què s’ha de complir), les regles per descartar configuracions degenerades, la variant trencada, l’escala de pistes, la demostració, «I després» (amb objectes nous) i les referències.

## Proves

```
node tests/run-all.js
```

| Fitxer | Què comprova |
|---|---|
| `tests/geo-motor.test.js` | Que el GeoMotor és el fitxer comú i té els tipus que fan servir els teoremes |
| `tests/invariants.test.js` | Cada comprovador amb casos fets a mà (sense GeoMotor): es compleix, no es compleix, degenerat |
| `tests/teoremes.test.js` | Les dades; les referències de cada construcció; 1000 configuracions per teorema amb error ≤ 10⁻⁸; la variant trencada falla; sis teoremes recalculats amb fórmules clàssiques; KaTeX; pistes; SVG ben format |
| `tests/repo.test.js` | Fitxers citats, ordre dels scripts, cap petició a internet, cap `Math.random`, capçaleres, textos curts, llicència |
| `tools/versio.py --comprova` | Que els `?v=` dels HTML són al dia (`python3 tools/versio.py` els posa al dia) |
| `tests/docs_vs_codi.py` | Que aquest README diu el mateix que el codi (teoremes, comprovadors, claus) |

GitHub els passa a cada pujada a `main` (`.github/workflows/tests.yml`).

<!-- atribucio-centre:inici -->

---

Material desenvolupat per **David Arso Civil** per al Departament de Matemàtiques de l'INS Miquel Tarradell.
Contingut sota CC BY-NC-SA 4.0, codi sota llicència MIT. Vegeu [`LLICENCIA.md`](LLICENCIA.md).

<!-- atribucio-centre:final -->
