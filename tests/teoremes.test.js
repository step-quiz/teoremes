/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: tests/teoremes.test.js
 * ROL: Els 14 teoremes (data/teoremes/*.js), segons l'especificació (§14.5):
 *   1. Forma: camps, ids, ordre 1–14, el nom del fitxer és l'id.
 *   2. Construcció: totes les referències són vàlides (base, variant trencada
 *      i «I després»), rols, lliures, destacats, invariant; la figura inicial
 *      compleix el teorema i la variant trencada, no.
 *   3. Prova de resistència: 1000 configuracions no degenerades amb error
 *      relatiu ≤ 1e-8; la variant trencada FALLA (el comprovador pot fallar);
 *      mateixa llavor, mateix resultat.
 *   4. Independència: per a sis teoremes es recalculen els punts amb fórmules
 *      clàssiques (sense GeoMotor) i es comparen amb la construcció.
 *   5. Text: cada fórmula entre $…$ es dibuixa amb KaTeX (throwOnError), cap
 *      apòstrof recte, escala de pistes completa, demostració i referències.
 *   6. Figures: SVG ben format en tots els modes.
 * ÚS: node tests/teoremes.test.js
 * ============================================================================
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { suite, ok, eq, finish } = require('./harness');
const G = require('../js/motor/geo-motor.js');
const Atzar = require('../js/motor/atzar.js');
const Inv = require('../js/motor/invariants.js');
const K = require('../js/motor/construccio.js');
const R = require('../js/motor/resistencia.js');
const D = require('../js/motor/dibuix.js');
const Tx = require('../js/motor/text.js');
const katex = require('../vendor/katex-0.16.11/katex.min.js');

const DIR = path.join(__dirname, '..', 'data', 'teoremes');
const fitxers = fs
    .readdirSync(DIR)
    .filter(f => f.endsWith('.js'))
    .sort();
const TEOREMES = fitxers.map(f => ({ fitxer: f, t: require(path.join(DIR, f)) })).sort((a, b) => a.t.ordre - b.t.ordre);
const PER_ID = Object.fromEntries(TEOREMES.map(x => [x.t.id, x.t]));
// La llista aprovada (SPEC §14.4), en aquest ordre
const LLISTA = [
    'varignon',
    'mediatrius',
    'euler',
    'nou-punts',
    'napoleo',
    'miquel',
    'simson',
    'ptolemeu',
    'papallona',
    'pascal',
    'monge',
    'van-aubel',
    'morley',
    'feuerbach',
];
const CAMPS = [
    'id',
    'ordre',
    'nom',
    'nomAngles',
    'historia',
    'enunciat',
    'vista',
    'limits',
    'lliures',
    'construccio',
    'destacat',
    'invariant',
    'degenerat',
    'trencada',
    'pistes',
    'demostracio',
    'iDespres',
    'referencies',
];
const PISTES = ['encarrec', 'concreta', 'figura', 'tanca', 'comprovacio'];

suite('1. Forma');
{
    eq('14 teoremes', TEOREMES.length, 14);
    eq('la llista aprovada, en ordre', TEOREMES.map(x => x.t.id).join(' '), LLISTA.join(' '));
    eq('ordre 1–14', TEOREMES.map(x => x.t.ordre).join(','), LLISTA.map((x, i) => i + 1).join(','));
    for (const { fitxer, t } of TEOREMES) {
        eq(`${t.id}: el fitxer es diu com l’id`, fitxer, `${t.id}.js`);
        const falten = CAMPS.filter(k => t[k] === undefined || t[k] === null || t[k] === '');
        ok(`${t.id}: tots els camps`, !falten.length, falten.join(', '));
    }
}

/** Les tuples ben formades: [id, tipus, args, opcions?] amb un rol vàlid. */
function tuplesBones(tuples) {
    return tuples.every(
        tp =>
            Array.isArray(tp) &&
            (tp.length === 3 || tp.length === 4) &&
            typeof tp[0] === 'string' &&
            G.TIPUS[tp[1]] &&
            Array.isArray(tp[2]) &&
            (!tp[3] || !tp[3].rol || ['aux', 'pista', 'invisible'].includes(tp[3].rol))
    );
}

suite('2. Construcció, invariant i variant trencada');
for (const { t } of TEOREMES) {
    ok(
        `${t.id}: tuples ben formades`,
        tuplesBones(t.construccio) && tuplesBones(t.trencada.canvis) && tuplesBones(t.iDespres.construccioExtra)
    );
    let m, mt, me;
    try {
        m = K.munta(t);
        mt = K.munta(t, { trencada: true });
        me = K.munta(t, { extra: true, trencada: true });
        ok(`${t.id}: cada objecte fa servir objectes anteriors (base, trencada i «I després»)`, true);
    } catch (e) {
        ok(`${t.id}: les referències són vàlides`, false, e.message);
        continue;
    }
    const ids = new Set(m.fig.objectes.map(o => o.id));
    ok(
        `${t.id}: els lliures existeixen i són punts o punts-sobre`,
        K.lliures(t, m.fig).every(l => l.mode)
    );
    ok(
        `${t.id}: els destacats existeixen`,
        t.destacat.every(id => ids.has(id))
    );
    ok(
        `${t.id}: ordenats ⊂ lliures (sobre una circumferència)`,
        !t.ordenats || t.ordenats.every(id => K.lliures(t, m.fig).find(l => l.id === id && l.mode === 'cercle'))
    );
    eq(`${t.id}: l’invariant és vàlid`, Inv.valida(t.invariant), null);
    ok(
        `${t.id}: els objectes de l’invariant existeixen`,
        Inv.ids(t.invariant).every(id => ids.has(id))
    );
    ok(`${t.id}: almenys un objecte de pista (la pista 2)`, Object.values(m.rol).includes('pista'));
    ok(
        `${t.id}: la variant trencada substitueix algun objecte`,
        t.trencada.canvis.some(c => ids.has(c[0]))
    );
    const v = t.vista;
    ok(
        `${t.id}: vista vàlida i límits dins de la vista`,
        v.x1 > v.x0 &&
            v.y1 > v.y0 &&
            t.limits.x[0] >= v.x0 &&
            t.limits.x[1] <= v.x1 &&
            t.limits.y[0] >= v.y0 &&
            t.limits.y[1] <= v.y1
    );
    const val = G.avalua(m.fig).valors;
    const nuls = m.fig.objectes.filter(o => val[o.id] === null).map(o => o.id);
    ok(`${t.id}: a la figura inicial existeix tot`, !nuls.length, nuls.join(', '));
    eq(`${t.id}: la figura inicial no és degenerada`, R.degenerada(t, m.fig, val), null);
    const e = R.errorDe(t, val);
    ok(`${t.id}: la figura inicial compleix el teorema (error ${Inv.format(e)})`, e !== null && e <= Inv.TOLERANCIA);
    const et = R.errorDe(t, G.avalua(mt.fig).valors);
    ok(`${t.id}: la variant trencada, a la figura inicial, no (error ${Inv.format(et)})`, et !== null && et > 1e-4);
    const ve = G.avalua(me.fig).valors;
    const nulsE = (t.iDespres.construccioExtra || []).map(tp => tp[0]).filter(id => ve[id] === null);
    ok(`${t.id}: «I després» existeix a la figura inicial`, !nulsE.length, nulsE.join(', '));
}

suite('3. Prova de resistència (1000 configuracions)');
for (const { t } of TEOREMES) {
    const r = R.prova(t);
    eq(`${t.id}: 1000 configuracions no degenerades`, r.n, 1000);
    ok(`${t.id}: totes dins de 1e-8 (error màxim ${Inv.format(r.errorMax)})`, r.errorMax <= 1e-8);
    ok(`${t.id}: menys descartades que provades (${r.descartades})`, r.descartades < 2 * r.n);
    const rt = R.prova(t, { trencada: true });
    ok(
        `${t.id}: la variant trencada falla (${rt.compleixen} de ${rt.n} es compleixen; error mitjà ${Inv.format(rt.errorMedia)})`,
        rt.n === 1000 && rt.compleixen <= 10 && rt.errorMedia > 1e-3
    );
    eq(
        `${t.id}: mateixa llavor, mateix resultat`,
        JSON.stringify(R.prova(t, { n: 50 })),
        JSON.stringify(R.prova(t, { n: 50 }))
    );
    ok(
        `${t.id}: una altra llavor, altres configuracions`,
        JSON.stringify(R.prova(t, { n: 20, llavor: 'x' }).pitjor) !== JSON.stringify(R.prova(t, { n: 20 }).pitjor)
    );
}

suite('4. Independència: fórmules clàssiques, sense GeoMotor');
{
    const d = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
    const area = (A, B, C) => Math.abs((B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x)) / 2;
    // Circumcentre resolent el sistema |X − A|² = |X − B|² = |X − C|² per Cramer
    const circ = (A, B, C) => {
        const a1 = 2 * (B.x - A.x),
            b1 = 2 * (B.y - A.y),
            c1 = B.x ** 2 + B.y ** 2 - A.x ** 2 - A.y ** 2;
        const a2 = 2 * (C.x - A.x),
            b2 = 2 * (C.y - A.y),
            c2 = C.x ** 2 + C.y ** 2 - A.x ** 2 - A.y ** 2;
        const det = a1 * b2 - a2 * b1;
        return { x: (c1 * b2 - c2 * b1) / det, y: (a1 * c2 - a2 * c1) / det };
    };
    const rot = (P, O, graus) => {
        const a = (graus * Math.PI) / 180;
        return {
            x: O.x + (P.x - O.x) * Math.cos(a) - (P.y - O.y) * Math.sin(a),
            y: O.y + (P.x - O.x) * Math.sin(a) + (P.y - O.y) * Math.cos(a),
        };
    };
    const mig = (P, Q) => ({ x: (P.x + Q.x) / 2, y: (P.y + Q.y) / 2 });
    const angle = (P, V, Q) => Math.acos(((P.x - V.x) * (Q.x - V.x) + (P.y - V.y) * (Q.y - V.y)) / (d(P, V) * d(Q, V)));
    function cada(id, f) {
        const t = PER_ID[id];
        const m = K.munta(t);
        const rng = Atzar.crea('independent:' + id);
        let pitjor = 0,
            n = 0;
        for (let i = 0; i < 2000 && n < 200; i++) {
            K.posa(m.fig, R.configura(t, m.fig, rng));
            const v = G.avalua(m.fig).valors;
            if (R.degenerada(t, m.fig, v)) continue;
            pitjor = Math.max(pitjor, f(v, K.mida(t, v)));
            n++;
        }
        return { pitjor, n };
    }
    let r = cada('euler', (v, s) => {
        const O = circ(v.A, v.B, v.C);
        const G0 = { x: (v.A.x + v.B.x + v.C.x) / 3, y: (v.A.y + v.B.y + v.C.y) / 3 };
        // H: l'ortocentre és el circumcentre del triangle anticomplementari
        const H = circ(
            { x: v.B.x + v.C.x - v.A.x, y: v.B.y + v.C.y - v.A.y },
            { x: v.C.x + v.A.x - v.B.x, y: v.C.y + v.A.y - v.B.y },
            { x: v.A.x + v.B.x - v.C.x, y: v.A.y + v.B.y - v.C.y }
        );
        return Math.max(d(O, v.O), d(G0, v.G), d(H, v.H), Math.abs(d(H, G0) - 2 * d(G0, O))) / s;
    });
    ok(
        `Euler: O, G, H coincideixen i HG = 2·GO (${r.n} configuracions, ${Inv.format(r.pitjor)})`,
        r.n === 200 && r.pitjor < 1e-9
    );
    r = cada('nou-punts', (v, s) => {
        const Rr = (d(v.A, v.B) * d(v.B, v.C) * d(v.C, v.A)) / (4 * area(v.A, v.B, v.C));
        return Math.abs(v.c9.r - Rr / 2) / s;
    });
    ok(`Nou punts: el radi és R/2, amb R = abc/(4·àrea) (${Inv.format(r.pitjor)})`, r.n === 200 && r.pitjor < 1e-9);
    r = cada('napoleo', (v, s) => {
        const N = { x: (v.A.x + v.B.x + rot(v.B, v.A, -60).x) / 3, y: (v.A.y + v.B.y + rot(v.B, v.A, -60).y) / 3 };
        const L = { x: (v.B.x + v.C.x + rot(v.C, v.B, -60).x) / 3, y: (v.B.y + v.C.y + rot(v.C, v.B, -60).y) / 3 };
        const M = { x: (v.C.x + v.A.x + rot(v.A, v.C, -60).x) / 3, y: (v.C.y + v.A.y + rot(v.A, v.C, -60).y) / 3 };
        return Math.max(d(N, v.N), d(L, v.L), d(M, v.M), Math.abs(d(L, M) - d(M, N)), Math.abs(d(M, N) - d(N, L))) / s;
    });
    ok(
        `Napoleó: centres recalculats, i el triangle és equilàter (${Inv.format(r.pitjor)})`,
        r.n === 200 && r.pitjor < 1e-9
    );
    r = cada('morley', (v, s) => {
        const Rr = d(circ(v.A, v.B, v.C), v.A);
        const costat =
            8 *
            Rr *
            Math.sin(angle(v.B, v.A, v.C) / 3) *
            Math.sin(angle(v.A, v.B, v.C) / 3) *
            Math.sin(angle(v.A, v.C, v.B) / 3);
        return Math.max(Math.abs(d(v.X, v.Y) - costat), Math.abs(d(v.Y, v.Z) - costat)) / s;
    });
    ok(`Morley: el costat és 8R·sin(A/3)·sin(B/3)·sin(C/3) (${Inv.format(r.pitjor)})`, r.n === 200 && r.pitjor < 1e-9);
    r = cada('feuerbach', (v, s) => {
        const a = d(v.B, v.C),
            b = d(v.C, v.A),
            c = d(v.A, v.B),
            sp = (a + b + c) / 2,
            K0 = area(v.A, v.B, v.C);
        const Rr = (a * b * c) / (4 * K0),
            rr = K0 / sp;
        const I = {
            x: (a * v.A.x + b * v.B.x + c * v.C.x) / (2 * sp),
            y: (a * v.A.y + b * v.B.y + c * v.C.y) / (2 * sp),
        };
        const O = circ(v.A, v.B, v.C);
        const N = { x: (v.A.x + v.B.x + v.C.x - O.x) / 2, y: (v.A.y + v.B.y + v.C.y - O.y) / 2 }; // (O + H)/2, H = A + B + C − 2O
        return Math.max(Math.abs(d(N, I) - (Rr / 2 - rr)), d(I, v.I), Math.abs(v.ci.r - rr)) / s;
    });
    ok(
        `Feuerbach: NI = R/2 − r amb R = abc/(4·àrea) i r = àrea/s (${Inv.format(r.pitjor)})`,
        r.n === 200 && r.pitjor < 1e-9
    );
    r = cada('van-aubel', (v, s) => {
        const centre = (P, Q) => mig(P, rot(P, Q, 90)); // centre del quadrat: punt mitjà de la diagonal
        const [P, Q, Rr, S] = [centre(v.A, v.B), centre(v.B, v.C), centre(v.C, v.D), centre(v.D, v.A)];
        return Math.max(d(P, v.P), d(Q, v.Q), d(Rr, v.R), d(S, v.S), Math.abs(d(P, Rr) - d(Q, S))) / s;
    });
    ok(`Van Aubel: centres recalculats i PR = QS (${Inv.format(r.pitjor)})`, r.n === 200 && r.pitjor < 1e-9);
}

/** Tots els textos d'un teorema amb el seu camí. */
function textos(t) {
    const out = [
        ['nom', t.nom],
        ['historia', t.historia],
        ['enunciat', t.enunciat],
        ['trencada.text', t.trencada.text],
        ['iDespres.text', t.iDespres.text],
    ];
    if (t.nota) out.push(['nota', t.nota]);
    PISTES.forEach(k => out.push([`pistes.${k}`, t.pistes[k]]));
    t.demostracio.forEach((p, i) => {
        out.push([`demostracio[${i}].text`, p.text]);
        if (p.provaPrimer) out.push([`demostracio[${i}].provaPrimer`, p.provaPrimer]);
    });
    t.referencies.forEach((r, i) => out.push([`referencies[${i}]`, r]));
    return out;
}

suite('5. Text: fórmules, tipografia, pistes, demostració');
for (const { t } of TEOREMES) {
    const mal = [],
        apostrofs = [];
    let n = 0;
    for (const [cami, s] of textos(t)) {
        if (typeof s !== 'string' || !s.trim()) {
            mal.push(`${cami}: buit`);
            continue;
        }
        let trossos;
        try {
            trossos = Tx.trossos(s);
        } catch (e) {
            mal.push(`${cami}: ${e.message}`);
            continue;
        }
        for (const tr of trossos) {
            if (tr.tipus === 'text') {
                if (/'/.test(tr.v)) apostrofs.push(cami);
                continue;
            }
            n++;
            try {
                katex.renderToString(tr.v, { throwOnError: true });
            } catch (e) {
                mal.push(`${cami}: ${e.message.slice(0, 80)}`);
            }
        }
    }
    ok(`${t.id}: les ${n} fórmules es dibuixen amb KaTeX`, !mal.length, mal.join(' | '));
    ok(`${t.id}: cap apòstrof recte fora de les fórmules (’)`, !apostrofs.length, apostrofs.join(', '));
    ok(
        `${t.id}: l’escala de pistes és completa`,
        PISTES.every(k => typeof t.pistes[k] === 'string' && t.pistes[k].trim())
    );
    ok(
        `${t.id}: la pista 2 té com a molt 3 paraules («${t.pistes.figura}»)`,
        Tx.pla(t.pistes.figura).split(/\s+/).length <= 3
    );
    ok(
        `${t.id}: la demostració té de 3 a 8 passos i acaba amb ∎`,
        t.demostracio.length >= 3 && t.demostracio.length <= 8 && t.demostracio.some(p => p.text.includes('∎'))
    );
    ok(
        `${t.id}: almenys un «Prova-ho primer al paper»`,
        t.demostracio.some(p => p.provaPrimer)
    );
    ok(`${t.id}: el nom anglès és en anglès (sense accents catalans)`, !/[àèéíòóúç·]/.test(t.nomAngles));
    ok(`${t.id}: referències`, t.referencies.length >= 1 && t.referencies.every(r => !/https?:/.test(r)));
}

suite('6. Figures (SVG ben format)');
{
    /** SVG ben format: etiquetes equilibrades, atributs entre cometes, cap & ni < solt. */
    function benFormat(s) {
        const re = /<\/?([a-zA-Z][\w-]*)((?:\s+[\w:-]+="[^"<&]*(?:&(?:amp|lt|gt|quot);[^"<&]*)*")*)\s*(\/?)>|([^<]+)/g;
        const pila = [];
        let m,
            fi = 0;
        while ((m = re.exec(s))) {
            if (m.index !== fi) return `caràcter inesperat a la posició ${fi}`;
            fi = re.lastIndex;
            if (m[4] !== undefined) {
                if (/&(?!(amp|lt|gt|quot);)/.test(m[4])) return 'un & solt al text';
                continue;
            }
            if (m[0].startsWith('</')) {
                if (pila.pop() !== m[1]) return `</${m[1]}> no tanca res`;
            } else if (m[3] !== '/') pila.push(m[1]);
        }
        if (fi !== s.length) return `queda text a la posició ${fi}`;
        if (pila.length) return `queden obertes: ${pila.join(', ')}`;
        return s.startsWith('<svg') ? null : 'no comença per <svg';
    }
    ok('el comprovador troba una etiqueta sense tancar', benFormat('<svg><g></svg>') !== null);
    for (const { t } of TEOREMES) {
        const errors = [];
        for (const o of [{}, { trencada: true }, { extra: true }, { trencada: true, extra: true }])
            for (const pistes of [false, true]) {
                const m = K.munta(t, o);
                const s = D.svg(m, G.avalua(m.fig).valors, {
                    lliures: t.lliures,
                    pistes,
                    seleccionat: t.lliures[0],
                    titol: Tx.pla(t.enunciat),
                });
                const e = benFormat(s) || (/NaN|undefined|Infinity/.test(s) ? 'NaN o undefined' : null);
                if (e) errors.push(`${JSON.stringify(o)} ${pistes}: ${e}`);
            }
        ok(`${t.id}: totes les figures ben formades`, !errors.length, errors.join(' | '));
        const m = K.munta(t);
        const s = D.svg(m, G.avalua(m.fig).valors, { lliures: t.lliures });
        eq(`${t.id}: una nansa per cada punt lliure`, (s.match(/class="toc"/g) || []).length, t.lliures.length);
        ok(`${t.id}: sense pistes, no es dibuixa cap objecte de pista`, !/r-pista/.test(s));
    }
}

finish('TEOREMES');
