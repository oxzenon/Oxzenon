// Project entries shown in the /ls projects panel.
// Each one is a real thing Oxzenon shipped while learning.
//
// Fields:
//   glyph   – Font Awesome class (kept off `icon` to avoid generic naming)
//   chrome  – fake "filename" rendered in the card's terminal top-bar
//   bg      – background gradient for the icon plate
//   stack   – tags shown as --flag chips
//   bucket  – filter id: frontend | web3 | startup | practice
//   repo    – GitHub URL or null
//   live    – live URL or null

export const PROJECTS = [
  {
    title:  'Oxzenon Portfolio',
    blurb:  'This site — a terminal-themed React rebuild with Three.js boot 3D, Cmd+K palette, live SOL price, and a fully custom WebGL background.',
    glyph:  'fas fa-cube',
    chrome: 'oxzenon-portfolio.jsx',
    bg:     'linear-gradient(135deg, #1a1040, #0d2a3a)',
    stack:  ['React', 'Vite', 'Tailwind', 'Three.js'],
    bucket: 'frontend',
    repo:   'https://github.com/oxzenon/Oxzenon',
    live:   '#',
  },
  {
    title:  'FigurePro — JAMB English',
    blurb:  'A study tool for Nigerian JAMB students prepping for the 2026 UTME. Covers 20 figures of speech with a Learn section, three quiz sets (45 questions), works offline.',
    glyph:  'fas fa-book-open',
    chrome: 'figurepro.html',
    bg:     'linear-gradient(135deg, #2a1040, #1a0a2a)',
    stack:  ['HTML', 'CSS', 'JS', 'Offline'],
    bucket: 'frontend',
    repo:   null,
    live:   'https://englishjamb.netlify.app/',
  },
  {
    title:  'AlphaDegens',
    blurb:  'Real-time memecoin intelligence platform for Solana traders — smart wallet tracking, token scanning, whale alerts, rug risk detection, and AI-generated alpha signals.',
    glyph:  'fas fa-chart-line',
    chrome: 'alphadegens.ts',
    bg:     'linear-gradient(135deg, #0d2a1a, #1a2a0d)',
    stack:  ['Solana', 'Memecoins', 'AI', 'Dashboard'],
    bucket: 'startup',
    repo:   null,
    live:   'https://alphadegen.onrender.com/',
  },
  {
    title:  'Examly JAMB AI',
    blurb:  'AI-powered JAMB practice platform for Nigerian university aspirants — adaptive question sets, instant explanations, and progress tracking to prep for the UTME smarter.',
    glyph:  'fas fa-graduation-cap',
    chrome: 'examly-ai.py',
    bg:     'linear-gradient(135deg, #1a0d3a, #0d1a40)',
    stack:  ['AI', 'EdTech', 'JAMB', 'Startup'],
    bucket: 'startup',
    repo:   null,
    live:   'https://examly-jamb-ai.up.railway.app/',
  },
  {
    title:  'Zenon Coffee Shop',
    blurb:  'A modern café landing page with menu, about, contact, and a "Reserve Table" flow. Built to practice multi-section layouts, hero copywriting, clean responsive design.',
    glyph:  'fas fa-mug-hot',
    chrome: 'zenon-coffee.html',
    bg:     'linear-gradient(135deg, #2a1a00, #1a0a40)',
    stack:  ['HTML', 'CSS', 'JS', 'Landing'],
    bucket: 'frontend',
    repo:   null,
    live:   'https://zenonshop.netlify.app/',
  },
  {
    title:  'FlowStack — SaaS Landing',
    blurb:  'A SaaS product landing page built to practice modern marketing layouts — hero, feature blocks, and a responsive single-page flow you can ship straight to Vercel.',
    glyph:  'fas fa-layer-group',
    chrome: 'flowstack.jsx',
    bg:     'linear-gradient(135deg, #0d1a40, #1a0d2a)',
    stack:  ['React', 'Tailwind', 'Landing', 'SaaS'],
    bucket: 'practice',
    repo:   null,
    live:   'https://flowstack-saas-practice-landing.vercel.app/',
  },
];

export const BUCKETS = [
  { id: 'all',      label: 'all' },
  { id: 'frontend', label: 'frontend' },
  { id: 'web3',     label: 'web3' },
  { id: 'startup',  label: 'startup' },
  { id: 'practice', label: 'practice' },
];
