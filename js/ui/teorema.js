/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: js/ui/teorema.js
 * ROL: La pàgina d'un teorema (teorema.html?id=…): la figura que es pot
 *      arrossegar (sense cap veredicte de l'ordinador: ni xifres d'error ni
 *      «es compleix»), la variant trencada, l'escala de
 *      pistes, la demostració pas a pas, «I després» i el mode projector.
 * ARQUITECTURA: Script clàssic. Adreça: ?id=… (obligatori), ?projector=1.
 *   Figura: Construccio.munta → GeoMotor.avalua → Dibuix.svg (innerHTML d'un
 *   SVG sense estils en línia). Cada canvi torna a avaluar i a dibuixar; en
 *   arrossegar, GeoMotor tria el tall més proper a l'anterior (continuïtat) i
 *   en deixar-ho es desen les branques (fixaBranques).
 *   La tríada d'interacció: arrossegar; tocar un punt i després el lloc on va;
 *   teclat (Tab fins al punt, fletxes per moure'l, Maj: més de pressa,
 *   Retorn per triar-lo, Esc per deixar-lo).
 *   Pistes: una cada vegada; quantes n'hi ha d'obertes es desa per teorema
 *   (Comu.desaPistes). La pista 2 («figura») i la demostració fan sortir els
 *   objectes de rol 'pista'. Demostració: un pas cada vegada, amb «Prova-ho
 *   primer al paper» abans dels passos que en porten.
 * DEPENDÈNCIES: TEOREMES, GeoMotor, Atzar, Invariants, Construccio,
 *   Resistencia, Dibuix, TeoremesTextos, Comu
 * ============================================================================
 */
