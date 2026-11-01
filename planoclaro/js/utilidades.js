/* Utilidades compartidas. Espacio de nombres global PC (sin módulos ES para funcionar en file://).
   Seguridad: la interfaz se construye SOLO con APIs del DOM (createElement + textContent).
   No se usa innerHTML con datos, así que un texto del catálogo nunca se interpreta como HTML. */
window.PC = window.PC || {};
PC.util = {
  soles(n) { return 'S/ ' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
  dominio(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return String(url); } },
  /* Solo se enlazan URL https:// (evita javascript:, data:, etc.). */
  urlSegura(url) { try { const u = new URL(url); return u.protocol === 'https:' ? u.href : null; } catch (e) { return null; } },
  fecha(iso) { return String(iso || '').split('-').reverse().join('/'); },
  plural(n, uno, varios) { return n === 1 ? uno : varios; },
  /* Traducciones a palabras de todos los días (aproximadas y declaradas como tales). */
  explicarGB(gb) {
    if (gb == null || gb === Infinity) return 'sin límite de uso en alta velocidad (con reglas de uso justo)';
    const horas = Math.round(gb); // ≈ 1 GB por hora de video en calidad normal
    return `≈ ${horas} horas de video al mes en calidad normal (unas ${Math.max(1, Math.round(horas / 30 * 10) / 10)} al día)`;
  },
  explicarMbps(mbps) {
    const pantallas = Math.max(1, Math.floor(mbps / 25)); // ≈ 25 Mbps por pantalla en 4K
    return `alcanza para ≈ ${pantallas} ${pantallas === 1 ? 'tele o equipo' : 'teles o equipos'} viendo video en muy alta calidad a la vez`;
  },
  descargar(nombre, contenido, tipo) {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const a = document.createElement('a'); a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },
  operadorWeb: { Claro: 'https://www.claro.com.pe/', Movistar: 'https://www.movistar.com.pe/', Entel: 'https://www.entel.pe/', Bitel: 'https://bitel.com.pe/', Win: 'https://win.pe/', WOW: 'https://wowperu.pe/', MiFibra: 'https://www.mifibra.pe/', FiberPro: 'https://fiberpro.com.pe/' },
  /* Enlace de contratación: primera fuente que sea del dominio del operador; si no, su web principal. */
  urlOficial(p) {
    const base = this.operadorWeb[p.operador]; if (!base) return null;
    const dom = this.dominio(base);
    const f = (p.fuentes || []).map(u => this.urlSegura(u)).find(u => u && this.dominio(u).endsWith(dom.replace(/^www\./, '')));
    return f || base;
  }
};
/* h('p', {class:'x'}, 'texto', otroNodo): crea elementos. Los strings se insertan como nodos de texto. */
PC.h = function h(tag, attrs, ...hijos) {
  const esSvg = /^(svg|path|circle|rect|line|g|polygon|polyline|use|text)$/i.test(tag);
  const el = esSvg
    ? document.createElementNS('http://www.w3.org/2000/svg', tag)
    : document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') {
      if (esSvg) el.setAttribute('class', v);
      else el.className = v;
    }
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (/^on/i.test(k)) throw new Error('Usa addEventListener, no atributos on*');
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  PC.agregar(el, hijos);
  return el;
};
PC.agregar = function (el, hijos) {
  hijos.flat(Infinity).forEach(c => { if (c == null || c === false) return; el.append(c instanceof Node ? c : document.createTextNode(String(c))); });
  return el;
};
PC.vaciar = function (el, ...hijos) { el.replaceChildren(); return PC.agregar(el, hijos); };
PC.enlaceExterno = function (url, texto, clase) {
  const seguro = PC.util.urlSegura(url); if (!seguro) return PC.h('span', null, texto);
  return PC.h('a', { href: seguro, target: '_blank', rel: 'noopener noreferrer', class: clase }, texto, PC.h('span', { class: 'sr-only' }, ' (se abre en otra pestaña)'));
};
let temporizadorAviso = 0;
PC.avisar = function (texto) {
  const a = document.getElementById('aviso'); if (!a) return;
  a.textContent = texto; a.classList.add('aviso--visible');
  clearTimeout(temporizadorAviso); temporizadorAviso = setTimeout(() => a.classList.remove('aviso--visible'), 3800);
};
/* Sellos: además del texto, cada nivel tiene forma distinta (no depende del color). */
PC.ETIQUETAS_VERIF = {
  oficial: { texto: 'Verificado en la web del operador', corto: 'Verificado', clase: 'ok', icono: 'ok' },
  secundaria: { texto: 'Dato de un comparador (fuente secundaria)', corto: 'Fuente secundaria', clase: 'medio', icono: 'libro' },
  no_verificado: { texto: 'No pudimos verificarlo', corto: 'No verificado', clase: 'no', icono: 'no' },
  en_conflicto: { texto: 'Las fuentes no coinciden', corto: 'Datos en conflicto', clase: 'no', icono: 'no' }
};
