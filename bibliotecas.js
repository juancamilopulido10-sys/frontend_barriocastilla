const DEFAULT_BIBLIOTECAS = [{"id": "cb1d393b", "nombre": "PPP Castilla (Paradero Paralibros Paraparques)", "horario": "Viernes, sabados y domingos de 9:00 a. m. a 2:00 p. m.", "lat": 4.642, "lon": -74.143, "direccion": "Carrera 75 #8A-50, parque Zonal Castilla"}, {"id": "7cb478dd", "nombre": "Biblioteca comunitaria e itinerante Alcaravan con rio", "horario": "Consultar horario", "lat": 4.6458675, "lon": -74.1481214, "direccion": "Cl. 8b #82-51, Kennedy"}, {"id": "ff2a8d96", "nombre": "Biblioteca Publica El Tintal Manuel Zapata Olivella", "horario": "Martes a sabado de 8:00 a. m. a 7:00 p. m.; domingos de 10:00 a. m. a 5:00 p. m.", "lat": 4.6430923, "lon": -74.1547938, "direccion": "Avenida Ciudad de Cali #6C-09, Kennedy"}];
/* Bibliotecas: listado + mapa + CRUD (API o localStorage) - responsabilidad única */
const STORAGE_KEY_BIBLIOS = "bc-bibliotecas-v1";
let bibliosMap = null;
let bibliosMarker = null;

function getLocalBiblios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BIBLIOS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const seed = (typeof DEFAULT_BIBLIOTECAS !== "undefined") ? DEFAULT_BIBLIOTECAS : [];
  localStorage.setItem(STORAGE_KEY_BIBLIOS, JSON.stringify(seed));
  return seed;
}
function setLocalBiblios(arr) { localStorage.setItem(STORAGE_KEY_BIBLIOS, JSON.stringify(arr)); }

async function apiBiblios(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

function renderBibliosList(biblios) {
  const ul = document.getElementById("bibliosList");
  if (!ul) return;
  ul.innerHTML = "";
  biblios.forEach(b => {
    const li = document.createElement("li");
    li.className = "centro-item";
    li.innerHTML = `<strong>${b.nombre}</strong><br><small>Horario: ${b.horario || ""}</small>` + (b.direccion ? `<br><em>${b.direccion}</em>` : "");
    li.addEventListener("click", () => showBiblioMap(b));
    const actions = document.createElement("div");
    actions.className = "centro-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); fillBiblioForm(b); });
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("¿Eliminar " + b.nombre + "?")) return;
      try { await apiBiblios("DELETE", "/api/bibliotecas/" + b.id); }
      catch (err) {
        const arr = getLocalBiblios().filter(x => x.id !== b.id);
        setLocalBiblios(arr);
      }
      await loadBiblios();
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function showBiblioMap(b) {
  const container = document.getElementById("bibliosMap");
  if (!container) return;
  if (!bibliosMap) {
    bibliosMap = L.map(container).setView([b.lat, b.lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(bibliosMap);
  } else {
    bibliosMap.setView([b.lat, b.lon], 16);
  }
  if (bibliosMarker) bibliosMap.removeLayer(bibliosMarker);
  bibliosMarker = L.marker([b.lat, b.lon]).addTo(bibliosMap).bindPopup(b.nombre).openPopup();
  container.scrollIntoView({ behavior: "smooth" });
}

function fillBiblioForm(b) {
  document.getElementById("biblioId").value = b ? b.id : "";
  document.getElementById("biblioNombre").value = b ? b.nombre : "";
  document.getElementById("biblioHorario").value = b ? (b.horario || "") : "";
  document.getElementById("biblioLat").value = b ? b.lat : "";
  document.getElementById("biblioLon").value = b ? b.lon : "";
  document.getElementById("biblioDir").value = b ? (b.direccion || "") : "";
}

async function loadBiblios() {
  try {
    const biblios = await apiBiblios("GET", "/api/bibliotecas");
    setLocalBiblios(biblios);
    renderBibliosList(biblios);
    return;
  } catch (e) {
    console.warn("API no disponible, usando datos locales.");
  }
  renderBibliosList(getLocalBiblios());
}

function initBibliosUI() {
  const form = document.getElementById("biblioForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("biblioId").value;
    const data = {
      nombre: document.getElementById("biblioNombre").value,
      horario: document.getElementById("biblioHorario").value,
      lat: parseFloat(document.getElementById("biblioLat").value),
      lon: parseFloat(document.getElementById("biblioLon").value),
      direccion: document.getElementById("biblioDir").value
    };
    let ok = false;
    try {
      if (id) await apiBiblios("PUT", "/api/bibliotecas/" + id, data);
      else await apiBiblios("POST", "/api/bibliotecas", data);
      ok = true;
    } catch (err) { /* fallback local */ }
    if (!ok) {
      const arr = getLocalBiblios();
      if (id) {
        const i = arr.findIndex(x => x.id === id);
        if (i >= 0) arr[i] = Object.assign({}, arr[i], data);
      } else {
        arr.push(Object.assign({ id: (crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10)) }, data));
      }
      setLocalBiblios(arr);
    }
    fillBiblioForm(null);
    await loadBiblios();
  });
  const resetBtn = document.getElementById("biblioReset");
  if (resetBtn) resetBtn.addEventListener("click", () => fillBiblioForm(null));
}