(function () {
    'use strict';
    var G = window.GeoMotor,
        Atzar = window.Atzar,
        K = window.Construccio,
        R = window.Resistencia,
        D = window.Dibuix,
        T = window.TeoremesTextos,
        C = window.Comu;
    var $ = function (id) {
        return document.getElementById(id);
    };
    var ORDRE_PISTES = ['encarrec', 'concreta', 'figura', 'tanca', 'comprovacio'];

    var q = C.parametres();
    var llista = C.teoremes();
    var index = -1;
    llista.forEach(function (x, i) {
        if (x.id === q.get('id')) index = i;
    });
    var t = llista[index];
    if (!t) {
        $('principal').textContent = '';
        var p = document.createElement('p');
        p.className = 'panell';
        p.textContent = T.noTrobat + ' ';
        var a = document.createElement('a');
        a.href = 'index.html';
        a.textContent = T.tots;
        p.appendChild(a);
        $('principal').appendChild(p);
        return;
    }

    // ── Capçalera ──────────────────────────────────────────────────────────
    document.title = C.pla(t.nom) + ' · ' + T.titol;
    $('etiqueta').textContent = T.deCatorze(index + 1, llista.length);
    C.posa($('nom'), t.nom);
    $('angles').textContent = t.nomAngles;
    C.posa($('enunciat'), t.enunciat);
    var enllac = function (el, x, text) {
        if (!x) {
            el.hidden = true;
            return;
        }
        el.href = 'teorema.html?id=' + encodeURIComponent(x.id);
        el.textContent = text;
        el.title = C.pla(x.nom);
    };
    enllac($('a-anterior'), llista[index - 1], T.anterior);
    enllac($('a-seguent'), llista[index + 1], T.seguent);
    $('a-tots').textContent = T.tots;
    $('a-fitxa').href = 'fitxa.html?id=' + encodeURIComponent(t.id);
    $('a-fitxa').textContent = T.fitxa;

    // ── Figura ─────────────────────────────────────────────────────────────
    var mode = { trencada: false, extra: false };
    var muntat, fig, res;
    var seleccionat = null,
        demoComencada = false,
        obertes = C.pistesObertes(t.id, ORDRE_PISTES.length);
    var perId = {};
    var modeLliure = {};

    function munta(conservar) {
        var conf = conservar && fig ? K.llegeix(t, fig) : null;
        muntat = K.munta(t, mode);
        fig = muntat.fig;
        if (conf) K.posa(fig, conf);
        perId = {};
        fig.objectes.forEach(function (ob) {
            perId[ob.id] = ob;
        });
        modeLliure = {};
        K.lliures(t, fig).forEach(function (l) {
            modeLliure[l.id] = l.mode;
        });
        res = G.avalua(fig);
    }
    function mostraPistes() {
        return demoComencada || obertes > ORDRE_PISTES.indexOf('figura');
    }
    function dibuixa() {
        var focus = document.activeElement && document.activeElement.getAttribute('data-id');
        $('figura').innerHTML = D.svg(muntat, res.valors, {
            lliures: t.lliures,
            pistes: mostraPistes(),
            seleccionat: seleccionat,
            nomPunt: T.nomPunt,
            titol: C.pla(t.enunciat),
        });
        if (focus) {
            var el = $('figura').querySelector('[data-id="' + focus + '"]');
            if (el) el.focus();
        }
    }

    /** El punt del món (cm, y cap amunt) sota el punter. */
    function puntDelMon(ev) {
        var svg = $('figura').querySelector('svg');
        var m = svg.getScreenCTM();
        if (!m) return null;
        var pt = svg.createSVGPoint();
        pt.x = ev.clientX;
        pt.y = ev.clientY;
        var p = pt.matrixTransform(m.inverse());
        return { x: p.x, y: -p.y };
    }

    var DOS_PI = 2 * Math.PI;
    var norm = function (a) {
        var r = a % DOS_PI;
        return r < 0 ? r + DOS_PI : r;
    };
    /** Els punts de t.ordenats segueixen en el mateix ordre (sentit antihorari)? */
    function ordreBo(id, nou) {
        if (!t.ordenats || t.ordenats.indexOf(id) < 0) return true;
        var angles = t.ordenats.map(function (x) {
            return x === id ? nou : perId[x].args[1];
        });
        var prev = 0;
        for (var i = 1; i < angles.length; i++) {
            var r = norm(angles[i] - angles[0]);
            if (r <= prev + 1e-3) return false;
            prev = r;
        }
        return DOS_PI - prev > 1e-3;
    }
    /** Posa el lliure id al valor v (x, y o paràmetre) i torna a avaluar. */
    function posaValor(id, v) {
        var ob = perId[id];
        if (ob.tipus === 'punt') ob.args = v;
        else {
            if (modeLliure[id] === 'cercle' && !ordreBo(id, v)) return false;
            ob.args = [ob.args[0], v];
        }
        res = G.avalua(fig, { anterior: res.valors });
        return true;
    }
    /** Mou el lliure id cap al punt W del món. */
    function mou(id, W) {
        var ob = perId[id],
            vi = fig.vista;
        if (!ob || !W) return;
        if (ob.tipus === 'punt') {
            var x = Math.max(vi.x0, Math.min(vi.x1, W.x)),
                y = Math.max(vi.y0, Math.min(vi.y1, W.y));
            posaValor(id, [x, y]);
        } else {
            var sobre = res.valors[ob.args[0]];
            if (!sobre) return;
            if (modeLliure[id] === 'cercle') posaValor(id, norm(Math.atan2(W.y - sobre.c.y, W.x - sobre.c.x)));
            else {
                var tt = G.parametre(sobre, W);
                if (modeLliure[id] === 'segment') tt = Math.max(0, Math.min(1, tt));
                posaValor(id, tt);
            }
        }
        dibuixa();
    }
    function deixa() {
        G.fixaBranques(fig, res);
    }
    function tria(id) {
        seleccionat = seleccionat === id ? null : id;
        $('instruccio').textContent = seleccionat ? T.triat(muntat.etiqueta[seleccionat] || seleccionat) : T.arrossega;
        dibuixa();
    }

    var arr = null;
    var zona = $('figura');
    zona.addEventListener('pointerdown', function (ev) {
        var toc = ev.target.closest && ev.target.closest('.toc');
        if (toc) {
            arr = { id: toc.getAttribute('data-id'), x: ev.clientX, y: ev.clientY, mogut: false, punter: ev.pointerId };
            try {
                zona.setPointerCapture(ev.pointerId);
            } catch (e) {
                /* res */
            }
            ev.preventDefault();
        } else if (seleccionat) {
            // tocar i després tocar on va
            mou(seleccionat, puntDelMon(ev));
            deixa();
            tria(seleccionat); // ja és on havia d'anar: es deixa de triar
            ev.preventDefault();
        }
    });
    zona.addEventListener('pointermove', function (ev) {
        if (!arr || ev.pointerId !== arr.punter) return;
        if (!arr.mogut && Math.hypot(ev.clientX - arr.x, ev.clientY - arr.y) < 4) return;
        arr.mogut = true;
        mou(arr.id, puntDelMon(ev));
    });
    function acaba(ev) {
        if (!arr || ev.pointerId !== arr.punter) return;
        var a = arr;
        arr = null;
        if (a.mogut) deixa();
        else tria(a.id);
    }
    zona.addEventListener('pointerup', acaba);
    zona.addEventListener('pointercancel', acaba);
    zona.addEventListener('keydown', function (ev) {
        var id = ev.target.getAttribute && ev.target.getAttribute('data-id');
        if (!id) return;
        var dirs = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
        if (ev.key === 'Enter' || ev.key === ' ') {
            tria(id);
            ev.preventDefault();
        } else if (ev.key === 'Escape' && seleccionat) {
            tria(seleccionat);
            ev.preventDefault();
        } else if (dirs[ev.key]) {
            var d = dirs[ev.key],
                ob = perId[id],
                rapid = ev.shiftKey;
            if (ob.tipus === 'punt') {
                var pas = rapid ? 0.5 : 0.1;
                mou(id, { x: ob.args[0] + d[0] * pas, y: ob.args[1] + d[1] * pas });
            } else {
                var signe = d[0] + d[1];
                var dt = modeLliure[id] === 'cercle' ? ((rapid ? 10 : 2) * Math.PI) / 180 : rapid ? 0.05 : 0.01;
                var nou = ob.args[1] + signe * dt;
                if (modeLliure[id] === 'cercle') nou = norm(nou);
                else if (modeLliure[id] === 'segment') nou = Math.max(0, Math.min(1, nou));
                if (posaValor(id, nou)) dibuixa();
            }
            deixa();
            ev.preventDefault();
        }
    });

    // ── Accions ────────────────────────────────────────────────────────────
    $('btn-atzar').textContent = T.atzar;
    $('btn-inicial').textContent = T.inicial;
    $('btn-trencada').textContent = T.trencada;
    $('t-en-trencada').textContent = T.enTrencada;
    C.posa($('text-trencada'), t.trencada.text);
    $('instruccio').textContent = T.arrossega;
    if (t.nota) C.posa($('nota'), t.nota);
    else $('nota').hidden = true;

    var tirades = 0;
    $('btn-atzar').addEventListener('click', function () {
        var rng = Atzar.crea('atzar:' + t.id + ':' + tirades++);
        for (var i = 0; i < 50; i++) {
            K.posa(fig, R.configura(t, fig, rng));
            res = G.avalua(fig);
            if (!R.degenerada(t, fig, res.valors)) break;
        }
        dibuixa();
    });
    $('btn-inicial').addEventListener('click', function () {
        munta(false);
        dibuixa();
    });
    function commutaTrencada() {
        mode.trencada = !mode.trencada;
        munta(true);
        $('btn-trencada').setAttribute('aria-pressed', String(mode.trencada));
        $('btn-trencada').textContent = mode.trencada ? T.tornaTeorema : T.trencada;
        $('avis-trencada').hidden = !mode.trencada;
        document.body.classList.toggle('en-trencada', mode.trencada);
        dibuixa();
    }
    $('btn-trencada').addEventListener('click', commutaTrencada);

    // ── Història i referències ─────────────────────────────────────────────
    $('t-historia').textContent = T.historia;
    C.posa($('historia'), t.historia);
    $('t-referencies').textContent = T.referencies;
    t.referencies.forEach(function (r) {
        $('referencies').appendChild(C.element('li', r));
    });

    // ── Pistes ─────────────────────────────────────────────────────────────
    $('t-pistes').textContent = T.pistes;
    $('pistes-nota').textContent = T.pistesNota;
    function pintaPistes() {
        var ol = $('pistes');
        ol.textContent = '';
        ORDRE_PISTES.slice(0, obertes).forEach(function (k) {
            var li = document.createElement('li');
            li.className = 'pista-' + k;
            var nom = document.createElement('span');
            nom.className = 'nom-pista';
            nom.textContent = T.nomsPistes[k];
            li.appendChild(nom);
            li.appendChild(C.element('span', t.pistes[k]));
            if (k === 'figura') li.appendChild(C.element('span', T.figuraPista, 'nota'));
            ol.appendChild(li);
        });
        var b = $('btn-pista');
        b.disabled = obertes >= ORDRE_PISTES.length;
        b.textContent = b.disabled ? T.sensePistes : T.demanaPista;
    }
    $('btn-pista').addEventListener('click', function () {
        if (obertes < ORDRE_PISTES.length) obertes++;
        C.desaPistes(t.id, obertes);
        pintaPistes();
        dibuixa();
    });

    // ── Demostració ────────────────────────────────────────────────────────
    $('t-demo').textContent = T.demostracio;
    $('t-prova-primer').textContent = T.provaPrimer;
    $('btn-pensat').textContent = T.jaHoHePensat;
    var passos = t.demostracio,
        pas = 0,
        pensat = {};
    function pintaDemo() {
        var ol = $('passos');
        ol.textContent = '';
        for (var i = 0; i < pas; i++) ol.appendChild(C.element('li', passos[i].text, i === pas - 1 ? 'actual' : ''));
        var seg = passos[pas];
        var pregunta = demoComencada && seg && seg.provaPrimer && !pensat[pas];
        $('prova-primer').hidden = !pregunta;
        if (pregunta) C.posa($('text-prova-primer'), seg.provaPrimer);
        var b = $('btn-pas');
        b.textContent = pas === 0 ? T.comencaDemo : T.pasSeguent;
        b.hidden = pas >= passos.length;
        b.disabled = !!pregunta;
        $('pas-de').textContent = pas ? T.pasDe(pas, passos.length) : '';
    }
    function avanca() {
        if (pas >= passos.length) return;
        if (!demoComencada) {
            demoComencada = true;
            dibuixa();
            // si el primer pas porta «Prova-ho primer», abans es demana
            if (passos[0].provaPrimer && !pensat[0]) return pintaDemo();
        }
        pas++;
        pintaDemo();
    }
    $('btn-pas').addEventListener('click', avanca);
    $('btn-pensat').addEventListener('click', function () {
        pensat[pas] = true;
        avanca();
        $('btn-pas').focus();
    });

    // ── I després ──────────────────────────────────────────────────────────
    $('t-idespres').textContent = T.iDespres;
    C.posa($('text-idespres'), t.iDespres.text);
    var hiHaExtra = t.iDespres.construccioExtra && t.iDespres.construccioExtra.length > 0;
    $('idespres-figura').textContent = hiHaExtra ? T.iDespresFigura : '';
    $('btn-idespres').textContent = T.mostraIDespres;
    $('btn-idespres').addEventListener('click', function () {
        var obert = $('idespres').hidden;
        $('idespres').hidden = !obert;
        $('btn-idespres').setAttribute('aria-expanded', String(obert));
        $('btn-idespres').textContent = obert ? T.amagaIDespres : T.mostraIDespres;
        if (hiHaExtra) {
            mode.extra = obert;
            munta(true);
            dibuixa();
        }
    });

    // ── Projector ──────────────────────────────────────────────────────────
    function projector(on) {
        document.body.classList.toggle('projector', on);
        $('btn-projector').setAttribute('aria-pressed', String(on));
        $('btn-projector').textContent = on ? T.surtProjector : T.projector;
    }
    $('btn-projector').addEventListener('click', function () {
        projector(!document.body.classList.contains('projector'));
    });
    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && !seleccionat && document.body.classList.contains('projector')) projector(false);
    });

    // ── Inici ──────────────────────────────────────────────────────────────
    projector(q.get('projector') === '1');
    munta(false);
    dibuixa();
    pintaPistes();
    pintaDemo();
})();
