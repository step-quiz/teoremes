/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/monge.js
 * ROL: 11. Teorema de Monge (Monge’s circle theorem): enunciat, construcció de GeoMotor,
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
    id: 'monge',
    ordre: 11,
    nom: 'Teorema de Monge',
    nomAngles: 'Monge’s circle theorem',
    historia:
        'S’atribueix a Gaspard Monge (1746–1818), el creador de la geometria descriptiva. La demostració més bonica surt de pensar en l’espai, com feia ell: és a «I després».',
    enunciat:
        'Donades tres circumferències de radis diferents, cada parell té un centre d’homotècia exterior: el punt on es tallen les seves dues tangents comunes exteriors. Els tres punts, $E_{12}$, $E_{13}$ i $E_{23}$, estan alineats.',
    nota: 'Arrossega els centres; els punts petits canvien els radis.',
    vista: { x0: -9.5, y0: -6.3, x1: 9.5, y1: 6.3 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['O1', 'K1', 'O2', 'K2', 'O3', 'K3'],
    construccio: [
        ['O1', 'punt', [-5.4, 1.7], { et: 'O₁' }],
        ['K1', 'punt', [-5.4, 4.2], { et: false }],
        ['O2', 'punt', [1.9, -0.6], { et: 'O₂' }],
        ['K2', 'punt', [1.9, 0.5], { et: false }],
        ['O3', 'punt', [-1, -2.5], { et: 'O₃' }],
        ['K3', 'punt', [-1, -1.9], { et: false }],
        ['c1', 'circumferencia', ['O1', 'K1']],
        ['c2', 'circumferencia', ['O2', 'K2']],
        ['c3', 'circumferencia', ['O3', 'K3']],
        ['E12', 'centre-homotecia', ['c1', 'c2', 'ext'], { et: 'E₁₂' }],
        ['E13', 'centre-homotecia', ['c1', 'c3', 'ext'], { et: 'E₁₃' }],
        ['E23', 'centre-homotecia', ['c2', 'c3', 'ext'], { et: 'E₂₃' }],
        ['rM', 'recta', ['E12', 'E23']],
        ['mE12', 'punt-mig', ['E12', 'O1'], { et: false, rol: 'invisible' }],
        ['kE12', 'circumferencia', ['mE12', 'O1'], { rol: 'invisible' }],
        ['T0E12', 'interseccio', ['kE12', 'c1', 0], { et: false, rol: 'invisible' }],
        ['T1E12', 'interseccio', ['kE12', 'c1', 1], { et: false, rol: 'invisible' }],
        ['t0E12', 'recta', ['E12', 'T0E12'], { rol: 'aux' }],
        ['t1E12', 'recta', ['E12', 'T1E12'], { rol: 'aux' }],
        ['mE13', 'punt-mig', ['E13', 'O1'], { et: false, rol: 'invisible' }],
        ['kE13', 'circumferencia', ['mE13', 'O1'], { rol: 'invisible' }],
        ['T0E13', 'interseccio', ['kE13', 'c1', 0], { et: false, rol: 'invisible' }],
        ['T1E13', 'interseccio', ['kE13', 'c1', 1], { et: false, rol: 'invisible' }],
        ['t0E13', 'recta', ['E13', 'T0E13'], { rol: 'aux' }],
        ['t1E13', 'recta', ['E13', 'T1E13'], { rol: 'aux' }],
        ['mE23', 'punt-mig', ['E23', 'O2'], { et: false, rol: 'invisible' }],
        ['kE23', 'circumferencia', ['mE23', 'O2'], { rol: 'invisible' }],
        ['T0E23', 'interseccio', ['kE23', 'c2', 0], { et: false, rol: 'invisible' }],
        ['T1E23', 'interseccio', ['kE23', 'c2', 1], { et: false, rol: 'invisible' }],
        ['t0E23', 'recta', ['E23', 'T0E23'], { rol: 'aux' }],
        ['t1E23', 'recta', ['E23', 'T1E23'], { rol: 'aux' }],
        ['pO', 'poligon', ['O1', 'O2', 'O3'], { rol: 'pista' }],
    ],
    destacat: ['E12', 'E13', 'E23', 'rM'],
    invariant: { tipus: 'colinears', objectes: ['E12', 'E13', 'E23'] },
    degenerat: { distMinima: 0.5 },
    trencada: {
        text: 'Si en lloc del centre exterior $E_{23}$ prenem l’interior $I_{23}$ (on es tallen les tangents comunes interiors), els tres punts ja no estan alineats.',
        canvis: [['E23', 'centre-homotecia', ['c2', 'c3', 'int'], { et: 'I₂₃' }]],
    },
    pistes: {
        encarrec:
            'Cada $E_{ij}$ és a la recta dels centres $O_iO_j$. Has de provar que tres punts, un a cada costat del triangle $O_1O_2O_3$, estan alineats.',
        concreta: 'Pren $O_1=(0,0)$ amb $r_1=1$ i $O_2=(6,0)$ amb $r_2=3$. On és $E_{12}$?',
        figura: 'Triangle dels centres',
        tanca: 'Calcula la raó en què $E_{12}$ divideix $\\overline{O_1O_2}$ (pensa en els triangles semblants que fan els radis amb una tangent). Després, Menelau.',
        comprovacio:
            'En el cas concret, $E_{12}=(-3,0)$: $\\tfrac{E_{12}O_1}{E_{12}O_2}=\\tfrac39=\\tfrac13=\\tfrac{r_1}{r_2}$.',
    },
    demostracio: [
        {
            text: 'L’homotècia de centre $E_{12}$ i raó $\\tfrac{r_2}{r_1}$ porta la primera circumferència a la segona, i per tant $O_1$ a $O_2$. Així, $E_{12}$ és a la recta $O_1O_2$, fora del segment, i $\\tfrac{E_{12}O_1}{E_{12}O_2}=\\tfrac{r_1}{r_2}$.',
        },
        {
            text: 'Amb segments amb signe: $\\tfrac{\\overline{O_1E_{12}}}{\\overline{E_{12}O_2}}=-\\tfrac{r_1}{r_2}$, i igualment $\\tfrac{\\overline{O_2E_{23}}}{\\overline{E_{23}O_3}}=-\\tfrac{r_2}{r_3}$ i $\\tfrac{\\overline{O_3E_{13}}}{\\overline{E_{13}O_1}}=-\\tfrac{r_3}{r_1}$.',
            provaPrimer: 'Multiplica les tres raons.',
        },
        {
            text: 'El producte és $\\left(-\\tfrac{r_1}{r_2}\\right)\\left(-\\tfrac{r_2}{r_3}\\right)\\left(-\\tfrac{r_3}{r_1}\\right)=-1$. Pel recíproc del teorema de Menelau, al triangle $O_1O_2O_3$, els tres punts estan alineats. ∎',
        },
        {
            text: 'Si els tres centres estan alineats, els tres punts són a la mateixa recta que ells, i no hi ha res a demostrar.',
        },
    ],
    iDespres: {
        text: 'Una demostració sense càlculs, a l’espai: posa una esfera sobre cada circumferència (mateix centre i radi). Si les circumferències no es tallen, un pla toca les tres esferes per sobre, i el seu simètric per sota. Cada $E_{ij}$ és el vèrtex del con que embolcalla dues esferes i és als dos plans: és a la recta on es tallen. A més, $E_{12}$, $I_{13}$ i $I_{23}$ també estan alineats (a la figura).',
        construccioExtra: [
            ['I13', 'centre-homotecia', ['c1', 'c3', 'int'], { et: 'I₁₃' }],
            ['I23', 'centre-homotecia', ['c2', 'c3', 'int'], { et: 'I₂₃' }],
            ['rI', 'recta', ['E12', 'I23']],
        ],
    },
    referencies: [
        'R. A. Johnson: Advanced Euclidean Geometry. Dover, 1960 (abans Modern Geometry, 1929).',
        'D. Wells: The Penguin Dictionary of Curious and Interesting Geometry. Penguin, 1991.',
    ],
});
