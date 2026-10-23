/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/varignon.js
 * ROL: 1. Teorema de Varignon (Varignon’s theorem): enunciat, construcció de GeoMotor,
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
    id: 'varignon',
    ordre: 1,
    nom: 'Teorema de Varignon',
    nomAngles: 'Varignon’s theorem',
    historia:
        'Pierre Varignon (1654–1722), matemàtic i físic francès, el va incloure en un curs de geometria elemental que es va publicar després de la seva mort, el 1731. És tan senzill que costa creure que algú l’hagués de descobrir.',
    enunciat:
        'Si $P$, $Q$, $R$ i $S$ són els punts mitjans dels costats d’un quadrilàter qualsevol $ABCD$, aleshores $PQRS$ és un paral·lelogram.',
    nota: 'Prova de fer el quadrilàter còncau, o fins i tot creuat.',
    vista: { x0: -8, y0: -5.5, x1: 8, y1: 5.5 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C', 'D'],
    construccio: [
        ['A', 'punt', [-5, -3]],
        ['B', 'punt', [4, -3.5]],
        ['C', 'punt', [5, 2.5]],
        ['D', 'punt', [-3, 3.5]],
        ['sAB', 'segment', ['A', 'B']],
        ['sBC', 'segment', ['B', 'C']],
        ['sCD', 'segment', ['C', 'D']],
        ['sDA', 'segment', ['D', 'A']],
        ['sAC', 'segment', ['A', 'C'], { rol: 'pista' }],
        ['sBD', 'segment', ['B', 'D'], { rol: 'pista' }],
        ['P', 'punt-mig', ['A', 'B']],
        ['Q', 'punt-mig', ['B', 'C']],
        ['R', 'punt-mig', ['C', 'D']],
        ['S', 'punt-mig', ['D', 'A']],
        ['pPQRS', 'poligon', ['P', 'Q', 'R', 'S']],
    ],
    destacat: ['P', 'Q', 'R', 'S', 'pPQRS'],
    invariant: { tipus: 'paralelogram', objectes: ['P', 'Q', 'R', 'S'] },
    degenerat: { areaMinima: 2, distMinima: 0.8 },
    trencada: {
        text: 'Si en lloc dels punts mitjans prenem el punt que hi ha a un terç de cada costat (de $A$ cap a $B$, de $B$ cap a $C$…), $PQRS$ ja no és un paral·lelogram.',
        canvis: [
            ['P', 'punt-sobre', ['sAB', 0.3333333333333333]],
            ['Q', 'punt-sobre', ['sBC', 0.3333333333333333]],
            ['R', 'punt-sobre', ['sCD', 0.3333333333333333]],
            ['S', 'punt-sobre', ['sDA', 0.3333333333333333]],
        ],
    },
    pistes: {
        encarrec:
            'Has de provar que els costats oposats de $PQRS$ són paral·lels (o bé que dos costats oposats són iguals i paral·lels).',
        concreta:
            'Fes-ho primer amb $A=(0,0)$, $B=(4,0)$, $C=(6,4)$ i $D=(0,2)$: calcula $P$, $Q$, $R$, $S$ i compara els vectors $\\overrightarrow{PQ}$ i $\\overrightarrow{SR}$.',
        figura: 'Les diagonals',
        tanca: 'Mira el triangle $ABC$: què hi fan $P$ i $Q$? I al triangle $ACD$, què hi fan $S$ i $R$?',
        comprovacio:
            'En el cas concret, $P=(2,0)$, $Q=(5,2)$, $R=(3,3)$ i $S=(0,1)$: $\\overrightarrow{PQ}=\\overrightarrow{SR}=(3,2)$, que és la meitat de $\\overrightarrow{AC}=(6,4)$.',
    },
    demostracio: [
        {
            text: 'Al triangle $ABC$, el segment $\\overline{PQ}$ uneix els punts mitjans de dos costats. Pel teorema de Tales, $PQ \\parallel AC$ i $PQ=\\tfrac12 AC$.',
            provaPrimer: 'Quina relació hi ha entre $\\overline{PQ}$ i la diagonal $\\overline{AC}$?',
        },
        { text: 'Al triangle $ACD$ passa el mateix amb $\\overline{SR}$: $SR \\parallel AC$ i $SR=\\tfrac12 AC$.' },
        {
            text: 'Per tant $\\overline{PQ}$ i $\\overline{SR}$ són paral·lels i iguals, i un quadrilàter amb dos costats oposats paral·lels i iguals és un paral·lelogram. ∎',
        },
        {
            text: 'Amb vectors és encara més curt: $\\overrightarrow{PQ}=\\tfrac{B+C}{2}-\\tfrac{A+B}{2}=\\tfrac{C-A}{2}$ i $\\overrightarrow{SR}=\\tfrac{C+D}{2}-\\tfrac{D+A}{2}=\\tfrac{C-A}{2}$. No hem fet servir enlloc que $ABCD$ sigui convex: per això també val per als quadrilàters còncaus i creuats.',
        },
    ],
    iDespres: {
        text: 'Les diagonals de $PQRS$ (les bimitjanes $\\overline{PR}$ i $\\overline{QS}$ de $ABCD$) es tallen en el seu punt mitjà $G=\\tfrac{A+B+C+D}{4}$, el centre de gravetat dels quatre vèrtexs. I si $ABCD$ és convex, l’àrea de $PQRS$ és exactament la meitat de la de $ABCD$.',
        construccioExtra: [
            ['sPR', 'segment', ['P', 'R']],
            ['sQS', 'segment', ['Q', 'S']],
            ['G', 'punt-mig', ['P', 'R']],
        ],
    },
    referencies: [
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
        'P. Varignon: Elemens de mathematique. París, 1731 (pòstum).',
    ],
});
