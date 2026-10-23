/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: tests/invariants.test.js
 * ROL: Els comprovadors (js/motor/invariants.js) amb casos fets a mà, sense
 *      GeoMotor: cada comprovador dona 0 (o gairebé) quan es compleix, un
 *      error gran quan no, i null quan la configuració és degenerada. També
 *      el format de l'error («2·10⁻¹⁵») i la validació dels invariants.
 * ÚS: node tests/invariants.test.js
 * ============================================================================
 */
'use strict';
const { suite, ok, eq, finish } = require('./harness');
const I = require('../js/motor/invariants.js');

const P = (x, y) => ({ x, y });
const L = (a, b) => ({ tipus: 'recta', p: a, q: b });
const Cc = (c, r) => ({ c, r });
const err = (tipus, objectes, valors, esc = 10) => I.error({ tipus, objectes }, valors, esc);
const petit = e => e !== null && e < 1e-12;
const gran = e => e !== null && e > 1e-3;

suite('1. Alineats i concurrents');
{
    const v = { A: P(0, 0), B: P(2, 1), C: P(6, 3), D: P(6, 3.5), E: P(1, 1), F: P(1, 1) };
    ok('A, B, C alineats', petit(err('colinears', ['A', 'B', 'C'], v)));
    ok('l’ordre no hi fa res', petit(err('colinears', ['C', 'A', 'B'], v)));
    ok('A, B, D no', gran(err('colinears', ['A', 'B', 'D'], v)));
    eq('tres punts iguals: degenerat', err('colinears', ['E', 'F', 'F'], v), null);
    const w = {
        l1: L(P(0, 0), P(1, 1)),
        l2: L(P(0, 2), P(2, 0)),
        l3: L(P(1, -5), P(1, 7)),
        l4: L(P(1.2, -5), P(1.2, 7)),
        l5: L(P(0, 1), P(1, 2)),
    };
    ok('tres rectes per (1, 1)', petit(err('concurrents', ['l1', 'l2', 'l3'], w)));
    ok('la tercera no hi passa', gran(err('concurrents', ['l1', 'l2', 'l4'], w)));
    ok('dues paral·leles i una que les talla: no són concurrents', gran(err('concurrents', ['l1', 'l5', 'l3'], w)));
    eq('tres paral·leles: degenerat', err('concurrents', ['l1', 'l5', 'l1'], w), null);
    eq('un objecte que no existeix: null', err('concurrents', ['l1', 'l2', 'x'], w), null);
}

suite('2. Concíclics, equilàter, tangents');
{
    const r = 5;
    const v = {};
    [0.3, 1.2, 2.5, 4, 5.5].forEach((t, i) => (v['Q' + i] = P(1 + r * Math.cos(t), -2 + r * Math.sin(t))));
    v.X = P(1 + 5.2, -2);
    ok('cinc punts d’una circumferència', petit(err('conciclics', ['Q0', 'Q1', 'Q2', 'Q3', 'Q4'], v)));
    ok('un de fora', gran(err('conciclics', ['Q0', 'Q1', 'Q2', 'X'], v)));
    v.A = P(0, 0);
    v.B = P(1, 0);
    v.C = P(2, 0);
    eq('els tres primers alineats: degenerat', err('conciclics', ['A', 'B', 'C', 'X'], v), null);
    const e = { A: P(0, 0), B: P(4, 0), C: P(2, 2 * Math.sqrt(3)), D: P(2, 3) };
    ok('equilàter', petit(err('equilater', ['A', 'B', 'C'], e)));
    ok('isòsceles no', gran(err('equilater', ['A', 'B', 'D'], e)));
    const c = { c1: Cc(P(0, 0), 2), c2: Cc(P(5, 0), 3), c3: Cc(P(1, 0), 1), c4: Cc(P(4, 0), 1.5) };
    ok('tangents per fora (d = r1 + r2)', petit(err('tangents', ['c1', 'c2'], c)));
    ok('tangents per dins (d = r1 − r2)', petit(err('tangents', ['c1', 'c3'], c)));
    ok('secants no', gran(err('tangents', ['c1', 'c4'], c)));
}

suite('3. Igualtats, paral·lelogram, iguals i perpendiculars');
{
    // Ptolemeu en un rectangle 3 × 4: 5·5 = 3·3 + 4·4
    const v = { A: P(0, 0), B: P(3, 0), C: P(3, 4), D: P(0, 4), E: P(0, 4.5) };
    const pto = {
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
    };
    ok('Ptolemeu al rectangle', petit(I.error(pto, v, 5)));
    const mal = JSON.parse(JSON.stringify(pto).replace(/"D"/g, '"E"'));
    ok('amb un vèrtex fora, no', gran(I.error(mal, v, 5)));
    eq('ben formada', I.valida(pto), null);
    ok(
        'graus diferents: no és vàlida',
        I.valida({ tipus: 'igualtat', esquerra: [[['A', 'B']]], dreta: pto.dreta }) !== null
    );
    ok('paral·lelogram', petit(err('paralelogram', ['A', 'B', 'C', 'D'], v)));
    ok('trapezi no', gran(err('paralelogram', ['A', 'B', 'C', 'E'], v)));
    const w = { P: P(2, -2), Q: P(5, 1), R: P(2, 4), S: P(-1, 1), T: P(-1, 1.5) };
    ok(
        'PR i QS iguals i perpendiculars (Van Aubel al rectangle 4 × 2)',
        petit(err('iguals-perpendiculars', ['P', 'Q', 'R', 'S'], w))
    );
    ok('si no, no', gran(err('iguals-perpendiculars', ['P', 'Q', 'R', 'T'], w)));
}

suite('4. Validació i format');
{
    eq('tipus desconegut', I.valida({ tipus: 'res', objectes: [] }), 'tipus desconegut: res');
    ok('colinears amb dos punts: no', I.valida({ tipus: 'colinears', objectes: ['A', 'B'] }) !== null);
    eq(
        'ids d’una igualtat',
        I.ids({ tipus: 'igualtat', esquerra: [[['M', 'X']]], dreta: [[['M', 'Y']]] }).join(''),
        'MXMY'
    );
    eq('format 0', I.format(0), '0');
    eq('format 2,3·10⁻¹⁵', I.format(2.3e-15), '2·10⁻¹⁵');
    eq('format 9,6·10⁻⁸ → 1·10⁻⁷', I.format(9.6e-8), '1·10⁻⁷');
    eq('format 0,214', I.format(0.214), '0,21');
    eq('format 3·10⁻³', I.format(0.003), '3·10⁻³');
    eq('format null', I.format(null), '—');
    eq('tolerància', I.TOLERANCIA, 1e-9);
}

finish('COMPROVADORS');
