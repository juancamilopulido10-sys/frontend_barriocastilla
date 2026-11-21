const DEFAULT_CENTROS = [{"id": "7f2d1dca", "nombre": "Gimnasio Maria Luisa Tricheth", "descripcion": "Institucion educativa (gimnasio) ubicada en el barrio Castilla, Bogota.", "tipo": "kindergarten", "lat": 4.642284, "lon": -74.141526, "direccion": null}, {"id": "b20f9c87", "nombre": "Colegio San Jose de Castilla (sede C)", "descripcion": "Institucion educativa distrital ubicada en el barrio Castilla (Kennedy), Bogota. Forma parte de la red de colegios distritales de la ciudad.", "tipo": "school", "lat": 4.65076, "lon": -74.134984, "direccion": null}, {"id": "81a429e1", "nombre": "Jingle School", "descripcion": "Jardin infantil privado ubicado en el barrio Castilla, localidad de Kennedy. Atiende a la primera infancia.", "tipo": "school", "lat": 4.638894, "lon": -74.143512, "direccion": "Avenida Calle 8"}, {"id": "d6ccbcbe", "nombre": "General Gustavo Rojas Pinilla", "descripcion": "Institucion educativa distrital ubicada en el barrio Castilla, Bogota.", "tipo": "school", "lat": 4.648727, "lon": -74.140871, "direccion": null}, {"id": "97e33c30", "nombre": "Centro Educativo San Luis de Gonzaga Fe y Alegria", "descripcion": "Centro educativo de la fundacion Fe y Alegria ubicado en el barrio Castilla, Bogota. Atiende a la comunidad del sector.", "tipo": "school", "lat": 4.634889, "lon": -74.146735, "direccion": null}, {"id": "b39b6eb6", "nombre": "Colegio I.E.D. Castilla", "descripcion": "Institucion Educativa Distrital (IED) Castilla, ubicada en el barrio Castilla, Bogota.", "tipo": "school", "lat": 4.640958, "lon": -74.142323, "direccion": null}, {"id": "9fca50d3", "nombre": "Colegio Isabel Segunda", "descripcion": "Institucion educativa ubicada en el barrio Castilla, Bogota.", "tipo": "school", "lat": 4.633428, "lon": -74.152915, "direccion": null}, {"id": "a10e7e4c", "nombre": "Colegio Distrital Nueva Castilla", "descripcion": "Institucion educativa distrital publica ubicada en el barrio Castilla (Kennedy), Bogota. Forma parte de la red de colegios distritales.", "tipo": "school", "lat": 4.638501, "lon": -74.141599, "direccion": null}, {"id": "a70449a5", "nombre": "Centro educativo sin nombre 24", "descripcion": "Centro educativo ubicado en el barrio Castilla, Bogota.", "tipo": "school", "lat": 4.635174, "lon": -74.15158, "direccion": null}, {"id": "9dcbdd87", "nombre": "Mimositos", "descripcion": "Jardin infantil ubicado en el barrio Castilla, Bogota.", "tipo": "school", "lat": 4.635763, "lon": -74.137421, "direccion": null}];
/* Centros educativos: listado + mapa + CRUD (API o localStorage) - responsabilidad única */
const STORAGE_KEY = "bc-centros-v2";
let centrosMap = null;
let centrosMarker = null;

function getLocalCentros() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const seed = (typeof DEFAULT_CENTROS !== "undefined") ? DEFAULT_CENTROS : [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}
function setLocalCentros(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

async function apiCentros(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

function renderCentrosList(centros) {
  const ul = document.getElementById("centrosList");
  if (!ul) return;
  ul.innerHTML = "";
  centros.forEach(c => {
    const li = document.createElement("li");
    li.className = "centro-item";
    li.innerHTML = `<strong>${c.nombre}</strong><br><small>${c.descripcion || ""}</small><br><em>${c.tipo || ""}</em>`;
    li.addEventListener("click", () => showCentroMap(c));
    const actions = document.createElement("div");
    actions.className = "centro-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); fillCentroForm(c); });
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("¿Eliminar " + c.nombre + "?")) return;
      // intentar API; si falla, local
      try { await apiCentros("DELETE", "/api/centros/" + c.id); }
      catch (err) {
        const arr = getLocalCentros().filter(x => x.id !== c.id);
        setLocalCentros(arr);
      }
      await loadCentros();
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function showCentroMap(c) {
  const container = document.getElementById("centrosMap");
  if (!container) return;
  if (!centrosMap) {
    centrosMap = L.map(container).setView([c.lat, c.lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(centrosMap);
  } else {
    centrosMap.setView([c.lat, c.lon], 16);
  }
  if (centrosMarker) centrosMap.removeLayer(centrosMarker);
  centrosMarker = L.marker([c.lat, c.lon]).addTo(centrosMap).bindPopup(c.nombre).openPopup();
  container.scrollIntoView({ behavior: "smooth" });
}

function fillCentroForm(c) {
  document.getElementById("centroId").value = c ? c.id : "";
  document.getElementById("centroNombre").value = c ? c.nombre : "";
  document.getElementById("centroDesc").value = c ? (c.descripcion || "") : "";
  document.getElementById("centroTipo").value = c ? (c.tipo || "school") : "school";
  document.getElementById("centroLat").value = c ? c.lat : "";
  document.getElementById("centroLon").value = c ? c.lon : "";
  document.getElementById("centroDir").value = c ? (c.direccion || "") : "";
}

async function loadCentros() {
  // intentar API primero
  try {
    const centros = await apiCentros("GET", "/api/centros");
    setLocalCentros(centros);
    renderCentrosList(centros);
    return;
  } catch (e) {
    console.warn("API no disponible, usando datos locales.");
  }
  renderCentrosList(getLocalCentros());
}

function initCentrosUI() {
  const form = document.getElementById("centroForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("centroId").value;
    const data = {
      nombre: document.getElementById("centroNombre").value,
      descripcion: document.getElementById("centroDesc").value,
      tipo: document.getElementById("centroTipo").value,
      lat: parseFloat(document.getElementById("centroLat").value),
      lon: parseFloat(document.getElementById("centroLon").value),
      direccion: document.getElementById("centroDir").value
    };
    // intentar API
    let ok = false;
    try {
      if (id) await apiCentros("PUT", "/api/centros/" + id, data);
      else await apiCentros("POST", "/api/centros", data);
      ok = true;
    } catch (err) { /* fallback local */ }
    if (!ok) {
      const arr = getLocalCentros();
      if (id) {
        const i = arr.findIndex(x => x.id === id);
        if (i >= 0) arr[i] = Object.assign({}, arr[i], data);
      } else {
        arr.push(Object.assign({ id: (crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10)) }, data));
      }
      setLocalCentros(arr);
    }
    fillCentroForm(null);
    await loadCentros();
  });
  const resetBtn = document.getElementById("centroReset");
  if (resetBtn) resetBtn.addEventListener("click", () => fillCentroForm(null));
}
