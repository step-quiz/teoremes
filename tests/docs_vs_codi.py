#!/usr/bin/env python3
"""
PROJECTE: teoremes (Step Quiz, vanilla JS)
FITXER: tests/docs_vs_codi.py
ROL: Que la documentació diu el mateix que el codi:
  - les rutes entre `cometes` del README existeixen;
  - la taula de teoremes del README té cada fitxer de data/teoremes/ (id, nom i el
    que es comprova, segons el tipus d'invariant), i el títol diu quants n'hi ha;
  - docs/REVISIO.md té una fila per teorema;
  - cada tipus d'invariant de js/motor/invariants.js té nom al README;
  - les claus de localStorage són les del codi.
ÚS: python3 tests/docs_vs_codi.py   (només biblioteca estàndard)
"""
import pathlib
import re
import sys

ARREL = pathlib.Path(__file__).resolve().parent.parent
llegeix = lambda rel: (ARREL / rel).read_text(encoding='utf-8')
errors = []


def comprova(cond, msg):
    if not cond:
        errors.append(msg)


readme = llegeix('README.md')
revisio = llegeix('docs/REVISIO.md')

# Com diu el README cada tipus d'invariant
NOMS = {
    'colinears': 'tres punts alineats',
    'concurrents': 'tres rectes concurrents',
    'conciclics': 'punts concíclics',
    'equilater': 'triangle equilàter',
    'tangents': 'circumferències tangents',
    'igualtat': 'una igualtat de longituds',
    'paralelogram': 'paral·lelogram',
    'iguals-perpendiculars': 'segments iguals i perpendiculars',
}

# 1. Rutes citades
for ruta in re.findall(r'`([^`\s#?*]+\.(?:js|css|html|py|yml|md))(?:[?#][^`]*)?`', readme):
    if ruta.startswith('.github/'):
        continue  # els workflows es creen des del web de GitHub
    comprova((ARREL / ruta).exists(), f'README.md cita `{ruta}`, que no existeix')

# 2. Teoremes
fitxers = sorted((ARREL / 'data' / 'teoremes').glob('*.js'))
comprova(f'## Els {len(fitxers)} teoremes' in readme, f'README.md: el títol ha de dir que hi ha {len(fitxers)} teoremes')
for f in fitxers:
    s = f.read_text(encoding='utf-8')
    tid = re.search(r"^    id: '([^']+)'", s, re.M).group(1)
    nom = re.search(r"^    nom: '([^']+)'", s, re.M).group(1)
    tipus = re.search(r"^    invariant: \{\s*tipus: '([^']+)'", s, re.M).group(1)
    comprova(tid == f.stem, f'{f.name}: l’id ({tid}) no és el nom del fitxer')
    fila = re.search(rf'^\| `{re.escape(tid)}` \| ([^|]+) \| ([^|]+) \|$', readme, re.M)
    comprova(fila is not None, f'README.md: falta el teorema `{tid}` a la taula')
    if fila:
        comprova(fila.group(1).strip() == nom, f'README.md: `{tid}` es diu «{nom}»')
        comprova(fila.group(2).strip() == NOMS.get(tipus), f'README.md: `{tid}` comprova «{NOMS.get(tipus)}»')
    comprova(re.search(rf'^\| `{re.escape(tid)}` \|', revisio, re.M) is not None, f'docs/REVISIO.md: falta la fila de `{tid}`')
files_readme = re.findall(r'^\| `([a-z0-9-]+)` \|', readme, re.M)
comprova(len(files_readme) == len(fitxers), f'README.md: la taula té {len(files_readme)} teoremes i n’hi ha {len(fitxers)}')

# 3. Tipus d'invariant: els del codi tenen nom aquí
codi = llegeix('js/motor/invariants.js')
bloc = re.search(r'var COMPROVA = \{(.*?)\n    \};', codi, re.S).group(1)
tipus_codi = set(re.findall(r"^        '?([a-z-]+)'?: function", bloc, re.M)) | {'igualtat'}
comprova(tipus_codi == set(NOMS), f'tests/docs_vs_codi.py: els tipus del codi són {sorted(tipus_codi)}')

# 4. Claus de localStorage
for f in ('js/ui/comu.js', 'js/ui/teorema.js'):
    for clau in re.findall(r"'(teoremes:v1:\w+)'", llegeix(f)):
        comprova(f'`{clau}`' in readme, f'README.md: falta la clau `{clau}`')

if errors:
    print(f'✗ teoremes: {len(errors)} discrepàncies entre la documentació i el codi:')
    for e in errors:
        print('  - ' + e)
    sys.exit(1)
print('✓ teoremes: la documentació quadra amb el codi.')
