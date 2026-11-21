const DEFAULT_ZONASVERDES = [{"id": "08baec05", "nombre": "Zona verde cicloruta Castilla", "actividades": "Ciclismo, paseo, ejercicio al aire libre", "lat": 4.63483, "lon": -74.14495, "direccion": "Cl. 7a #78c2"}, {"id": "306cf6c8", "nombre": "Parque Castilla (IDRD 08-030)", "actividades": "Juegos infantiles, descanso, paseo", "lat": 4.64096, "lon": -74.14271, "direccion": "Avenida Cra 8"}, {"id": "5bc59d6c", "nombre": "Nueva Castilla Park", "actividades": "Descanso, paseo, juegos", "lat": 4.65005, "lon": -74.15153, "direccion": "Ak 88d #8C-21"}, {"id": "0f198017", "nombre": "Plaza Castilla", "actividades": "Descanso, encuentro comunitario", "lat": 4.64631, "lon": -74.14365, "direccion": "Cl. 10 #80f-40"}, {"id": "c6303556", "nombre": "Casas de Nueva Castilla Park", "actividades": "Juegos infantiles, descanso", "lat": 4.65033, "lon": -74.15116, "direccion": "Ak 88d #87B-75"}, {"id": "0606a432", "nombre": "Villa Alsacia Park", "actividades": "Descanso, paseo, juegos, deporte", "lat": 4.64437, "lon": -74.13558, "direccion": "Tv. 78d #10B-54"}, {"id": "6905e417", "nombre": "Castilla Reserved Park", "actividades": "Descanso, paseo", "lat": 4.65412, "lon": -74.1553, "direccion": "Cl. 8a #92-1"}, {"id": "c159f312", "nombre": "Coliseo Deportivo Castilla", "actividades": "Deporte, eventos, ejercicio", "lat": 4.63942, "lon": -74.13911, "direccion": "Cl. 8b Bis #7343"}, {"id": "2ba30ec6", "nombre": "Polideportivo Castilla", "actividades": "Deporte, juegos, ejercicio", "lat": 4.63927, "lon": -74.13922, "direccion": "Cl. 8b Bis #73b-1"}, {"id": "437eaf42", "nombre": "Parque de Bolsillo Castilla (08-090)", "actividades": "Descanso, paseo", "lat": 4.63756, "lon": -74.1414, "direccion": "Cl. 7f #76a-19"}, {"id": "09589ddc", "nombre": "Parque Zonal Castilla", "actividades": "Deporte, juegos, lectura, descanso", "lat": 4.6395, "lon": -74.142, "direccion": "Carrera 74 con Calle 8a Bis"}];
/* Zonas verdes: listado + mapa + CRUD (API o localStorage) - responsabilidad única */
const STORAGE_KEY_ZONAS = "bc-zonasverdes-v1";
let zonasMap = null;
let zonasMarker = null;

function getLocalZonas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ZONAS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const seed = (typeof DEFAULT_ZONASVERDES !== "undefined") ? DEFAULT_ZONASVERDES : [];
  localStorage.setItem(STORAGE_KEY_ZONAS, JSON.stringify(seed));
  return seed;
}
function setLocalZonas(arr) { localStorage.setItem(STORAGE_KEY_ZONAS, JSON.stringify(arr)); }

async function apiZonas(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

function renderZonasList(zonas) {
  const ul = document.getElementById("zonasList");
  if (!ul) return;
  ul.innerHTML = "";
  zonas.forEach(z => {
    const li = document.createElement("li");
    li.className = "centro-item";
    li.innerHTML = `<strong>${z.nombre}</strong><br><small>${z.actividades || ""}</small>`;
    li.addEventListener("click", () => showZonaMap(z));
    const actions = document.createElement("div");
    actions.className = "centro-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); fillZonaForm(z); });
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("¿Eliminar " + z.nombre + "?")) return;
      try { await apiZonas("DELETE", "/api/zonasverdes/" + z.id); }
      catch (err) {
        const arr = getLocalZonas().filter(x => x.id !== z.id);
        setLocalZonas(arr);
      }
      await loadZonas();
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function showZonaMap(z) {
  const container = document.getElementById("zonasMap");
  if (!container) return;
  if (!zonasMap) {
    zonasMap = L.map(container).setView([z.lat, z.lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(zonasMap);
  } else {
    zonasMap.setView([z.lat, z.lon], 16);
  }
  if (zonasMarker) zonasMap.removeLayer(zonasMarker);
  zonasMarker = L.marker([z.lat, z.lon]).addTo(zonasMap).bindPopup(z.nombre).openPopup();
  container.scrollIntoView({ behavior: "smooth" });
}

function fillZonaForm(z) {
  document.getElementById("zonaId").value = z ? z.id : "";
  document.getElementById("zonaNombre").value = z ? z.nombre : "";
  document.getElementById("zonaAct").value = z ? (z.actividades || "") : "";
  document.getElementById("zonaLat").value = z ? z.lat : "";
  document.getElementById("zonaLon").value = z ? z.lon : "";
  document.getElementById("zonaDir").value = z ? (z.direccion || "") : "";
}

async function loadZonas() {
  try {
    const zonas = await apiZonas("GET", "/api/zonasverdes");
    setLocalZonas(zonas);
    renderZonasList(zonas);
    return;
  } catch (e) {
    console.warn("API no disponible, usando datos locales.");
  }
  renderZonasList(getLocalZonas());
}

function initZonasUI() {
  const form = document.getElementById("zonaForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("zonaId").value;
    const data = {
      nombre: document.getElementById("zonaNombre").value,
      actividades: document.getElementById("zonaAct").value,
      lat: parseFloat(document.getElementById("zonaLat").value),
      lon: parseFloat(document.getElementById("zonaLon").value),
      direccion: document.getElementById("zonaDir").value
    };
    let ok = false;
    try {
      if (id) await apiZonas("PUT", "/api/zonasverdes/" + id, data);
      else await apiZonas("POST", "/api/zonasverdes", data);
      ok = true;
    } catch (err) { /* fallback local */ }
    if (!ok) {
      const arr = getLocalZonas();
      if (id) {
        const i = arr.findIndex(x => x.id === id);
        if (i >= 0) arr[i] = Object.assign({}, arr[i], data);
      } else {
        arr.push(Object.assign({ id: (crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10)) }, data));
      }
      setLocalZonas(arr);
    }
    fillZonaForm(null);
    await loadZonas();
  });
  const resetBtn = document.getElementById("zonaReset");
  if (resetBtn) resetBtn.addEventListener("click", () => fillZonaForm(null));
}
