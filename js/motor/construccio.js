/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: js/motor/construccio.js
 * ROL: Converteix la construcció d'un teorema (data/teoremes/<id>.js), escrita
 *      com a llista curta de tuples, en una figura de GeoMotor, amb el paper
 *      de cada objecte (com es dibuixa). També hi aplica la variant trencada i
 *      hi afegeix la construcció d'«I després».
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   Tupla: [id, tipus, args, opcions?], amb tipus i args de GeoMotor.
 *   opcions: { rol: 'aux' | 'pista' | 'invisible', et: 'N₁' | false, d: [dx, dy] }
 *     rol (per defecte, 'base'):
 *       base       traç normal
 *       aux        traç fi i gris (construccions que ajuden a veure-ho)
 *       pista      amagat; surt amb la pista 2 («figura») i amb la demostració
 *       invisible  no es dibuixa mai (passos intermedis)
 *     Els ids de t.destacat tenen el rol 'destacat' (la sorpresa, en color).
 *     Els de iDespres.construccioExtra, el rol 'extra' (surten amb «I després»).
 *     et: l'etiqueta d'un punt (per defecte, l'id; false: cap). d: on va l'etiqueta.
 *   Variant trencada (t.trencada.canvis): tuples amb el mateix id que un objecte
 *   el substitueixen allà mateix; les que tenen un id nou s'hi afegeixen just
 *   abans de la substitució següent (o al final).
 * DEPENDÈNCIES: GeoMotor (js/motor/geo-motor.js)
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica(typeof module === 'object' && module.exports ? require('./geo-motor.js') : arrel.GeoMotor);
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.Construccio = api;
})(typeof self !== 'undefined' ? self : this, function (G) {
    'use strict';

    var ROLS = ['base', 'aux', 'pista', 'invisible', 'destacat', 'extra'];

    /** Les tuples de la variant trencada, aplicades a la llista base. */
    function ambCanvis(base, canvis) {
        var out = base.slice(),
            pendents = [];
        canvis.forEach(function (c) {
            var i = -1;
            for (var k = 0; k < out.length; k++) if (out[k][0] === c[0]) i = k;
            if (i < 0) {
                pendents.push(c);
                return;
            }
            out.splice.apply(out, [i, 1].concat(pendents, [c]));
            pendents = [];
        });
        return out.concat(pendents);
    }

    /**
     * La figura de GeoMotor d'un teorema.
     * @param {object} t   el teorema
     * @param {object} [o] { trencada: bool, extra: bool }
     * @returns {{ fig, rol: Object<string,string>, etiqueta: Object<string,string|null>, desp: Object<string,number[]> }}
     */
    function munta(t, o) {
        o = o || {};
        var tuples = t.construccio;
        if (o.trencada && t.trencada) tuples = ambCanvis(tuples, t.trencada.canvis);
        var extra = (o.extra && t.iDespres && t.iDespres.construccioExtra) || [];
        // «I després» pot demanar una vista més gran (t.iDespres.vista)
        var fig = G.nova((o.extra && t.iDespres && t.iDespres.vista) || t.vista);
        var rol = {},
            etiqueta = {},
            desp = {};
        var destacat = {};
        (t.destacat || []).forEach(function (id) {
            destacat[id] = true;
        });
        tuples.concat(extra).forEach(function (tp, i) {
            var id = tp[0],
                op = tp[3] || {};
            var esExtra = i >= tuples.length;
            G.afegeix(fig, tp[1], tp[2], { id: id, etiqueta: null });
            rol[id] = esExtra ? 'extra' : destacat[id] ? 'destacat' : op.rol || 'base';
            if (G.classe(tp[1]) === 'punt') etiqueta[id] = op.et === false ? null : op.et || id;
            if (op.d) desp[id] = op.d;
        });
        return { fig: fig, rol: rol, etiqueta: etiqueta, desp: desp };
    }

    /** Els objectes lliures i com es mouen: 'xy' (punt) o 'cercle' / 'linia' (punt-sobre). */
    function lliures(t, fig) {
        var per = {};
        fig.objectes.forEach(function (ob) {
            per[ob.id] = ob;
        });
        return t.lliures.map(function (id) {
            var ob = per[id];
            if (!ob) return { id: id, mode: null };
            if (ob.tipus === 'punt') return { id: id, mode: 'xy' };
            if (ob.tipus === 'punt-sobre') {
                var sobre = per[ob.args[0]];
                var c = sobre && G.classe(sobre.tipus);
                return { id: id, mode: c === 'cercle' ? 'cercle' : sobre.tipus === 'segment' ? 'segment' : 'linia' };
            }
            return { id: id, mode: null };
        });
    }

    /** Posa els valors (x, y o t) dels lliures: valors = { id: [x, y] | t }. */
    function posa(fig, valors) {
        fig.objectes.forEach(function (ob) {
            if (!Object.prototype.hasOwnProperty.call(valors, ob.id)) return;
            var v = valors[ob.id];
            if (ob.tipus === 'punt') ob.args = [v[0], v[1]];
            else if (ob.tipus === 'punt-sobre') ob.args = [ob.args[0], v];
        });
        return fig;
    }

    /** Els valors actuals dels lliures (el contrari de posa). */
    function llegeix(t, fig) {
        var out = {};
        fig.objectes.forEach(function (ob) {
            if (t.lliures.indexOf(ob.id) < 0) return;
            out[ob.id] = ob.tipus === 'punt' ? [ob.args[0], ob.args[1]] : ob.args[1];
        });
        return out;
    }

    /** La mida de la figura: la distància més gran entre dos punts lliures (avaluats). */
    function mida(t, valors) {
        var p = t.lliures
            .map(function (id) {
                return valors[id];
            })
            .filter(function (v) {
                return v && typeof v.x === 'number';
            });
        var m = 0;
        for (var i = 0; i < p.length; i++)
            for (var j = i + 1; j < p.length; j++) m = Math.max(m, Math.hypot(p[i].x - p[j].x, p[i].y - p[j].y));
        return m;
    }

    return {
        ROLS: ROLS,
        ambCanvis: ambCanvis,
        munta: munta,
        lliures: lliures,
        posa: posa,
        llegeix: llegeix,
        mida: mida,
    };
});
