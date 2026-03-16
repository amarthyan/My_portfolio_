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

// ─── Contact Form → Google Sheets ───
// After deploying your Apps Script, replace the URL below with your Web App URL
const APPS_SCRIPT_URL ='https://script.google.com/macros/s/AKfycbwjg4w2MIweN_ghD_l9YGtT74-EjNNx0omtv7VT1XITjabmq_92MMEDwlqbQVAFAVlT/exec';

const form = document.getElementById('contact-form');
const toast = document.getElementById('toast');
const submitBtn = form.querySelector('.btn-submit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = form.querySelector('input[type="text"]').value.trim();
  const email   = form.querySelector('input[type="email"]').value.trim();
  const message = form.querySelector('textarea').value.trim();

  // Show loading state
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',   // Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    // no-cors means we can't read the response — assume success if no throw
    showToast('✓ Message sent! I\'ll get back to you soon.', 'success');
    form.reset();
  } catch (err) {
    showToast('✗ Something went wrong. Please try again.', 'error');
  } finally {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
});

function showToast(msg, type) {
  toast.textContent = msg;
  toast.style.background = type === 'error' ? '#dc2626' : '';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
