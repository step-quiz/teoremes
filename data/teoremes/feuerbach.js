/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/feuerbach.js
 * ROL: 14. Teorema de Feuerbach (Feuerbach’s theorem): enunciat, construcció de GeoMotor,
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
    id: 'feuerbach',
    ordre: 14,
    nom: 'Teorema de Feuerbach',
    nomAngles: 'Feuerbach’s theorem',
    historia:
        'Karl Wilhelm Feuerbach el va publicar el 1822, quan tenia 22 anys, en una memòria sobre els punts notables del triangle. El punt de tangència $F$ es diu punt de Feuerbach.',
    enunciat:
        'En qualsevol triangle, la circumferència dels nou punts és tangent a la circumferència inscrita (i també a les tres exinscrites).',
    vista: { x0: -8, y0: -6.3, x1: 8, y1: 5.3 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C'],
    construccio: [
        ['A', 'punt', [-5.2, -2.8]],
        ['B', 'punt', [2.3, -2.8]],
        ['C', 'punt', [5.2, 4.4]],
        ['sAB', 'segment', ['A', 'B']],
        ['sBC', 'segment', ['B', 'C']],
        ['sCA', 'segment', ['C', 'A']],
        ['rBC', 'recta', ['B', 'C'], { rol: 'invisible' }],
        ['Ap', 'punt-mig', ['B', 'C'], { rol: 'aux', et: 'A′' }],
        ['Bp', 'punt-mig', ['C', 'A'], { rol: 'aux', et: 'B′' }],
        ['Cp', 'punt-mig', ['A', 'B'], { rol: 'aux', et: 'C′' }],
        ['c9', 'circumcercle', ['Ap', 'Bp', 'Cp']],
        ['N', 'circumcentre', ['Ap', 'Bp', 'Cp'], { rol: 'aux' }],
        ['I', 'incentre', ['A', 'B', 'C']],
        ['pI', 'perpendicular', ['rBC', 'I'], { rol: 'invisible' }],
        ['T', 'interseccio', ['pI', 'rBC', 0], { et: false, rol: 'invisible' }],
        ['ci', 'circumferencia', ['I', 'T']],
        ['rNI', 'semirecta', ['N', 'I'], { rol: 'invisible' }],
        ['Fe', 'interseccio', ['rNI', 'c9', 1], { et: 'F' }],
        ['O', 'circumcentre', ['A', 'B', 'C'], { rol: 'pista' }],
        ['H', 'ortocentre', ['A', 'B', 'C'], { rol: 'pista' }],
        ['sOH', 'segment', ['O', 'H'], { rol: 'pista' }],
        ['sNI', 'segment', ['N', 'I'], { rol: 'pista' }],
    ],
    destacat: ['c9', 'ci', 'Fe'],
    invariant: { tipus: 'tangents', objectes: ['c9', 'ci'] },
    degenerat: { areaMinima: 3, angleMinim: 10 },
    trencada: {
        text: 'Si en lloc de la circumferència inscrita prenem la que té el centre al baricentre $G$ i és tangent a la recta $BC$, ja no és tangent a la circumferència dels nou punts.',
        canvis: [['I', 'baricentre', ['A', 'B', 'C'], { et: 'G' }]],
    },
    pistes: {
        encarrec:
            'Dues circumferències són tangents per dins quan la distància entre els centres és la diferència dels radis. Has de provar que $NI=\\tfrac R2-r$.',
        concreta: 'Fes-ho amb el triangle rectangle $C=(0,0)$, $B=(4,0)$, $A=(0,3)$: calcula $R$, $r$, $N$ i $I$.',
        figura: 'La distància NI',
        tanca: 'Posa l’origen al circumcentre $O$. Aleshores $|A|=|B|=|C|=R$, $H=A+B+C$, $N=\\tfrac H2$ i $I=\\tfrac{aA+bB+cC}{a+b+c}$. Calcula $|I-N|^2$.',
        comprovacio:
            'En el cas concret, $R=\\tfrac52$, $r=1$, $N=(1,\\tfrac34)$ i $I=(1,1)$: $NI=\\tfrac14=\\tfrac54-1$.',
    },
    demostracio: [
        {
            text: 'Posem l’origen al circumcentre $O$. Llavors $|A|=|B|=|C|=R$, i de $|A-B|^2=c^2$ surt $A\\cdot B=R^2-\\tfrac{c^2}{2}$ (i igual per als altres parells).',
        },
        {
            text: 'El punt $H=A+B+C$ és l’ortocentre: $(H-A)\\cdot(B-C)=(B+C)\\cdot(B-C)=|B|^2-|C|^2=0$, i igual als altres vèrtexs. El centre dels nou punts és $N=\\tfrac H2$, i el radi, $\\tfrac R2$ (teorema 4).',
        },
        {
            text: 'L’incentre és $I=\\tfrac{aA+bB+cC}{2s}$, amb $2s=a+b+c$. Amb el pas 1 i $abc=4Rrs$ (l’àrea és $\\tfrac{abc}{4R}$ i també $rs$): $|I|^2=R^2-\\tfrac{abc}{2s}=R^2-2Rr$.',
            provaPrimer: 'És la fórmula d’Euler. Què en surt si recordes que $|I|^2\\ge0$?',
        },
        {
            text: 'De la mateixa manera, com que $A\\cdot H=3R^2-\\tfrac{b^2+c^2}{2}$ (i igual per a $B$ i $C$), surt $I\\cdot H=3R^2-\\tfrac{ab+bc+ca}{2}+3Rr$; i $|H|^2=9R^2-(a^2+b^2+c^2)$.',
        },
        {
            text: 'Ara, $|I-N|^2=|I|^2-I\\cdot H+\\tfrac{|H|^2}{4}=\\tfrac{R^2}{4}-5Rr+\\tfrac{ab+bc+ca}{2}-\\tfrac{a^2+b^2+c^2}{4}$.',
        },
        {
            text: 'Per la fórmula d’Heró, $r^2s=(s-a)(s-b)(s-c)$; desenvolupant-la surt $ab+bc+ca=s^2+r^2+4Rr$, i d’aquí $a^2+b^2+c^2=4s^2-2(ab+bc+ca)=2s^2-2r^2-8Rr$.',
        },
        {
            text: 'Substituint, $|I-N|^2=\\tfrac{R^2}{4}-5Rr+(r^2+4Rr)=\\left(\\tfrac R2-r\\right)^2$. Com que $R\\ge 2r$ (pas 3), $NI=\\tfrac R2-r$: la distància entre els centres és la diferència dels radis, i les circumferències són tangents per dins. ∎',
        },
    ],
    iDespres: {
        vista: { x0: -7.5, y0: -7.5, x1: 15, y1: 9.4 },
        text: 'Un càlcul semblant, amb l’excentre $I_a$ i el radi $r_a$ de la circumferència exinscrita oposada a $A$, dona $NI_a=\\tfrac R2+r_a$: la circumferència dels nou punts també és tangent, per fora, a les tres exinscrites. A la figura, l’exinscrita oposada a $A$.',
        construccioExtra: [
            ['bB', 'bisectriu', ['A', 'B', 'C'], { rol: 'invisible' }],
            ['eB', 'perpendicular', ['bB', 'B'], { rol: 'invisible' }],
            ['bC', 'bisectriu', ['A', 'C', 'B'], { rol: 'invisible' }],
            ['eC', 'perpendicular', ['bC', 'C'], { rol: 'invisible' }],
            ['Ia', 'interseccio', ['eB', 'eC', 0], { et: 'Iₐ' }],
            ['pa', 'perpendicular', ['rBC', 'Ia'], { rol: 'invisible' }],
            ['Ta', 'interseccio', ['pa', 'rBC', 0], { et: false, rol: 'invisible' }],
            ['ca', 'circumferencia', ['Ia', 'Ta']],
        ],
    },
    referencies: [
        'K. W. Feuerbach: Eigenschaften einiger merkwürdigen Punkte des geradlinigen Dreiecks. Nuremberg, 1822.',
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
    ],
});
