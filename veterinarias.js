const DEFAULT_VETERINARIAS = [{"id": "6c7b6540", "nombre": "Bichos", "horario": "Consultar horario", "lat": 4.63219, "lon": -74.141608, "direccion": "Calle 6"}, {"id": "81e2462d", "nombre": "2.Caninos First", "horario": "Consultar horario", "lat": 4.634877, "lon": -74.149939, "direccion": "Carrera 79C"}, {"id": "80975698", "nombre": "Pet Clinical", "horario": "Mo-Su 09:00-21:00", "lat": 4.643336, "lon": -74.135857, "direccion": "Calle 11A"}];
/* Veterinarias: listado + mapa + CRUD (API o localStorage) - responsabilidad única */
const STORAGE_KEY_VETS = "bc-veterinarias-v1";
let vetsMap = null;
let vetsMarker = null;

function getLocalVets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VETS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const seed = (typeof DEFAULT_VETERINARIAS !== "undefined") ? DEFAULT_VETERINARIAS : [];
  localStorage.setItem(STORAGE_KEY_VETS, JSON.stringify(seed));
  return seed;
}
function setLocalVets(arr) { localStorage.setItem(STORAGE_KEY_VETS, JSON.stringify(arr)); }

async function apiVets(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

function renderVetsList(vets) {
  const ul = document.getElementById("vetsList");
  if (!ul) return;
  ul.innerHTML = "";
  vets.forEach(v => {
    const li = document.createElement("li");
    li.className = "centro-item";
    li.innerHTML = `<strong>${v.nombre}</strong><br><small>Horario: ${v.horario || ""}</small>` + (v.direccion ? `<br><em>${v.direccion}</em>` : "");
    li.addEventListener("click", () => showVetMap(v));
    const actions = document.createElement("div");
    actions.className = "centro-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); fillVetForm(v); });
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("¿Eliminar " + v.nombre + "?")) return;
      try { await apiVets("DELETE", "/api/veterinarias/" + v.id); }
      catch (err) {
        const arr = getLocalVets().filter(x => x.id !== v.id);
        setLocalVets(arr);
      }
      await loadVets();
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function showVetMap(v) {
  const container = document.getElementById("vetsMap");
  if (!container) return;
  if (!vetsMap) {
    vetsMap = L.map(container).setView([v.lat, v.lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(vetsMap);
  } else {
    vetsMap.setView([v.lat, v.lon], 16);
  }
  if (vetsMarker) vetsMap.removeLayer(vetsMarker);
  vetsMarker = L.marker([v.lat, v.lon]).addTo(vetsMap).bindPopup(v.nombre).openPopup();
  container.scrollIntoView({ behavior: "smooth" });
}

function fillVetForm(v) {
  document.getElementById("vetId").value = v ? v.id : "";
  document.getElementById("vetNombre").value = v ? v.nombre : "";
  document.getElementById("vetHorario").value = v ? (v.horario || "") : "";
  document.getElementById("vetLat").value = v ? v.lat : "";
  document.getElementById("vetLon").value = v ? v.lon : "";
  document.getElementById("vetDir").value = v ? (v.direccion || "") : "";
}

async function loadVets() {
  try {
    const vets = await apiVets("GET", "/api/veterinarias");
    setLocalVets(vets);
    renderVetsList(vets);
    return;
  } catch (e) {
    console.warn("API no disponible, usando datos locales.");
  }
  renderVetsList(getLocalVets());
}

function initVetsUI() {
  const form = document.getElementById("vetForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("vetId").value;
    const data = {
      nombre: document.getElementById("vetNombre").value,
      horario: document.getElementById("vetHorario").value,
      lat: parseFloat(document.getElementById("vetLat").value),
      lon: parseFloat(document.getElementById("vetLon").value),
      direccion: document.getElementById("vetDir").value
    };
    let ok = false;
    try {
      if (id) await apiVets("PUT", "/api/veterinarias/" + id, data);
      else await apiVets("POST", "/api/veterinarias", data);
      ok = true;
    } catch (err) { /* fallback local */ }
    if (!ok) {
      const arr = getLocalVets();
      if (id) {
        const i = arr.findIndex(x => x.id === id);
        if (i >= 0) arr[i] = Object.assign({}, arr[i], data);
      } else {
        arr.push(Object.assign({ id: (crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10)) }, data));
      }
      setLocalVets(arr);
    }
    fillVetForm(null);
    await loadVets();
  });
  const resetBtn = document.getElementById("vetReset");
  if (resetBtn) resetBtn.addEventListener("click", () => fillVetForm(null));
}
