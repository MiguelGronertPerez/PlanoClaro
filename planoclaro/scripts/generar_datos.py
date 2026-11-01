# Genera data/planes.json y data/planes.js (misma información) a partir de esta lista.
import json
F="2026-10-20"
U={
 "claro_post":"https://www.claro.com.pe/personas/movil/postpago/",
 "claro_full":"https://www.claro.com.pe/personas/beneficios/full-claro/",
 "claro_roam":"https://www.claro.com.pe/personas/beneficios/movil/cobertura-internacional/",
 "mov_tienda":"https://tienda.movistar.com.pe/planes-pospago-movistar",
 "sel_mov":"https://selectra.com.pe/celular/postpago/movistar",
 "entel_post":"https://www.entel.pe/planes/postpago",
 "sel_entel":"https://selectra.com.pe/celular/postpago/entel",
 "bitel_post":"https://bitel.com.pe/planes/control/ilimitado",
 "sel_bitel":"https://selectra.com.pe/celular/postpago/bitel",
 "sel_claro_h":"https://selectra.com.pe/empresas/claro",
 "mov_fibra":"https://www.movistar.com.pe/hogar/internet-fibra-optica/",
 "sel_mov_h":"https://selectra.com.pe/empresas/movistar",
 "entel_h":"https://www.entel.pe/hogar/internet/planes",
 "bitel_h":"https://bitel.com.pe/planes/casa/internet-fibra-optica",
 "win_h":"https://win-internet.com.pe/hogar/plan-internet-duo/",
 "win_pe":"https://win.pe/hogar",
 "win_pdf":"https://win-internet.com.pe/pdf/lima.pdf",
 "sel_win":"https://selectra.com.pe/empresas/win",
 "wow_promo":"https://wowperu.pe/promociones",
 "wow_planes":"https://wowperu.pe/planes/",
 "sel_wow":"https://selectra.com.pe/internet/fibra-optica/wow",
 "mifibra_planes":"https://www.mifibra.pe/informacion-de-planes/",
 "mifibra_home":"https://www.mifibra.pe/internet-hogar/",
 "mifibra_abon":"https://www.mifibra.pe/informacion-a-abonados-y-usuarios/",
 "fiberpro_tc":"https://fiberpro.com.pe/contents/footer/T%C3%A9rminos%20y%20Condiciones%20-%20Junio%202026.pdf",
 "fiberpro_tarifas":"https://fiberpro.com.pe/tarifas/",
 "fiberpro_planes":"https://fiberpro.com.pe/planes/",
}
def m(id,op,nombre,promo,meses,reg,gb,ilim,intl,extras,fuentes,ver,cond="",notas="",reduc=None,comparte="no_verificado"):
    return dict(id=id,tipo="movil",operador=op,nombre=nombre,precioPromo=promo,mesesPromo=meses,precioRegular=reg,
      gbAltaVelocidad=gb,datosIlimitados=ilim,internacional=intl,compartirDatos=comparte,extras=extras,
      velocidadTrasConsumo=reduc,permanencia=None,costoEquipo=None,costoInstalacion=0,
      condicionPromo=cond,notas=notas,fuentes=[U[f] for f in fuentes],fechaConsulta=F,verificacion=ver)
def h(id,op,nombre,promo,meses,reg,mbps,tec,simetrica,inst,equipo,minimo,fuentes,ver,cond="",notas="",tope=None,mesh=False,perm=None,cobertura="nacional"):
    return dict(cobertura=cobertura,id=id,tipo="hogar",operador=op,nombre=nombre,precioPromo=promo,mesesPromo=meses,precioRegular=reg,
      velocidadMbps=mbps,tecnologia=tec,simetrica=simetrica,costoInstalacion=inst,costoEquipo=equipo,
      velocidadMinimaGarantizada=minimo,topeGB=tope,incluyeMesh=mesh,permanencia=perm,
      condicionPromo=cond,notas=notas,fuentes=[U[f] for f in fuentes],fechaConsulta=F,verificacion=ver)
