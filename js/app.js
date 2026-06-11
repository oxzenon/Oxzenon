// ============================================================
//  app.js — Portfolio JavaScript
//  Handles: UI interactions, animations, project rendering,
//           live SOL price, contact form
// ============================================================

'use strict';


// ── Project Data ──────────────────────────────────────────────
// Replace these with your real projects. Each card uses a
// Font Awesome icon (`icon`) instead of an emoji.

const PROJECTS = [
  {
    title:  'Oxzenon Portfolio',
    desc:   'This site — a 3D-animated portfolio built from scratch with HTML, CSS, JavaScript, and Three.js. Mouse-tilt cards, live SOL price, and a fully custom WebGL background.',
    icon:   'fas fa-cube',
    bg:     'linear-gradient(135deg, #1a1040, #0d2a3a)',
    tags:   ['HTML', 'CSS', 'JS', 'Three.js'],
    cat:    'frontend',
    github: '#',
    live:   '#'
  },
  {
    title:  'FigurePro — JAMB English',
    desc:   'A study tool I built for Nigerian JAMB students prepping for the 2026 UTME. Covers 20 figures of speech with a Learn section, three quiz sets (45 questions total), and works offline.',
    icon:   'fas fa-book-open',
    bg:     'linear-gradient(135deg, #2a1040, #1a0a2a)',
    tags:   ['HTML', 'CSS', 'JS', 'Offline'],
    cat:    'frontend',
    github: null,
    live:   'https://englishjamb.netlify.app/'
  },
  {
    title:  'AlphaDegens',
    desc:   'Real-time memecoin intelligence platform for Solana traders — smart wallet tracking, token scanning, whale alerts, rug risk detection, and AI-generated alpha signals in one dashboard.',
    icon:   'fas fa-chart-line',
    bg:     'linear-gradient(135deg, #0d2a1a, #1a2a0d)',
    tags:   ['Solana', 'Memecoins', 'AI', 'Dashboard'],
    cat:    'startup',
    github: null,
    live:   'https://alphadegen.onrender.com/'
  },
  {
    title:  'Examly JAMB AI',
    desc:   'AI-powered JAMB practice platform for Nigerian university aspirants — adaptive question sets, instant explanations, and progress tracking to prep for the UTME smarter.',
    icon:   'fas fa-graduation-cap',
    bg:     'linear-gradient(135deg, #1a0d3a, #0d1a40)',
    tags:   ['AI', 'EdTech', 'JAMB', 'Startup'],
    cat:    'startup',
    github: null,
    live:   'https://examly-jamb-ai.up.railway.app/'
  },
  {
    title:  'Zenon Coffee Shop',
    desc:   'A modern café landing page with menu, about, contact, and a "Reserve Table" flow. Built to practice multi-section layouts, hero copywriting, and clean responsive design.',
    icon:   'fas fa-mug-hot',
    bg:     'linear-gradient(135deg, #2a1a00, #1a0a40)',
    tags:   ['HTML', 'CSS', 'JS', 'Landing Page'],
    cat:    'frontend',
    github: null,
    live:   'https://zenonshop.netlify.app/'
  }
];


// ══════════════════════════════════════════════════════════════
//  INIT — runs after the DOM is ready
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initScrollReveal();
  initSkillBars();
  initFilterButtons();
  initContactForm();
  renderProjects('all');
  fetchSolPrice();

  // Refresh live SOL price every 60 seconds
  setInterval(fetchSolPrice, 60000);
});


// ══════════════════════════════════════════════════════════════
//  NAVBAR — shrink on scroll
// ══════════════════════════════════════════════════════════════

function initNavbar() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')
      .classList.toggle('scrolled', window.scrollY > 60);
  });
}


// ══════════════════════════════════════════════════════════════
//  HAMBURGER MENU — mobile nav toggle
// ══════════════════════════════════════════════════════════════

function initHamburger() {
  const ham      = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!ham.contains(e.target) && !navLinks.contains(e.target)) {
      ham.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}


// ══════════════════════════════════════════════════════════════
//  SCROLL REVEAL — fade-in elements as they enter viewport
// ══════════════════════════════════════════════════════════════

function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function observeNewElements() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}


// ══════════════════════════════════════════════════════════════
//  SKILL BARS — animate width when scrolled into view
// ══════════════════════════════════════════════════════════════

function initSkillBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.w;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.skill-fill').forEach(el => observer.observe(el));
}


// ══════════════════════════════════════════════════════════════
//  PROJECT CARDS — render and filter
// ══════════════════════════════════════════════════════════════

function renderProjects(filter) {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';

  const list = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.cat === filter);

  list.forEach((project, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';

    card.innerHTML = `
      <div class="project-img" style="background: ${project.bg}">
        <i class="${project.icon}" style="font-size:3rem; color:#fff; z-index:1; position:relative"></i>
      </div>
      <div class="project-body">
        <h3>${project.title}</h3>
        <p>${project.desc}</p>
        <div class="project-tags">
          ${project.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          ${project.github ? `
          <a href="${project.github}" target="_blank" rel="noopener">
            <i class="fab fa-github"></i> Code
          </a>` : ''}
          ${project.live ? `
          <a href="${project.live}" target="_blank" rel="noopener">
            <i class="fas fa-external-link-alt"></i> Live
          </a>` : ''}
        </div>
      </div>
    `;

    grid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), 80 + i * 60);
  });
}


function initFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.f);
    });
  });
}


// ══════════════════════════════════════════════════════════════
//  TOAST NOTIFICATION
// ══════════════════════════════════════════════════════════════

function toast(message, type = 'success') {
  const el = document.getElementById('toast');
  const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
  el.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
  el.className = `toast ${type} show`;

  setTimeout(() => el.classList.remove('show'), 3800);
}


// ══════════════════════════════════════════════════════════════
//  LIVE SOL PRICE — from CoinGecko public API
// ══════════════════════════════════════════════════════════════

async function fetchSolPrice() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true'
    );
    if (!res.ok) throw new Error('API error');

    const data   = await res.json();
    const price  = data.solana.usd;
    const change = data.solana.usd_24h_change;

    document.getElementById('solPriceVal').textContent  = '$' + price.toLocaleString();
    document.getElementById('heroSolPrice').textContent = '$' + price.toLocaleString();

    const changeEl = document.getElementById('solChangeVal');
    changeEl.textContent = `${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%`;
    changeEl.className   = 'stat-change ' + (change >= 0 ? 'pos' : 'neg');

  } catch {
    document.getElementById('solPriceVal').textContent  = 'Unavailable';
    document.getElementById('heroSolPrice').textContent = 'Unavailable';
  }
}


// ══════════════════════════════════════════════════════════════
//  CONTACT FORM
// ══════════════════════════════════════════════════════════════

function initContactForm() {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = document.getElementById('cName').value.trim();
    const email   = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMsg').value.trim();

    if (!name || !email || !message) {
      toast('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      toast('Please enter a valid email address.', 'error');
      return;
    }

    const btn = document.getElementById('sendBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled  = true;

    try {
      // Build a URL-encoded body from the form, the way Netlify expects.
      const body = new URLSearchParams(new FormData(form)).toString();

      const res = await fetch('/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });

      if (!res.ok) throw new Error('Network error: ' + res.status);

      toast("Message sent! I'll be in touch soon.", 'success');
      form.reset();

    } catch (err) {
      console.error('Form submit error:', err);
      toast('Something went wrong. Please try again.', 'error');

    } finally {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled  = false;
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
