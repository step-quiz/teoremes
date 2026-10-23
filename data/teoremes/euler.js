/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/euler.js
 * ROL: 3. La recta d’Euler (Euler line): enunciat, construcció de GeoMotor,
 *      invariant, variant trencada, escala de pistes, demostració i «I després».
 * ARQUITECTURA: Dades. Al navegador s'afegeix a window.TEOREMES; amb Node,
 *      s'exporta. Format: docs/SPEC.md (§ «Theorem record») i js/motor/construccio.js
 *      (les tuples). Text amb fórmules entre $…$ (KaTeX). Revisió matemàtica:
 *      docs/REVISIO.md.
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, t) {
    'use strict';
    if (typeof module === 'object' && module.exports) module.exports = t;
    else (arrel.TEOREMES = arrel.TEOREMES || []).push(t);
})(typeof self !== 'undefined' ? self : this, {
    id: 'euler',
    ordre: 3,
    nom: 'La recta d’Euler',
    nomAngles: 'Euler line',
    historia:
        'Leonhard Euler ho va publicar el 1767, en un article on calculava els punts notables del triangle amb coordenades. El baricentre, el circumcentre i l’ortocentre eren coneguts des dels grecs, però ningú no s’havia adonat que sempre estan alineats.',
    enunciat:
        'En qualsevol triangle, el circumcentre $O$, el baricentre $G$ i l’ortocentre $H$ estan alineats, i $HG=2\\,GO$.',
    vista: { x0: -8, y0: -5.5, x1: 8, y1: 5.5 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C'],
    construccio: [
        ['A', 'punt', [-5, -3.5]],
        ['B', 'punt', [5, -3.5]],
        ['C', 'punt', [-2.5, 3.5]],
        ['sAB', 'segment', ['A', 'B']],
        ['sBC', 'segment', ['B', 'C']],
        ['sCA', 'segment', ['C', 'A']],
        ['G', 'baricentre', ['A', 'B', 'C']],
        ['O', 'circumcentre', ['A', 'B', 'C']],
        ['H', 'ortocentre', ['A', 'B', 'C']],
        ['rE', 'recta', ['O', 'H']],
        ['A1', 'punt-mig', ['B', 'C'], { et: false, rol: 'pista' }],
        ['B1', 'punt-mig', ['C', 'A'], { et: false, rol: 'pista' }],
        ['C1', 'punt-mig', ['A', 'B'], { et: false, rol: 'pista' }],
        ['pM', 'poligon', ['A1', 'B1', 'C1'], { rol: 'pista' }],
        ['hA', 'perpendicular', ['sBC', 'A'], { rol: 'pista' }],
        ['mBC', 'mediatriu', ['B', 'C'], { rol: 'pista' }],
    ],
    destacat: ['G', 'O', 'H', 'rE'],
    invariant: { tipus: 'colinears', objectes: ['O', 'G', 'H'] },
    degenerat: { areaMinima: 3, angleMinim: 10 },
    trencada: {
        text: 'Si en lloc del baricentre hi posem l’incentre $I$ (on es tallen les bisectrius), els punts $O$, $I$ i $H$ ja no estan alineats (tret que el triangle sigui isòsceles).',
        canvis: [['G', 'incentre', ['A', 'B', 'C'], { et: 'I' }]],
    },
    pistes: {
        encarrec: 'Cal veure que $H$, $G$ i $O$ són en una recta i que $G$ divideix $\\overline{HO}$ en la raó $2:1$.',
        concreta: 'Pren el triangle rectangle $A=(0,0)$, $B=(6,0)$, $C=(0,4)$ i calcula els tres punts.',
        figura: 'Triangle medial',
        tanca: 'L’homotècia de centre $G$ i raó $-\\tfrac12$ porta cada vèrtex al punt mitjà del costat oposat. On porta l’altura que surt de $A$?',
        comprovacio:
            'En el cas concret, $H=(0,0)$, $G=(2,\\tfrac43)$ i $O=(3,2)$: $\\overrightarrow{HG}=(2,\\tfrac43)$ és el doble de $\\overrightarrow{GO}=(1,\\tfrac23)$.',
    },
    demostracio: [
        {
            text: "El baricentre $G$ divideix cada mitjana en la raó $2:1$. Per tant, l’homotècia $h$ de centre $G$ i raó $-\\tfrac12$ porta $A$, $B$, $C$ als punts mitjans $A'$, $B'$, $C'$ dels costats oposats.",
        },
        {
            text: "Una homotècia conserva les direccions. L’altura per $A$ és perpendicular a $\\overline{BC}$; la seva imatge passa per $h(A)=A'$ i també és perpendicular a $\\overline{BC}$: és la mediatriu de $\\overline{BC}$.",
            provaPrimer: 'Abans de llegir-ho: quina recta és la imatge de l’altura que surt de $A$?',
        },
        {
            text: 'Passa el mateix amb les altres dues altures. Com que $H$ és a les tres altures, $h(H)$ és a les tres mediatrius: $h(H)=O$.',
        },
        {
            text: 'Això vol dir que $\\overrightarrow{GO}=-\\tfrac12\\,\\overrightarrow{GH}$: $O$, $G$ i $H$ estan alineats, $G$ és entre tots dos i $HG=2\\,GO$. ∎ (Si el triangle és equilàter, els tres punts coincideixen i no hi ha recta.)',
        },
    ],
    iDespres: {
        text: 'El punt mitjà $N$ de $\\overline{OH}$ també és a la recta d’Euler: és el centre de la circumferència dels nou punts (el teorema següent). I amb vectors, prenent $O$ com a origen, tot es redueix a $H=A+B+C$ i $G=\\tfrac{A+B+C}{3}$.',
        construccioExtra: [['N', 'punt-mig', ['O', 'H']]],
    },
    referencies: [
        'L. Euler: «Solutio facilis problematum quorundam geometricorum difficillimorum». Novi Commentarii Academiae Scientiarum Petropolitanae 11 (1767).',
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
    ],
});
