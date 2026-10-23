/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: js/motor/text.js
 * ROL: Separa un text amb fórmules en trossos: el text normal i les fórmules
 *      entre $…$ (que la interfície dibuixa amb KaTeX i els tests comproven).
 * ARQUITECTURA: Pur, sense DOM. «\$» és un dòlar de veritat. Un $ sense parella
 *      és un error (els tests ho comproven a totes les dades).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.TextTeo = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /** [{ tipus: 'text' | 'tex', v }]; llança un error si hi ha un $ sense tancar. */
    function trossos(s) {
        var out = [],
            actual = '',
            dinsTex = false;
        for (var i = 0; i < s.length; i++) {
            var ch = s[i];
            if (ch === '\\' && s[i + 1] === '$' && !dinsTex) {
                actual += '$';
                i++;
            } else if (ch === '$') {
                if (actual) out.push({ tipus: dinsTex ? 'tex' : 'text', v: actual });
                actual = '';
                dinsTex = !dinsTex;
            } else actual += ch;
        }
        if (dinsTex) throw new Error('fórmula sense tancar: ' + s);
        if (actual) out.push({ tipus: 'text', v: actual });
        return out;
    }

    // Unes quantes ordres de TeX en Unicode, per al text pla
    var UNICODE = [
        [/\\sqrt\{([^}]*)\}/g, '√$1'],
        [/\\d?frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)'],
        [/\^2/g, '²'],
        [/\^3/g, '³'],
        [/\^n/g, 'ⁿ'],
        [/\\cdot/g, '·'],
        [/\\times/g, '×'],
        [/\\le\b/g, '≤'],
        [/\\ge\b/g, '≥'],
        [/\\ne\b/g, '≠'],
        [/\\dots|\\ldots/g, '…'],
        [/\\circ/g, '°'],
        [/\\alpha/g, 'α'],
        [/\\beta/g, 'β'],
        [/\\gamma/g, 'γ'],
    ];
    /** El text pla (per a aria-label i títols): les fórmules sense els $ i amb uns quants símbols. */
    function pla(s) {
        return trossos(s)
            .map(function (t) {
                if (t.tipus === 'text') return t.v;
                var v = t.v;
                UNICODE.forEach(function (r) {
                    v = v.replace(r[0], r[1]);
                });
                return v;
            })
            .join('');
    }

    return { trossos: trossos, pla: pla };
});
