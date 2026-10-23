/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: js/ui/textos.js
 * ROL: Tots els textos de la interfície (els dels teoremes són a data/teoremes/).
 * ARQUITECTURA: Dades (window.TeoremesTextos); també es carrega amb Node (tests:
 *      cap text no passa de 40 paraules).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.TeoremesTextos = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    return {
        titol: 'Teoremes que no t’esperes',
        lema: 'Catorze teoremes de geometria que costa creure. Arrossega la figura, trenca’n una hipòtesi per veure què canvia i puja l’escala de pistes fins a la demostració.',
        esglaons: ['Arrossega', 'Trenca una hipòtesi', 'Demostra-ho', 'I després?'],
        obre: 'Obre',
        fitxa: 'Fitxa per imprimir',
        totesFitxes: 'Imprimeix totes les fitxes',
        tots: 'Tots els teoremes',
        anterior: '← Anterior',
        seguent: 'Següent →',
        deCatorze: function (n, total) {
            return 'Teorema ' + n + ' de ' + total;
        },
        noTrobat: 'Aquest teorema no existeix.',
        sensePistes: 'No hi ha més pistes',

        // Figura
        arrossega:
            'Arrossega els punts grossos (o toca’n un i després on vols posar-lo; amb el teclat, Tab i les fletxes).',
        nomPunt: 'Punt',
        triat: function (p) {
            return 'Has triat ' + p + ': toca on el vols posar, o fes servir les fletxes. Esc per deixar-lo.';
        },

        // Accions
        atzar: 'Configuració a l’atzar',
        inicial: 'Torna a la figura inicial',
        trencada: 'Variant trencada',
        tornaTeorema: 'Torna al teorema',
        projector: 'Mode projector',
        surtProjector: 'Surt del projector',

        // Variant trencada
        enTrencada: 'Estàs mirant la variant trencada:',

        // Pistes
        pistes: 'Escala de pistes',
        pistesNota: 'Cap pista no et dona la resposta. Prova-ho primer sense.',
        demanaPista: 'Una pista més',
        nomsPistes: {
            encarrec: '0 · Què has de fer',
            concreta: '1 · Un cas concret',
            figura: '2 · La figura',
            tanca: '3 · On mirar',
            comprovacio: 'Comprovació',
        },
        figuraPista: 'Mira la figura: hi han sortit objectes nous, amb traç discontinu.',

        // Demostració
        demostracio: 'La demostració',
        comencaDemo: 'Comença la demostració',
        pasSeguent: 'Pas següent',
        provaPrimer: 'Prova-ho primer al paper:',
        jaHoHePensat: 'Ja hi he pensat',
        pasDe: function (p, n) {
            return 'Pas ' + p + ' de ' + n;
        },

        // I després
        iDespres: 'I després?',
        mostraIDespres: 'Mostra-ho',
        amagaIDespres: 'Amaga-ho',
        iDespresFigura: 'A la figura, amb traç de ratlla i punt.',

        historia: 'Una mica d’història',
        referencies: 'Referències',

        // Fitxa
        imprimeix: 'Imprimeix',
        notaImpressio: 'En imprimir, desmarca «Capçaleres i peus de pàgina» a les opcions del navegador.',
        laTevaDemo: 'La teva demostració',
        iDespresFitxa: 'I després?',
    };
});
