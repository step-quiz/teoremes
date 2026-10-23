/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/morley.js
 * ROL: 13. Teorema de Morley (Morley’s trisector theorem): enunciat, construcció de GeoMotor,
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
    id: 'morley',
    ordre: 13,
    nom: 'Teorema de Morley',
    nomAngles: 'Morley’s trisector theorem',
    historia:
        'Frank Morley el va descobrir cap al 1899 i el va explicar als seus col·legues, però va trigar anys a publicar-lo. Que un resultat tan elemental passés desapercebut durant més de dos mil anys es deu, segurament, al fet que la trisecció de l’angle no es pot fer amb regle i compàs.',
    enunciat:
        'En qualsevol triangle, les trisectrius dels angles (les semirectes que divideixen cada angle en tres parts iguals) es tallen, les dues més properes a cada costat, en tres punts $X$, $Y$, $Z$ que formen un triangle equilàter.',
    vista: { x0: -8, y0: -5.5, x1: 8, y1: 5.5 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C'],
    construccio: [
        ['A', 'punt', [-5, -3]],
        ['B', 'punt', [5, -3]],
        ['C', 'punt', [-1.5, 4]],
        ['sAB', 'segment', ['A', 'B']],
        ['sBC', 'segment', ['B', 'C']],
        ['sCA', 'segment', ['C', 'A']],
        ['tA1', 'trisectriu', ['B', 'A', 'C', 1], { rol: 'invisible' }],
        ['tA2', 'trisectriu', ['B', 'A', 'C', 2], { rol: 'invisible' }],
        ['tB1', 'trisectriu', ['C', 'B', 'A', 1], { rol: 'invisible' }],
        ['tB2', 'trisectriu', ['C', 'B', 'A', 2], { rol: 'invisible' }],
        ['tC1', 'trisectriu', ['A', 'C', 'B', 1], { rol: 'invisible' }],
        ['tC2', 'trisectriu', ['A', 'C', 'B', 2], { rol: 'invisible' }],
        ['Z', 'interseccio', ['tA1', 'tB2', 0]],
        ['X', 'interseccio', ['tB1', 'tC2', 0]],
        ['Y', 'interseccio', ['tC1', 'tA2', 0]],
        ['sAZ', 'segment', ['A', 'Z'], { rol: 'aux' }],
        ['sAY', 'segment', ['A', 'Y'], { rol: 'aux' }],
        ['sBZ', 'segment', ['B', 'Z'], { rol: 'aux' }],
        ['sBX', 'segment', ['B', 'X'], { rol: 'aux' }],
        ['sCX', 'segment', ['C', 'X'], { rol: 'aux' }],
        ['sCY', 'segment', ['C', 'Y'], { rol: 'aux' }],
        ['pXYZ', 'poligon', ['X', 'Y', 'Z']],
        ['pA', 'poligon', ['A', 'Z', 'Y'], { rol: 'pista' }],
        ['pB', 'poligon', ['B', 'X', 'Z'], { rol: 'pista' }],
        ['pC', 'poligon', ['C', 'Y', 'X'], { rol: 'pista' }],
    ],
    destacat: ['X', 'Y', 'Z', 'pXYZ'],
    invariant: { tipus: 'equilater', objectes: ['X', 'Y', 'Z'] },
    degenerat: { areaMinima: 3, angleMinim: 8 },
    trencada: {
        text: 'Si a l’angle $A$, en lloc de la trisectriu més propera a $AB$, hi posem la bisectriu (que el divideix en dues parts i no en tres), el triangle $XYZ$ ja no és equilàter.',
        canvis: [
            ['tA1', 'bisectriu', ['B', 'A', 'C'], { rol: 'invisible' }],
        ],
    },
    pistes: {
        encarrec:
            'Treballa al revés: en lloc de partir del triangle i arribar a l’equilàter, parteix d’un equilàter i construeix-hi al voltant un triangle amb els angles de $ABC$.',
        concreta: 'Fes-ho en un triangle equilàter: quins angles té el triangle $XYZ$? I el triangle $AZY$?',
        figura: 'Set peces',
        tanca: 'Escriu els angles de $ABC$ com $3\\alpha$, $3\\beta$, $3\\gamma$, amb $\\alpha+\\beta+\\gamma=60^\\circ$. Quins angles han de tenir els triangles $AZY$, $BXZ$ i $CYX$?',
        comprovacio:
            'En un equilàter de costat $1$, cada trisectriu fa $20^\\circ$ amb el costat, i el triangle de Morley té costat $8R\\sin^3 20^\\circ\\approx 0{,}18$, amb $R=\\tfrac{1}{\\sqrt3}$.',
    },
    demostracio: [
        {
            text: 'Escrivim els angles de $ABC$ com $3\\alpha$, $3\\beta$, $3\\gamma$; aleshores $\\alpha+\\beta+\\gamma=60^\\circ$. Per a un angle $\\theta$, escrivim $\\theta^{+}=\\theta+60^\\circ$ i $\\theta^{++}=\\theta+120^\\circ$.',
        },
        {
            text: 'Fem-ho al revés. Partim d’un triangle equilàter $XYZ$ de costat $1$ i hi enganxem tres triangles: $AYZ$ amb angles $\\alpha$, $\\gamma^{+}$, $\\beta^{+}$ (a $A$, $Y$, $Z$); $BZX$ amb $\\beta$, $\\alpha^{+}$, $\\gamma^{+}$; i $CXY$ amb $\\gamma$, $\\beta^{+}$, $\\alpha^{+}$.',
            provaPrimer: 'Comprova que els angles de cada triangle sumen $180^\\circ$.',
        },
        {
            text: 'Hi afegim tres triangles més: $AZB$ amb angles $\\alpha$, $\\gamma^{++}$, $\\beta$ (a $A$, $Z$, $B$); $BXC$ amb $\\beta$, $\\alpha^{++}$, $\\gamma$; i $CYA$ amb $\\gamma$, $\\beta^{++}$, $\\alpha$.',
        },
        {
            text: 'Les mides encaixen. Pel teorema del sinus, a $AYZ$, $AZ=\\tfrac{\\sin\\gamma^{+}}{\\sin\\alpha}$, i a $BZX$, $BZ=\\tfrac{\\sin\\gamma^{+}}{\\sin\\beta}$. Per tant $\\tfrac{AZ}{BZ}=\\tfrac{\\sin\\beta}{\\sin\\alpha}$, just la raó que demana $AZB$ (angles $\\alpha$ a $A$ i $\\beta$ a $B$): el fem d’aquesta mida. Igual amb $BXC$ i $CYA$.',
        },
        {
            text: 'Al voltant de $X$ els angles sumen $60^\\circ+\\alpha^{++}+\\gamma^{+}+\\beta^{+}=360^\\circ$, i igual a $Y$ i a $Z$: les set peces fan una figura sense forats. A cada vèrtex, per exemple $A$, s’hi troben tres peces amb angle $\\alpha$: l’angle total és $3\\alpha$ i $AZ$, $AY$ en són les trisectrius.',
        },
        {
            text: 'Hem construït un triangle amb angles $3\\alpha$, $3\\beta$, $3\\gamma$, semblant a $ABC$, on les trisectrius es tallen en un equilàter. Una semblança conserva angles i rectes: a $ABC$ també. ∎ (Aquesta idea de treballar al revés és de John H. Conway; aquí n’hem fet una versió amb el teorema del sinus.)',
        },
    ],
    iDespres: {
        text: 'El costat del triangle de Morley fa $8R\\sin\\alpha\\sin\\beta\\sin\\gamma$, on $R$ és el radi de la circumferència circumscrita. I amb les trisectrius dels angles exteriors també surten triangles equilàters: n’hi ha $18$ en total.',
        construccioExtra: [],
    },
    referencies: [
        'J. H. Conway: «On Morley’s trisector theorem». The Mathematical Intelligencer 36 (2014).',
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
    ],
});
