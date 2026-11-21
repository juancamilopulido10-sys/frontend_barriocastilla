const DEFAULT_CAI = [{"id": "726811e1", "nombre": "CAI Castilla", "direccion": "Calle 9 # 78C-15 Sur", "telefono": "292 7420 (emergencias: 123)", "lat": 4.642393, "lon": -74.141171}];
/* CAI: listado + mapa + CRUD (API o localStorage) - responsabilidad única */
const STORAGE_KEY_CAI = "bc-cai-v1";
let caiMap = null;
let caiMarker = null;

function getLocalCai() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAI);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const seed = (typeof DEFAULT_CAI !== "undefined") ? DEFAULT_CAI : [];
  localStorage.setItem(STORAGE_KEY_CAI, JSON.stringify(seed));
  return seed;
}
function setLocalCai(arr) { localStorage.setItem(STORAGE_KEY_CAI, JSON.stringify(arr)); }

async function apiCai(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

function renderCaiList(items) {
  const ul = document.getElementById("caiList");
  if (!ul) return;
  ul.innerHTML = "";
  items.forEach(c => {
    const li = document.createElement("li");
    li.className = "centro-item";
    li.innerHTML = `<strong>${c.nombre}</strong><br><small>${c.direccion || ""}</small><br><em>Tel: ${c.telefono || ""}</em>`;
    li.addEventListener("click", () => showCaiMap(c));
    const actions = document.createElement("div");
    actions.className = "centro-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); fillCaiForm(c); });
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("¿Eliminar " + c.nombre + "?")) return;
      try { await apiCai("DELETE", "/api/cai/" + c.id); }
      catch (err) {
        const arr = getLocalCai().filter(x => x.id !== c.id);
        setLocalCai(arr);
      }
      await loadCai();
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function showCaiMap(c) {
  const container = document.getElementById("caiMap");
  if (!container) return;
  if (!caiMap) {
    caiMap = L.map(container).setView([c.lat, c.lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(caiMap);
  } else {
    caiMap.setView([c.lat, c.lon], 16);
  }
  if (caiMarker) caiMap.removeLayer(caiMarker);
  caiMarker = L.marker([c.lat, c.lon]).addTo(caiMap).bindPopup(c.nombre + "<br>" + (c.direccion || "") + "<br>Tel: " + (c.telefono || "")).openPopup();
  container.scrollIntoView({ behavior: "smooth" });
}

function fillCaiForm(c) {
  document.getElementById("caiId").value = c ? c.id : "";
  document.getElementById("caiNombre").value = c ? c.nombre : "";
  document.getElementById("caiDir").value = c ? (c.direccion || "") : "";
  document.getElementById("caiTel").value = c ? (c.telefono || "") : "";
  document.getElementById("caiLat").value = c ? c.lat : "";
  document.getElementById("caiLon").value = c ? c.lon : "";
}

async function loadCai() {
  try {
    const items = await apiCai("GET", "/api/cai");
    setLocalCai(items);
    renderCaiList(items);
    return;
  } catch (e) {
    console.warn("API no disponible, usando datos locales.");
  }
  renderCaiList(getLocalCai());
}

function initCaiUI() {
  const form = document.getElementById("caiForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("caiId").value;
    const data = {
      nombre: document.getElementById("caiNombre").value,
      direccion: document.getElementById("caiDir").value,
      telefono: document.getElementById("caiTel").value,
      lat: parseFloat(document.getElementById("caiLat").value),
      lon: parseFloat(document.getElementById("caiLon").value)
    };
    let ok = false;
    try {
      if (id) await apiCai("PUT", "/api/cai/" + id, data);
      else await apiCai("POST", "/api/cai", data);
      ok = true;
    } catch (err) { /* fallback local */ }
    if (!ok) {
      const arr = getLocalCai();
      if (id) {
        const i = arr.findIndex(x => x.id === id);
        if (i >= 0) arr[i] = Object.assign({}, arr[i], data);
      } else {
        arr.push(Object.assign({ id: (crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10)) }, data));
      }
      setLocalCai(arr);
    }
    fillCaiForm(null);
    await loadCai();
  });
  const resetBtn = document.getElementById("caiReset");
  if (resetBtn) resetBtn.addEventListener("click", () => fillCaiForm(null));
}
