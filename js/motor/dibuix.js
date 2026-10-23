/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: js/motor/dibuix.js
 * ROL: Dibuixa la figura d'un teorema en SVG (text): punts, segments, rectes
 *      i semirectes retallades a la vista, circumferències i polígons, cadascun
 *      amb la classe del seu paper (base, aux, pista, destacat, extra), i els
 *      punts lliures amb una zona grossa per tocar-los i arrossegar-los.
 * ARQUITECTURA: Pur, sense DOM (retorna text; també el fan servir els tests).
 *   Coordenades: les del món (cm, y cap amunt); l'SVG fa servir (x, −y), així
 *   el text no surt de cap per avall. Colors i gruixos: a css/teoremes.css
 *   (classes r-base, r-aux…), cap atribut style (CSP).
 *   svg(muntat, valors, o) amb o = { pistes, lliures: [ids], seleccionat,
 *   etiquetes (per defecte, sí), titol }.
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.Dibuix = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var ORDRE = ['aux', 'base', 'pista', 'extra', 'destacat'];
    // Mides (cm) per a una vista de 16 cm d'amplada; es fan més grans amb la vista
    var MIDA_LLETRA = 0.5;

    var n = function (v) {
        var s = (Math.round(v * 1000) / 1000).toFixed(3).replace(/\.?0+$/, '');
        return s === '-0' ? '0' : s;
    };
    var esc = function (s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    var esPunt = function (v) {
        return v && typeof v.x === 'number' && typeof v.y === 'number';
    };

    /** Retalla p + t·d (t dins [t0, t1]) al rectangle de la vista (Liang–Barsky). */
    function retalla(p, d, t0, t1, v) {
        var lims = [
            [-d.x, p.x - v.x0],
            [d.x, v.x1 - p.x],
            [-d.y, p.y - v.y0],
            [d.y, v.y1 - p.y],
        ];
        for (var i = 0; i < 4; i++) {
            var a = lims[i][0],
                b = lims[i][1];
            if (a === 0) {
                if (b < 0) return null;
            } else {
                var r = b / a;
                if (a < 0) {
                    if (r > t1) return null;
                    if (r > t0) t0 = r;
                } else {
                    if (r < t0) return null;
                    if (r < t1) t1 = r;
                }
            }
        }
        return [
            { x: p.x + d.x * t0, y: p.y + d.y * t0 },
            { x: p.x + d.x * t1, y: p.y + d.y * t1 },
        ];
    }

    function linia(L, v) {
        var d = { x: L.q.x - L.p.x, y: L.q.y - L.p.y };
        if (L.tipus === 'segment') return [L.p, L.q];
        return retalla(L.p, d, L.tipus === 'semirecta' ? 0 : -Infinity, Infinity, v);
    }

    /** On va l'etiqueta d'un punt: lluny del centre de la figura. */
    function lloc(P, centre, desp, u) {
        if (desp) return { x: P.x + desp[0] * u, y: P.y + desp[1] * u };
        var dx = P.x - centre.x,
            dy = P.y - centre.y,
            l = Math.hypot(dx, dy);
        if (l < 1e-9) {
            dx = 1;
            dy = 1;
            l = Math.SQRT2;
        }
        return { x: P.x + (0.42 * u * dx) / l, y: P.y + (0.42 * u * dy) / l };
    }

    /**
     * L'SVG de la figura.
     * @param {object} m       el que torna Construccio.munta
     * @param {object} valors  GeoMotor.avalua(m.fig).valors
     * @param {object} [o]
     */
    function svg(m, valors, o) {
        o = o || {};
        var v = m.fig.vista;
        var u = (v.x1 - v.x0) / 16;
        var lliures = o.lliures || [];
        var esLliure = {};
        lliures.forEach(function (id) {
            esLliure[id] = true;
        });
        var visible = function (id) {
            var r = m.rol[id];
            if (r === 'invisible') return false;
            if (r === 'pista' && !o.pistes) return false;
            return true;
        };
        // Centre de la figura: el dels punts lliures (o el de la vista)
        var cx = 0,
            cy = 0,
            k = 0;
        lliures.forEach(function (id) {
            if (esPunt(valors[id])) {
                cx += valors[id].x;
                cy += valors[id].y;
                k++;
            }
        });
        var centre = k ? { x: cx / k, y: cy / k } : { x: (v.x0 + v.x1) / 2, y: (v.y0 + v.y1) / 2 };

        var capes = { ple: [], traç: {}, punts: [], etiquetes: [], nanses: [] };
        ORDRE.forEach(function (r) {
            capes.traç[r] = [];
        });
        m.fig.objectes.forEach(function (ob) {
            var id = ob.id,
                val = valors[id],
                rol = m.rol[id];
            if (!val || !visible(id)) return;
            var cls = 'r-' + rol;
            if (val.punts) {
                var pts = val.punts
                    .map(function (P) {
                        return n(P.x) + ',' + n(-P.y);
                    })
                    .join(' ');
                if (rol === 'destacat' || rol === 'extra')
                    capes.ple.push('<polygon class="ple ' + cls + '" points="' + pts + '"/>');
                capes.traç[rol].push('<polygon class="' + cls + '" points="' + pts + '"/>');
            } else if (val.c && typeof val.r === 'number') {
                capes.traç[rol].push(
                    '<circle class="' +
                        cls +
                        '" cx="' +
                        n(val.c.x) +
                        '" cy="' +
                        n(-val.c.y) +
                        '" r="' +
                        n(val.r) +
                        '"/>'
                );
            } else if (val.p && val.q) {
                var s = linia(val, v);
                if (s)
                    capes.traç[rol].push(
                        '<line class="' +
                            cls +
                            '" x1="' +
                            n(s[0].x) +
                            '" y1="' +
                            n(-s[0].y) +
                            '" x2="' +
                            n(s[1].x) +
                            '" y2="' +
                            n(-s[1].y) +
                            '"/>'
                    );
            } else if (esPunt(val)) {
                if (Math.abs(val.x) > 1e4 || Math.abs(val.y) > 1e4) return;
                var lliure = esLliure[id];
                capes.punts.push(
                    '<circle class="punt ' +
                        cls +
                        (lliure ? ' lliure' : '') +
                        (o.seleccionat === id ? ' triat' : '') +
                        '" cx="' +
                        n(val.x) +
                        '" cy="' +
                        n(-val.y) +
                        '" r="' +
                        n((lliure ? 0.14 : 0.085) * u) +
                        '"/>'
                );
                var et = m.etiqueta[id];
                if (et && o.etiquetes !== false) {
                    var L = lloc(val, centre, m.desp[id], u);
                    capes.etiquetes.push(
                        '<text class="et ' +
                            cls +
                            '" x="' +
                            n(L.x) +
                            '" y="' +
                            n(-L.y + MIDA_LLETRA * u * 0.35) +
                            '" font-size="' +
                            n(MIDA_LLETRA * u) +
                            '" text-anchor="middle">' +
                            esc(et) +
                            '</text>'
                    );
                }
                if (lliure && o.nanses !== false)
                    capes.nanses.push(
                        '<circle class="toc" data-id="' +
                            esc(id) +
                            '" tabindex="0" role="button" aria-label="' +
                            esc((o.nomPunt || 'Punt') + ' ' + (et || id)) +
                            '"' +
                            (o.seleccionat === id ? ' aria-pressed="true"' : ' aria-pressed="false"') +
                            ' cx="' +
                            n(val.x) +
                            '" cy="' +
                            n(-val.y) +
                            '" r="' +
                            n(0.45 * u) +
                            '"/>'
                    );
            }
        });
        var cos = capes.ple.join('');
        ORDRE.forEach(function (r) {
            cos += capes.traç[r].join('');
        });
        cos += capes.punts.join('') + capes.etiquetes.join('') + capes.nanses.join('');
        var w = v.x1 - v.x0,
            h = v.y1 - v.y0;
        return (
            '<svg class="figura" viewBox="' +
            [n(v.x0), n(-v.y1), n(w), n(h)].join(' ') +
            '" role="img"' +
            (o.titol ? ' aria-label="' + esc(o.titol) + '"' : '') +
            '>' +
            '<rect class="fons" x="' +
            n(v.x0) +
            '" y="' +
            n(-v.y1) +
            '" width="' +
            n(w) +
            '" height="' +
            n(h) +
            '"/>' +
            cos +
            '</svg>'
        );
    }

    return { svg: svg, retalla: retalla, ORDRE: ORDRE };
});
