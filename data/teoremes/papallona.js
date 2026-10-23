/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/papallona.js
 * ROL: 9. Teorema de la papallona (Butterfly theorem): enunciat, construcció de GeoMotor,
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
    id: 'papallona',
    ordre: 9,
    nom: 'Teorema de la papallona',
    nomAngles: 'Butterfly theorem',
    historia:
        'Va aparèixer com a problema en revistes angleses de principis del segle XIX, i des d’aleshores se n’han publicat desenes de demostracions. El nom ve de la figura: els triangles $AMD$ i $BMC$ semblen les ales d’una papallona.',
    enunciat:
        'Sigui $M$ el punt mitjà d’una corda $\\overline{PQ}$ d’una circumferència, i $\\overline{AB}$ i $\\overline{CD}$ dues cordes que passen per $M$. Si $AD$ i $BC$ tallen la recta $PQ$ en $X$ i en $Y$, aleshores $M$ també és el punt mitjà de $\\overline{XY}$: $MX=MY$.',
    nota: 'Arrossega $P$ i $Q$ (la corda) i $A$ i $C$ (les altres dues cordes).',
    vista: { x0: -7, y0: -5, x1: 7, y1: 5 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['P', 'Q', 'A', 'C'],
    construccio: [
        ['O', 'punt', [0, 0], { et: false }],
        ['c', 'circumferencia-radi', ['O', 4]],
        ['P', 'punt-sobre', ['c', 3.5]],
        ['Q', 'punt-sobre', ['c', 5.9]],
        ['sPQ', 'segment', ['P', 'Q']],
        ['M', 'punt-mig', ['P', 'Q']],
        ['A', 'punt-sobre', ['c', 1.2]],
        ['C', 'punt-sobre', ['c', 2.2]],
        ['rAM', 'recta', ['A', 'M'], { rol: 'invisible' }],
        ['rCM', 'recta', ['C', 'M'], { rol: 'invisible' }],
        ['B', 'segona-interseccio', ['rAM', 'c', 'A']],
        ['D', 'segona-interseccio', ['rCM', 'c', 'C']],
        ['sAB', 'segment', ['A', 'B']],
        ['sCD', 'segment', ['C', 'D']],
        ['sAD', 'segment', ['A', 'D']],
        ['sBC', 'segment', ['B', 'C']],
        ['rPQ', 'recta', ['P', 'Q'], { rol: 'invisible' }],
        ['rAD', 'recta', ['A', 'D'], { rol: 'invisible' }],
        ['rBC', 'recta', ['B', 'C'], { rol: 'invisible' }],
        ['X', 'interseccio', ['rAD', 'rPQ', 0]],
        ['Y', 'interseccio', ['rBC', 'rPQ', 0]],
        ['sMX', 'segment', ['M', 'X']],
        ['sMY', 'segment', ['M', 'Y']],
        ['pX1', 'perpendicular', ['rAM', 'X'], { rol: 'invisible' }],
        ['X1', 'interseccio', ['pX1', 'rAM', 0], { et: false, rol: 'invisible' }],
        ['sX1', 'segment', ['X', 'X1'], { rol: 'pista' }],
        ['pX2', 'perpendicular', ['rCM', 'X'], { rol: 'invisible' }],
        ['X2', 'interseccio', ['pX2', 'rCM', 0], { et: false, rol: 'invisible' }],
        ['sX2', 'segment', ['X', 'X2'], { rol: 'pista' }],
        ['pY1', 'perpendicular', ['rAM', 'Y'], { rol: 'invisible' }],
        ['Y1', 'interseccio', ['pY1', 'rAM', 0], { et: false, rol: 'invisible' }],
        ['sY1', 'segment', ['Y', 'Y1'], { rol: 'pista' }],
        ['pY2', 'perpendicular', ['rCM', 'Y'], { rol: 'invisible' }],
        ['Y2', 'interseccio', ['pY2', 'rCM', 0], { et: false, rol: 'invisible' }],
        ['sY2', 'segment', ['Y', 'Y2'], { rol: 'pista' }],
    ],
    destacat: ['M', 'X', 'Y', 'sMX', 'sMY'],
    invariant: { tipus: 'igualtat', esquerra: [[['M', 'X']]], dreta: [[['M', 'Y']]] },
    degenerat: { distMinima: 0.6, maxCoord: 200 },
    trencada: {
        text: 'Si $M$ no és el punt mitjà de $\\overline{PQ}$ (aquí és a $\\tfrac{4}{10}$ de la corda), $MX$ i $MY$ ja no són iguals.',
        canvis: [['M', 'punt-sobre', ['sPQ', 0.4]]],
    },
    pistes: {
        encarrec: 'Escriu $x=MX$, $y=MY$ i $a=MP=MQ$. Has de provar que $x=y$.',
        concreta: 'Prova-ho primer quan $\\overline{PQ}$ és un diàmetre (aleshores $M$ és el centre).',
        figura: 'Quatre perpendiculars',
        tanca: 'Baixa perpendiculars de $X$ i de $Y$ a les dues cordes. Surten parells de triangles semblants; combina’ls amb la potència d’un punt, $PX\\cdot XQ=AX\\cdot XD$.',
        comprovacio:
            'Si $\\overline{PQ}$ és un diàmetre, la simetria de centre $M$ porta $A$ a $B$ i $D$ a $C$: porta la recta $AD$ a la recta $BC$ i deixa la recta $PQ$ on és. Per tant porta $X$ a $Y$, i $MX=MY$.',
    },
    demostracio: [
        {
            text: 'Suposem $X$ i $Y$ dins del cercle (la figura de la papallona). Siguin $x=MX$, $y=MY$ i $a=MP=MQ$. De $X$ baixem perpendiculars a les cordes $AB$ i $CD$, amb peus $X_1$ i $X_2$; de $Y$, amb peus $Y_1$ i $Y_2$.',
        },
        {
            text: 'Els triangles rectangles $MXX_1$ i $MYY_1$ tenen els angles de $M$ oposats pel vèrtex: són semblants, i $\\tfrac xy=\\tfrac{XX_1}{YY_1}$. Igualment, $\\tfrac xy=\\tfrac{XX_2}{YY_2}$.',
        },
        {
            text: 'Els triangles rectangles $AXX_1$ i $CYY_2$ també són semblants: els angles $\\widehat{DAB}$ i $\\widehat{BCD}$ miren el mateix arc $BD$. Per tant $\\tfrac{XX_1}{YY_2}=\\tfrac{AX}{CY}$; i igualment (arc $AC$), $\\tfrac{XX_2}{YY_1}=\\tfrac{XD}{YB}$.',
            provaPrimer: 'Multiplica les dues igualtats del pas anterior: què obtens per a $\\tfrac{x^2}{y^2}$?',
        },
        {
            text: '$\\tfrac{x^2}{y^2}=\\tfrac{XX_1}{YY_1}\\cdot\\tfrac{XX_2}{YY_2}=\\tfrac{XX_1}{YY_2}\\cdot\\tfrac{XX_2}{YY_1}=\\tfrac{AX\\cdot XD}{CY\\cdot YB}$.',
        },
        {
            text: 'Per la potència d’un punt, $AX\\cdot XD=PX\\cdot XQ=(a-x)(a+x)$ i $CY\\cdot YB=PY\\cdot YQ=(a+y)(a-y)$. Per tant $\\tfrac{x^2}{y^2}=\\tfrac{a^2-x^2}{a^2-y^2}$, és a dir, $x^2a^2=y^2a^2$, i $x=y$. ∎',
        },
    ],
    iDespres: {
        text: 'Si $M$ no és el punt mitjà, encara hi ha una relació: mesurant amb signe sobre la recta $PQ$, amb l’origen a $M$, $\\tfrac1p+\\tfrac1q=\\tfrac1x+\\tfrac1y$, on $p$, $q$, $x$, $y$ són les posicions de $P$, $Q$, $X$, $Y$ (prova-ho amb la variant trencada). I el teorema de la papallona val igual en una el·lipse, una paràbola o una hipèrbola.',
        construccioExtra: [],
    },
    referencies: [
        'L. Bankoff: «The Metamorphosis of the Butterfly Problem». Mathematics Magazine 60 (1987).',
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
    ],
});
