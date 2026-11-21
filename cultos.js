const DEFAULT_CULTOS = [{"id": "3147e4a1", "nombre": "Iglesia Jesús Amor Misericordioso", "horario": "Consultar horario", "religion": "christian", "denominacion": "catholic", "lat": 4.637774, "lon": -74.141622, "direccion": null}, {"id": "07532f68", "nombre": "Parroquia San Felipe de Jesús", "horario": "Consultar horario", "religion": "christian", "denominacion": "catholic", "lat": 4.634391, "lon": -74.141174, "direccion": null}, {"id": "359a1e2b", "nombre": "Parroquia San Eugenio", "horario": "Consultar horario", "religion": "christian", "denominacion": "catholic", "lat": 4.633936, "lon": -74.149614, "direccion": null}, {"id": "14edda33", "nombre": "San Juan Macías", "horario": "Consultar horario", "religion": "christian", "denominacion": null, "lat": 4.650379, "lon": -74.135459, "direccion": null}];
/* Cultos religiosos: listado + mapa + CRUD (API o localStorage) - responsabilidad única */
const STORAGE_KEY_CULTOS = "bc-cultos-v1";
let cultosMap = null;
let cultosMarker = null;

function getLocalCultos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CULTOS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const seed = (typeof DEFAULT_CULTOS !== "undefined") ? DEFAULT_CULTOS : [];
  localStorage.setItem(STORAGE_KEY_CULTOS, JSON.stringify(seed));
  return seed;
}
function setLocalCultos(arr) { localStorage.setItem(STORAGE_KEY_CULTOS, JSON.stringify(arr)); }

async function apiCultos(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

function renderCultosList(cultos) {
  const ul = document.getElementById("cultosList");
  if (!ul) return;
  ul.innerHTML = "";
  cultos.forEach(c => {
    const li = document.createElement("li");
    li.className = "centro-item";
    li.innerHTML = `<strong>${c.nombre}</strong><br><small>Horario: ${c.horario || ""}</small>` + (c.direccion ? `<br><em>${c.direccion}</em>` : "");
    li.addEventListener("click", () => showCultoMap(c));
    const actions = document.createElement("div");
    actions.className = "centro-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); fillCultoForm(c); });
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("¿Eliminar " + c.nombre + "?")) return;
      try { await apiCultos("DELETE", "/api/cultos/" + c.id); }
      catch (err) {
        const arr = getLocalCultos().filter(x => x.id !== c.id);
        setLocalCultos(arr);
      }
      await loadCultos();
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function showCultoMap(c) {
  const container = document.getElementById("cultosMap");
  if (!container) return;
  if (!cultosMap) {
    cultosMap = L.map(container).setView([c.lat, c.lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(cultosMap);
  } else {
    cultosMap.setView([c.lat, c.lon], 16);
  }
  if (cultosMarker) cultosMap.removeLayer(cultosMarker);
  cultosMarker = L.marker([c.lat, c.lon]).addTo(cultosMap).bindPopup(c.nombre).openPopup();
  container.scrollIntoView({ behavior: "smooth" });
}

function fillCultoForm(c) {
  document.getElementById("cultoId").value = c ? c.id : "";
  document.getElementById("cultoNombre").value = c ? c.nombre : "";
  document.getElementById("cultoHorario").value = c ? (c.horario || "") : "";
  document.getElementById("cultoLat").value = c ? c.lat : "";
  document.getElementById("cultoLon").value = c ? c.lon : "";
  document.getElementById("cultoDir").value = c ? (c.direccion || "") : "";
}

async function loadCultos() {
  try {
    const cultos = await apiCultos("GET", "/api/cultos");
    setLocalCultos(cultos);
    renderCultosList(cultos);
    return;
  } catch (e) {
    console.warn("API no disponible, usando datos locales.");
  }
  renderCultosList(getLocalCultos());
}

function initCultosUI() {
  const form = document.getElementById("cultoForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("cultoId").value;
    const data = {
      nombre: document.getElementById("cultoNombre").value,
      horario: document.getElementById("cultoHorario").value,
      lat: parseFloat(document.getElementById("cultoLat").value),
      lon: parseFloat(document.getElementById("cultoLon").value),
      direccion: document.getElementById("cultoDir").value
    };
    let ok = false;
    try {
      if (id) await apiCultos("PUT", "/api/cultos/" + id, data);
      else await apiCultos("POST", "/api/cultos", data);
      ok = true;
    } catch (err) { /* fallback local */ }
    if (!ok) {
      const arr = getLocalCultos();
      if (id) {
        const i = arr.findIndex(x => x.id === id);
        if (i >= 0) arr[i] = Object.assign({}, arr[i], data);
      } else {
        arr.push(Object.assign({ id: (crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10)) }, data));
      }
      setLocalCultos(arr);
    }
    fillCultoForm(null);
    await loadCultos();
  });
  const resetBtn = document.getElementById("cultoReset");
  if (resetBtn) resetBtn.addEventListener("click", () => fillCultoForm(null));
}
