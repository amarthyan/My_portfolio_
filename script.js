// ─── Theme Toggle ───
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('icon-sun');
const moonIcon = document.getElementById('icon-moon');

function applyTheme(dark) {
  if (dark) {
    html.classList.add('dark');
    localStorage.theme = 'dark';
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    html.classList.remove('dark');
    localStorage.theme = 'light';
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
}

// Init theme
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.theme;
const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
applyTheme(isDark);

themeBtn.addEventListener('click', () => {
  applyTheme(!html.classList.contains('dark'));
});

// ─── Reveal on Scroll ───
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ─── GitHub Projects ───
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  try {
    const res = await fetch('https://api.github.com/users/amarthyan/repos?sort=updated&per_page=6');
    const repos = await res.json();
    const filtered = repos.filter(r => !r.fork);

    if (filtered.length === 0) {
      grid.innerHTML = '<p style="color:var(--muted-foreground)">No projects found.</p>';
      return;
    }

    grid.innerHTML = filtered.map(repo => `
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="card-surface project-card">
        <div>
          <div class="project-header">
            <span class="project-name">${repo.name}</span>
            <span class="project-stars">★ ${repo.stargazers_count}</span>
          </div>
          <p class="project-desc">${repo.description || 'No description provided.'}</p>
        </div>
        <div class="project-lang">
          <span class="lang-dot"></span>
          <span class="lang-name">${repo.language || 'Code'}</span>
        </div>
      </a>
    `).join('');
  } catch {
    grid.innerHTML = '<p style="color:var(--muted-foreground)">Could not load projects.</p>';
  }
}
loadProjects();

// ─── Contact Form ───
const form = document.getElementById('contact-form');
const toast = document.getElementById('toast');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.reset();
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
});
