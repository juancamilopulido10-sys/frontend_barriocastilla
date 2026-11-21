/* Servicio de datos (API) - responsabilidad única */
const DEFAULT_DATA = {"barrio":"Castilla","habitantes":18420,"superficie_km2":3.2,"viviendas":6180,
 "comercios":312,"servicios_activos":47,"lineas_transporte":12,
 "demografia":{"menores_18":24,"entre_18_64":61,"mayores_65":15,"mujeres":9480,"hombres":8720,"otro_nd":220,"por_edad":[4420,3180,4610,3760,2450]},
 "servicios":{"salud":3,"educacion":8,"deporte":5,"cultura":1,"farmacias":12,"cobertura_salud":98},
 "transporte":{"bus":38,"metro":24,"bici":16,"auto":12,"pie":10},
 "comercio":{"almacenes":94,"gastronomia":61,"salud":47,"servicios":38,"moda":29,"tecnologia":22,"otros":21},
 "seguridad":{"incidentes_mes":[42,38,35,30,28,26,31,24,22,20,18],"camaras":38,"variacion_pct":-12},
 "ambiente":{"espacios_verdes_ha":42,"arboles":1240,"calidad_aire":"Buena","reciclaje_pct":68}};

function renderData(d) {
  const hs = document.querySelectorAll('.hero__stat-num');
  if (hs[0]) hs[0].textContent = d.habitantes.toLocaleString('es');
  if (hs[1]) hs[1].textContent = d.superficie_km2;
  if (hs[2]) hs[2].textContent = d.servicios_activos;
  if (hs[3]) hs[3].textContent = d.lineas_transporte;
  const kv = document.querySelectorAll('.card--kpi .card__value');
  if (kv[0]) kv[0].textContent = d.habitantes.toLocaleString('es');
  if (kv[1]) kv[1].textContent = d.viviendas.toLocaleString('es');
  if (kv[2]) kv[2].textContent = d.comercios;
  if (kv[3]) kv[3].textContent = d.lineas_transporte;
  const mini = document.querySelectorAll('.card--mini strong');
  if (mini[0]) mini[0].textContent = d.demografia.menores_18 + '%';
  if (mini[1]) mini[1].textContent = d.demografia.entre_18_64 + '%';
  if (mini[2]) mini[2].textContent = d.demografia.mayores_65 + '%';
  if (typeof updateChartsData === 'function') updateChartsData(d);
}

async function loadData() {
  try {
    const r = await fetch('/api/barrio');
    if (!r.ok) throw new Error('API');
    renderData(await r.json());
  } catch (e) {
    console.warn('API no disponible, usando datos locales.');
    renderData(DEFAULT_DATA);
  }
}
