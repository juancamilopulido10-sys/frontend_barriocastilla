const DEFAULT_RESTAURANTES = [{"id": "8a3f9b0d", "nombre": "Leños Palos", "cuisine": null, "lat": 4.637197, "lon": -74.142118, "direccion": "Calle 7C Bis"}, {"id": "dbc90080", "nombre": "Monte Castilla", "cuisine": null, "lat": 4.642755, "lon": -74.14207, "direccion": null}, {"id": "bff2f045", "nombre": "Maria Kanela", "cuisine": null, "lat": 4.642733, "lon": -74.142042, "direccion": null}, {"id": "f2d72f09", "nombre": "Surtiraves de la 22", "cuisine": null, "lat": 4.649453, "lon": -74.13357, "direccion": "Calle 13"}, {"id": "2c024e00", "nombre": "La Estancia", "cuisine": null, "lat": 4.655907, "lon": -74.138125, "direccion": "Carrera 83"}, {"id": "509321d6", "nombre": "Calivea", "cuisine": null, "lat": 4.639369, "lon": -74.136097, "direccion": "Carrera 72"}, {"id": "6a3d4d0c", "nombre": "Americas Jireth Pizza", "cuisine": null, "lat": 4.638321, "lon": -74.154568, "direccion": null}, {"id": "616a9745", "nombre": "Mi Cabaña Asados", "cuisine": null, "lat": 4.645777, "lon": -74.149977, "direccion": null}, {"id": "710eda2d", "nombre": "Wok Time", "cuisine": null, "lat": 4.637629, "lon": -74.140478, "direccion": null}, {"id": "92fe37e2", "nombre": "surtidora de aves 22", "cuisine": null, "lat": 4.637396, "lon": -74.142117, "direccion": null}, {"id": "95c5f520", "nombre": "El Portal de la pizza", "cuisine": "pizza", "lat": 4.631683, "lon": -74.141825, "direccion": "calle 6"}, {"id": "b0eda99c", "nombre": "Punto Paisa", "cuisine": "pizza;regional", "lat": 4.631641, "lon": -74.141842, "direccion": "Calle 6"}, {"id": "875238a8", "nombre": "Fortuna china", "cuisine": "chinese", "lat": 4.631524, "lon": -74.141872, "direccion": "Calle 6"}, {"id": "bf6d89d8", "nombre": "Sazón Costeño", "cuisine": null, "lat": 4.654002, "lon": -74.136113, "direccion": "Carrera 81"}, {"id": "a1c4011f", "nombre": "Girasol", "cuisine": null, "lat": 4.654373, "lon": -74.136465, "direccion": "Carrera 81A"}, {"id": "058d37df", "nombre": "Surti Broster 27", "cuisine": null, "lat": 4.636885, "lon": -74.138139, "direccion": "Carrera 72B"}, {"id": "46219b69", "nombre": "El Brasero Al Rojo", "cuisine": null, "lat": 4.64516, "lon": -74.147433, "direccion": "Calle 8B"}, {"id": "8886a58c", "nombre": "Julio's Pizza", "cuisine": "pizza", "lat": 4.644828, "lon": -74.145995, "direccion": "Calle 8C"}, {"id": "f6238fd0", "nombre": "Chicken Krons", "cuisine": null, "lat": 4.652307, "lon": -74.138424, "direccion": "Calle 13A"}, {"id": "65823cdb", "nombre": "Surtido De Aves 22", "cuisine": null, "lat": 4.652117, "lon": -74.137901, "direccion": "Calle 13A"}, {"id": "282d8046", "nombre": "Croky Burger", "cuisine": null, "lat": 4.637246, "lon": -74.138186, "direccion": "Avenida Calle 8"}, {"id": "6e6d7224", "nombre": "Libanesa", "cuisine": null, "lat": 4.63736, "lon": -74.138516, "direccion": "Avenida Calle 8"}, {"id": "28f6e71e", "nombre": "Pollo Claudio", "cuisine": null, "lat": 4.637827, "lon": -74.139946, "direccion": "Avenida Calle 8"}, {"id": "46f2225f", "nombre": "La Poche", "cuisine": "seafood", "lat": 4.638038, "lon": -74.140632, "direccion": "Avenida Calle 8"}, {"id": "353e5e09", "nombre": "La Parrilla Del Santandereano", "cuisine": null, "lat": 4.651275, "lon": -74.138066, "direccion": "Calle 13"}, {"id": "fb8d88a7", "nombre": "Bukey", "cuisine": null, "lat": 4.651347, "lon": -74.138206, "direccion": "Calle 13"}, {"id": "ea0ab041", "nombre": "El Brazon Ardiente", "cuisine": null, "lat": 4.653354, "lon": -74.140398, "direccion": "Calle 13A"}, {"id": "d7b856f2", "nombre": "La Esquina Soatense", "cuisine": null, "lat": 4.653258, "lon": -74.140196, "direccion": "Calle 13A"}, {"id": "76795791", "nombre": "Chispas & Pollo", "cuisine": null, "lat": 4.652622, "lon": -74.138697, "direccion": "Calle 13A"}, {"id": "6e8c82ba", "nombre": "Pollos & Sopas", "cuisine": null, "lat": 4.651195, "lon": -74.138256, "direccion": "Calle 13"}, {"id": "7d7f7dec", "nombre": "Donna Letty", "cuisine": null, "lat": 4.639742, "lon": -74.147994, "direccion": "Calle 7A Bis C"}, {"id": "623a1646", "nombre": "gallina", "cuisine": null, "lat": 4.65502, "lon": -74.139111, "direccion": null}, {"id": "f9e1fcc8", "nombre": "Asadero Mi Llanura", "cuisine": null, "lat": 4.637982, "lon": -74.140459, "direccion": null}];
/* Restaurantes: listado + mapa + CRUD (API o localStorage) - responsabilidad única */
const STORAGE_KEY_REST = "bc-restaurantes-v2";
let restMap = null;
let restMarker = null;

