/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: js/ui/index.js
 * ROL: La portada: els quatre esglaons i una targeta per teorema, amb la
 *      figura inicial dibuixada (sense etiquetes) i l'enunciat.
 * ARQUITECTURA: Script clàssic. Les miniatures són el mateix SVG que la
 *      pàgina del teorema (Dibuix.svg), sense nanses.
 * DEPENDÈNCIES: TEOREMES, GeoMotor, Construccio, Dibuix, TeoremesTextos, Comu
 * ============================================================================
 */
(function () {
    'use strict';
    var G = window.GeoMotor,
        K = window.Construccio,
        D = window.Dibuix,
        T = window.TeoremesTextos,
        C = window.Comu;
    var $ = function (id) {
        return document.getElementById(id);
    };

    $('titol').textContent = T.titol;
    $('lema').textContent = T.lema;
    T.esglaons.forEach(function (e) {
        var li = document.createElement('li');
        li.textContent = e;
        $('esglaons').appendChild(li);
    });
    $('a-totes').textContent = T.totesFitxes;

    C.teoremes().forEach(function (t) {
        var li = document.createElement('li');
        li.className = 'targeta';
        var a = document.createElement('a');
        a.href = 'teorema.html?id=' + encodeURIComponent(t.id);
        a.className = 'enllac-targeta';
        var m = K.munta(t);
        var fig = document.createElement('div');
        fig.className = 'miniatura';
        fig.setAttribute('aria-hidden', 'true');
        fig.innerHTML = D.svg(m, G.avalua(m.fig).valors, { lliures: t.lliures, etiquetes: false, nanses: false });
        a.appendChild(fig);
        var num = document.createElement('span');
        num.className = 'numero';
        num.textContent = (t.ordre < 10 ? '0' : '') + t.ordre;
        a.appendChild(num);
        a.appendChild(C.element('h2', t.nom));
        var en = document.createElement('p');
        en.className = 'angles';
        en.lang = 'en';
        en.textContent = t.nomAngles;
        a.appendChild(en);
        li.appendChild(a);
        li.appendChild(C.element('p', t.enunciat, 'enunciat-curt'));
        $('graella').appendChild(li);
    });
})();
