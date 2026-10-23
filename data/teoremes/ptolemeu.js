/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/ptolemeu.js
 * ROL: 8. Teorema de Ptolemeu (Ptolemy’s theorem): enunciat, construcció de GeoMotor,
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
    id: 'ptolemeu',
    ordre: 8,
    nom: 'Teorema de Ptolemeu',
    nomAngles: 'Ptolemy’s theorem',
    historia:
        'Claudi Ptolemeu (segle II) el va fer servir a l’Almagest per construir una taula de cordes, l’avantpassada de les taules trigonomètriques: d’aquest teorema surten les fórmules del sinus de la suma i de la diferència.',
    enunciat:
        'Si $ABCD$ és un quadrilàter convex inscrit en una circumferència, el producte de les diagonals és la suma dels productes dels costats oposats: $AC\\cdot BD=AB\\cdot CD+AD\\cdot BC$.',
    nota: 'Arrossega els vèrtexs per la circumferència (l’ordre $A$, $B$, $C$, $D$ no canvia).',
    vista: { x0: -7, y0: -5, x1: 7, y1: 5 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C', 'D'],
    ordenats: ['A', 'B', 'C', 'D'],
    construccio: [
        ['O', 'punt', [0, 0], { et: false }],
        ['c', 'circumferencia-radi', ['O', 4]],
        ['A', 'punt-sobre', ['c', 3.6]],
        ['B', 'punt-sobre', ['c', 5.6]],
        ['C', 'punt-sobre', ['c', 0.9]],
        ['D', 'punt-sobre', ['c', 2.3]],
        ['pQ', 'poligon', ['A', 'B', 'C', 'D']],
        ['sAC', 'segment', ['A', 'C']],
        ['sBD', 'segment', ['B', 'D']],
        ['bis', 'bisectriu', ['A', 'B', 'C'], { rol: 'invisible' }],
        ['Dp', 'simetria', ['D', 'bis'], { et: false, rol: 'invisible' }],
        ['rBK', 'recta', ['B', 'Dp'], { rol: 'invisible' }],
        ['K', 'interseccio', ['rBK', 'sAC', 0], { rol: 'pista' }],
        ['sBK', 'segment', ['B', 'K'], { rol: 'pista' }],
    ],
    destacat: ['sAC', 'sBD'],
    invariant: {
        tipus: 'igualtat',
        esquerra: [
            [
                ['A', 'C'],
                ['B', 'D'],
            ],
        ],
        dreta: [
            [
                ['A', 'B'],
                ['C', 'D'],
            ],
            [
                ['A', 'D'],
                ['B', 'C'],
            ],
        ],
    },
    degenerat: { distMinima: 0.5 },
    trencada: {
        text: 'Si $D$ no és sobre la circumferència (aquí és sobre una de concèntrica més gran), la igualtat ja no es compleix: $AC\\cdot BD$ queda per sota de $AB\\cdot CD+AD\\cdot BC$.',
        canvis: [
            ['c2', 'circumferencia-radi', ['O', 5], { rol: 'aux' }],
            ['D', 'punt-sobre', ['c2', 2.3]],
        ],
    },
    pistes: {
        encarrec:
            'Has de partir la diagonal $\\overline{AC}$ en dos trossos, $AK$ i $KC$, de manera que $AK\\cdot BD=AB\\cdot CD$ i $KC\\cdot BD=AD\\cdot BC$.',
        concreta: 'Prova-ho amb un rectangle de costats $3$ i $4$: què diu el teorema?',
        figura: 'El punt K',
        tanca: 'Tria $K$ sobre $\\overline{AC}$ de manera que $\\widehat{ABK}=\\widehat{DBC}$, i busca dos parells de triangles semblants.',
        comprovacio:
            'Al rectangle de costats $3$ i $4$, les diagonals fan $5$: $5\\cdot5=3\\cdot3+4\\cdot4$. És el teorema de Pitàgores!',
    },
    demostracio: [
        {
            text: 'Prenem $K$ a la diagonal $\\overline{AC}$ de manera que $\\widehat{ABK}=\\widehat{DBC}$: la recta $BK$ és la simètrica de $BD$ respecte de la bisectriu de $\\widehat{ABC}$.',
        },
        {
            text: 'Els triangles $ABK$ i $DBC$ són semblants: $\\widehat{ABK}=\\widehat{DBC}$ per construcció, i $\\widehat{BAK}=\\widehat{BAC}=\\widehat{BDC}$ perquè tots dos angles inscrits miren l’arc $BC$.',
            provaPrimer: 'Quina proporció en surt?',
        },
        { text: 'Per tant, $\\tfrac{AK}{AB}=\\tfrac{DC}{DB}$, és a dir, $AK\\cdot BD=AB\\cdot CD$.' },
        {
            text: 'Els triangles $KBC$ i $ABD$ també són semblants: $\\widehat{KBC}=\\widehat{ABC}-\\widehat{ABK}=\\widehat{ABC}-\\widehat{DBC}=\\widehat{ABD}$, i $\\widehat{BCK}=\\widehat{BCA}=\\widehat{BDA}$ (miren l’arc $AB$). D’aquí, $\\tfrac{KC}{BC}=\\tfrac{AD}{BD}$: $KC\\cdot BD=AD\\cdot BC$.',
        },
        { text: 'Sumant: $AC\\cdot BD=(AK+KC)\\cdot BD=AB\\cdot CD+AD\\cdot BC$. ∎' },
    ],
    iDespres: {
        text: 'Per a quatre punts qualssevol del pla, $AC\\cdot BD\\le AB\\cdot CD+AD\\cdot BC$ (la desigualtat de Ptolemeu), i la igualtat només es dona si $ABCD$ és convex i inscrit. Amb un rectangle surt Pitàgores; amb un triangle equilàter $ABC$ i un punt $P$ de l’arc $BC$, surt $PA=PB+PC$.',
        construccioExtra: [],
    },
    referencies: [
        'Ptolemeu: Almagest, llibre I.',
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
    ],
});