O="oficial"; S="secundaria"; N="no_verificado"; C="en_conflicto"
planes=[
 # ---- CLARO móvil (precios y GB en web oficial Claro; tabla Full Claro) ----
 m("claro-max-2990","Claro","Max 29.90",None,0,29.90,20,False,"roaming",["Redes sociales ilimitadas (según web Claro)","Roaming en 17 países de América (30 min, 180 MB)"],["claro_full","claro_post","claro_roam"],
   dict(precio=O,datos=C,velocidadTrasConsumo=N,permanencia=N),notas="La página Full Claro indica 20 GB; otra página de Claro y un comparador mencionan 10 GB o 25 GB. Confirma los GB antes de contratar."),
 m("claro-max-3990","Claro","Max 39.90",None,0,39.90,30,False,"roaming",["Roaming 17 países (125 min, 1.3 GB)"],["claro_full","claro_roam"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N)),
 m("claro-max-4990","Claro","Max 49.90",None,0,49.90,45,False,"roaming",["Roaming 17 países (200 min, 2.5 GB)"],["claro_full","claro_roam"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N)),
 m("claro-max-6090","Claro","Max 60.90",None,0,60.90,75,False,"roaming",["Roaming 17 países (300 min, 3 GB)"],["claro_full","claro_roam"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N)),
 m("claro-maxilim-6990","Claro","Max Ilimitado 69.90",None,0,69.90,110,True,"roaming",["Llamadas y SMS ilimitados","Roaming América + EE.UU. + Canadá (350 min, 3.5 GB)","WhatsApp ilimitado en el extranjero"],["claro_full","claro_roam","claro_post"],
   dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N),notas="Tras 110 GB en alta velocidad sigues navegando a velocidad reducida (Claro no publica la velocidad en las páginas consultadas). Uso personal: no permite reventa, P2P ni proxys."),
 m("claro-maxilim-7990","Claro","Max Ilimitado 79.90",None,0,79.90,125,True,"roaming",["Roaming América + EE.UU. + Canadá (350 min, 4 GB)"],["claro_full","claro_roam"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N)),
 # ---- MOVISTAR móvil (familia Máximo: comparador Selectra que cita catálogo Movistar y OSIPTEL; 20 GB y 79.90 vistos en tienda oficial) ----
 m("mov-max-20","Movistar","Plan Máximo 20 GB",None,0,29.90,20,False,"si",["Llamadas ilimitadas en Perú, 500 SMS","Apps ilimitadas por 12 meses","100 MB en América y Europa por 12 meses"],["mov_tienda","sel_mov"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N)),
 m("mov-max-125","Movistar","Plan Máximo 125 GB",None,0,39.90,125,False,"no_verificado",["Llamadas ilimitadas en Perú","225 GB los primeros 6 meses (bono)"],["sel_mov"],dict(precio=S,datos=S,velocidadTrasConsumo=N,permanencia=N),notas="Otras páginas de Movistar aún muestran 25 GB por S/ 39.90 (campaña anterior)."),
 m("mov-max-250","Movistar","Plan Máximo 250 GB",None,0,49.90,250,False,"no_verificado",["L1 Max por tiempo limitado","Movistar TV App"],["sel_mov"],dict(precio=S,datos=S,velocidadTrasConsumo=N,permanencia=N)),
 m("mov-max-500","Movistar","Plan Máximo 500 GB",None,0,59.90,500,False,"no_verificado",["Llamadas ilimitadas en Perú"],["sel_mov"],dict(precio=S,datos=S,velocidadTrasConsumo=N,permanencia=N)),
 m("mov-max-ilim","Movistar","Plan Máximo Ilimitado",None,0,79.90,None,True,"si",["Internet y llamadas ilimitadas","4 GB en América y Europa por 12 meses","Llamadas a EE.UU. y Canadá (según tienda)"],["mov_tienda","sel_mov"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N),notas="La tienda muestra '999 GB'. Revisa la política de uso justo."),
 # ---- ENTEL móvil (planes y GB en web oficial; descuento portabilidad desde comparador) ----
 m("entel-power-2990","Entel","Power 29.90",None,0,29.90,20,False,"no_verificado",["Llamadas ilimitadas","50 GB los primeros 6 meses si portas tu número"],["entel_post","sel_entel"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N)),
 m("entel-power-4990","Entel","Power 49.90",None,0,49.90,80,False,"no_verificado",["Llamadas ilimitadas","110 GB los primeros 6 meses"],["entel_post","sel_entel"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N)),
 m("entel-power-5990","Entel","Power 59.90",None,0,59.90,120,False,"no_verificado",["Llamadas ilimitadas"],["entel_post","sel_entel"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N)),
 m("entel-ilim-6990","Entel","Power Ilim 69.90",34.95,6,69.90,200,True,"no_verificado",["Llamadas ilimitadas"],["entel_post","sel_entel"],dict(precio=S,datos=O,velocidadTrasConsumo=N,permanencia=N),cond="50% de descuento por 6 meses solo con portabilidad"),
 m("entel-ilim-7990","Entel","Power Ilim 79.90 SD",39.95,6,79.90,None,True,"no_verificado",["Datos, llamadas y SMS ilimitados"],["entel_post","sel_entel"],dict(precio=S,datos=O,velocidadTrasConsumo=N,permanencia=N),cond="50% de descuento por 6 meses solo con portabilidad"),
 m("entel-ilim-9990","Entel","Power Ilim 99.90 SD",49.95,6,99.90,None,True,"roaming",["Todo ilimitado","Roaming y datos satelitales (Direct to Cell)"],["entel_post","sel_entel"],dict(precio=S,datos=O,velocidadTrasConsumo=N,permanencia=N),cond="50% de descuento por 6 meses solo con portabilidad"),
 # ---- BITEL móvil (web oficial bitel.com.pe) ----
 m("bitel-ilim-3990","Bitel","Ilimitado 39.90",None,0,39.90,30,False,"no_verificado",["Datos 5G ilimitados por 6 meses","80 GB si portas (regular 30 GB)","Facebook, Instagram y WhatsApp en baja velocidad"],["bitel_post"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N),notas="Un comparador indica 45 GB regulares; la web oficial dice 30 GB."),
 m("bitel-ilim-4990","Bitel","Ilimitado 49.90",None,0,49.90,45,False,"no_verificado",["Datos 5G ilimitados por 12 meses","Bono TikTok 30 GB x 6 meses"],["bitel_post"],dict(precio=O,datos=C,velocidadTrasConsumo=N,permanencia=N),notas="Otra página de Bitel muestra 120 GB para un plan 49.90 5G. Confirma antes de contratar."),
 m("bitel-ilim-5590","Bitel","Ilimitado 55.90",27.90,12,55.90,75,False,"no_verificado",["Bono TikTok y Spotify por 6 meses"],["bitel_post","sel_bitel"],dict(precio=C,datos=C,velocidadTrasConsumo=N,permanencia=N),cond="50% dscto. solo por portabilidad",notas="La web oficial dice 12 meses de descuento; otra página de Bitel y un comparador indican 6 meses o 30%."),
 m("bitel-ilim-6990","Bitel","Ilimitado 69.90",34.90,12,69.90,110,False,"no_verificado",["Facebook e Instagram ilimitado en baja velocidad"],["bitel_post"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N),cond="50% dscto. solo por portabilidad"),
 m("bitel-ilim-7990","Bitel","Ilimitado 79.90",39.90,12,79.90,125,True,"no_verificado",["Internet, llamadas y SMS ilimitados","Datos 5G ilimitados por 6 meses"],["bitel_post"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N),cond="50% dscto. solo por portabilidad"),
 m("bitel-ilim-9990","Bitel","Ilimitado 99.90",49.90,12,99.90,155,True,"no_verificado",["Datos 5G ilimitados por 12 meses"],["bitel_post"],dict(precio=O,datos=O,velocidadTrasConsumo=N,permanencia=N),cond="50% dscto. solo por portabilidad"),
 # ---- HOGAR ----
 h("claro-fibra-200","Claro","Fibra 200 Mb",None,0,69,200,"Fibra óptica",None,None,None,"70% (según Claro)",["sel_claro_h"],dict(precio=S,instalacion=N,permanencia=N),notas="Claro vende el mismo nombre en fibra y cable coaxial; en coaxial la subida es 50 Mbps."),
 h("claro-fibra-400","Claro","Fibra 400 Mb",69,6,89,400,"Fibra óptica",None,None,None,"70% (según Claro)",["sel_claro_h"],dict(precio=S,instalacion=N,permanencia=N),cond="Precio promocional; sube en el mes 7 según comparador"),
 h("claro-fibra-500","Claro","Fibra 500 Mb",79,6,110,500,"Fibra óptica",None,None,None,"70% (según Claro)",["sel_claro_h"],dict(precio=S,instalacion=N,permanencia=N)),
 h("claro-fibra-1000","Claro","Fibra 1000 Mb",119,6,145,1000,"Fibra óptica",None,None,None,"70% (según Claro)",["sel_claro_h"],dict(precio=S,instalacion=N,permanencia=N)),
 h("mov-fibra-400","Movistar","Fibra 400 Mbps",79.90,2,89.90,400,"Fibra óptica",True,0,"Módem Smart WiFi incluido",None,["mov_fibra","sel_mov_h"],dict(precio=S,instalacion=O,permanencia=N),cond="Instalación gratis previa evaluación crediticia",notas="Incluye Movistar TV App (+20 canales)."),
 h("mov-fibra-600","Movistar","Fibra 600 Mbps",99.90,2,109.90,600,"Fibra óptica",True,0,"Módem Smart WiFi incluido",None,["mov_fibra","sel_mov_h"],dict(precio=S,instalacion=O,permanencia=N)),
 h("mov-fibra-1000","Movistar","Fibra 1000 Mbps",139.90,2,149.90,1000,"Fibra óptica",True,0,"Módem Smart WiFi incluido",None,["mov_fibra","sel_mov_h"],dict(precio=S,instalacion=O,permanencia=N)),
 h("mov-inal-25","Movistar","Internet Inalámbrico 25 GB",None,0,39.90,5,"Inalámbrico (red móvil)",False,None,None,None,["sel_mov_h"],dict(precio=S,instalacion=N,permanencia=N),tope=25,notas="5 Mbps de bajada; al agotar los GB baja a unos 0.5 Mbps. Solo para uso muy ligero o zonas sin fibra."),
 h("entel-fibra-600","Entel","Fibra 600 Mbps",69.93,3,99.90,600,"Fibra óptica",True,0,"Router WiFi 7",'70%',["entel_h"],dict(precio=O,instalacion=O,permanencia=N),cond="30% de descuento los 3 primeros meses"),
 h("entel-fibra-1000","Entel","Fibra 1000 Mbps",90.93,3,129.90,1000,"Fibra óptica",True,0,"Router WiFi 7 + hasta 1 repetidor (según evaluación)",'70%',["entel_h"],dict(precio=O,instalacion=O,permanencia=N),mesh=True,cond="30% de descuento los 3 primeros meses"),
 h("bitel-fibra-200","Bitel","Fibra 200 Mbps",None,0,55,200,"Fibra óptica",True,0,None,'70%',["bitel_h"],dict(precio=N,instalacion=N,permanencia=N),perm="6 meses para instalación gratis (no verificado); sin contrato: S/ 120",notas="Precio tomado de resultados de búsqueda; la página oficial no mostró la tabla al consultarla."),
 h("bitel-fibra-1000","Bitel","Fibra 1000 Mbps",None,0,139,1000,"Fibra óptica",True,0,None,'70%',["bitel_h"],dict(precio=N,instalacion=N,permanencia=N),perm="6 meses para instalación gratis (no verificado); sin contrato: S/ 120",notas="Precio tomado de resultados de búsqueda; no verificado en la web oficial."),
 h("win-fibra-500","Win","Fibra 500 Mbps",None,0,99,500,"Fibra óptica",True,None,"Router ONT en comodato",None,["sel_win"],dict(precio=S,instalacion=N,permanencia=N)),
 h("win-fibra-750","Win","Fibra 750 Mbps",None,0,109.90,750,"Fibra óptica",True,120,"Router ONT en comodato",None,["win_h","win_pdf"],dict(precio=O,instalacion=C,permanencia=N),notas="Instalación S/ 120 (hasta 6 cuotas) según web Win; el PDF de promoción de Lima indica S/ 0."),
 h("win-fibra-850","Win","Fibra 850 Mbps",59.50,1,119.90,850,"Fibra óptica",True,120,"Router ONT en comodato",None,["win_h","win_pdf"],dict(precio=O,instalacion=C,permanencia=N),cond="50% de descuento solo el primer mes"),
 h("win-fibra-1000","Win","Fibra 1000 Mbps",69.95,1,139.90,1000,"Fibra óptica",True,120,"Router ONT en comodato",None,["win_h","win_pe"],dict(precio=O,instalacion=C,permanencia=N),cond="50% de descuento solo el primer mes"),
 # ---- WOW Perú (wowperu.pe, consultado 20/10/2026; promoción válida 01-31/10/2026) ----
 h("wow-fibra-300","WOW","Internet 300 Mbps + DGO",79.90,6,84.90,300,"Fibra óptica",None,0,None,"70% (210 Mbps)",["wow_promo","wow_planes"],dict(precio=O,instalacion=N,permanencia=N),
   cond="Descuento de S/ 5 por hasta 6 recibos solo si pagas puntual; velocidad promocional de 500 Mbps por 6 meses",perm="La web de WOW indica 'plazo forzoso' sin publicar su duración en la página consultada",
   notas="Incluye app DGO (32 canales) por 12 meses renovables a criterio de WOW. Cobertura en los 24 departamentos, sujeta a evaluación técnica."),
 h("wow-fibra-500","WOW","Internet 500 Mbps + DGO",84.90,6,89.90,500,"Fibra óptica",None,0,"Router WiFi 6",'70%',["wow_planes","wow_promo"],dict(precio=O,instalacion=N,permanencia=N),
   cond="Descuento de hasta S/ 5 por 6 recibos con pago puntual; 1000 Mbps promocionales por 6 meses",perm="La web de WOW indica 'plazo forzoso' sin publicar su duración en la página consultada",
   notas="El precio promocional se calculó con el descuento máximo de S/ 5 que publica WOW (nota 3 de su web)."),
 h("wow-fibra-1000","WOW","Internet 1000 Mbps + DGO Familia",99.90,6,104.90,1000,"Fibra óptica",None,0,"Router WiFi 6",'70% (700 Mbps)',["wow_promo","wow_planes"],dict(precio=C,instalacion=N,permanencia=N),
   cond="Descuento de S/ 5 por hasta 6 recibos solo si pagas puntual",perm="La web de WOW indica 'plazo forzoso' sin publicar su duración en la página consultada",
   notas="La página de promociones dice S/ 99.90 con pago puntual; la de planes muestra S/ 94.90 como 'promo exclusiva digital'. Usamos S/ 99.90 (el mayor)."),
 # ---- MiFibra (mifibra.pe, web oficial) ----
 h("mifibra-500","MiFibra","Internet 500 Mbps",59.90,2,79.90,500,"Fibra óptica",True,0,"Router WiFi 6 + Mesh S/ 5 al mes",None,["mifibra_planes","mifibra_home","mifibra_abon"],dict(precio=O,instalacion=O,permanencia=N),
   cond="Precio de entrada para nuevas altas; velocidad promocional de 1000 Mbps",notas="Una página de MiFibra dice 2 meses de promoción y otra 4 meses (6 en Arequipa y Huánuco). Calculamos con 2 meses (lo más caro para ti). Instalación gratis sujeta a evaluación crediticia."),
 h("mifibra-1500","MiFibra","Internet 1500 Mbps",59.90,2,99.90,1500,"Fibra óptica",False,0,"Router WiFi 6 + Mesh S/ 5 al mes",None,["mifibra_planes","mifibra_home","mifibra_abon"],dict(precio=O,instalacion=O,permanencia=N),
   cond="Precio de entrada para nuevas altas",notas="Subida de 1000 Mbps. Promoción de 2 o 4 meses según la página de MiFibra; calculamos con 2."),
 h("mifibra-5000","MiFibra","Internet 5000 Mbps",99.90,2,189.90,5000,"Fibra óptica",False,0,"Router WiFi 7 + 2 Mesh (Lima)",None,["mifibra_planes","mifibra_home"],dict(precio=C,instalacion=O,permanencia=N),
   notas="Datos en conflicto: la tabla oficial de planes dice S/ 99.90 por 4 meses y luego S/ 189.90; la portada dice S/ 89.90 por 2 meses y luego S/ 139.90. Usamos el precio regular más alto."),
 # ---- FiberPro (fiberpro.com.pe; solo Lima Metropolitana y Callao) ----
 h("fiberpro-300","FiberPro","Plan Familiar 300 Mbps",None,0,50,300,"Fibra óptica",None,0,"Router ONT incluido",None,["fiberpro_tc","fiberpro_tarifas"],dict(precio=O,instalacion=O,permanencia=N),cobertura="lima",
   notas="Los términos de junio 2026 llaman 300 Mbps al plan de S/ 50; la tabla de tarifas registradas lo nombra 'Plan Familiar 100 Mbps'. Confirma la velocidad. Sujeto a evaluación crediticia."),
 h("fiberpro-700","FiberPro","Plan Familiar 700 Mbps",None,0,70,700,"Fibra óptica",None,0,"Router ONT incluido",None,["fiberpro_tc","fiberpro_tarifas"],dict(precio=O,instalacion=O,permanencia=N),cobertura="lima",
   notas="1000 Mbps promocionales los 3 primeros recibos. La tabla de tarifas registradas usa otro nombre de velocidad para S/ 70 (350 Mbps): confirma antes de contratar."),
]
data=dict(version="avance-2",fechaConsulta=F,moneda="PEN",nota="Precios con IGV. Datos recogidos el 2026-10-20; las promociones cambian cada mes. 'oficial' = visto en la web del operador; 'secundaria' = comparador (Selectra) que cita la web del operador u OSIPTEL; 'no_verificado' / 'en_conflicto' = no se pudo confirmar.",planes=planes)
js=json.dumps(data,ensure_ascii=False,indent=1)
open("data/planes.json","w").write(js)
open("data/planes.js","w").write("// Generado por scripts/generar_datos.py. Permite abrir index.html sin servidor (file://).\nwindow.PLANOCLARO_DATA = "+js+";\n")
print(len(planes))
