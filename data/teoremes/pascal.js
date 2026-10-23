/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: data/teoremes/pascal.js
 * ROL: 10. Teorema de Pascal (Pascal’s theorem): enunciat, construcció de GeoMotor,
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
    id: 'pascal',
    ordre: 10,
    nom: 'Teorema de Pascal',
    nomAngles: 'Pascal’s theorem',
    historia:
        'Blaise Pascal el va enunciar el 1640, amb setze anys, en un full imprès titulat Essai pour les coniques. N’hi deia l’hexagrama místic.',
    enunciat:
        'Si els sis vèrtexs d’un hexàgon $ABCDEF$ són sobre una circumferència, els punts on es tallen els costats oposats, $X=AB\\cap DE$, $Y=BC\\cap EF$ i $Z=CD\\cap FA$, estan alineats.',
    nota: 'Arrossega els vèrtexs: si en canvies l’ordre, l’hexàgon es creua i el teorema continua valent.',
    vista: { x0: -9, y0: -6, x1: 9, y1: 6 },
    limits: { x: [-6, 6], y: [-4.5, 4.5] },
    lliures: ['A', 'B', 'C', 'D', 'E', 'F'],
    construccio: [
        ['O', 'punt', [0, 0], { et: false }],
        ['c', 'circumferencia-radi', ['O', 4]],
        ['A', 'punt-sobre', ['c', 0.18]],
        ['B', 'punt-sobre', ['c', 3.41]],
        ['C', 'punt-sobre', ['c', 4.6]],
        ['D', 'punt-sobre', ['c', 5.52]],
        ['E', 'punt-sobre', ['c', 2.71]],
        ['F', 'punt-sobre', ['c', 0.82]],
        ['h', 'poligon', ['A', 'B', 'C', 'D', 'E', 'F']],
        ['rAB', 'recta', ['A', 'B'], { rol: 'aux' }],
        ['rBC', 'recta', ['B', 'C'], { rol: 'aux' }],
        ['rCD', 'recta', ['C', 'D'], { rol: 'aux' }],
        ['rDE', 'recta', ['D', 'E'], { rol: 'aux' }],
        ['rEF', 'recta', ['E', 'F'], { rol: 'aux' }],
        ['rFA', 'recta', ['F', 'A'], { rol: 'aux' }],
        ['X', 'interseccio', ['rAB', 'rDE', 0]],
        ['Y', 'interseccio', ['rBC', 'rEF', 0]],
        ['Z', 'interseccio', ['rCD', 'rFA', 0]],
        ['rP', 'recta', ['X', 'Z']],
        ['U', 'interseccio', ['rAB', 'rCD', 0], { et: false, rol: 'invisible' }],
        ['Vv', 'interseccio', ['rCD', 'rEF', 0], { et: false, rol: 'invisible' }],
        ['W', 'interseccio', ['rEF', 'rAB', 0], { et: false, rol: 'invisible' }],
        ['pT', 'poligon', ['U', 'Vv', 'W'], { rol: 'pista' }],
    ],
    destacat: ['X', 'Y', 'Z', 'rP'],
    invariant: { tipus: 'colinears', objectes: ['X', 'Y', 'Z'] },
    degenerat: { distMinima: 0.4, maxCoord: 300 },
    trencada: {
        text: 'Si $F$ no és sobre la circumferència (aquí és sobre una de concèntrica més gran), els punts $X$, $Y$, $Z$ ja no estan alineats.',
        canvis: [
            ['c2', 'circumferencia-radi', ['O', 5], { rol: 'aux' }],
            ['F', 'punt-sobre', ['c2', 0.82]],
        ],
    },
    pistes: {
        encarrec:
            'Has de provar que tres punts estan alineats. Una eina per a això: el recíproc del teorema de Menelau.',
        concreta:
            'Pensa en el cas en què $AB\\parallel DE$ i $BC\\parallel EF$: aleshores el teorema diu que $CD\\parallel FA$. Comprova-ho en un hexàgon regular.',
        figura: 'El triangle UVW',
        tanca: 'Les rectes $AB$, $CD$ i $EF$ formen un triangle $UVW$. Aplica-hi Menelau tres vegades, amb les rectes $DE$, $BC$ i $FA$, i multiplica.',
        comprovacio:
            'A l’hexàgon regular, cada costat és paral·lel a l’oposat: els tres punts són «a l’infinit», i la recta que els uneix és la recta de l’infinit. És el cas límit del teorema.',
    },
    demostracio: [
        {
            text: 'Les rectes $AB$, $CD$ i $EF$ formen un triangle $UVW$, amb $U=AB\\cap CD$, $V=CD\\cap EF$ i $W=EF\\cap AB$. Fem servir segments amb signe.',
        },
        {
            text: 'Menelau al triangle $UVW$ amb la recta $DE$ (que talla $UV$ en $D$, $VW$ en $E$ i $WU$ en $X$): $\\tfrac{\\overline{UD}}{\\overline{DV}}\\cdot\\tfrac{\\overline{VE}}{\\overline{EW}}\\cdot\\tfrac{\\overline{WX}}{\\overline{XU}}=-1$. Igualment amb la recta $BC$ (punts $C$, $Y$, $B$) i amb la recta $FA$ (punts $Z$, $F$, $A$).',
        },
        {
            text: 'Multipliquem les tres igualtats. Per la potència d’un punt, $\\overline{UA}\\cdot\\overline{UB}=\\overline{UC}\\cdot\\overline{UD}$ (perquè $U$ és a les rectes $AB$ i $CD$), $\\overline{VC}\\cdot\\overline{VD}=\\overline{VE}\\cdot\\overline{VF}$ i $\\overline{WE}\\cdot\\overline{WF}=\\overline{WA}\\cdot\\overline{WB}$.',
            provaPrimer: 'Quins factors del producte es cancel·len?',
        },
        {
            text: 'Tots els factors amb $A$, $B$, $C$, $D$, $E$ o $F$ es cancel·len, i queda $\\tfrac{\\overline{UZ}}{\\overline{ZV}}\\cdot\\tfrac{\\overline{VY}}{\\overline{YW}}\\cdot\\tfrac{\\overline{WX}}{\\overline{XU}}=-1$.',
        },
        {
            text: 'Pel recíproc del teorema de Menelau, $X$, $Y$ i $Z$ estan alineats. ∎ No hem fet servir l’ordre dels punts a la circumferència: per això també val per als hexàgons creuats.',
        },
    ],
    iDespres: {
        text: 'El teorema val per a qualsevol cònica (el·lipse, paràbola o hipèrbola), i també quan la «cònica» són dues rectes: llavors és el teorema de Pappus. Amb sis punts fixos es poden fer $60$ hexàgons diferents, i cadascun té la seva recta de Pascal.',
        construccioExtra: [],
    },
    referencies: [
        'B. Pascal: Essai pour les coniques. París, 1640.',
        'H. S. M. Coxeter i S. L. Greitzer: Geometry Revisited. Mathematical Association of America, 1967.',
    ],
});
