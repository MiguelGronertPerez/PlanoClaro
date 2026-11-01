# Regenera vendor/bricolage-grotesque/fuente-file.js (copia base64 de la fuente para abrir con file://).
import base64, pathlib
v = pathlib.Path(__file__).resolve().parent.parent / "vendor" / "bricolage-grotesque"
b = base64.b64encode((v / "bricolage-grotesque-latin-standard-normal.woff2").read_bytes()).decode()
(v / "fuente-file.js").write_text(
    "/* Generado por scripts/generar_fuente.py. Bricolage Grotesque (OFL-1.1) embebida para file://,\n   donde Chrome bloquea cargar fuentes de archivos locales (CORS). Se registra con la API FontFace. */\n"
    "(function(){try{var b=atob('" + b + "');var u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);\n"
    "var f=new FontFace('Bricolage Grotesque',u.buffer,{weight:'200 800',stretch:'75% 100%',style:'normal',display:'swap'});document.fonts.add(f);f.load();}catch(e){}})();\n")
print("ok")
