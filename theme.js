/* Tema (claro/oscuro) - responsabilidad única */
function updateThemeIcon(t) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.innerHTML = t === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
}
function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem('bc-theme') || 'dark';
  root.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('bc-theme', next);
    updateThemeIcon(next);
    if (typeof updateChartsTheme === 'function') updateChartsTheme();
  });
}
