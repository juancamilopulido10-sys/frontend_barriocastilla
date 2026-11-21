const DEFAULT_BANCOS = [{"id": "45ca3cac", "nombre": "Davivienda", "horario": "Lunes a viernes 9:00 a. m. - 4:00 p. m.", "lat": 4.63605, "lon": -74.137405, "direccion": null}, {"id": "60a44c1a", "nombre": "Banco de Bogotá", "horario": "Lunes a viernes 9:00 a. m. - 3:30 p. m.", "lat": 4.638842, "lon": -74.136369, "direccion": null}, {"id": "da9f47a4", "nombre": "Corresponsal Bancolombia", "horario": "Lunes a viernes 9:00 a. m. - 4:00 p. m.", "lat": 4.642989, "lon": -74.135352, "direccion": null}];
/* Bancos: listado + mapa + CRUD (API o localStorage) - responsabilidad única */
const STORAGE_KEY_BANCOS = "bc-bancos-v1";
let bancosMap = null;
let bancosMarker = null;

function getLocalBancos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANCOS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  const seed = (typeof DEFAULT_BANCOS !== "undefined") ? DEFAULT_BANCOS : [];
  localStorage.setItem(STORAGE_KEY_BANCOS, JSON.stringify(seed));
  return seed;
}
function setLocalBancos(arr) { localStorage.setItem(STORAGE_KEY_BANCOS, JSON.stringify(arr)); }

async function apiBancos(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

function renderBancosList(bancos) {
  const ul = document.getElementById("bancosList");
  if (!ul) return;
  ul.innerHTML = "";
  bancos.forEach(b => {
    const li = document.createElement("li");
    li.className = "centro-item";
    li.innerHTML = `<strong>${b.nombre}</strong><br><small>Horario: ${b.horario || ""}</small>` + (b.direccion ? `<br><em>${b.direccion}</em>` : "");
    li.addEventListener("click", () => showBancoMap(b));
    const actions = document.createElement("div");
    actions.className = "centro-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => { e.stopPropagation(); fillBancoForm(b); });
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm("¿Eliminar " + b.nombre + "?")) return;
      try { await apiBancos("DELETE", "/api/bancos/" + b.id); }
      catch (err) {
        const arr = getLocalBancos().filter(x => x.id !== b.id);
        setLocalBancos(arr);
      }
      await loadBancos();
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function showBancoMap(b) {
  const container = document.getElementById("bancosMap");
  if (!container) return;
  if (!bancosMap) {
    bancosMap = L.map(container).setView([b.lat, b.lon], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(bancosMap);
  } else {
    bancosMap.setView([b.lat, b.lon], 16);
  }
  if (bancosMarker) bancosMap.removeLayer(bancosMarker);
  bancosMarker = L.marker([b.lat, b.lon]).addTo(bancosMap).bindPopup(b.nombre).openPopup();
  container.scrollIntoView({ behavior: "smooth" });
}

function fillBancoForm(b) {
  document.getElementById("bancoId").value = b ? b.id : "";
  document.getElementById("bancoNombre").value = b ? b.nombre : "";
  document.getElementById("bancoHorario").value = b ? (b.horario || "") : "";
  document.getElementById("bancoLat").value = b ? b.lat : "";
  document.getElementById("bancoLon").value = b ? b.lon : "";
  document.getElementById("bancoDir").value = b ? (b.direccion || "") : "";
}

async function loadBancos() {
  try {
    const bancos = await apiBancos("GET", "/api/bancos");
    setLocalBancos(bancos);
    renderBancosList(bancos);
    return;
  } catch (e) {
    console.warn("API no disponible, usando datos locales.");
  }
  renderBancosList(getLocalBancos());
}

function initBancosUI() {
  const form = document.getElementById("bancoForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("bancoId").value;
    const data = {
      nombre: document.getElementById("bancoNombre").value,
      horario: document.getElementById("bancoHorario").value,
      lat: parseFloat(document.getElementById("bancoLat").value),
      lon: parseFloat(document.getElementById("bancoLon").value),
      direccion: document.getElementById("bancoDir").value
    };
    let ok = false;
    try {
      if (id) await apiBancos("PUT", "/api/bancos/" + id, data);
      else await apiBancos("POST", "/api/bancos", data);
      ok = true;
    } catch (err) { /* fallback local */ }
    if (!ok) {
      const arr = getLocalBancos();
      if (id) {
        const i = arr.findIndex(x => x.id === id);
        if (i >= 0) arr[i] = Object.assign({}, arr[i], data);
      } else {
        arr.push(Object.assign({ id: (crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10)) }, data));
      }
      setLocalBancos(arr);
    }
    fillBancoForm(null);
    await loadBancos();
  });
  const resetBtn = document.getElementById("bancoReset");
  if (resetBtn) resetBtn.addEventListener("click", () => fillBancoForm(null));
}
