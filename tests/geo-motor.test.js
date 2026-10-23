/**
 * ============================================================================
 * PROJECTE: teoremes (Step Quiz, vanilla JS)
 * FITXER: tests/geo-motor.test.js
 * ROL: El GeoMotor és un FITXER COMÚ (step-quiz-commons, fitxers/geo-motor.js):
 *      els seus tests de veritat són a step-quiz-commons (tests/geo-motor.test.js).
 *      Aquí només es comprova que la còpia d'aquest web és la comuna, que es
 *      carrega i que té els tipus que fan servir els teoremes; i, si al costat
 *      hi ha una còpia de step-quiz-commons, que és al dia.
 * ÚS: node tests/geo-motor.test.js
 * ============================================================================
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { suite, ok, eq, finish } = require('./harness');
const G = require('../js/motor/geo-motor.js');

const FITXER = path.join(__dirname, '..', 'js', 'motor', 'geo-motor.js');
const text = fs.readFileSync(FITXER, 'utf8');

suite('1. El fitxer comú');
{
    ok('porta l’avís de FITXER COMÚ (no s’edita aquí)', /FITXER COMÚ/.test(text) && /step-quiz-commons/.test(text));
    ok('la capçalera diu que el fa servir teoremes', /el fan servir[^\n]*teoremes/.test(text));
    eq('versió del format', G.VERSIO, 1);
    const commons = path.join(__dirname, '..', '..', 'step-quiz-commons', 'fitxers', 'geo-motor.js');
    if (fs.existsSync(commons))
        ok(
            'és igual que el de step-quiz-commons (al costat)',
            fs.readFileSync(commons, 'utf8') === text,
            'executa sincronitza.py'
        );
    else ok('(no hi ha step-quiz-commons al costat: el workflow «Fitxers comuns» el posa al dia)', true);
}

suite('2. Els tipus que fan servir els teoremes');
{
    const dir = path.join(__dirname, '..', 'data', 'teoremes');
    const tipus = new Set();
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
        const t = require(path.join(dir, f));
        for (const tp of [...t.construccio, ...t.trencada.canvis, ...t.iDespres.construccioExtra]) tipus.add(tp[1]);
    }
    for (const x of [...tipus].sort()) ok(`el tipus «${x}» existeix al GeoMotor`, !!G.TIPUS[x]);
    // Les que necessiten els teoremes (comprovades a fons a commons): una prova curta de cadascuna
    const f = G.nova({ x0: -8, y0: -6, x1: 8, y1: 6 });
    G.afegeix(f, 'punt', [0, 0], { id: 'A' });
    G.afegeix(f, 'punt', [4, 0], { id: 'B' });
    G.afegeix(f, 'punt', [0, 4], { id: 'C' });
    G.afegeix(f, 'circumcercle', ['A', 'B', 'C'], { id: 'c' });
    G.afegeix(f, 'recta', ['A', 'B'], { id: 'r' });
    G.afegeix(f, 'segona-interseccio', ['r', 'c', 'A'], { id: 'S' });
    G.afegeix(f, 'trisectriu', ['B', 'A', 'C', 1], { id: 't' });
    const v = G.avalua(f).valors;
    ok(
        'circumcercle: centre (2, 2) i radi √8',
        Math.hypot(v.c.c.x - 2, v.c.c.y - 2) < 1e-12 && Math.abs(v.c.r - Math.sqrt(8)) < 1e-12
    );
    ok('segona-interseccio: l’altre tall és B', Math.hypot(v.S.x - 4, v.S.y) < 1e-12);
    ok(
        'trisectriu: 30° (un terç de l’angle recte)',
        Math.abs(Math.atan2(v.t.q.y - v.t.p.y, v.t.q.x - v.t.p.x) - Math.PI / 6) < 1e-12
    );
}

finish('GEOMOTOR (FITXER COMÚ)');
