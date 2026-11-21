/* Gráficos (Chart.js) - responsabilidad única */
Chart.defaults.font.family = '"Space Grotesk", system-ui, sans-serif';
let charts = {};
function chartColors() {
  const s = getComputedStyle(document.documentElement);
  return { text: s.getPropertyValue('--text').trim(), muted: s.getPropertyValue('--muted').trim(),
    accent: s.getPropertyValue('--accent').trim(), a2: s.getPropertyValue('--accent-2').trim(),
    a3: s.getPropertyValue('--accent-3').trim(), a4: s.getPropertyValue('--accent-4').trim(),
    border: s.getPropertyValue('--border').trim() };
}
function baseOpts() {
  const c = chartColors();
  return { responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: c.muted, font: { size: 12 } } } },
    scales: { x: { ticks: { color: c.muted }, grid: { color: c.border } },
              y: { ticks: { color: c.muted }, grid: { color: c.border } } } };
}
function initCharts() {
  const c = chartColors();
  charts.edad = new Chart(document.getElementById('chartEdad'), { type: 'bar',
    data: { labels: ['0-17','18-29','30-44','45-64','65+'],
      datasets: [{ label: 'Habitantes', data: [4420,3180,4610,3760,2450], backgroundColor: [c.a4,c.accent,c.a2,c.a3,'#a78bfa'], borderRadius: 8 }] },
    options: baseOpts() });
  charts.genero = new Chart(document.getElementById('chartGenero'), { type: 'doughnut',
    data: { labels: ['Mujeres','Hombres','Otro/ND'], datasets: [{ data: [9480,8720,220], backgroundColor: [c.accent,c.a4,c.a3], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: c.muted } } }, cutout: '62%' } });
  charts.transporte = new Chart(document.getElementById('chartTransporte'), { type: 'pie',
    data: { labels: ['Bus','Metro','Bicicleta','Auto','A pie'], datasets: [{ data: [38,24,16,12,10], backgroundColor: [c.a4,c.accent,c.a3,c.a2,'#a78bfa'], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: c.muted } } } } });
  charts.comercio = new Chart(document.getElementById('chartComercio'), { type: 'bar',
    data: { labels: ['Almacenes','Gastronomía','Salud','Servicios','Moda','Tecnología','Otros'],
      datasets: [{ label: 'Comercios', data: [94,61,47,38,29,22,21], backgroundColor: c.a4, borderRadius: 8 }] },
    options: { ...baseOpts(), indexAxis: 'y' } });
}
function updateChartsTheme() {
  Object.values(charts).forEach(ch => ch.destroy());
  charts = {};
  initCharts();
}
function updateChartsData(d) {
  if (charts.edad) { charts.edad.data.datasets[0].data = d.demografia.por_edad; charts.edad.update(); }
  if (charts.genero) { charts.genero.data.datasets[0].data = [d.demografia.mujeres, d.demografia.hombres, d.demografia.otro_nd]; charts.genero.update(); }
  if (charts.transporte) { const t = d.transporte; charts.transporte.data.datasets[0].data = [t.bus, t.metro, t.bici, t.auto, t.pie]; charts.transporte.update(); }
  if (charts.comercio) { const c = d.comercio; charts.comercio.data.datasets[0].data = [c.almacenes, c.gastronomia, c.salud, c.servicios, c.moda, c.tecnologia, c.otros]; charts.comercio.update(); }
}
