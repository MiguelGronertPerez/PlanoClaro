#!/usr/bin/env python3
"""Pruebas de PlanoClaro (Playwright): file:// y http × 1440 y 390.
Recorre el cuestionario paso a paso (variantes A y B), todas las funciones, axe-core, y guarda capturas en capturas/.
Uso: python3 scripts/probar.py [--axe RUTA_axe.min.js]"""
import asyncio, http.server, json, os, shutil, socketserver, sys, threading
from functools import partial
from pathlib import Path
from playwright.async_api import async_playwright

RAIZ = Path(__file__).resolve().parent.parent
CAP = RAIZ / 'capturas'
AXE = Path(sys.argv[sys.argv.index('--axe') + 1]) if '--axe' in sys.argv else Path('/tmp/fnt/axe/axe.min.js')
IGNORAR = ('GL Driver Message', 'GPU stall', 'WebGL-')
MOV = ['poco', 'si_mucho', 'no', 'no', '60']
fallos, resumen_axe = [], {}

def ok(c, msj):
    print(('  ✔ ' if c else '  ✘ ') + msj)
    if not c: fallos.append(msj)

class Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

async def responder(pg, valores=None):
    """Responde pregunta a pregunta hasta que aparezca «Ver mis planes»."""
    for i in range(10):
        fs = pg.locator('fieldset.pregunta:not([hidden])')
        opciones = fs.locator('input')
        n = await opciones.count()
        elegir = [0] if (await opciones.first.get_attribute('type')) == 'radio' else [0, 1]
        actual = await fs.get_attribute('id')
        for k in elegir: await pg.locator(f'#{actual} label.opcion').nth(min(k, n - 1)).click()
        await pg.wait_for_timeout(500)
        if await pg.locator('fieldset.pregunta:not([hidden])').get_attribute('id') != actual: continue
        if await pg.locator('#btn-enviar').is_visible():
            await pg.click('#btn-enviar'); return i + 1
        if await pg.locator('#btn-siguiente').is_visible():
            await pg.click('#btn-siguiente'); await pg.wait_for_timeout(350)
    raise RuntimeError('no llegó al final')

async def axe(pg, nombre):
    if not AXE.exists(): return
    if not await pg.evaluate('() => !!window.axe'): await pg.evaluate(AXE.read_text() + '\n;0')
    r = await pg.evaluate("axe.run(document,{preload:false,runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}).then(r=>r.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,help:v.help,ej:v.nodes.slice(0,3).map(n=>n.target.join(' '))})))")
    resumen_axe[nombre] = r
    ok(not r, f'axe sin violaciones en {nombre}' + ('' if not r else f': {[v["id"] for v in r]}'))

