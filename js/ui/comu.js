/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: js/ui/comu.js
 * ROL: El que fan servir les tres pàgines: escriure un text amb fórmules dins
 *      d'un element (KaTeX), la llista dels teoremes en ordre, el teorema de
 *      l'adreça (?id=…) i les pistes obertes, desades al navegador.
 * ARQUITECTURA: Script clàssic (window.Comu).
 *      - Les fórmules es dibuixen amb katex.render (crea el DOM i posa els
 *        estils amb CSSOM), no amb renderToString + innerHTML: així la CSP pot
 *        prohibir els atributs style en línia.
 *      - Pistes: localStorage «teoremes:v1:pistes» = { id: quantes n'hi ha
 *        d'obertes }, sempre dins de try/catch (sense emmagatzematge, funciona igual).
 * DEPENDÈNCIES: vendor/katex-0.16.11/katex.min.js (window.katex), js/motor/text.js
 * ============================================================================
 */
(function () {
    'use strict';
    var Tx = window.TextTeo;
    var CLAU_PISTES = 'teoremes:v1:pistes';

    /** Posa el text s (amb fórmules entre $…$) dins de l'element el. */
    function posa(el, s) {
        el.textContent = '';
        var trossos;
        try {
            trossos = Tx.trossos(String(s));
        } catch (e) {
            el.textContent = s;
            return el;
        }
        trossos.forEach(function (t) {
            if (t.tipus === 'text') el.appendChild(document.createTextNode(t.v));
            else {
                var sp = document.createElement('span');
                sp.className = 'formula';
                try {
                    window.katex.render(t.v, sp, { throwOnError: false });
                } catch (e) {
                    sp.textContent = t.v;
                }
                el.appendChild(sp);
            }
        });
        return el;
    }
    /** Un element nou amb el text (i fórmules). */
    function element(etiqueta, s, classe) {
        var el = document.createElement(etiqueta);
        if (classe) el.className = classe;
        return posa(el, s);
    }

    /** Els teoremes, en l'ordre de la llista. */
    function teoremes() {
        return (window.TEOREMES || []).slice().sort(function (a, b) {
            return a.ordre - b.ordre;
        });
    }
    /** Els paràmetres de l'adreça (si n'hi ha d'estranys, no passa res). */
    function parametres() {
        try {
            return new URLSearchParams(location.search);
        } catch (e) {
            return new URLSearchParams('');
        }
    }

    function llegeixPistes() {
        try {
            var p = JSON.parse(localStorage.getItem(CLAU_PISTES) || '{}');
            return p && typeof p === 'object' ? p : {};
        } catch (e) {
            return {};
        }
    }
    function pistesObertes(id, maxim) {
        var n = Number(llegeixPistes()[id]) || 0;
        return Math.max(0, Math.min(maxim, Math.floor(n)));
    }
    function desaPistes(id, n) {
        var p = llegeixPistes();
        p[id] = n;
        try {
            localStorage.setItem(CLAU_PISTES, JSON.stringify(p));
        } catch (e) {
            /* sense emmagatzematge: es treballa igual */
        }
    }

    window.Comu = {
        posa: posa,
        element: element,
        pla: Tx.pla,
        teoremes: teoremes,
        parametres: parametres,
        pistesObertes: pistesObertes,
        desaPistes: desaPistes,
    };
})();
