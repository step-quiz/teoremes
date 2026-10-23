/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: js/motor/invariants.js
 * ROL: Els comprovadors dels teoremes: donats els valors d'una construcció
 *      avaluada (GeoMotor), diuen quant s'allunya la figura del que afirma el
 *      teorema. L'error és RELATIU (sense unitats): 0 vol dir exacte, i la
 *      tolerància per defecte és 1e-9 (només l'error d'arrodoniment dels doubles).
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   error(inv, valors, esc) → nombre ≥ 0, o null si la configuració és
 *   degenerada per a aquest comprovador (punts que coincideixen, rectes
 *   paral·leles…) o si algun objecte no existeix (null de GeoMotor).
 *   esc és la mida de la figura (la distància més gran entre els punts lliures):
 *   les distàncies es divideixen per esc per fer-les relatives.
 *   Tipus (inv.tipus) i arguments (inv.objectes, ids de la construcció):
 *     colinears [P, Q, R]           el tercer punt, a la recta dels altres dos
 *     concurrents [l1, l2, l3]      tres rectes que passen per un mateix punt
 *     conciclics [P1, P2, P3, …]    tots a la circumferència per P1, P2, P3
 *     equilater [P, Q, R]           els tres costats iguals
 *     tangents [c1, c2]             |d − (r1 + r2)| o |d − |r1 − r2||
 *     igualtat {esquerra, dreta}    sumes de productes de longituds:
 *                                   cada terme és una llista de segments [P, Q]
 *     paralelogram [P, Q, R, S]     P + R = Q + S (les diagonals es tallen pel mig)
 *     iguals-perpendiculars [P, Q, R, S]  PR i QS iguals i perpendiculars
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.Invariants = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var TOLERANCIA = 1e-9;
    // Per sota d'això (relatiu a la mida de la figura) dues coses es consideren el mateix punt
    var MIN = 1e-7;

    var dist = function (a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    };
    var cross = function (a, b, c) {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    };
    var esPunt = function (v) {
        return v && typeof v.x === 'number' && typeof v.y === 'number';
    };
    var esLinia = function (v) {
        return v && esPunt(v.p) && esPunt(v.q);
    };
    var esCercle = function (v) {
        return v && esPunt(v.c) && typeof v.r === 'number';
    };

    /** Circumcentre i radi de tres punts, o null si estan (gairebé) alineats. */
    function cercle3(A, B, C, esc) {
        var d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
        if (Math.abs(d) <= MIN * esc * esc) return null;
        var a2 = A.x * A.x + A.y * A.y,
            b2 = B.x * B.x + B.y * B.y,
            c2 = C.x * C.x + C.y * C.y;
        var O = {
            x: (a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / d,
            y: (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / d,
        };
        return { c: O, r: dist(O, A) };
    }

    /** Punt de tall de dues rectes, o null si són paral·leles. */
    function tall(l, m) {
        var d1 = { x: l.q.x - l.p.x, y: l.q.y - l.p.y },
            d2 = { x: m.q.x - m.p.x, y: m.q.y - m.p.y };
        var den = d1.x * d2.y - d1.y * d2.x;
        var n1 = Math.hypot(d1.x, d1.y),
            n2 = Math.hypot(d2.x, d2.y);
        if (!n1 || !n2 || Math.abs(den) <= 1e-9 * n1 * n2) return null;
        var t = ((m.p.x - l.p.x) * d2.y - (m.p.y - l.p.y) * d2.x) / den;
        return { x: l.p.x + d1.x * t, y: l.p.y + d1.y * t, sin: Math.abs(den) / (n1 * n2) };
    }
    /** Distància d'un punt a una recta. */
    function distRecta(P, l) {
        return Math.abs(cross(l.p, l.q, P)) / dist(l.p, l.q);
    }

    var COMPROVA = {
        'colinears': function (v, esc) {
            var P = v[0],
                Q = v[1],
                R = v[2];
            // La recta, pels dos punts més allunyats; l'error, la distància del tercer
            var parells = [
                [P, Q, R],
                [Q, R, P],
                [R, P, Q],
            ].sort(function (a, b) {
                return dist(b[0], b[1]) - dist(a[0], a[1]);
            });
            var m = parells[0];
            var d = dist(m[0], m[1]);
            if (d <= MIN * esc) return null;
            return Math.abs(cross(m[0], m[1], m[2])) / d / esc;
        },
        'concurrents': function (v, esc) {
            // El tall de les dues rectes que es tallen més de cara, i la distància a la tercera
            var parells = [
                [0, 1, 2],
                [1, 2, 0],
                [2, 0, 1],
            ]
                .map(function (ix) {
                    return { X: tall(v[ix[0]], v[ix[1]]), l: v[ix[2]] };
                })
                .filter(function (p) {
                    return p.X;
                })
                .sort(function (a, b) {
                    return b.X.sin - a.X.sin;
                });
            if (!parells.length || parells[0].X.sin < 1e-4) return null;
            return distRecta(parells[0].X, parells[0].l) / esc;
        },
        'conciclics': function (v, esc) {
            var c = cercle3(v[0], v[1], v[2], esc);
            if (!c) return null;
            var e = 0;
            for (var i = 3; i < v.length; i++) e = Math.max(e, Math.abs(dist(v[i], c.c) - c.r) / c.r);
            return e;
        },
        'equilater': function (v, esc) {
            var c = [dist(v[0], v[1]), dist(v[1], v[2]), dist(v[2], v[0])];
            var mx = Math.max.apply(null, c),
                mn = Math.min.apply(null, c);
            if (mx <= MIN * esc) return null;
            return (mx - mn) / mx;
        },
        'tangents': function (v, esc) {
            var a = v[0],
                b = v[1];
            var d = dist(a.c, b.c),
                r = Math.max(a.r, b.r);
            if (r <= MIN * esc) return null;
            return Math.min(Math.abs(d - (a.r + b.r)), Math.abs(d - Math.abs(a.r - b.r))) / r;
        },
        'paralelogram': function (v, esc) {
            return Math.hypot(v[0].x - v[1].x + v[2].x - v[3].x, v[0].y - v[1].y + v[2].y - v[3].y) / esc;
        },
        'iguals-perpendiculars': function (v, esc) {
            var u = { x: v[2].x - v[0].x, y: v[2].y - v[0].y }, // PR
                w = { x: v[3].x - v[1].x, y: v[3].y - v[1].y }; // QS
            var m = Math.max(Math.hypot(u.x, u.y), Math.hypot(w.x, w.y));
            if (m <= MIN * esc) return null;
            // u = ±(w girat 90°)
            var e1 = Math.hypot(u.x + w.y, u.y - w.x),
                e2 = Math.hypot(u.x - w.y, u.y + w.x);
            return Math.min(e1, e2) / m;
        },
    };

    // Quin tipus de valor demana cada comprovador
    var CLASSE = {
        'colinears': esPunt,
        'concurrents': esLinia,
        'conciclics': esPunt,
        'equilater': esPunt,
        'tangents': esCercle,
        'paralelogram': esPunt,
        'iguals-perpendiculars': esPunt,
    };
    var NOMBRE = {
        'colinears': [3, 3],
        'concurrents': [3, 3],
        'conciclics': [4, 99],
        'equilater': [3, 3],
        'tangents': [2, 2],
        'paralelogram': [4, 4],
        'iguals-perpendiculars': [4, 4],
    };

    /** Els ids que fa servir un invariant (per comprovar les referències). */
    function ids(inv) {
        if (inv.tipus === 'igualtat') {
            var out = [];
            inv.esquerra.concat(inv.dreta).forEach(function (terme) {
                terme.forEach(function (seg) {
                    out.push(seg[0], seg[1]);
                });
            });
            return out;
        }
        return inv.objectes.slice();
    }

    /** L'invariant és ben format? Retorna un missatge d'error o null. */
    function valida(inv) {
        if (!inv || typeof inv !== 'object') return 'no hi ha invariant';
        if (inv.tipus === 'igualtat') {
            var bo = function (costat) {
                return (
                    Array.isArray(costat) &&
                    costat.length > 0 &&
                    costat.every(function (t) {
                        return (
                            Array.isArray(t) &&
                            t.length > 0 &&
                            t.every(function (s) {
                                return Array.isArray(s) && s.length === 2;
                            })
                        );
                    })
                );
            };
            if (!bo(inv.esquerra) || !bo(inv.dreta)) return 'igualtat mal formada';
            // Tots els termes del mateix grau (si no, l'error no seria relatiu)
            var graus = inv.esquerra.concat(inv.dreta).map(function (t) {
                return t.length;
            });
            return graus.every(function (g) {
                return g === graus[0];
            })
                ? null
                : 'igualtat: termes de grau diferent';
        }
        if (!COMPROVA[inv.tipus]) return 'tipus desconegut: ' + inv.tipus;
        var n = NOMBRE[inv.tipus];
        if (!Array.isArray(inv.objectes) || inv.objectes.length < n[0] || inv.objectes.length > n[1])
            return inv.tipus + ': nombre d’objectes';
        return null;
    }

    /**
     * L'error relatiu de l'invariant amb aquests valors.
     * @returns {number|null}
     */
    function error(inv, valors, esc) {
        esc = esc > 0 ? esc : 1;
        if (inv.tipus === 'igualtat') {
            var suma = function (costat) {
                var s = 0;
                for (var i = 0; i < costat.length; i++) {
                    var p = 1;
                    for (var j = 0; j < costat[i].length; j++) {
                        var a = valors[costat[i][j][0]],
                            b = valors[costat[i][j][1]];
                        if (!esPunt(a) || !esPunt(b)) return null;
                        p *= dist(a, b) / esc;
                    }
                    s += p;
                }
                return s;
            };
            var L = suma(inv.esquerra),
                R = suma(inv.dreta);
            if (L === null || R === null) return null;
            var m = Math.max(Math.abs(L), Math.abs(R));
            if (m <= MIN) return null;
            return Math.abs(L - R) / m;
        }
        var f = COMPROVA[inv.tipus];
        if (!f) return null;
        var v = inv.objectes.map(function (id) {
            return valors[id];
        });
        if (!v.every(CLASSE[inv.tipus])) return null;
        var e = f(v, esc);
        return e === null || !isFinite(e) ? null : e;
    }

    /** «2·10⁻¹⁵», «0», «0,21»: l'error per a la pantalla (coma decimal). */
    var SUPER = {
        '-': '⁻',
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹',
    };
    function format(e) {
        if (e === null || e === undefined || !isFinite(e)) return '—';
        if (e === 0) return '0';
        if (e >= 0.01) return String(Math.round(e * 100) / 100).replace('.', ',');
        var k = Math.floor(Math.log10(e));
        var m = Math.round(e / Math.pow(10, k));
        if (m === 10) {
            m = 1;
            k++;
        }
        var exp = String(k)
            .split('')
            .map(function (c) {
                return SUPER[c];
            })
            .join('');
        return m + '·10' + exp;
    }

    return {
        TOLERANCIA: TOLERANCIA,
        TIPUS: Object.keys(COMPROVA).concat(['igualtat']),
        ids: ids,
        valida: valida,
        error: error,
        format: format,
        cercle3: cercle3,
    };
});