async def contexto(b, base, ancho, etiqueta, captura):
    print(f'\n== {etiqueta} ==')
    ctx = await b.new_context(viewport={'width': ancho, 'height': 900 if ancho > 500 else 844}, accept_downloads=True,
                              device_scale_factor=1 if ancho > 500 else 2)
    pg = await ctx.new_page(); errores = []
    pg.on('console', lambda m: m.type in ('error', 'warning') and not any(s in m.text for s in IGNORAR) and errores.append(m.text))
    pg.on('pageerror', lambda e: errores.append('pageerror: ' + str(e)))
    pg.on('response', lambda r: r.status >= 400 and errores.append(f'HTTP {r.status} {r.url}'))
    pg.on('requestfailed', lambda r: errores.append('falló ' + r.url))
    pg.on('dialog', lambda d: asyncio.ensure_future(d.accept()))
    cap = (lambda n: pg.screenshot(path=str(CAP / f'{etiqueta}-{n}.png'), full_page=n.endswith('completo'))) if captura else (lambda n: asyncio.sleep(0))
    ira = lambda v: pg.evaluate(f"PC.app.mostrar('{v}')")

    await pg.goto(base + 'index.html?variante=A'); await pg.wait_for_function('() => window.PC_ESTADO && document.querySelector(".escena--lista")', timeout=15000)
    await pg.wait_for_timeout(900)
    ok(await pg.evaluate("document.fonts.check('700 20px \"Bricolage Grotesque\"')"), 'fuente propia cargada')
    ok(await pg.evaluate("parseFloat(getComputedStyle(document.body).fontSize)>=18"), 'cuerpo ≥ 18 px')
    ok(await pg.evaluate("document.querySelectorAll('.ticket').length===3"), 'escena con 3 tarjetas reales')
    ok(await pg.evaluate("document.documentElement.scrollWidth<=innerWidth"), 'sin desborde horizontal (inicio)')
    ok(await pg.evaluate("[...document.querySelectorAll('a[target=_blank]')].every(a=>/noopener/.test(a.rel)&&/noreferrer/.test(a.rel))"), 'enlaces externos con noopener noreferrer')
    await cap('01-inicio'); await cap('01-inicio-completo')
    await axe(pg, etiqueta + ' inicio')
    await pg.keyboard.press('Tab'); ok(await pg.evaluate("document.activeElement.classList.contains('saltar')"), 'primer Tab = saltar al contenido')
    await pg.click('#consent-si'); await pg.wait_for_timeout(200)
    # sonido: arranca apagado, se puede activar
    ok(await pg.get_attribute('#btn-sonido', 'aria-pressed') == 'false', 'sonido apagado por defecto')
    await pg.click('#btn-sonido'); ok(await pg.get_attribute('#btn-sonido', 'aria-pressed') == 'true', 'botón de sonido alterna')
    await pg.click('#btn-sonido')

    # Cuestionario variante A (celular): validación en paso 1 y avance automático
    await pg.click('[data-servicio=movil]'); await pg.wait_for_timeout(450)
    await cap('02-pregunta-1')
    vis = await pg.locator('#btn-siguiente').is_visible()
    ok(not vis, 'variante A oculta «Siguiente» hasta responder')
    pasos = await responder(pg)
    ok(pasos == 5, f'celular: 5 pasos ({pasos})')
    await pg.wait_for_selector('.plan'); await pg.wait_for_timeout(900)
    ok(await pg.locator('.plan').count() >= 1, 'hay recomendaciones de celular')
    await cap('03-resultados'); await cap('03-resultados-completo')
    await axe(pg, etiqueta + ' resultados')
    # favorito, comparar, ics
    await pg.locator('[data-fav]').first.click(); ok(await pg.locator('[data-fav]').first.get_attribute('aria-pressed') == 'true', 'guardar favorito')
    for k in range(min(3, await pg.locator('[data-comp]').count())): await pg.locator('[data-comp]').nth(k).click()
    ok(await pg.text_content('#carrito-n') in ('2', '3'), 'contador del comparador')
    if await pg.locator('[data-ics]').count():
        async with pg.expect_download() as d: await pg.locator('[data-ics]').first.click()
        dl = await d.value; txt = Path(await dl.path()).read_text()
        ok('BEGIN:VEVENT' in txt and 'VALARM' in txt, 'recordatorio .ics válido')
    await ira('comparar'); await pg.wait_for_timeout(1200)
    ok(await pg.locator('#comparador table').count() == 1, 'tabla comparativa')
    await cap('04-comparador'); await axe(pg, etiqueta + ' comparador')

    # Variante B (internet) con zona, incluyendo resumen de errores
    await pg.goto(base + 'index.html?variante=B'); await pg.wait_for_function('() => !!window.PC_ESTADO')
    await pg.click('[data-servicio=hogar]'); await pg.wait_for_timeout(400)
    await pg.click('#btn-siguiente'); await pg.wait_for_timeout(300)
    ok(await pg.locator('.pregunta__error:not([hidden])').count() == 1, 'B: error si no responde')
    await cap('05-validacion')
    pasos = await responder(pg)
    ok(pasos == 5, f'internet: 5 pasos con zona ({pasos})')
    await pg.wait_for_selector('.plan'); await pg.wait_for_timeout(800)
    ok('OSIPTEL' in await pg.text_content('#letra-chica'), 'letra chica con OSIPTEL')
    await cap('06-resultados-internet')

    # Medidor
    await ira('medidor'); await pg.wait_for_timeout(300)
    await pg.click('#tab-iphone'); await pg.fill('#gb-medido', '5000'); await pg.press('#gb-medido', 'Enter')
    ok(await pg.locator('#gb-err:not([hidden])').count() == 1, 'medidor valida el número')
    await cap('07-medidor')
    await pg.fill('#gb-medido', '12'); await pg.press('#gb-medido', 'Enter'); await pg.wait_for_timeout(400)
    ok(await pg.locator('#aviso-medido:not([hidden])').count() == 1, 'medidor alimenta el cuestionario')

    # Cuenta local
    await ira('cuenta'); await pg.wait_for_timeout(300)
    await pg.fill('#c-nombre', 'Rosa'); await pg.fill('#c-correo', f'rosa{ancho}@ejemplo.pe'); await pg.fill('#c-clave', 'claveSegura123')
    await pg.click('button[value=crear]'); await pg.wait_for_timeout(2500)
    ok(await pg.locator('text=Salir de mi cuenta').count() == 1, 'crear cuenta local')
    await cap('08-cuenta')

    # Asistente
    await pg.click('#abrir-asistente'); await pg.fill('#chat-entrada', '¿cómo hago la portabilidad?'); await pg.press('#chat-entrada', 'Enter')
    await pg.wait_for_timeout(500)
    ok('24' in (await pg.locator('.msj--bot').last.text_content()), 'asistente responde portabilidad')
    await cap('09-asistente'); await axe(pg, etiqueta + ' asistente')
    await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)

    # SUS
    await ira('encuesta'); await pg.wait_for_timeout(300)
    for i in range(10): await pg.locator(f'fieldset.sus-item').nth(i).locator('label.escala__op').nth(3 if i % 2 == 0 else 1).click()
    await cap('10-encuesta'); await pg.click('text=Enviar respuestas'); await pg.wait_for_timeout(400)
    ok(await pg.locator('.resultado-sus').count() == 1, 'SUS calcula puntaje')

    # Métricas
    await ira('metricas'); await pg.wait_for_timeout(1200)
    ok(await pg.locator('.grafico').count() >= 3, 'panel de métricas con gráficos')
    await cap('11-metricas'); await axe(pg, etiqueta + ' métricas')

    # Admin
    await ira('admin'); await pg.fill('#a-usuario', 'admin'); await pg.fill('#a-clave', 'ucss-demo-2026'); await pg.click('text=Entrar al panel')
    await pg.wait_for_timeout(500); ok(await pg.locator('.tabla--admin').count() == 1, 'admin: entra con login demo')
    await pg.locator('.tabla--admin button.enlace').first.click(); await pg.wait_for_timeout(300)
    await pg.fill('#f-nombre' if await pg.locator('#f-nombre').count() else '#nombre', '')
    await pg.click('text=Guardar plan'); await pg.wait_for_timeout(300)
    ok(await pg.locator('#admin .errores:not([hidden])').count() >= 1, 'admin valida campos')
    await cap('12-admin')
    await pg.set_input_files('#importar', files=[{'name': 'x.json', 'mimeType': 'application/json', 'buffer': b'{"no":1}'}]); await pg.wait_for_timeout(400)
    await pg.click('text=Salir del panel')

    # Móvil vs. movimiento reducido
    await pg.emulate_media(reduced_motion='reduce'); await ira('inicio'); await pg.wait_for_timeout(600)
    await cap('13-movimiento-reducido')
    await pg.emulate_media(reduced_motion='no-preference')
    ok(await pg.evaluate("document.documentElement.scrollWidth<=innerWidth"), 'sin desborde horizontal (final)')
    ok(not errores, 'consola limpia, sin 404 ni CSP' + ('' if not errores else ': ' + ' | '.join(errores[:6])))
    await ctx.close()

async def main():
    if CAP.exists(): shutil.rmtree(CAP)
    CAP.mkdir()
    srv = socketserver.TCPServer(('127.0.0.1', 0), partial(Silencioso, directory=str(RAIZ)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    http_base = f'http://127.0.0.1:{srv.server_address[1]}/'
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        for base, nom in ((http_base, 'http'), (RAIZ.as_uri() + '/', 'file')):
            for ancho in (1440, 390):
                await contexto(b, base, ancho, f'{nom}-{ancho}', captura=True)
        await b.close()
    srv.shutdown()
    (RAIZ / 'docs' / 'axe-resultados.json').write_text(json.dumps(resumen_axe, ensure_ascii=False, indent=1))
    print(f'\n{len(fallos)} fallos'); sys.exit(1 if fallos else 0)

asyncio.run(main())
