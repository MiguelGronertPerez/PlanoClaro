#!/usr/bin/env python3
"""Mide la legibilidad del texto visible de PlanoClaro (Fernández-Huerta y Szigriszt-Pazos/INFLESZ).
Extrae cadenas en español de index.html y de los módulos JS de interfaz. Uso: python3 scripts/legibilidad.py"""
import re, json, html
from pathlib import Path
R = Path(__file__).resolve().parent.parent
FUENTES = ['index.html', 'js/preguntas.js', 'js/asistente.js', 'js/vista-resultados.js', 'js/medidor.js', 'js/cuestionario.js', 'js/utilidades.js']
def silabas(p):
    p = p.lower()
    p = re.sub(r'(?<=[aeoáéó])(?=[aeoáéó])', '-', p)  # hiato entre vocales fuertes
    return max(1, len(re.findall(r'[aeiouáéíóúü]+', re.sub(r'(?<=[aeo])([íú])', r'-\1', p).replace('-', ' '))) )
def textos(ruta):
    s = (R / ruta).read_text(encoding='utf-8')
    if ruta.endswith('.html'):
        s = re.sub(r'<(script|style|head)[\s\S]*?</\1>', ' ', s); s = re.sub(r'<[^>]+>', '\n', s)
        return [html.unescape(t).strip() for t in s.split('\n') if len(t.split()) >= 4]
    return [t for t in re.findall(r"'([^'\n]{20,})'|`([^`\n]{20,})`", s) for t in t if t and ' ' in t and not re.search(r'[{}<>=;]|https?:', t)]
def medir(ts):
    txt = ' '.join(t if re.search(r'[.!?…]$', t) else t + '.' for t in ts)
    palabras = re.findall(r"[A-Za-zÁÉÍÓÚáéíóúÑñü]+", txt)
    frases = max(1, len(re.findall(r'[.!?…]+', txt)))
    sil = sum(silabas(w) for w in palabras); n = max(1, len(palabras))
    fh = 206.84 - 60 * (sil / n) - 1.02 * (n / frases)  # forma corregida (Law, 2011)
    sp = 206.835 - 62.3 * sil / n - n / frases
    return {'palabras': n, 'frases': frases, 'palabras_por_frase': round(n / frases, 1), 'silabas_por_palabra': round(sil / n, 2), 'fernandez_huerta': round(fh, 1), 'inflesz': round(sp, 1)}
res = {f: medir(textos(f)) for f in FUENTES}
todo = [t for f in FUENTES for t in textos(f)]; res['TOTAL'] = medir(todo)
print(json.dumps(res, ensure_ascii=False, indent=1))
(R / 'docs' / 'legibilidad-resultados.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')
