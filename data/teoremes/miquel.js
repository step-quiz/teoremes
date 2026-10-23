/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/miquel.js
 * ROL: 6. Teorema de Miquel (Miquel’s theorem): enunciat, construcció de GeoMotor,
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
    id: 'miquel',
    ordre: 6,
    nom: 'Teorema de Miquel',
    nomAngles: 'Miquel’s theorem',
    historia:
        'Auguste Miquel el va publicar el 1838 al Journal de mathématiques pures et appliquées. Sembla una casualitat afortunada, però és una peça clau de tota la geometria de les circumferències.',
    enunciat:
        'Sigui $ABC$ un triangle i $D$, $E$, $F$ punts dels costats $\\overline{BC}$, $\\overline{CA}$, $\\overline{AB}$. Les circumferències que passen per $A$, $E$, $F$, per $B$, $F$, $D$ i per $C$, $D$, $E$ tenen un punt en comú, $M$.',
    nota: 'Arrossega també $D$, $E$ i $F$ pels costats.',
    vista: { x0: -8, y0: -6.5, x1: 8, y1: 5.5 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C', 'D', 'E', 'F'],
    construccio: [
        ['A', 'punt', [-5, -3.5]],
        ['B', 'punt', [5, -3.5]],
        ['C', 'punt', [-1.5, 3.5]],
        ['sAB', 'segment', ['A', 'B']],
        ['sBC', 'segment', ['B', 'C']],
        ['sCA', 'segment', ['C', 'A']],
        ['D', 'punt-sobre', ['sBC', 0.55]],
        ['E', 'punt-sobre', ['sCA', 0.45]],
        ['F', 'punt-sobre', ['sAB', 0.4]],
        ['c1', 'circumcercle', ['A', 'E', 'F']],
        ['c2', 'circumcercle', ['B', 'F', 'D']],
        ['c3', 'circumcercle', ['C', 'D', 'E']],
        ['M', 'segona-interseccio', ['c1', 'c2', 'F']],
        ['q1', 'poligon', ['A', 'F', 'M', 'E'], { rol: 'pista' }],
        ['q2', 'poligon', ['B', 'D', 'M', 'F'], { rol: 'pista' }],
    ],
    destacat: ['M', 'c3'],
    invariant: { tipus: 'conciclics', objectes: ['C', 'D', 'E', 'M'] },
    degenerat: { areaMinima: 3, angleMinim: 12, distMinima: 0.6 },
    trencada: {
        text: 'Si el punt $E$ no és sobre el costat $\\overline{CA}$ sinó sobre la mitjana que surt de $C$, les tres circumferències ja no tenen cap punt en comú.',
        canvis: [
            ['Mc', 'punt-mig', ['A', 'B'], { et: false, rol: 'aux' }],
            ['mC', 'segment', ['C', 'Mc'], { rol: 'aux' }],
            ['E', 'punt-sobre', ['mC', 0.55]],
        ],
    },
    pistes: {
        encarrec:
            'Pren $M$ com el segon punt de tall de les dues primeres circumferències. Has de provar que $C$, $D$, $M$ i $E$ són en una mateixa circumferència.',
        concreta: 'Fes-ho primer quan $D$, $E$ i $F$ són els punts mitjans dels costats. Quin punt és $M$?',
        figura: 'Dos quadrilàters inscrits',
        tanca: 'En un quadrilàter inscrit, els angles oposats sumen $180^\\circ$. Fes-ho servir als quadrilàters $AFME$ i $BDMF$, i suma els angles al voltant de $M$.',
        comprovacio:
            'Si $D$, $E$, $F$ són els punts mitjans, $M$ és el circumcentre: per exemple, amb $A=(0,0)$, $B=(4,0)$ i $C=(1,3)$, $M=(2,1)$, que és a $\\sqrt5$ dels tres vèrtexs.',
    },
    demostracio: [
        {
            text: 'Sigui $M$ el segon punt de tall de les circumferències de $AEF$ i de $BFD$ (el primer és $F$). Suposem que $M$ és dins del triangle.',
        },
        {
            text: '$AFME$ és inscrit, i per tant $\\widehat{EMF}=180^\\circ-\\widehat{A}$. $BDMF$ també ho és: $\\widehat{FMD}=180^\\circ-\\widehat{B}$.',
            provaPrimer: 'Amb això, quant fa l’angle $\\widehat{DME}$?',
        },
        {
            text: 'Al voltant de $M$: $\\widehat{DME}=360^\\circ-(180^\\circ-\\widehat{A})-(180^\\circ-\\widehat{B})=\\widehat{A}+\\widehat{B}=180^\\circ-\\widehat{C}$.',
        },
        {
            text: 'Al quadrilàter $CDME$, els angles oposats $\\widehat{DME}$ i $\\widehat{C}$ sumen $180^\\circ$: és inscrit, i la tercera circumferència passa per $M$. ∎ (Si $M$ cau fora del triangle, el mateix càlcul amb angles orientats mòdul $180^\\circ$ ho resol.)',
        },
    ],
    iDespres: {
        text: 'Els centres $O_1$, $O_2$, $O_3$ de les tres circumferències formen un triangle semblant a $ABC$ (mira’l a la figura mentre mous $D$, $E$ i $F$). I si $D$, $E$, $F$ són sobre les rectes dels costats i estan alineats, $M$ també és a la circumferència circumscrita de $ABC$: és el punt de Miquel d’un quadrilàter complet.',
        construccioExtra: [
            ['O1', 'circumcentre', ['A', 'E', 'F'], { et: 'O₁' }],
            ['O2', 'circumcentre', ['B', 'F', 'D'], { et: 'O₂' }],
            ['O3', 'circumcentre', ['C', 'D', 'E'], { et: 'O₃' }],
            ['pO', 'poligon', ['O1', 'O2', 'O3']],
        ],
    },
    referencies: [
        'A. Miquel: Journal de mathématiques pures et appliquées, vol. 3 (1838).',
        'R. A. Johnson: Advanced Euclidean Geometry. Dover, 1960 (abans Modern Geometry, 1929).',
    ],
});
