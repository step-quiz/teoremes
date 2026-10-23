/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: js/ui/fitxa.js
 * ROL: Les fitxes per imprimir (fitxa.html?id=… una; fitxa.html, les catorze):
 *      la figura inicial, l'enunciat, l'escala de pistes sencera, espai per
 *      escriure la demostració i la pregunta d'«I després». Una fitxa per full A4.
 * ARQUITECTURA: Script clàssic. La impressió és sempre negre sobre blanc
 *      (css/teoremes.css, @media print).
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
    var ORDRE_PISTES = ['encarrec', 'concreta', 'figura', 'tanca', 'comprovacio'];

    var id = C.parametres().get('id');
    var tots = C.teoremes();
    var triats = tots.filter(function (t) {
        return t.id === id;
    });
    if (!triats.length) triats = tots;
    document.title = (triats.length === 1 ? C.pla(triats[0].nom) : T.totesFitxes) + ' · ' + T.titol;

    $('btn-imprimeix').textContent = T.imprimeix;
    $('btn-imprimeix').addEventListener('click', function () {
        window.print();
    });
    $('nota-impressio').textContent = T.notaImpressio;
    $('a-torna').textContent = triats.length === 1 ? C.pla(triats[0].nom) : T.tots;
    $('a-torna').href = triats.length === 1 ? 'teorema.html?id=' + encodeURIComponent(triats[0].id) : 'index.html';

    triats.forEach(function (t) {
        var art = document.createElement('article');
        art.className = 'fitxa';
        var cap = document.createElement('p');
        cap.className = 'etiqueta';
        cap.textContent = T.titol + ' · ' + T.deCatorze(t.ordre, tots.length);
        art.appendChild(cap);
        art.appendChild(C.element('h1', t.nom));
        var en = document.createElement('p');
        en.className = 'angles';
        en.lang = 'en';
        en.textContent = t.nomAngles;
        art.appendChild(en);
        art.appendChild(C.element('p', t.enunciat, 'enunciat'));
        var m = K.munta(t);
        var fig = document.createElement('div');
        fig.className = 'figura-fitxa';
        fig.innerHTML = D.svg(m, G.avalua(m.fig).valors, {
            lliures: t.lliures,
            nanses: false,
            titol: C.pla(t.enunciat),
        });
        art.appendChild(fig);
        var h = document.createElement('h2');
        h.textContent = T.pistes;
        art.appendChild(h);
        var ol = document.createElement('ol');
        ol.className = 'pistes';
        ORDRE_PISTES.forEach(function (k) {
            var li = document.createElement('li');
            var nom = document.createElement('span');
            nom.className = 'nom-pista';
            nom.textContent = T.nomsPistes[k];
            li.appendChild(nom);
            li.appendChild(C.element('span', t.pistes[k]));
            ol.appendChild(li);
        });
        art.appendChild(ol);
        var h2 = document.createElement('h2');
        h2.textContent = T.laTevaDemo;
        art.appendChild(h2);
        var espai = document.createElement('div');
        espai.className = 'espai';
        art.appendChild(espai);
        var h3 = document.createElement('h2');
        h3.textContent = T.iDespresFitxa;
        art.appendChild(h3);
        art.appendChild(C.element('p', t.iDespres.text));
        var peu = document.createElement('p');
        peu.className = 'peu-fitxa';
        peu.textContent = 'teoremes.step-quiz.net · David Arso Civil, INS Miquel Tarradell · CC BY-NC-SA 4.0';
        art.appendChild(peu);
        $('fitxes').appendChild(art);
    });
})();
