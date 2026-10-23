/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/napoleo.js
 * ROL: 5. Teorema de Napoleó (Napoleon’s theorem): enunciat, construcció de GeoMotor,
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
    id: 'napoleo',
    ordre: 5,
    nom: 'Teorema de Napoleó',
    nomAngles: 'Napoleon’s theorem',
    historia:
        'Porta el nom de Napoleó Bonaparte, que era afeccionat a la geometria, però no hi ha cap prova que el descobrís ell. Va aparèixer publicat el 1825 en una revista anglesa de problemes, sense el seu nom.',
    enunciat:
        'Sobre cada costat d’un triangle qualsevol $ABC$ construïm un triangle equilàter cap a fora. Els centres $L$, $M$, $N$ d’aquests tres equilàters formen sempre un triangle equilàter.',
    nota: 'Si passes $C$ a l’altre costat de $AB$, els equilàters queden cap a dins: continua valent.',
    vista: { x0: -10, y0: -7.5, x1: 10, y1: 7.5 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C'],
    construccio: [
        ['A', 'punt', [-3, -1.2]],
        ['B', 'punt', [3.5, -1.2]],
        ['C', 'punt', [-1, 3]],
        ['sAB', 'segment', ['A', 'B']],
        ['sBC', 'segment', ['B', 'C']],
        ['sCA', 'segment', ['C', 'A']],
        ['Z', 'gir', ['B', 'A', -60]],
        ['X', 'gir', ['C', 'B', -60]],
        ['Y', 'gir', ['A', 'C', -60]],
        ['tZ', 'poligon', ['A', 'Z', 'B'], { rol: 'aux' }],
        ['tX', 'poligon', ['B', 'X', 'C'], { rol: 'aux' }],
        ['tY', 'poligon', ['C', 'Y', 'A'], { rol: 'aux' }],
        ['N', 'baricentre', ['A', 'B', 'Z']],
        ['L', 'baricentre', ['B', 'C', 'X']],
        ['M', 'baricentre', ['C', 'A', 'Y']],
        ['pN', 'poligon', ['L', 'M', 'N']],
        ['cX', 'circumcercle', ['B', 'X', 'C'], { rol: 'pista' }],
        ['cY', 'circumcercle', ['C', 'Y', 'A'], { rol: 'pista' }],
        ['cZ', 'circumcercle', ['A', 'Z', 'B'], { rol: 'pista' }],
    ],
    destacat: ['L', 'M', 'N', 'pN'],
    invariant: { tipus: 'equilater', objectes: ['L', 'M', 'N'] },
    degenerat: { areaMinima: 3, angleMinim: 10 },
    trencada: {
        text: 'Si en lloc de triangles equilàters fem triangles isòsceles amb un angle de $50^\\circ$ (i no de $60^\\circ$) entre els dos costats iguals, els seus baricentres ja no formen un triangle equilàter.',
        canvis: [
            ['Z', 'gir', ['B', 'A', -50]],
            ['X', 'gir', ['C', 'B', -50]],
            ['Y', 'gir', ['A', 'C', -50]],
        ],
    },
    pistes: {
        encarrec: 'Has de provar que el triangle $LMN$ té els tres angles de $60^\\circ$ (o els tres costats iguals).',
        concreta:
            'Fes-ho amb $A=(0,0)$, $B=(2,0)$, $C=(0,2)$. El centre d’un equilàter de costat $\\ell$ és a una distància $\\tfrac{\\ell}{2\\sqrt3}$ del costat.',
        figura: 'Tres circumferències',
        tanca: 'Les circumferències circumscrites a dos dels equilàters es tallen en $C$ i en un altre punt $F$. Quant fa l’angle $\\widehat{BFC}$? I la tercera circumferència, on talla?',
        comprovacio:
            'En el cas concret, $N=(1,-\\tfrac{1}{\\sqrt3})$, $M=(-\\tfrac{1}{\\sqrt3},1)$ i $L=(1+\\tfrac{1}{\\sqrt3},1+\\tfrac{1}{\\sqrt3})$; els tres costats de $LMN$ fan $\\sqrt2\\,(1+\\tfrac{1}{\\sqrt3})\\approx 2{,}23$.',
    },
    demostracio: [
        {
            text: 'Siguin $X$, $Y$, $Z$ els vèrtexs exteriors dels equilàters sobre $\\overline{BC}$, $\\overline{CA}$, $\\overline{AB}$, i $L$, $M$, $N$ els seus centres, que també ho són de les circumferències circumscrites.',
        },
        {
            text: 'Les circumferències de $BCX$ i de $CAY$ es tallen en $C$ i en un altre punt $F$. Com que $BXCF$ és inscrit i $\\widehat{BXC}=60^\\circ$, $\\widehat{BFC}=180^\\circ-60^\\circ=120^\\circ$. Igualment, $\\widehat{CFA}=120^\\circ$.',
            provaPrimer: 'Quant fa, doncs, l’angle $\\widehat{AFB}$?',
        },
        {
            text: 'Llavors $\\widehat{AFB}=360^\\circ-120^\\circ-120^\\circ=120^\\circ$ i, com que $\\widehat{AZB}=60^\\circ$, $AZBF$ també és inscrit: les tres circumferències passen per $F$.',
        },
        {
            text: 'La corda comuna de dues circumferències és perpendicular a la recta dels centres: $MN\\perp AF$, $NL\\perp BF$ i $LM\\perp CF$.',
        },
        {
            text: 'Les rectes $NM$ i $NL$ són perpendiculars a $FA$ i $FB$, que formen $120^\\circ$: l’angle de $LMN$ a $N$ és $180^\\circ-120^\\circ=60^\\circ$. Igual a $L$ i a $M$: $LMN$ és equilàter. ∎ (Hem suposat que $F$ cau dins del triangle, és a dir, que cap angle no passa de $120^\\circ$; amb angles orientats el raonament val sempre.)',
        },
    ],
    iDespres: {
        text: 'El punt $F$ on es tallen les tres circumferències és el punt de Fermat: les rectes $AX$, $BY$ i $CZ$ també hi passen (a la figura) i, si cap angle del triangle no arriba a $120^\\circ$, $F$ és el punt que fa mínima la suma $FA+FB+FC$. A més, la diferència entre les àrees dels triangles de Napoleó exterior i interior és l’àrea de $ABC$.',
        construccioExtra: [
            ['rAX', 'recta', ['A', 'X'], { rol: 'invisible' }],
            ['rBY', 'recta', ['B', 'Y'], { rol: 'invisible' }],
            ['sAX', 'segment', ['A', 'X']],
            ['sBY', 'segment', ['B', 'Y']],
            ['sCZ', 'segment', ['C', 'Z']],
            ['Fm', 'interseccio', ['rAX', 'rBY', 0], { et: 'F' }],
        ],
    },
    referencies: [
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
        'D. Wells: The Penguin Dictionary of Curious and Interesting Geometry. Penguin, 1991.',
    ],
});
