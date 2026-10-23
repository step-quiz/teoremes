/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/simson.js
 * ROL: 7. La recta de Simson (Simson line): enunciat, construcció de GeoMotor,
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
    id: 'simson',
    ordre: 7,
    nom: 'La recta de Simson',
    nomAngles: 'Simson line',
    historia:
        'Porta el nom de Robert Simson (1687–1768), però no apareix a cap de les seves obres: el primer a publicar-la va ser William Wallace, el 1797. Per això també se’n diu recta de Wallace.',
    enunciat:
        'Si $P$ és un punt de la circumferència circumscrita al triangle $ABC$, els peus $D$, $E$, $F$ de les perpendiculars de $P$ a les rectes $BC$, $CA$, $AB$ estan alineats.',
    nota: 'Arrossega $P$ per la circumferència.',
    vista: { x0: -8, y0: -6, x1: 8, y1: 5 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C', 'P'],
    construccio: [
        ['A', 'punt', [-4, -1]],
        ['B', 'punt', [4, -1]],
        ['C', 'punt', [-1, 3.5]],
        ['sAB', 'segment', ['A', 'B']],
        ['sBC', 'segment', ['B', 'C']],
        ['sCA', 'segment', ['C', 'A']],
        ['rBC', 'recta', ['B', 'C'], { rol: 'aux' }],
        ['rCA', 'recta', ['C', 'A'], { rol: 'aux' }],
        ['rAB', 'recta', ['A', 'B'], { rol: 'aux' }],
        ['cc', 'circumcercle', ['A', 'B', 'C']],
        ['P', 'punt-sobre', ['cc', 4.4]],
        ['pD', 'perpendicular', ['rBC', 'P'], { rol: 'invisible' }],
        ['pE', 'perpendicular', ['rCA', 'P'], { rol: 'invisible' }],
        ['pF', 'perpendicular', ['rAB', 'P'], { rol: 'invisible' }],
        ['D', 'interseccio', ['pD', 'rBC', 0]],
        ['E', 'interseccio', ['pE', 'rCA', 0]],
        ['F', 'interseccio', ['pF', 'rAB', 0]],
        ['sPD', 'segment', ['P', 'D'], { rol: 'aux' }],
        ['sPE', 'segment', ['P', 'E'], { rol: 'aux' }],
        ['sPF', 'segment', ['P', 'F'], { rol: 'aux' }],
        ['rS', 'recta', ['D', 'F']],
        ['K1', 'punt-mig', ['P', 'C'], { et: false, rol: 'invisible' }],
        ['k1', 'circumferencia', ['K1', 'P'], { rol: 'pista' }],
        ['K2', 'punt-mig', ['P', 'A'], { et: false, rol: 'invisible' }],
        ['k2', 'circumferencia', ['K2', 'P'], { rol: 'pista' }],
    ],
    destacat: ['D', 'E', 'F', 'rS'],
    invariant: { tipus: 'colinears', objectes: ['D', 'E', 'F'] },
    degenerat: { areaMinima: 3, angleMinim: 10, distMinima: 0.5 },
    trencada: {
        text: 'Si $P$ no és sobre la circumferència circumscrita (aquí és sobre una de concèntrica, una mica més gran), els tres peus ja no estan alineats.',
        canvis: [
            ['Oc', 'circumcentre', ['A', 'B', 'C'], { et: false, rol: 'invisible' }],
            ['rOA', 'recta', ['Oc', 'A'], { rol: 'invisible' }],
            ['Kc', 'punt-sobre', ['rOA', 1.25], { et: false, rol: 'invisible' }],
            ['c2', 'circumferencia', ['Oc', 'Kc'], { rol: 'aux' }],
            ['P', 'punt-sobre', ['c2', 4.4]],
        ],
    },
    pistes: {
        encarrec:
            'Has de veure que les rectes $ED$ i $EF$ són la mateixa, per exemple perquè fan el mateix angle amb $EP$.',
        concreta: 'Fes-ho quan $P$ és el punt diametralment oposat a $C$: on cauen els peus sobre $CA$ i sobre $BC$?',
        figura: 'Dues circumferències',
        tanca: 'Els angles rectes a $D$ i a $E$ fan que $P$, $D$, $C$, $E$ siguin en una circumferència (de diàmetre $\\overline{PC}$); passa el mateix amb $P$, $E$, $A$, $F$. Compara angles inscrits.',
        comprovacio:
            'Amb $A=(-1,0)$, $B=(1,0)$, $C=(\\tfrac35,\\tfrac45)$ i $P=(0,-1)$, tots a la circumferència de centre l’origen i radi $1$: $F=(0,0)$, $D=(\\tfrac65,-\\tfrac25)$ i $E=(-\\tfrac35,\\tfrac15)$, tots tres a la recta $y=-\\tfrac x3$.',
    },
    demostracio: [
        {
            text: 'Com que $\\widehat{PDC}=\\widehat{PEC}=90^\\circ$, els punts $D$ i $E$ són a la circumferència de diàmetre $\\overline{PC}$: $P$, $D$, $C$, $E$ són concíclics. Igualment, $P$, $E$, $A$, $F$ són a la de diàmetre $\\overline{PA}$.',
        },
        {
            text: 'Fem servir angles orientats entre rectes, mòdul $180^\\circ$, i així no cal distingir on cau cada peu: $\\angle(r,s)$ és l’angle que cal girar $r$ perquè sigui paral·lela a $s$.',
        },
        {
            text: 'Del primer quadrilàter inscrit, $\\angle(ED,EP)=\\angle(CD,CP)=\\angle(CB,CP)$. Del segon, $\\angle(EF,EP)=\\angle(AF,AP)=\\angle(AB,AP)$.',
            provaPrimer: 'Què ha de passar perquè $D$, $E$ i $F$ estiguin alineats?',
        },
        {
            text: '$D$, $E$, $F$ estan alineats si i només si $ED$ i $EF$ són la mateixa recta, és a dir, si $\\angle(ED,EP)=\\angle(EF,EP)$, és a dir, si $\\angle(CB,CP)=\\angle(AB,AP)$.',
        },
        {
            text: 'Aquesta última igualtat diu exactament que $A$, $B$, $C$, $P$ són concíclics (els angles inscrits que miren la corda $\\overline{BP}$ des de $C$ i des de $A$ són iguals). Com que ho són, els peus estan alineats. ∎ I també val al revés: si els peus estan alineats, $P$ és a la circumferència.',
        },
    ],
    iDespres: {
        text: 'La recta de Simson passa pel punt mitjà $Q$ de $\\overline{PH}$ ($H$, l’ortocentre), i $Q$ és a la circumferència dels nou punts. A més, quan $P$ fa una volta sencera a la circumferència, la recta de Simson en fa mitja.',
        construccioExtra: [
            ['H', 'ortocentre', ['A', 'B', 'C']],
            ['sPH', 'segment', ['P', 'H']],
            ['Q', 'punt-mig', ['P', 'H']],
        ],
    },
    referencies: [
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
        'R. A. Johnson: Advanced Euclidean Geometry. Dover, 1960 (abans Modern Geometry, 1929).',
    ],
});