function getLocalRest() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REST);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const seed = (typeof DEFAULT_RESTAURANTES !== "undefined") ? DEFAULT_RESTAURANTES : [];
  localStorage.setItem(STORAGE_KEY_REST, JSON.stringify(seed));
  return seed;
}
function setLocalRest(arr) { localStorage.setItem(STORAGE_KEY_REST, JSON.stringify(arr)); }

async function apiRest(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

function renderRestList(rests) {
  const ul = document.getElementById("restList");
  if (!ul) return;
  ul.innerHTML = "";
  rests.forEach(r => {
    const li = document.createElement("li");
    li.className = "centro-item";
    li.innerHTML = `<strong>${r.nombre}</strong><br><small>${r.cuisine || "restaurante"}</small>`;
    li.addEventListener("click", () => showRestMap(r));
    const actions = document.createElement("div");
    actions.className = "centro-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); fillRestForm(r); });
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("¿Eliminar " + r.nombre + "?")) return;
      try { await apiRest("DELETE", "/api/restaurantes/" + r.id); }
      catch (err) {
        const arr = getLocalRest().filter(x => x.id !== r.id);
        setLocalRest(arr);
      }
      await loadRest();
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function showRestMap(r) {
  const container = document.getElementById("restMap");
  if (!container) return;
  if (!restMap) {
    restMap = L.map(container).setView([r.lat, r.lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(restMap);
  } else {
    restMap.setView([r.lat, r.lon], 16);
  }
  if (restMarker) restMap.removeLayer(restMarker);
  restMarker = L.marker([r.lat, r.lon]).addTo(restMap).bindPopup(r.nombre).openPopup();
  container.scrollIntoView({ behavior: "smooth" });
}

function fillRestForm(r) {
  document.getElementById("restId").value = r ? r.id : "";
  document.getElementById("restNombre").value = r ? r.nombre : "";
  document.getElementById("restCuisine").value = r ? (r.cuisine || "") : "";
  document.getElementById("restLat").value = r ? r.lat : "";
  document.getElementById("restLon").value = r ? r.lon : "";
  document.getElementById("restDir").value = r ? (r.direccion || "") : "";
}

async function loadRest() {
  try {
    const rests = await apiRest("GET", "/api/restaurantes");
    setLocalRest(rests);
    renderRestList(rests);
    return;
  } catch (e) {
    console.warn("API no disponible, usando datos locales.");
  }
  renderRestList(getLocalRest());
}

function initRestUI() {
  const form = document.getElementById("restForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("restId").value;
    const data = {
      nombre: document.getElementById("restNombre").value,
      cuisine: document.getElementById("restCuisine").value,
      lat: parseFloat(document.getElementById("restLat").value),
      lon: parseFloat(document.getElementById("restLon").value),
      direccion: document.getElementById("restDir").value
    };
    let ok = false;
    try {
      if (id) await apiRest("PUT", "/api/restaurantes/" + id, data);
      else await apiRest("POST", "/api/restaurantes", data);
      ok = true;
    } catch (err) { /* fallback local */ }
    if (!ok) {
      const arr = getLocalRest();
      if (id) {
        const i = arr.findIndex(x => x.id === id);
        if (i >= 0) arr[i] = Object.assign({}, arr[i], data);
      } else {
        arr.push(Object.assign({ id: (crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10)) }, data));
      }
      setLocalRest(arr);
    }
    fillRestForm(null);
    await loadRest();
  });
  const resetBtn = document.getElementById("restReset");
  if (resetBtn) resetBtn.addEventListener("click", () => fillRestForm(null));
}
