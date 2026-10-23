/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/nou-punts.js
 * ROL: 4. La circumferència dels nou punts (Nine-point circle): enunciat, construcció de GeoMotor,
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
    id: 'nou-punts',
    ordre: 4,
    nom: 'La circumferència dels nou punts',
    nomAngles: 'Nine-point circle',
    historia:
        'Brianchon i Poncelet la van publicar el 1821, i Karl Wilhelm Feuerbach la va retrobar el 1822, amb una sorpresa més que és el teorema 14. En alemany encara se’n diu la circumferència de Feuerbach.',
    enunciat:
        "En qualsevol triangle $ABC$ hi ha una circumferència que passa per nou punts: els punts mitjans dels costats ($A'$, $B'$, $C'$), els peus de les altures ($D$, $E$, $F$) i els punts mitjans dels segments que van de cada vèrtex a l’ortocentre $H$ ($A''$, $B''$, $C''$).",
    nota: 'Fes el triangle obtusangle: els peus de les altures surten fora dels costats.',
    vista: { x0: -8, y0: -6.8, x1: 8, y1: 5.2 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C'],
    construccio: [
        ['A', 'punt', [-4.5, -3.5]],
        ['B', 'punt', [5, -3.5]],
        ['C', 'punt', [-2, 3.8]],
        ['sAB', 'segment', ['A', 'B']],
        ['sBC', 'segment', ['B', 'C']],
        ['sCA', 'segment', ['C', 'A']],
        ['rBC', 'recta', ['B', 'C'], { rol: 'invisible' }],
        ['rCA', 'recta', ['C', 'A'], { rol: 'invisible' }],
        ['rAB', 'recta', ['A', 'B'], { rol: 'invisible' }],
        ['H', 'ortocentre', ['A', 'B', 'C'], { rol: 'aux' }],
        ['hA', 'perpendicular', ['sBC', 'A'], { rol: 'aux' }],
        ['hB', 'perpendicular', ['sCA', 'B'], { rol: 'aux' }],
        ['hC', 'perpendicular', ['sAB', 'C'], { rol: 'aux' }],
        ['Ap', 'punt-mig', ['B', 'C'], { et: 'A′' }],
        ['Bp', 'punt-mig', ['C', 'A'], { et: 'B′' }],
        ['Cp', 'punt-mig', ['A', 'B'], { et: 'C′' }],
        ['D', 'interseccio', ['hA', 'rBC', 0]],
        ['E', 'interseccio', ['hB', 'rCA', 0]],
        ['F', 'interseccio', ['hC', 'rAB', 0]],
        ['App', 'punt-mig', ['A', 'H'], { et: 'A″' }],
        ['Bpp', 'punt-mig', ['B', 'H'], { et: 'B″' }],
        ['Cpp', 'punt-mig', ['C', 'H'], { et: 'C″' }],
        ['c9', 'circumcercle', ['Ap', 'Bp', 'Cp']],
        ['pR', 'poligon', ['Cp', 'Bp', 'Cpp', 'Bpp'], { rol: 'pista' }],
    ],
    destacat: ['c9'],
    invariant: { tipus: 'conciclics', objectes: ['Ap', 'Bp', 'Cp', 'D', 'E', 'F', 'App', 'Bpp', 'Cpp'] },
    degenerat: { areaMinima: 3, angleMinim: 10 },
    trencada: {
        text: 'Si en lloc dels punts mitjans de $\\overline{AH}$, $\\overline{BH}$ i $\\overline{CH}$ prenem els de $\\overline{AG}$, $\\overline{BG}$ i $\\overline{CG}$ ($G$, el baricentre), els nou punts ja no són a la mateixa circumferència.',
        canvis: [
            ['Gb', 'baricentre', ['A', 'B', 'C'], { et: 'G' }],
            ['App', 'punt-mig', ['A', 'Gb'], { et: 'A″' }],
            ['Bpp', 'punt-mig', ['B', 'Gb'], { et: 'B″' }],
            ['Cpp', 'punt-mig', ['C', 'Gb'], { et: 'C″' }],
        ],
    },
    pistes: {
        encarrec: 'N’hi ha prou de trobar una circumferència que passi pels nou punts. Comença pels sis punts mitjans.',
        concreta: 'Pren $A=(0,6)$, $B=(-2,0)$ i $C=(4,0)$. Calcula l’ortocentre $H$ i els nou punts.',
        figura: 'Un rectangle',
        tanca: "Mira el quadrilàter $C'B'C''B''$: quins costats són paral·lels a $\\overline{BC}$, i quins a l’altura $AH$? I què passa amb un angle recte que mira un diàmetre?",
        comprovacio:
            "En el cas concret, $H=(0,\\tfrac43)$, el centre és $(\\tfrac12,\\tfrac{11}{6})$ i el radi, $\\tfrac{\\sqrt{130}}{6}\\approx 1{,}90$: per exemple, $D=(0,0)$ i $B'=(2,3)$ són a aquesta distància del centre.",
    },
    demostracio: [
        {
            text: "Al triangle $ABC$, $\\overline{C'B'}$ uneix punts mitjans: és paral·lel a $\\overline{BC}$. Al triangle $HBC$, $\\overline{B''C''}$ també ho és.",
        },
        {
            text: "Al triangle $ABH$, $\\overline{C'B''}$ és paral·lel a $\\overline{AH}$; al triangle $ACH$, $\\overline{B'C''}$ també. I l’altura $AH$ és perpendicular a $BC$.",
        },
        {
            text: "Per tant, $C'B'C''B''$ és un rectangle, i la circumferència que hi passa té per diàmetres les dues diagonals, $\\overline{B'B''}$ i $\\overline{C'C''}$.",
            provaPrimer:
                'Fes el mateix raonament amb el costat $\\overline{AC}$ i l’altura $BH$: quin altre rectangle surt?',
        },
        {
            text: "El quadrilàter $A'C'A''C''$ també és un rectangle (els seus costats són paral·lels a $AC$ i a $BH$), i comparteix el diàmetre $\\overline{C'C''}$: és la mateixa circumferència. Ja tenim sis punts, amb diàmetres $\\overline{A'A''}$, $\\overline{B'B''}$ i $\\overline{C'C''}$.",
        },
        {
            text: "Finalment, el peu $D$ és a la recta $BC$ (on hi ha $A'$) i a l’altura $AH$ (on hi ha $A''$): l’angle $\\widehat{A''DA'}$ és recte. Un angle recte que mira un diàmetre té el vèrtex a la circumferència (Tales): $D$ hi és. Igual per a $E$ i $F$. ∎",
        },
    ],
    iDespres: {
        text: "L’homotècia de centre $H$ i raó $\\tfrac12$ porta $A$, $B$, $C$ a $A''$, $B''$, $C''$ i, per tant, porta la circumferència circumscrita a la dels nou punts: el radi és la meitat, $\\tfrac R2$, i el centre $N$ és el punt mitjà de $\\overline{OH}$, a la recta d’Euler.",
        construccioExtra: [
            ['O', 'circumcentre', ['A', 'B', 'C']],
            ['N', 'punt-mig', ['O', 'H']],
            ['cc', 'circumcercle', ['A', 'B', 'C']],
        ],
    },
    referencies: [
        'K. W. Feuerbach: Eigenschaften einiger merkwürdigen Punkte des geradlinigen Dreiecks. Nuremberg, 1822.',
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
    ],
});
