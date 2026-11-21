const DEFAULT_CENTROSMEDICOS = [{"id": "88680c7f", "nombre": "Unidad de Atención de salud Abastos", "lat": 4.632573, "lon": -74.154911, "direccion": "Avenida Carrera 80C"}, {"id": "38c8339d", "nombre": "Centro Medico Kennedy", "lat": 4.6315145, "lon": -74.1501014, "direccion": "Calle 5b #7840"}, {"id": "c55cf252", "nombre": "Centro Radiologico en Castilla", "lat": 4.6419001, "lon": -74.1405183, "direccion": "Cra. 78a #9-39 Loc 1"}];
/* Centros medicos: listado + mapa + CRUD (API o localStorage) - responsabilidad única */
const STORAGE_KEY_MEDICOS = "bc-centrosmedicos-v1";
let medicosMap = null;
let medicosMarker = null;

function getLocalMedicos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEDICOS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const seed = (typeof DEFAULT_CENTROSMEDICOS !== "undefined") ? DEFAULT_CENTROSMEDICOS : [];
  localStorage.setItem(STORAGE_KEY_MEDICOS, JSON.stringify(seed));
  return seed;
}
function setLocalMedicos(arr) { localStorage.setItem(STORAGE_KEY_MEDICOS, JSON.stringify(arr)); }

async function apiMedicos(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

function renderMedicosList(medicos) {
  const ul = document.getElementById("medicosList");
  if (!ul) return;
  ul.innerHTML = "";
  medicos.forEach(m => {
    const li = document.createElement("li");
    li.className = "centro-item";
    li.innerHTML = `<strong>${m.nombre}</strong>` + (m.direccion ? `<br><small>${m.direccion}</small>` : "");
    li.addEventListener("click", () => showMedicoMap(m));
    const actions = document.createElement("div");
    actions.className = "centro-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); fillMedicoForm(m); });
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("¿Eliminar " + m.nombre + "?")) return;
      try { await apiMedicos("DELETE", "/api/centrosmedicos/" + m.id); }
      catch (err) {
        const arr = getLocalMedicos().filter(x => x.id !== m.id);
        setLocalMedicos(arr);
      }
      await loadMedicos();
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function showMedicoMap(m) {
  const container = document.getElementById("medicosMap");
  if (!container) return;
  if (!medicosMap) {
    medicosMap = L.map(container).setView([m.lat, m.lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(medicosMap);
  } else {
    medicosMap.setView([m.lat, m.lon], 16);
  }
  if (medicosMarker) medicosMap.removeLayer(medicosMarker);
  medicosMarker = L.marker([m.lat, m.lon]).addTo(medicosMap).bindPopup(m.nombre).openPopup();
  container.scrollIntoView({ behavior: "smooth" });
}

function fillMedicoForm(m) {
  document.getElementById("medicoId").value = m ? m.id : "";
  document.getElementById("medicoNombre").value = m ? m.nombre : "";
  document.getElementById("medicoLat").value = m ? m.lat : "";
  document.getElementById("medicoLon").value = m ? m.lon : "";
  document.getElementById("medicoDir").value = m ? (m.direccion || "") : "";
}

async function loadMedicos() {
  try {
    const medicos = await apiMedicos("GET", "/api/centrosmedicos");
    setLocalMedicos(medicos);
    renderMedicosList(medicos);
    return;
  } catch (e) {
    console.warn("API no disponible, usando datos locales.");
  }
  renderMedicosList(getLocalMedicos());
}

function initMedicosUI() {
  const form = document.getElementById("medicoForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("medicoId").value;
    const data = {
      nombre: document.getElementById("medicoNombre").value,
      lat: parseFloat(document.getElementById("medicoLat").value),
      lon: parseFloat(document.getElementById("medicoLon").value),
      direccion: document.getElementById("medicoDir").value
    };
    let ok = false;
    try {
      if (id) await apiMedicos("PUT", "/api/centrosmedicos/" + id, data);
      else await apiMedicos("POST", "/api/centrosmedicos", data);
      ok = true;
    } catch (err) { /* fallback local */ }
    if (!ok) {
      const arr = getLocalMedicos();
      if (id) {
        const i = arr.findIndex(x => x.id === id);
        if (i >= 0) arr[i] = Object.assign({}, arr[i], data);
      } else {
        arr.push(Object.assign({ id: (crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10)) }, data));
      }
      setLocalMedicos(arr);
    }
    fillMedicoForm(null);
    await loadMedicos();
  });
  const resetBtn = document.getElementById("medicoReset");
  if (resetBtn) resetBtn.addEventListener("click", () => fillMedicoForm(null));
}
