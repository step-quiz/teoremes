/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/van-aubel.js
 * ROL: 12. Teorema de Van Aubel (Van Aubel’s theorem): enunciat, construcció de GeoMotor,
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
    id: 'van-aubel',
    ordre: 12,
    nom: 'Teorema de Van Aubel',
    nomAngles: 'Van Aubel’s theorem',
    historia:
        'Henricus Hubertus van Aubel el va publicar el 1878. És un parent proper del teorema de Napoleó: allà hi ha triangles equilàters sobre un triangle, aquí quadrats sobre un quadrilàter.',
    enunciat:
        'Sobre cada costat d’un quadrilàter qualsevol $ABCD$ construïm un quadrat cap a fora, amb centres $P$, $Q$, $R$, $S$ (sobre $\\overline{AB}$, $\\overline{BC}$, $\\overline{CD}$, $\\overline{DA}$). Els segments $\\overline{PR}$ i $\\overline{QS}$ són iguals i perpendiculars.',
    nota: 'Prova de fer el quadrilàter còncau.',
    vista: { x0: -8, y0: -6, x1: 8, y1: 6 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C', 'D'],
    construccio: [
        ['A', 'punt', [-2, -1.5]],
        ['B', 'punt', [1.6, -1.8]],
        ['C', 'punt', [2.2, 1]],
        ['D', 'punt', [-1.2, 1.5]],
        ['sAB', 'segment', ['A', 'B']],
        ['sBC', 'segment', ['B', 'C']],
        ['sCD', 'segment', ['C', 'D']],
        ['sDA', 'segment', ['D', 'A']],
        ['ab2', 'gir', ['A', 'B', 90], { et: false, rol: 'invisible' }],
        ['ab1', 'gir', ['B', 'A', -90], { et: false, rol: 'invisible' }],
        ['P', 'punt-mig', ['A', 'ab2']],
        ['qAB', 'poligon', ['A', 'B', 'ab2', 'ab1'], { rol: 'aux' }],
        ['bc2', 'gir', ['B', 'C', 90], { et: false, rol: 'invisible' }],
        ['bc1', 'gir', ['C', 'B', -90], { et: false, rol: 'invisible' }],
        ['Q', 'punt-mig', ['B', 'bc2']],
        ['qBC', 'poligon', ['B', 'C', 'bc2', 'bc1'], { rol: 'aux' }],
        ['cd2', 'gir', ['C', 'D', 90], { et: false, rol: 'invisible' }],
        ['cd1', 'gir', ['D', 'C', -90], { et: false, rol: 'invisible' }],
        ['R', 'punt-mig', ['C', 'cd2']],
        ['qCD', 'poligon', ['C', 'D', 'cd2', 'cd1'], { rol: 'aux' }],
        ['da2', 'gir', ['D', 'A', 90], { et: false, rol: 'invisible' }],
        ['da1', 'gir', ['A', 'D', -90], { et: false, rol: 'invisible' }],
        ['S', 'punt-mig', ['D', 'da2']],
        ['qDA', 'poligon', ['D', 'A', 'da2', 'da1'], { rol: 'aux' }],
        ['sPR', 'segment', ['P', 'R']],
        ['sQS', 'segment', ['Q', 'S']],
        ['sBD', 'segment', ['B', 'D'], { rol: 'pista' }],
        ['Md', 'punt-mig', ['B', 'D'], { rol: 'pista', et: 'M' }],
        ['sMP', 'segment', ['Md', 'P'], { rol: 'pista' }],
        ['sMS', 'segment', ['Md', 'S'], { rol: 'pista' }],
        ['sMQ', 'segment', ['Md', 'Q'], { rol: 'pista' }],
        ['sMR', 'segment', ['Md', 'R'], { rol: 'pista' }],
    ],
    destacat: ['P', 'Q', 'R', 'S', 'sPR', 'sQS'],
    invariant: { tipus: 'iguals-perpendiculars', objectes: ['P', 'Q', 'R', 'S'] },
    degenerat: { areaMinima: 2, distMinima: 0.8 },
    trencada: {
        text: 'Si en lloc de quadrats hi posem triangles equilàters (i en prenem el vèrtex de fora), els segments $\\overline{PR}$ i $\\overline{QS}$ ja no són iguals ni perpendiculars.',
        canvis: [
            ['P', 'gir', ['B', 'A', -60]],
            ['qAB', 'poligon', ['A', 'P', 'B'], { rol: 'aux' }],
            ['Q', 'gir', ['C', 'B', -60]],
            ['qBC', 'poligon', ['B', 'Q', 'C'], { rol: 'aux' }],
            ['R', 'gir', ['D', 'C', -60]],
            ['qCD', 'poligon', ['C', 'R', 'D'], { rol: 'aux' }],
            ['S', 'gir', ['A', 'D', -60]],
            ['qDA', 'poligon', ['D', 'S', 'A'], { rol: 'aux' }],
        ],
    },
    pistes: {
        encarrec: 'Has de veure que $\\overrightarrow{QS}$ s’obté girant $\\overrightarrow{PR}$ un angle recte.',
        concreta: 'Fes-ho amb el rectangle $A=(0,0)$, $B=(4,0)$, $C=(4,2)$, $D=(0,2)$.',
        figura: 'Un punt mitjà',
        tanca: 'Sigui $M$ el punt mitjà de la diagonal $\\overline{BD}$. Mira els segments $\\overline{MP}$ i $\\overline{MS}$, i també $\\overline{MQ}$ i $\\overline{MR}$.',
        comprovacio:
            'En el cas concret, $P=(2,-2)$, $Q=(5,1)$, $R=(2,4)$ i $S=(-1,1)$: $\\overrightarrow{PR}=(0,6)$ i $\\overrightarrow{QS}=(-6,0)$.',
    },
    demostracio: [
        {
            text: 'Pensem els punts com a nombres complexos $a$, $b$, $c$, $d$, amb el quadrilàter recorregut en sentit antihorari (si no, canvieu $-i$ per $i$). Girar un vector $-90^\\circ$ és multiplicar-lo per $-i$.',
        },
        {
            text: 'El centre del quadrat sobre $\\overline{AB}$ és el punt mitjà del costat més mig costat girat cap a fora: $P=\\tfrac{a+b}{2}-i\\,\\tfrac{b-a}{2}$. Igualment, $Q=\\tfrac{b+c}{2}-i\\,\\tfrac{c-b}{2}$, $R=\\tfrac{c+d}{2}-i\\,\\tfrac{d-c}{2}$ i $S=\\tfrac{d+a}{2}-i\\,\\tfrac{a-d}{2}$.',
            provaPrimer: 'Calcula $R-P$ i $S-Q$.',
        },
        { text: 'Amb $u=c+d-a-b$ i $w=a+d-b-c$: $2(R-P)=u-iw$ i $2(S-Q)=w+iu=i\\,(u-iw)$.' },
        {
            text: 'Per tant $S-Q=i\\,(R-P)$: $\\overrightarrow{QS}$ és $\\overrightarrow{PR}$ girat $90^\\circ$. Són iguals i perpendiculars. ∎',
        },
        {
            text: 'La idea geomètrica que hi ha a sota (la pista): si $M$ és el punt mitjà de $\\overline{BD}$, el gir de $90^\\circ$ al voltant de $M$ porta $S$ a $P$ i $Q$ a $R$, i per tant porta $\\overline{SQ}$ a $\\overline{PR}$.',
        },
    ],
    iDespres: {
        text: 'Si $ABCD$ és un paral·lelogram, els quatre centres formen un quadrat (teorema de Thébault): mira el quadrilàter $PQRS$ de la figura. I si fas que $D$ s’acosti a $A$ fins a coincidir-hi, el quadrilàter es converteix en un triangle i el resultat continua valent.',
        construccioExtra: [['pPQRS', 'poligon', ['P', 'Q', 'R', 'S']]],
    },
    referencies: [
        'H. van Aubel: Nouvelle Correspondance Mathématique 4 (1878).',
        'D. Wells: The Penguin Dictionary of Curious and Interesting Geometry. Penguin, 1991.',
    ],
});
