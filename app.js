/* Orquestador principal: inyecta markup y coordina módulos */
document.getElementById('app').innerHTML = `
<header class="nav">
  <div class="nav__brand"><span class="nav__logo"><i class="fa-solid fa-location-dot"></i></span><span class="nav__name">Barrio Castilla</span></div>
  <nav class="nav__links">
    <a href="#hero">Inicio</a><a href="#centros">Centros educativos</a><a href="#restaurantes">Restaurantes</a><a href="#zonasverdes">Zonas verdes</a><a href="#transporte">Transporte</a><a href="#supermercados">Supermercados</a><a href="#centrosmedicos">Centros médicos</a><a href="#cai">CAI</a><a href="#veterinarias">Veterinarias</a><a href="#bibliotecas">Bibliotecas</a><a href="#vias">Vías</a><a href="#bancos">Bancos</a><a href="#cultos">Cultos religiosos</a><a href="#predios">Predios</a>
  </nav>
  <button class="nav__cta" id="themeToggle" aria-label="Cambiar tema"><i class="fa-solid fa-moon"></i></button>
</header>
<section id="hero" class="hero">
  <div class="hero__content">
    <span class="hero__eyebrow"><i class="fa-solid fa-sparkles"></i> Portal comunitario del barrio</span>
    <h1 class="hero__title">Barrio <span class="hero__accent">Castilla</span></h1>
    <p class="hero__subtitle">Uno de los barrios más tradicionales de Bogotá, ubicado en la localidad de Kennedy (suroccidente). Fundado en 1969 bajo la alcaldía de Virgilio Barco Vargas.</p>
    <div class="hero__facts">
      <div class="hero__fact"><i class="fa-solid fa-calendar"></i><span>Fundado</span><strong>1969</strong></div>
      <div class="hero__fact"><i class="fa-solid fa-ruler-combined"></i><span>Área (UPZ)</span><strong>5,03 km²</strong></div>
      <div class="hero__fact"><i class="fa-solid fa-users"></i><span>Habitantes</span><strong>~125.411</strong></div>
      <div class="hero__fact"><i class="fa-solid fa-layer-group"></i><span>Estrato</span><strong>3 y 4</strong></div>
      <div class="hero__fact"><i class="fa-solid fa-water"></i><span>Humedales</span><strong>Burro y Techo</strong></div>
      <div class="hero__fact"><i class="fa-solid fa-location-dot"></i><span>Localidad</span><strong>Kennedy</strong></div>
    </div>
  </div>
  <div class="hero__visual"><div class="hero__map"><div class="map-pulse"></div><div class="map-pin"><i class="fa-solid fa-location-dot"></i></div><div class="map-ring map-ring--1"></div><div class="map-ring map-ring--2"></div><div class="map-ring map-ring--3"></div></div></div>
</section>
<section id="centros" class="section">
  <div class="section__head"><span class="section__tag">Educación</span><h2>Centros educativos</h2><p>Listado de centros educativos del barrio. Haz clic en uno para ver su ubicación en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>Centros registrados</h3>
      <ul id="centrosList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="centrosMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar centro educativo</h3>
    <form id="centroForm" class="centro-form">
      <input type="hidden" id="centroId" />
      <input id="centroNombre" placeholder="Nombre del centro" required />
      <input id="centroDesc" placeholder="Descripción" />
      <select id="centroTipo"><option value="school">Escuela</option><option value="kindergarten">Jardín infantil</option><option value="college">Colegio</option><option value="university">Universidad</option></select>
      <input id="centroLat" type="number" step="any" placeholder="Latitud" required />
      <input id="centroLon" type="number" step="any" placeholder="Longitud" required />
      <input id="centroDir" placeholder="Dirección" />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="centroReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
<section id="restaurantes" class="section">
  <div class="section__head"><span class="section__tag">Gastronomía</span><h2>Restaurantes</h2><p>Listado de restaurantes del barrio. Haz clic en uno para ver su ubicación en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>Restaurantes registrados</h3>
      <ul id="restList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="restMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar restaurante</h3>
    <form id="restForm" class="centro-form">
      <input type="hidden" id="restId" />
      <input id="restNombre" placeholder="Nombre del restaurante" required />
      <input id="restCuisine" placeholder="Tipo de cocina" />
      <input id="restLat" type="number" step="any" placeholder="Latitud" required />
      <input id="restLon" type="number" step="any" placeholder="Longitud" required />
      <input id="restDir" placeholder="Dirección" />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="restReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
<section id="zonasverdes" class="section">
  <div class="section__head"><span class="section__tag">Ambiente</span><h2>Zonas verdes</h2><p>Parques y zonas verdes del barrio. Haz clic en uno para ver su ubicación en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>Zonas verdes registradas</h3>
      <ul id="zonasList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="zonasMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar zona verde</h3>
    <form id="zonaForm" class="centro-form">
      <input type="hidden" id="zonaId" />
      <input id="zonaNombre" placeholder="Nombre de la zona verde" required />
      <input id="zonaAct" placeholder="Actividades que se pueden hacer" />
      <input id="zonaLat" type="number" step="any" placeholder="Latitud" required />
      <input id="zonaLon" type="number" step="any" placeholder="Longitud" required />
      <input id="zonaDir" placeholder="Dirección" />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="zonaReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
</section>
<section id="transporte" class="section">
  <div class="section__head"><span class="section__tag">Movilidad</span><h2>Transporte público</h2><p>SITP (azul), alimentadores (verde) y estaciones TransMilenio (rojo, sin línea de ruta). Haz clic en un elemento para verlo en el mapa.</p></div>
  <div class="grid grid--1">
    <article class="card">
      <h3>Servicios de transporte</h3>
      <ul id="transList" class="centro-list"></ul>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar servicio</h3>
    <form id="transForm" class="centro-form">
      <input type="hidden" id="transId" />
      <input id="transNombre" placeholder="Nombre del servicio/ruta" required />
      <select id="transCat"><option value="sitp">SITP (azul)</option><option value="alimentador">Alimentador (verde)</option><option value="transmilenio">TransMilenio (rojo)</option></select>
      <input id="transLat" type="number" step="any" placeholder="Latitud" required />
      <input id="transLon" type="number" step="any" placeholder="Longitud" required />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="transReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
</section>
<section id="supermercados" class="section">
  <div class="section__head"><span class="section__tag">Comercio</span><h2>Supermercados</h2><p>Listado de supermercados del barrio. Haz clic en uno para ver su ubicación en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>Supermercados registrados</h3>
      <ul id="supersList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="supersMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar supermercado</h3>
    <form id="superForm" class="centro-form">
      <input type="hidden" id="superId" />
      <input id="superNombre" placeholder="Nombre del supermercado" required />
      <input id="superLat" type="number" step="any" placeholder="Latitud" required />
      <input id="superLon" type="number" step="any" placeholder="Longitud" required />
      <input id="superDir" placeholder="Dirección" />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="superReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
</section>
<section id="centrosmedicos" class="section">
  <div class="section__head"><span class="section__tag">Salud</span><h2>Centros médicos</h2><p>Listado de centros médicos del barrio. Haz clic en uno para ver su ubicación en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>Centros médicos registrados</h3>
      <ul id="medicosList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="medicosMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar centro médico</h3>
    <form id="medicoForm" class="centro-form">
      <input type="hidden" id="medicoId" />
      <input id="medicoNombre" placeholder="Nombre del centro médico" required />
      <input id="medicoLat" type="number" step="any" placeholder="Latitud" required />
      <input id="medicoLon" type="number" step="any" placeholder="Longitud" required />
      <input id="medicoDir" placeholder="Dirección" />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="medicoReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
</section>
<section id="cai" class="section">
  <div class="section__head"><span class="section__tag">Seguridad</span><h2>CAI Castilla</h2><p>Comando de Atención Inmediata del barrio. Haz clic para ver su ubicación en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>CAI registrados</h3>
      <ul id="caiList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="caiMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar CAI</h3>
    <form id="caiForm" class="centro-form">
      <input type="hidden" id="caiId" />
      <input id="caiNombre" placeholder="Nombre del CAI" required />
      <input id="caiDir" placeholder="Dirección" />
      <input id="caiTel" placeholder="Teléfono de emergencia" />
      <input id="caiLat" type="number" step="any" placeholder="Latitud" required />
      <input id="caiLon" type="number" step="any" placeholder="Longitud" required />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="caiReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
</section>
<section id="veterinarias" class="section">
  <div class="section__head"><span class="section__tag">Salud animal</span><h2>Veterinarias</h2><p>Listado de veterinarias del barrio. Haz clic en una para ver su ubicación en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>Veterinarias registradas</h3>
      <ul id="vetsList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="vetsMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar veterinaria</h3>
    <form id="vetForm" class="centro-form">
      <input type="hidden" id="vetId" />
      <input id="vetNombre" placeholder="Nombre de la veterinaria" required />
      <input id="vetHorario" placeholder="Horario de atención" />
      <input id="vetLat" type="number" step="any" placeholder="Latitud" required />
      <input id="vetLon" type="number" step="any" placeholder="Longitud" required />
      <input id="vetDir" placeholder="Dirección" />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="vetReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
</section>
<section id="bibliotecas" class="section">
  <div class="section__head"><span class="section__tag">Cultura</span><h2>Bibliotecas</h2><p>Listado de bibliotecas del barrio. Haz clic en una para ver su ubicación en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>Bibliotecas registradas</h3>
      <ul id="bibliosList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="bibliosMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar biblioteca</h3>
    <form id="biblioForm" class="centro-form">
      <input type="hidden" id="biblioId" />
      <input id="biblioNombre" placeholder="Nombre de la biblioteca" required />
      <input id="biblioHorario" placeholder="Horario de atención" />
      <input id="biblioLat" type="number" step="any" placeholder="Latitud" required />
      <input id="biblioLon" type="number" step="any" placeholder="Longitud" required />
      <input id="biblioDir" placeholder="Dirección" />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="biblioReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
</section>
<section id="vias" class="section">
  <div class="section__head"><span class="section__tag">Infraestructura</span><h2>Vías</h2><p>Listado de vías del barrio por tipo. Haz clic en una para verla en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>Vías registradas</h3>
      <ul id="viasList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="viasMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar vía</h3>
    <form id="viaForm" class="centro-form">
      <input type="hidden" id="viaId" />
      <input id="viaNombre" placeholder="Nombre de la vía" required />
      <select id="viaTipo"><option value="principal">Principal</option><option value="secundaria">Secundaria</option><option value="local">Local</option></select>
      <input id="viaLong" type="number" step="any" placeholder="Longitud (m)" />
      <input id="viaLat" type="number" step="any" placeholder="Latitud" required />
      <input id="viaLon" type="number" step="any" placeholder="Longitud" required />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="viaReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
</section>
<section id="bancos" class="section">
  <div class="section__head"><span class="section__tag">Finanzas</span><h2>Bancos</h2><p>Listado de bancos del barrio. Haz clic en uno para ver su ubicación en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>Bancos registrados</h3>
      <ul id="bancosList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="bancosMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar banco</h3>
    <form id="bancoForm" class="centro-form">
      <input type="hidden" id="bancoId" />
      <input id="bancoNombre" placeholder="Nombre del banco" required />
      <input id="bancoHorario" placeholder="Horario de atención" />
      <input id="bancoLat" type="number" step="any" placeholder="Latitud" required />
      <input id="bancoLon" type="number" step="any" placeholder="Longitud" required />
      <input id="bancoDir" placeholder="Dirección" />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="bancoReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
</section>
<section id="cultos" class="section">
  <div class="section__head"><span class="section__tag">Fe</span><h2>Cultos religiosos</h2><p>Listado de iglesias y cultos religiosos del barrio. Haz clic en uno para ver su ubicación en el mapa.</p></div>
  <div class="grid grid--2">
    <article class="card">
      <h3>Cultos registrados</h3>
      <ul id="cultosList" class="centro-list"></ul>
    </article>
    <article class="card">
      <h3>Ubicación</h3>
      <div id="cultosMap" style="height:320px;border-radius:12px;"></div>
    </article>
  </div>
  <div class="card mt">
    <h3>Agregar / editar culto religioso</h3>
    <form id="cultoForm" class="centro-form">
      <input type="hidden" id="cultoId" />
      <input id="cultoNombre" placeholder="Nombre del culto/iglesia" required />
      <input id="cultoHorario" placeholder="Horario de atención" />
      <input id="cultoLat" type="number" step="any" placeholder="Latitud" required />
      <input id="cultoLon" type="number" step="any" placeholder="Longitud" required />
      <input id="cultoDir" placeholder="Dirección" />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="cultoReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
</section>
<section id="predios" class="section">
  <div class="section__head"><span class="section__tag">Predios</span><h2>Avalúo y datos de predios</h2><p>Listado de predios del barrio con su avalúo y descripción.</p></div>
  <div class="card">
    <h3>Predios registrados</h3>
    <ul id="prediosList" class="centro-list"></ul>
  </div>
  <div class="card mt">
    <h3>Agregar / editar predio</h3>
    <form id="predioForm" class="centro-form">
      <input type="hidden" id="predioId" />
      <input id="predioNombre" placeholder="Nombre del predio" required />
      <select id="predioTipo"><option value="residential">Residencial</option><option value="apartments">Apartamentos</option><option value="commercial">Comercial</option><option value="house">Casa</option><option value="industrial">Industrial</option></select>
      <input id="predioNiveles" placeholder="Niveles" />
      <input id="predioDir" placeholder="Dirección" />
      <input id="predioAvaluo" type="number" step="any" placeholder="Avalúo" />
      <input id="predioDesc" placeholder="Descripción" />
      <div style="display:flex;gap:10px;margin-top:10px">
        <button type="submit" class="btn btn--primary">Guardar</button>
        <button type="button" id="predioReset" class="btn btn--ghost">Limpiar</button>
      </div>
    </form>
  </div>
</section>
<footer class="footer">
  <div class="footer__brand"><span class="nav__logo"><i class="fa-solid fa-location-dot"></i></span><strong>Barrio Castilla</strong><p>Portal de datos comunitarios · © 2026</p></div>
</footer>
`;

window.addEventListener('load', () => {
  initTheme();
  initParticles();
  initCentrosUI();
  loadCentros();
  initRestUI();
  loadRest();
  initZonasUI();
  loadZonas();
  initTransUI();
  loadTrans();
  initSupersUI();
  loadSupers();
  initMedicosUI();
  loadMedicos();
  initCaiUI();
  loadCai();
  initVetsUI();
  loadVets();
  initBibliosUI();
  loadBiblios();
  initViasUI();
  loadVias();
  initBancosUI();
  loadBancos();
  initCultosUI();
  loadCultos();
  initPrediosUI();
  loadPredios();
});
