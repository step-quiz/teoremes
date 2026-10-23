/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: js/motor/resistencia.js
 * ROL: La «Prova de resistència»: 1000 configuracions a l'atzar (amb llavor)
 *      dels punts lliures d'un teorema, sense les degenerades, i l'error de
 *      l'invariant a cadascuna. També fa el mateix amb la variant trencada,
 *      per veure com és un teorema que NO es compleix.
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   Configuració a l'atzar (configura): cada punt lliure, uniforme dins de
 *   t.limits; cada punt-sobre una circumferència, un angle a [0, 2π); sobre un
 *   segment, t a [0,05, 0,95]; sobre una recta, t a [−0,5, 1,5]. Els ids de
 *   t.ordenats (punts-sobre la mateixa circumferència) surten en aquest ordre
 *   (sentit antihorari), com el quadrilàter convex de Ptolemeu.
 *   Degenerades (degenerada), segons t.degenerat:
 *     areaMinima / angleMinim: del polígon / triangle dels punts de `de`
 *                              (per defecte, els lliures que són punts);
 *     distMinima: entre els punts lliures (avaluats);
 *     maxCoord: cap punt de la construcció fora de [−maxCoord, maxCoord]²
 *               (per defecte 1000: talls gairebé a l'infinit);
 *     i sempre: algun objecte de l'invariant no existeix, o el comprovador
 *     diu que la configuració és degenerada.
 *   prova(t, { n, llavor, trencada }) → { n, compleixen, errorMax, errorMedia,
 *     descartades, pitjor } (pitjor: els valors dels lliures de l'error més gran).
 * DEPENDÈNCIES: GeoMotor, Atzar, Invariants, Construccio
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var node = typeof module === 'object' && module.exports;
    var api = node
        ? fabrica(
              require('./geo-motor.js'),
              require('./atzar.js'),
              require('./invariants.js'),
              require('./construccio.js')
          )
        : fabrica(arrel.GeoMotor, arrel.Atzar, arrel.Invariants, arrel.Construccio);
    if (node) module.exports = api;
    else arrel.Resistencia = api;
})(typeof self !== 'undefined' ? self : this, function (G, Atzar, Inv, K) {
    'use strict';

    var N = 1000;
    var LLAVOR = 'teoremes';
    var MAX_INTENTS = 20; // per configuració bona, com a molt

    /** Valors a l'atzar per als lliures (formats de Construccio.posa). */
    function configura(t, fig, rng) {
        var lim = t.limits || { x: [-5, 5], y: [-4, 4] };
        var out = {};
        K.lliures(t, fig).forEach(function (l) {
            if (l.mode === 'xy')
                out[l.id] = [
                    lim.x[0] + (lim.x[1] - lim.x[0]) * rng.real(),
                    lim.y[0] + (lim.y[1] - lim.y[0]) * rng.real(),
                ];
            else if (l.mode === 'cercle') out[l.id] = 2 * Math.PI * rng.real();
            else if (l.mode === 'segment') out[l.id] = 0.05 + 0.9 * rng.real();
            else if (l.mode === 'linia') out[l.id] = -0.5 + 2 * rng.real();
        });
        if (t.ordenats) {
            var angles = t.ordenats
                .map(function (id) {
                    return out[id];
                })
                .sort(function (a, b) {
                    return a - b;
                });
            t.ordenats.forEach(function (id, i) {
                out[id] = angles[i];
            });
        }
        return out;
    }

    function area(p) {
        var s = 0;
        for (var i = 0; i < p.length; i++) {
            var a = p[i],
                b = p[(i + 1) % p.length];
            s += a.x * b.y - a.y * b.x;
        }
        return Math.abs(s) / 2;
    }
    function angleMinim(p) {
        var m = Infinity;
        for (var i = 0; i < 3; i++) {
            var A = p[i],
                B = p[(i + 1) % 3],
                C = p[(i + 2) % 3];
            var u = { x: B.x - A.x, y: B.y - A.y },
                w = { x: C.x - A.x, y: C.y - A.y };
            var ang = Math.abs(Math.atan2(u.x * w.y - u.y * w.x, u.x * w.x + u.y * w.y));
            m = Math.min(m, (ang * 180) / Math.PI);
        }
        return m;
    }

    /** El motiu pel qual la configuració és degenerada, o null. */
    function degenerada(t, fig, valors) {
        var d = t.degenerat || {};
        var punts = function (ids) {
            return ids.map(function (id) {
                return valors[id];
            });
        };
        var de =
            d.de ||
            K.lliures(t, fig)
                .filter(function (l) {
                    return l.mode === 'xy';
                })
                .map(function (l) {
                    return l.id;
                });
        var p = punts(de);
        if (
            p.some(function (v) {
                return !v;
            })
        )
            return 'no existeix';
        if (d.areaMinima && p.length >= 3 && area(p) < d.areaMinima) return 'àrea';
        if (d.angleMinim && p.length === 3 && angleMinim(p) < d.angleMinim) return 'angle';
        if (d.distMinima) {
            var l = punts(t.lliures);
            for (var i = 0; i < l.length; i++)
                for (var j = i + 1; j < l.length; j++)
                    if (Math.hypot(l[i].x - l[j].x, l[i].y - l[j].y) < d.distMinima) return 'distància';
        }
        var max = d.maxCoord || 1000;
        for (var k = 0; k < fig.objectes.length; k++) {
            var v = valors[fig.objectes[k].id];
            if (v && typeof v.x === 'number' && (Math.abs(v.x) > max || Math.abs(v.y) > max)) return 'lluny';
        }
        return null;
    }

    /** L'error de l'invariant en una figura ja avaluada (null: degenerada). */
    function errorDe(t, valors) {
        var esc = K.mida(t, valors);
        if (!(esc > 0)) return null;
        return Inv.error(t.invariant, valors, esc);
    }

    /**
     * La prova de resistència.
     * @param {object} t  el teorema
     * @param {object} [o] { n: 1000, llavor: 'teoremes', trencada: false }
     */
    function prova(t, o) {
        o = o || {};
        var n = o.n || N;
        var rng = Atzar.crea((o.llavor || LLAVOR) + ':' + t.id);
        var muntat = K.munta(t, { trencada: !!o.trencada });
        var fig = muntat.fig;
        var compleixen = 0,
            fetes = 0,
            descartades = 0,
            errorMax = 0,
            suma = 0,
            pitjor = null;
        var intents = 0;
        while (fetes < n && intents < n * MAX_INTENTS) {
            intents++;
            var conf = configura(t, fig, rng);
            K.posa(fig, conf);
            var valors = G.avalua(fig).valors;
            var e = degenerada(t, fig, valors) ? null : errorDe(t, valors);
            if (e === null) {
                descartades++;
                continue;
            }
            fetes++;
            suma += e;
            if (e <= Inv.TOLERANCIA) compleixen++;
            if (e >= errorMax) {
                errorMax = e;
                pitjor = conf;
            }
        }
        return {
            n: fetes,
            compleixen: compleixen,
            errorMax: errorMax,
            errorMedia: fetes ? suma / fetes : null,
            descartades: descartades,
            pitjor: pitjor,
        };
    }

    return {
        N: N,
        LLAVOR: LLAVOR,
        configura: configura,
        degenerada: degenerada,
        errorDe: errorDe,
        prova: prova,
    };
});
