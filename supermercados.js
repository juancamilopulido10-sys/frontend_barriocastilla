const DEFAULT_SUPERMERCADOS = [{"id": "3cc9c67d", "nombre": "Metro", "lat": 4.632312, "lon": -74.145949, "direccion": "Avenida de las Américas"}, {"id": "6f3c101c", "nombre": "Surti Mayorista", "lat": 4.640297, "lon": -74.141029, "direccion": null}, {"id": "8a21372d", "nombre": "Zapatoca", "lat": 4.639844, "lon": -74.140094, "direccion": null}, {"id": "550bf185", "nombre": "Merkacol #1", "lat": 4.634725, "lon": -74.154028, "direccion": null}, {"id": "85ea4e3f", "nombre": "Surtimax", "lat": 4.634005, "lon": -74.154797, "direccion": null}, {"id": "d779bd3f", "nombre": "Merkacol #3", "lat": 4.647984, "lon": -74.147579, "direccion": null}, {"id": "d51d3dc1", "nombre": "Autoservicio", "lat": 4.636159, "lon": -74.152784, "direccion": null}, {"id": "d46fcebc", "nombre": "Gran Fruvar", "lat": 4.637398, "lon": -74.141883, "direccion": null}, {"id": "65110429", "nombre": "Visioón de Colombia Supermercado", "lat": 4.651652, "lon": -74.135682, "direccion": "Calle 14"}, {"id": "b6485f05", "nombre": "Gran Fruver La Huerta", "lat": 4.651821, "lon": -74.137275, "direccion": "Calle 13A"}, {"id": "8eb48508", "nombre": "La Pamplonesa Supermercado", "lat": 4.639589, "lon": -74.148099, "direccion": "Calle 7A Bis C"}, {"id": "f495eb77", "nombre": "Eximerka's 51", "lat": 4.633621, "lon": -74.147835, "direccion": null}];
/* Supermercados: listado + mapa + CRUD (API o localStorage) - responsabilidad única */
const STORAGE_KEY_SUPERS = "bc-supermercados-v1";
let supersMap = null;
let supersMarker = null;

function getLocalSupers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUPERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const seed = (typeof DEFAULT_SUPERMERCADOS !== "undefined") ? DEFAULT_SUPERMERCADOS : [];
  localStorage.setItem(STORAGE_KEY_SUPERS, JSON.stringify(seed));
  return seed;
}
function setLocalSupers(arr) { localStorage.setItem(STORAGE_KEY_SUPERS, JSON.stringify(arr)); }

async function apiSupers(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

function renderSupersList(supers) {
  const ul = document.getElementById("supersList");
  if (!ul) return;
  ul.innerHTML = "";
  supers.forEach(s => {
    const li = document.createElement("li");
    li.className = "centro-item";
    li.innerHTML = `<strong>${s.nombre}</strong>` + (s.direccion ? `<br><small>${s.direccion}</small>` : "");
    li.addEventListener("click", () => showSuperMap(s));
    const actions = document.createElement("div");
    actions.className = "centro-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); fillSuperForm(s); });
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("¿Eliminar " + s.nombre + "?")) return;
      try { await apiSupers("DELETE", "/api/supermercados/" + s.id); }
      catch (err) {
        const arr = getLocalSupers().filter(x => x.id !== s.id);
        setLocalSupers(arr);
      }
      await loadSupers();
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function showSuperMap(s) {
  const container = document.getElementById("supersMap");
  if (!container) return;
  if (!supersMap) {
    supersMap = L.map(container).setView([s.lat, s.lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(supersMap);
  } else {
    supersMap.setView([s.lat, s.lon], 16);
  }
  if (supersMarker) supersMap.removeLayer(supersMarker);
  supersMarker = L.marker([s.lat, s.lon]).addTo(supersMap).bindPopup(s.nombre).openPopup();
  container.scrollIntoView({ behavior: "smooth" });
}

function fillSuperForm(s) {
  document.getElementById("superId").value = s ? s.id : "";
  document.getElementById("superNombre").value = s ? s.nombre : "";
  document.getElementById("superLat").value = s ? s.lat : "";
  document.getElementById("superLon").value = s ? s.lon : "";
  document.getElementById("superDir").value = s ? (s.direccion || "") : "";
}

async function loadSupers() {
  try {
    const supers = await apiSupers("GET", "/api/supermercados");
    setLocalSupers(supers);
    renderSupersList(supers);
    return;
  } catch (e) {
    console.warn("API no disponible, usando datos locales.");
  }
  renderSupersList(getLocalSupers());
}

function initSupersUI() {
  const form = document.getElementById("superForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("superId").value;
    const data = {
      nombre: document.getElementById("superNombre").value,
      lat: parseFloat(document.getElementById("superLat").value),
      lon: parseFloat(document.getElementById("superLon").value),
      direccion: document.getElementById("superDir").value
    };
    let ok = false;
    try {
      if (id) await apiSupers("PUT", "/api/supermercados/" + id, data);
      else await apiSupers("POST", "/api/supermercados", data);
      ok = true;
    } catch (err) { /* fallback local */ }
    if (!ok) {
      const arr = getLocalSupers();
      if (id) {
        const i = arr.findIndex(x => x.id === id);
        if (i >= 0) arr[i] = Object.assign({}, arr[i], data);
      } else {
        arr.push(Object.assign({ id: (crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10)) }, data));
      }
      setLocalSupers(arr);
    }
    fillSuperForm(null);
    await loadSupers();
  });
  const resetBtn = document.getElementById("superReset");
  if (resetBtn) resetBtn.addEventListener("click", () => fillSuperForm(null));
}
