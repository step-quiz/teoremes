# Revisió matemàtica dels teoremes

La IA redacta cada teorema (enunciat, història, construcció, variant trencada, pistes, demostració, «I després» i
referències); **el professor en revisa la matemàtica**. Una fila per teorema. Estats: *esborrany* (redactat, pendent
de revisió) → *revisat* (el professor hi està d'acord, amb data) → *publicat*.

Per revisar un teorema: obre `teorema.html?id=<id>`, puja tota l'escala de pistes, fes tota la demostració, obre
«I després» i prova la variant trencada. Les dades són a `data/teoremes/<id>.js`.

Tot el que és **numèric** ja està comprovat pels tests (1000 configuracions per teorema, la variant trencada falla,
sis teoremes recalculats amb fórmules clàssiques, i les afirmacions numèriques d'«I després» verificades a part
abans d'escriure-les). El que cal revisar és **el raonament** de les demostracions i **la història i les referències**.

| Id | Teorema | Redactat | Revisat pel professor | Publicat | Què cal mirar especialment |
|---|---|---|---|---|---|
| `varignon` | Teorema de Varignon | 2026-10-23 | pendent | — | Títol de l’obra de Varignon (1731). |
| `mediatrius` | Les tres mediatrius | 2026-10-23 | pendent | — | Referència a Euclides IV.5. |
| `euler` | La recta d’Euler | 2026-10-23 | pendent | — | Títol i any de l’article d’Euler (1767). |
| `nou-punts` | La circumferència dels nou punts | 2026-10-23 | pendent | — | Atribució a Brianchon i Poncelet (1821). |
| `napoleo` | Teorema de Napoleó | 2026-10-23 | pendent | — | La demostració suposa $F$ dins del triangle (es diu); la publicació del 1825. |
| `miquel` | Teorema de Miquel | 2026-10-23 | pendent | — | La demostració suposa $M$ dins del triangle (es diu). I després: triangle dels centres semblant a $ABC$. |
| `simson` | La recta de Simson | 2026-10-23 | pendent | — | Demostració amb angles orientats; atribució a Wallace (1797). |
| `ptolemeu` | Teorema de Ptolemeu | 2026-10-23 | pendent | — | Al web l’ordre de $A$, $B$, $C$, $D$ no es pot canviar arrossegant (el quadrilàter és sempre convex). |
| `papallona` | Teorema de la papallona | 2026-10-23 | pendent | — | La demostració suposa $X$, $Y$ dins del cercle (es diu). I després: la relació amb signe quan $M$ no és el punt mitjà. |
| `pascal` | Teorema de Pascal | 2026-10-23 | pendent | — | Menelau amb segments amb signe. |
| `monge` | Teorema de Monge | 2026-10-23 | pendent | — | Atribució a Monge; la demostració a l’espai d’«I després». |
| `van-aubel` | Teorema de Van Aubel | 2026-10-23 | pendent | — | Demostració amb nombres complexos; referència del 1878. |
| `morley` | Teorema de Morley | 2026-10-23 | pendent | — | Versió pròpia de la idea de Conway (al revés) amb el teorema del sinus; «18 triangles equilàters» a I després. |
| `feuerbach` | Teorema de Feuerbach | 2026-10-23 | pendent | — | Demostració amb vectors (origen al circumcentre), Heró i $abc=4Rrs$. |

L'usuari va aprovar la llista de 14 teoremes i les fitxes per imprimir (2026-10-23). Quan revisis un teorema,
escriu-hi la data a «Revisat pel professor» i, si cal canviar res, digues-ho: el canvi i la nova fila van al mateix commit.
