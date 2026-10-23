/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/mediatrius.js
 * ROL: 2. Les tres mediatrius (Concurrence of the perpendicular bisectors): enunciat, construcció de GeoMotor,
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
    id: 'mediatrius',
    ordre: 2,
    nom: 'Les tres mediatrius',
    nomAngles: 'Concurrence of the perpendicular bisectors',
    historia:
        'És la proposició 5 del llibre IV dels Elements d’Euclides (cap al 300 aC): circumscriure una circumferència a un triangle. És l’escalfament: el raonament és curt, però la idea (fer servir un lloc geomètric) torna a sortir a tot arreu.',
    enunciat:
        'Les tres mediatrius d’un triangle $ABC$ es tallen en un mateix punt $O$, el centre de la circumferència que passa pels tres vèrtexs (el circumcentre).',
    vista: { x0: -8, y0: -6, x1: 8, y1: 5.5 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C'],
    construccio: [
        ['A', 'punt', [-4, -3]],
        ['B', 'punt', [4.5, -3]],
        ['C', 'punt', [-0.5, 3.8]],
        ['sAB', 'segment', ['A', 'B']],
        ['sBC', 'segment', ['B', 'C']],
        ['sCA', 'segment', ['C', 'A']],
        ['mAB', 'mediatriu', ['A', 'B']],
        ['mBC', 'mediatriu', ['B', 'C']],
        ['mCA', 'mediatriu', ['C', 'A']],
        ['O', 'interseccio', ['mAB', 'mBC', 0]],
        ['sOA', 'segment', ['O', 'A'], { rol: 'pista' }],
        ['sOB', 'segment', ['O', 'B'], { rol: 'pista' }],
        ['sOC', 'segment', ['O', 'C'], { rol: 'pista' }],
    ],
    destacat: ['mAB', 'mBC', 'mCA', 'O'],
    invariant: { tipus: 'concurrents', objectes: ['mAB', 'mBC', 'mCA'] },
    degenerat: { areaMinima: 3, angleMinim: 10 },
    trencada: {
        text: 'Si en lloc de les mediatrius tracem les perpendiculars als costats pel punt que hi ha a un terç de cada costat, les tres rectes ja no es tallen en un punt.',
        canvis: [
            ['T1', 'punt-sobre', ['sAB', 0.3333333333333333], { et: false, rol: 'invisible' }],
            ['mAB', 'perpendicular', ['sAB', 'T1']],
            ['T2', 'punt-sobre', ['sBC', 0.3333333333333333], { et: false, rol: 'invisible' }],
            ['mBC', 'perpendicular', ['sBC', 'T2']],
            ['T3', 'punt-sobre', ['sCA', 0.3333333333333333], { et: false, rol: 'invisible' }],
            ['mCA', 'perpendicular', ['sCA', 'T3']],
        ],
    },
    pistes: {
        encarrec:
            'Dues rectes no paral·leles sempre es tallen. Has de veure que el punt on es tallen dues mediatrius també és a la tercera.',
        concreta:
            'Pren $A=(0,0)$, $B=(6,0)$ i $C=(0,4)$. Escriu les equacions de les tres mediatrius i mira on es tallen.',
        figura: 'Tres distàncies',
        tanca: 'Què tenen en comú tots els punts de la mediatriu de $\\overline{AB}$? Fes-ho servir dues vegades.',
        comprovacio:
            'En el cas concret, $x=3$ (mediatriu de $\\overline{AB}$) i $y=2$ (mediatriu de $\\overline{CA}$) es tallen a $O=(3,2)$; la mediatriu de $\\overline{BC}$, $3x-2y=5$, hi passa, i $OA=OB=OC=\\sqrt{13}$.',
    },
    demostracio: [
        {
            text: 'La mediatriu de $\\overline{AB}$ és el conjunt dels punts que són a la mateixa distància de $A$ i de $B$: un punt $X$ hi és si i només si $XA=XB$.',
            provaPrimer:
                'Per què? Pensa en el triangle $XAB$ quan $X$ és a la mediatriu, i en el peu de la perpendicular quan $XA=XB$.',
        },
        {
            text: 'Els costats $\\overline{AB}$ i $\\overline{BC}$ no són paral·lels; per tant, les seves mediatrius (que hi són perpendiculars) tampoc: es tallen en un punt $O$.',
        },
        {
            text: 'Com que $O$ és a la mediatriu de $\\overline{AB}$, $OA=OB$; com que és a la de $\\overline{BC}$, $OB=OC$. Per tant $OA=OC$, i $O$ és a la mediatriu de $\\overline{CA}$. ∎',
        },
        {
            text: 'A més, la circumferència de centre $O$ i radi $OA$ passa per $A$, $B$ i $C$, i és l’única: el centre de qualsevol circumferència que hi passi ha de ser a les tres mediatrius.',
        },
    ],
    iDespres: {
        text: 'Les altures també es tallen en un punt (l’ortocentre), i pel mateix argument: si per cada vèrtex tracem la paral·lela al costat oposat, surt un triangle el doble de gran on les altures de $ABC$ són les mediatrius. A la figura, la circumferència circumscrita: el centre és dins del triangle si és acutangle, i al punt mitjà de la hipotenusa si és rectangle.',
        construccioExtra: [['cO', 'circumferencia', ['O', 'A']]],
    },
    referencies: [
        'Euclides: Elements, llibre IV, proposició 5.',
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
    ],
});
