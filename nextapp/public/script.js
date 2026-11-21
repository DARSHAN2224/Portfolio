/* ═══════════════════════════════════════════════════════════
   Darshan-OS 3.0 · script.js  (vanilla JS, no dependencies)
   00 helpers · 01 data · 02 boot · 03 hero + ambient · 04 bloom
   05 dock + launcher · 06 window manager · 07 scroll effects
   08 projects · 09 skills · 10 network · 11 about · 12 resume
   13 contact · 14 copilot · 15 start-up
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

/* ───────── 00 · HELPERS ───────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const rmq = matchMedia('(prefers-reduced-motion: reduce)');
const nmq = matchMedia('(max-width: 820px)');
const reduced = () => rmq.matches;
const isMobile = () => nmq.matches;
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ───────── 01 · DATA (taken from the existing portfolio: résumé, seed.js, Contact page) ───────── */
const ME = {
  name: 'Darshan P', location: 'Bengaluru, India', email: 'pdarshan2224@gmail.com', phone: '+91-6363757497',
  github: 'https://github.com/DARSHAN2224', linkedin: 'https://www.linkedin.com/in/pdarshan2224/',
  leetcode: 'https://leetcode.com/u/darshan2224/', gfg: 'https://geeksforgeeks.org/user/darshan2224/',
  roles: ['AI & Full-Stack Engineer', 'Full Stack Developer', 'Backend Developer', 'LLM & RAG Builder', 'Problem Solver'],
  summary: 'Computer Science and Engineering graduate skilled in full-stack development (MERN and Spring Boot) and AI/ML, with emphasis on backend development, API integration, web applications and AI-driven software solutions.',
  edu: { degree: 'Bachelor of Engineering, Computer Science & Engineering', school: 'Nagarjuna College of Engineering & Technology (NCET), Bengaluru', when: 'Aug 2022 – Jun 2026', cgpa: '8.94 / 10.0' }
};
const EXPERIENCE = [
  { role: 'Full Stack Developer', org: 'MECNTEC Solution Pvt. Ltd., Bengaluru', when: 'Jun 2026 – Present', points: [
    'Developing and maintaining full-stack web applications and AI-integrated features.',
    'Working on WhatsApp Cloud API messaging workflows and LLM-driven response handling for customer communication.',
    'Building responsive user interfaces, REST APIs and database-driven modules.',
    'Integrating frontend, backend and AI capabilities with clean architecture; contributing to debugging, code reviews and API testing.'] },
  { role: 'Backend Developer Intern', org: 'Nagarjuna Tech Solutions, Bengaluru', when: 'Jan 2025 – Apr 2025', points: [
    'Developed 30+ RESTful APIs using Node.js and MongoDB for core application workflows.',
    'Built modular backend services for authentication, restaurant operations, menu management and order lifecycle processing.',
    'Optimised database queries to improve endpoint response time and backend performance.',
    'Created test data and API test scripts in Postman, reducing integration defects by 30%.'] }
];
const STAGE_NOTE = {
  Software: 'Software project, listed on the résumé.', Integrated: 'Integrated with the college application.', Demo: 'Demonstrated during college volunteer campaigns; not a campus-wide production system.',
  Prototype: 'A prototype, not a deployed product.', Proposal: 'A proposal, not an implemented service.', Concept: 'Concept stage. Details are still being documented.'
};
const PROJECTS = [
  { id: 'whatsapp', title: 'Real-Estate Conversational AI Platform (WhatsApp)', stage: 'Software', kind: 'Agentic AI', ac: 'var(--lime)', stat: 'RAG', statLabel: 'on WhatsApp Cloud API',
    stack: ['Node.js', 'Redis', 'PostgreSQL', 'LangChain', 'RAG', 'WhatsApp Cloud API', 'WebSocket'], github: '',
    blurb: 'An agentic WhatsApp assistant for real-estate customer conversations, with retrieval-augmented answers and several LLM providers behind it.',
    points: ['Agentic WhatsApp AI platform built on the WhatsApp Cloud API.', 'Multi-provider LLM failover across DeepSeek, GPT-4o-mini and Gemini.', 'Dual-stream RAG engine; résumé figure: fact-retrieval latency cut by 50% (about 1.8 s).', 'Distributed messaging pipeline using Redis locks and single-flight request coalescing.', 'Local intent classification, with 19 automated test suites covering prompt-injection defence and multilingual handling (résumé figure: 100% pass rate).', 'Résumé figure: designed for 100k+ concurrent users.'],
    keys: ['whatsapp', 'real estate', 'real-estate', 'retrieval', 'langchain', 'redis'] },
  { id: 'voice', title: 'Voice Converter: Real-Time AI Translation', stage: 'Software', kind: 'Real-time AI', ac: 'var(--lime)', stat: '10+', statLabel: 'languages',
    stack: ['Node.js', 'React.js', 'WebSocket', 'LangChain', 'NLP'], github: 'https://github.com/DARSHAN2224/voice-converter',
    blurb: 'Browser-based speech transcription and multilingual translation, streamed in audio chunks over WebSockets to keep conversion latency low.',
    points: ['Audio is processed in chunks over WebSocket to reduce conversion latency.', 'LangChain STT and TTS models behind a browser-based voice converter.', 'Supports 10+ languages.'],
    keys: ['voice', 'translat', 'speech', 'whisper', 'websocket'] },
  { id: 'food', title: 'Multi-Role Food Ordering System', stage: 'Software', kind: 'Full-stack', ac: 'var(--coral)', stat: '3', statLabel: 'roles, one system',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'REST APIs'], github: 'https://github.com/DARSHAN2224/food-ordering-system',
    blurb: 'A three-tier, role-based platform for Admin, Seller and User, covering the whole order lifecycle with JWT authentication and a live analytics dashboard.',
    points: ['Role-based access control for Admin / Seller / User, secured with JWT.', 'End-to-end order lifecycle: placement, tracking and fulfilment.', 'Real-time analytics dashboard for order trends.', 'MongoDB query optimisation for read performance as order volume grew.'],
    keys: ['food', 'order', 'rbac', 'restaurant'] },
  { id: 'health', title: 'HealthCare: AI-Powered Mental Health Platform', stage: 'Software', kind: 'Full-stack + AI', ac: 'var(--violet)', stat: 'JWT', statLabel: 'secured, role-based access',
    stack: ['Node.js', 'React', 'Python', 'Flask', 'MongoDB', 'NLP', 'Transformers', 'JWT'], github: 'https://github.com/DARSHAN2224/healthcare-ai',
    blurb: 'A mental-health platform with an AI chatbot, emotion analysis and personalised wellness support.',
    points: ['Full-stack platform featuring an AI chatbot, emotion analysis and personalised wellness support.', 'NLP and Transformer-based models for emotion detection and context-aware conversations.', 'JWT-based authentication and REST APIs for secure, role-based access.'],
    keys: ['health', 'mental', 'emotion', 'chatbot'] },
  { id: 'aerlogisim', title: 'Aerlogisim', stage: 'Award', kind: 'Final-year project', ac: '#e2c46b', stat: '1st', statLabel: 'Best Major Project',
    stack: [], github: '', award: 'Best Major Project Award, 1st Prize, among final-year engineering teams.', blurb: 'The project behind the Best Major Project Award.', points: [], keys: ['aerlogisim', 'best major'] },
  { id: 'collegefood', title: 'College Food Management System', stage: 'Integrated', kind: 'Campus systems', ac: '#ff806b', stat: '1', statLabel: 'canteen and stores, one system',
    stack: [], github: '', blurb: 'One system for the college canteen and food stores, integrated with the college application.', points: [], keys: ['college food', 'canteen'] },
  { id: 'servicenow', title: 'ServiceNow College Administration Workflow', stage: 'Demo', kind: 'Workflow automation', ac: '#6f8bff', stat: 'SaaS', statLabel: 'on ServiceNow',
    stack: ['ServiceNow'], github: '', blurb: 'A ServiceNow application that automates college paperwork between students, faculty and administration, shown at college volunteer campaigns to promote ServiceNow.', points: [], keys: ['servicenow', 'workflow', 'campaign'] },
  { id: 'ev', title: 'E-card Digital Driving Licence for Electric Vehicles', stage: 'Concept', kind: 'Mobility', ac: '#8fd3ff', stat: 'Prize', statLabel: 'inter-college level',
    stack: [], github: '', award: 'Won a prize at inter-college level.', blurb: 'A driving licence represented as an electronic card for electric vehicles.', points: [], keys: ['e-card', 'licence', 'license', 'driving', 'electric vehicle'] },
  { id: 'chalk', title: 'Autonomous Chalk-Dust Cleaner', stage: 'Prototype', kind: 'Embedded & automation', ac: '#ff806b', stat: '0', statLabel: 'chalk dust is the goal',
    stack: [], github: '', blurb: 'A prototype that cleans the board automatically to reduce how much chalk dust students and teachers breathe in.', points: [], keys: ['chalk', 'duster', 'dust'] },
  { id: 'ewaste', title: 'E-waste Logistics and Rare-Element Recovery', stage: 'Proposal', kind: 'Sustainability', ac: '#b9f36b', stat: 'Top 10', statLabel: 'of 200+ ideas',
    stack: [], github: '', award: 'Top 10 of 200+ ideas at a three-day hackathon.', blurb: 'A logistics approach for reusing and recycling e-waste and recovering rare elements, born from a discussion with the Head of Department about an NGO’s e-waste work.', points: [], keys: ['e-waste', 'ewaste', 'rare element', 'hackathon'] },
  { id: 'drone', title: 'Virtual Drone System for Farmers', stage: 'Concept', kind: 'Agriculture', ac: '#a78bfa', stat: 'Farm', statLabel: 'monitoring',
    stack: [], github: '', blurb: 'A virtual drone system to support farmers’ monitoring needs.', points: [], keys: ['drone', 'farmer'] }
];
const CATS = [
  { id: 'lang', name: 'Languages', c: '#b9f36b', items: ['JavaScript', 'Python', 'Java', 'C++'] },
  { id: 'back', name: 'Backend & Systems', c: '#6f8bff', items: ['Node.js', 'Express.js', 'Spring Boot', 'REST APIs', 'JWT', 'WebSocket', 'Redis', 'Flask'] },
  { id: 'front', name: 'Frontend', c: '#ff806b', items: ['React.js', 'HTML', 'CSS', 'Tailwind CSS', 'EJS'] },
  { id: 'db', name: 'Databases', c: '#8fd3ff', items: ['MongoDB', 'MySQL', 'PostgreSQL'] },
  { id: 'ai', name: 'AI & ML', c: '#a78bfa', items: ['LLMs', 'RAG', 'LangChain', 'NLP', 'Transformers', 'Pandas', 'NumPy'] },
  { id: 'tools', name: 'Tools & Platforms', c: '#f2f0e9', items: ['Git', 'GitHub Copilot', 'Docker', 'Google Cloud', 'ServiceNow', 'Postman', 'VS Code'] },
  { id: 'core', name: 'Core concepts', c: '#e2c46b', items: ['OOPs', 'MVC', 'Microservices', 'Unit Testing', 'Networking'] }
];
const WORK = [
  { name: 'WhatsApp AI Platform', type: 'Project', uses: ['Node.js', 'Redis', 'PostgreSQL', 'LangChain', 'RAG', 'WebSocket', 'LLMs'] },
  { name: 'Voice Converter', type: 'Project', uses: ['Node.js', 'React.js', 'WebSocket', 'LangChain', 'NLP'] },
  { name: 'Food Ordering System', type: 'Project', uses: ['Node.js', 'Express.js', 'MongoDB', 'React.js', 'JWT', 'REST APIs'] },
  { name: 'HealthCare AI Platform', type: 'Project', uses: ['Node.js', 'React.js', 'Python', 'Flask', 'MongoDB', 'NLP', 'Transformers', 'JWT', 'REST APIs'] },
  { name: 'ServiceNow Workflow', type: 'Project', uses: ['ServiceNow'] },
  { name: 'MECNTEC Solution', type: 'Job', uses: ['React.js', 'Node.js', 'REST APIs', 'LLMs'] },
  { name: 'Nagarjuna Tech Solutions', type: 'Internship', uses: ['Node.js', 'MongoDB', 'REST APIs', 'Postman'] }
];
const NOTES = {
  'Node.js': 'Behind the WhatsApp AI platform, the food ordering system and the 30+ internship APIs.',
  'MongoDB': 'The data layer for the food ordering and healthcare projects, and the internship APIs.',
  'Postman': 'API test scripts and test data that reduced integration defects by 30%.',
  'Redis': 'Locks and single-flight request coalescing in the WhatsApp messaging pipeline.',
  'PostgreSQL': 'Stores the WhatsApp AI platform’s data.',
  'LangChain': 'Orchestrates the WhatsApp AI platform and the Voice Converter.',
  'RAG': 'A dual-stream retrieval engine in the WhatsApp AI platform.',
  'WebSocket': 'Real-time audio in Voice Converter and messaging in the WhatsApp platform.',
  'React.js': 'The front end of the food ordering, voice and healthcare projects.',
  'JWT': 'Authentication for the food ordering and healthcare platforms.',
  'REST APIs': 'Over 30 built in one internship, plus the APIs behind every full-stack project.',
  'Transformers': 'Emotion detection and context-aware conversation in HealthCare.',
  'NLP': 'Emotion analysis in HealthCare and language handling in Voice Converter.',
  'ServiceNow': 'CSA and CAD certified, and the platform of the college workflow application.',
  'Express.js': 'The API layer of the food ordering system.',
  'Flask': 'Serves the AI models behind the HealthCare platform.'
};
const AWARDS = [
  { t: 'Best Major Project Award (1st Prize)', s: 'Aerlogisim, among final-year engineering teams' },
  { t: 'Inter-college prize', s: 'E-card digital driving licence for electric vehicles' },
  { t: 'Top 10 of 200+ ideas', s: 'E-waste logistics proposal, three-day hackathon' },
  { t: 'Research paper on AI chatbots', s: 'Scopus-indexed, ICKECS 2025' },
  { t: '250+ DSA problems solved', s: 'LeetCode' },
  { t: 'Red Hat Ambassador', s: 'Campus representative for open source, NCET' }
];
const CERTS = [
  { t: 'ServiceNow Certified System Administrator (CSA)', s: 'ServiceNow' },
  { t: 'ServiceNow Certified Application Developer (CAD)', s: 'ServiceNow' },
  { t: 'Data Structures & Algorithms', s: 'GeeksforGeeks' },
  { t: 'Python Programming Certification', s: 'Red Hat' },
  { t: 'Oracle Certified Foundations Associate', s: 'Oracle' }
];
const TIMELINE = [
  { when: 'Aug 2022', t: 'Started B.E. in Computer Science & Engineering', d: 'Nagarjuna College of Engineering & Technology, Bengaluru.' },
  { when: 'College years', t: 'Built across disciplines', d: 'Embedded and automation ideas with practical or social impact: an EV e-card licence, a chalk-dust cleaner prototype, an e-waste proposal, a farmer drone concept, college food management and a ServiceNow workflow app.' },
  { when: 'Jan – Apr 2025', t: 'Backend Developer Intern, Nagarjuna Tech Solutions', d: 'Built 30+ REST APIs with Node.js and MongoDB, with services for authentication, menus and the order lifecycle.' },
  { when: '2025', t: 'Published research on AI chatbots', d: 'A Scopus-indexed paper presented at ICKECS 2025.' },
  { when: 'Jun 2026', t: 'Graduated, then joined MECNTEC Solution', d: 'B.E. completed (CGPA 8.94 / 10). Now a Full Stack Developer on WhatsApp Cloud API workflows and LLM-driven features.' },
  { when: 'Dec 2026', t: 'Internship period ends 8 December', d: 'A full-time role follows.' }
];
const LINKS = [
  { id: 'github', label: 'GitHub', g: 'GH', c: '#f2f0e9', url: ME.github, handle: 'github.com/DARSHAN2224', d: 'Source for the food ordering, voice converter and healthcare projects.', act: 'Open GitHub' },
  { id: 'linkedin', label: 'LinkedIn', g: 'in', c: '#6f8bff', url: ME.linkedin, handle: 'linkedin.com/in/pdarshan2224', d: 'Experience, certifications and the best place for a professional message.', act: 'Open LinkedIn' },
  { id: 'email', label: 'Email', g: '@', c: '#ff806b', url: 'mailto:' + ME.email, handle: ME.email, d: 'The most direct way to reach me.', act: 'Write an email', copy: ME.email },
  { id: 'leetcode', label: 'LeetCode', g: 'LC', c: '#b9f36b', url: ME.leetcode, handle: 'leetcode.com/u/darshan2224', d: '250+ DSA problems solved.', act: 'Open LeetCode' },
  { id: 'gfg', label: 'GeeksforGeeks', g: 'Gf', c: '#a78bfa', url: ME.gfg, handle: 'geeksforgeeks.org/user/darshan2224', d: 'Algorithm practice, plus a Data Structures & Algorithms certification.', act: 'Open GeeksforGeeks' },
  { id: 'home', label: 'Bengaluru', g: 'BLR', c: '#e2c46b', handle: 'Karnataka, India', d: 'Based in Bengaluru, working at MECNTEC Solution.' }
];

/* ───────── 02 · BOOT ───────── */
function runBoot() {
  const fill = $('#bootFill'), log = $('#bootLog'), boot = $('#boot');
  const msgs = ['Mounting workspace', 'Loading projects', 'Linking technology map', 'Waking the Copilot', 'Welcome'];
  const dur = reduced() ? 500 : 2700; let done = false; const t0 = performance.now();
  const finish = () => {
    if (done) return; done = true;
    document.body.dataset.state = 'ready'; boot.classList.add('out');
    setTimeout(() => boot.remove(), 1000);
  };
  const tick = now => {
    if (done) return;
    const t = clamp((now - t0) / dur);
    const p = t < .55 ? t * 1.2 : t < .8 ? .66 + (t - .55) * .5 : .785 + (t - .8) * 1.07;   // a believable stall in the middle
    fill.style.transform = `scaleX(${clamp(p)})`;
    log.textContent = msgs[Math.min(msgs.length - 1, Math.floor(clamp(p) * msgs.length))] + (p < 1 ? '…' : '');
    t < 1 ? requestAnimationFrame(tick) : setTimeout(finish, 250);
  };
  requestAnimationFrame(tick);
  $('#bootSkip').addEventListener('click', finish);
  addEventListener('keydown', function k(e) { if (!done && (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ')) { finish(); removeEventListener('keydown', k); } });
}

/* ───────── 03 · HERO + AMBIENT ───────── */
function initHero() {
  // letters: each one reacts to the cursor by changing weight, a quiet, purposeful bit of variable-font play
  const name = $('#name'); const letters = [...'Darshan'.toLowerCase()];
  name.innerHTML = letters.map((c, i) => `<span class="ch" aria-hidden="true"><span style="--i:${i}">${c}</span></span>`).join('');
  const spans = $$('.ch>span', name); const st = spans.map(() => ({ w: 560, t: 560 }));
  let centres = [], mouse = null, raf = 0;
  const measure = () => { centres = spans.map(s => { const r = s.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.height }; }); };
  const loop = () => {
    let moving = false;
    spans.forEach((s, i) => {
      const c = centres[i]; let target = 560;
      if (mouse && c) { const d = Math.hypot(mouse.x - c.x, (mouse.y - c.y) * .6) / (c.h * 1.1); target = lerp(800, 400, clamp(d)); }
      const o = st[i]; o.w = lerp(o.w, target, .14);
      if (Math.abs(o.w - target) > .5) moving = true;
      s.style.setProperty('--w', o.w.toFixed(0));
    });
    raf = moving ? requestAnimationFrame(loop) : 0;
  };
  if (!reduced() && !isMobile()) {
    setTimeout(measure, 2200); addEventListener('resize', measure);
    $('#home').addEventListener('pointermove', e => { mouse = { x: e.clientX, y: e.clientY }; if (!raf) raf = requestAnimationFrame(loop); });
    $('#home').addEventListener('pointerleave', () => { mouse = null; if (!raf) raf = requestAnimationFrame(loop); });
  }

  // rotating roles: the old line slides up out of its mask, the next one rises in
  const roleEl = $('#role'); let ri = 0;
  roleEl.textContent = ME.roles[0];
  setInterval(async () => {
    if (document.hidden) return;
    ri = (ri + 1) % ME.roles.length;
    if (reduced()) { roleEl.textContent = ME.roles[ri]; return; }
    const o = { duration: 380, easing: 'cubic-bezier(.5,0,.75,0)' };
    await roleEl.animate([{ translate: '0 0' }, { translate: '0 -120%' }], o).finished;
    roleEl.textContent = ME.roles[ri];
    roleEl.animate([{ translate: '0 120%' }, { translate: '0 0' }], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' });
  }, 2800);

  // clock + session
  const clock = $('#mbClock'), sess = $('#sysSession'); const s0 = Date.now();
  const tickClock = () => {
    const now = new Date();
    clock.textContent = 'Bengaluru ' + now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
    const s = Math.floor((Date.now() - s0) / 1000); sess.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };
  tickClock(); setInterval(tickClock, 1000);

  // cursor-responsive ambient light
  const d = $('#desktop'); let pr = 0, px = 0, py = 0;
  addEventListener('pointermove', e => {
    px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5;
    if (!pr) pr = requestAnimationFrame(() => { pr = 0; d.style.setProperty('--mx', px.toFixed(3)); d.style.setProperty('--my', py.toFixed(3)); });
  }, { passive: true });
  // mobile: scroll position drives the bloom and the name
  d.addEventListener('scroll', () => d.style.setProperty('--sy', d.scrollTop), { passive: true });
}

/* ───────── 04 · BLOOM (phyllotaxis flower, the desktop's central visual) ───────── */
const bloomState = { spin: 0, vel: .00035, windows: 0, scroll: 0 };
function initBloom() {
  const c = $('#bloom'), g = c.getContext('2d');
  const N = 560, GA = Math.PI * (3 - Math.sqrt(5)), cols = ['#b9f36b', '#4169ff', '#a78bfa', '#ff806b'];
  let W = 0, H = 0, rect = null, mx = -1e4, my = -1e4, last = 0, f = 0;
  const size = () => { const r = c.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; c.width = W * dpr; c.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); rect = r; };
  size(); addEventListener('resize', size);
  addEventListener('pointermove', e => { if (!rect) return; rect = c.getBoundingClientRect(); mx = e.clientX - rect.left; my = e.clientY - rect.top; }, { passive: true });
  addEventListener('pointerleave', () => { mx = my = -1e4; });
  $('#home').addEventListener('wheel', e => { bloomState.vel = clamp(bloomState.vel + e.deltaY * 0.000018, -.01, .01); }, { passive: true });
  const draw = now => {
    requestAnimationFrame(draw);
    if (document.hidden) return;
    if (bloomState.windows && (++f % 3)) return;                 // idle at ~20fps while windows cover the bloom
    const dt = Math.min(48, now - last || 16); last = now;
    if (!reduced()) { bloomState.spin += bloomState.vel * dt; bloomState.vel = lerp(bloomState.vel, .00035, .02); }
    g.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * .47;
    for (let i = 0; i < N; i++) {
      const k = i / N, r = Math.sqrt(k) * R, a = i * GA + bloomState.spin;
      let x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy);
      if (d < 120) { const p = Math.pow(1 - d / 120, 2) * 38; x += dx / d * p; y += dy / d * p; }
      g.globalAlpha = .35 + k * .6;
      g.fillStyle = k < .03 ? '#f2f0e9' : cols[Math.min(3, Math.floor(k * 4.2))];
      g.beginPath(); g.arc(x, y, 1.1 + k * R * .026, 0, 6.2832); g.fill();
    }
  };
  requestAnimationFrame(draw);
}

/* ───────── 05 · DOCK + LAUNCHER ───────── */
const ICONS = {
  home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
  projects: '<path d="M3 8l9-5 9 5-9 5z"/><path d="M3 13l9 5 9-5"/>',
  skills: '<path d="M5 17l5-8 4 4 5-8"/><circle cx="5" cy="17" r="1.6"/><circle cx="10" cy="9" r="1.6"/><circle cx="14" cy="13" r="1.6"/><circle cx="19" cy="5" r="1.6"/>',
  network: '<circle cx="12" cy="12" r="2.2"/><circle cx="5" cy="6" r="1.8"/><circle cx="19" cy="7" r="1.8"/><circle cx="6" cy="19" r="1.8"/><circle cx="18" cy="18" r="1.8"/><path d="M10.4 10.6L6.2 7M13.8 10.8l3.9-2.6M10.6 13.6L7 17.6M13.6 13.8l3 2.8"/>',
  about: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/>',
  resume: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  contact: '<path d="M3 6h18v12H3z"/><path d="M3 7l9 6 9-6"/>',
  copilot: '<path d="M5 8l4 4-4 4M12 17h7"/>'
};
const APPS = [
  { id: 'home', name: 'Home', tile: '#f2f0e9', fg: '#111827' },
  { id: 'projects', name: 'Projects', tile: '#ff806b', fg: '#2a0f0a' },
  { id: 'skills', name: 'Skills', tile: '#a78bfa', fg: '#1a1040' },
  { id: 'network', name: 'Network', tile: '#4169ff', fg: '#f2f0e9' },
  { id: 'about', name: 'About', tile: '#b9f36b', fg: '#1b2a05' },
  { id: 'resume', name: 'Resume', tile: '#e9e4d0', fg: '#3a3220' },
  { id: 'contact', name: 'Contact', tile: 'linear-gradient(135deg,#ff806b,#a78bfa)', fg: '#fff' },
  { id: 'copilot', name: 'Copilot', tile: '#050807', fg: '#3dff9a' }
];
const iconHTML = a => `<span class="app-icon" style="--tile:${a.tile};--fg:${a.fg}${a.id === 'copilot' ? ';box-shadow:inset 0 0 0 1.5px #3dff9a55,0 6px 14px -6px rgba(0,0,0,.6)' : ''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[a.id]}</svg></span>`;

function initDock() {
  const dock = $('#dock'), launcher = $('#launcher');
  dock.innerHTML = APPS.map(a => (a.id === 'copilot' ? '<i class="dock-sep"></i>' : '') +
    `<button class="dock-item" type="button" data-open="${a.id}" data-app="${a.id}" aria-label="${a.name}"><span class="tip">${a.name}</span>${iconHTML(a)}<i class="pip"></i></button>`).join('');
  launcher.innerHTML = APPS.filter(a => a.id !== 'home').map(a =>
    `<button class="launch-item" type="button" data-open="${a.id}" data-app="${a.id}">${iconHTML(a)}<span>${a.name}</span></button>`).join('');
  // magnetic magnification with a lerped spring
  const items = $$('.dock-item', dock); const cur = items.map(() => 1), tgt = items.map(() => 1); let mx = null, raf = 0; const BASE = 52;
  const step = () => {
    let busy = false;
    items.forEach((it, i) => {
      cur[i] = lerp(cur[i], tgt[i], .22); if (Math.abs(cur[i] - tgt[i]) > .003) busy = true;
      it.style.setProperty('--w', (BASE * cur[i]).toFixed(1) + 'px');
    });
    raf = busy ? requestAnimationFrame(step) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
  dock.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || reduced()) return;
    items.forEach((it, i) => { const r = it.getBoundingClientRect(); const d = Math.abs(e.clientX - (r.left + r.width / 2)); tgt[i] = 1 + .75 * Math.exp(-Math.pow(d / 75, 2)); });
    kick();
  });
  dock.addEventListener('pointerleave', () => { tgt.fill(1); kick(); });
}
const appButton = id => $(`.dock-item[data-app="${id}"]`) && getComputedStyle($('#dock')).display !== 'none' ? $(`.dock-item[data-app="${id}"]`) : $(`.launch-item[data-app="${id}"]`);

/* ───────── 06 · WINDOW MANAGER ───────── */
const wins = new Map(); let zTop = 20, focusedId = null;
const SIZES = { projects: [1060, 740], skills: [1000, 680], network: [900, 640], about: [1080, 760], resume: [800, 720], contact: [940, 640], copilot: [820, 560] };
const META = {
  projects: ['Projects', PROJECTS.length + ' projects'], skills: ['Skills', CATS.reduce((n, c) => n + c.items.length, 0) + ' technologies'], network: ['Network', '5 profiles'], about: ['About', 'Darshan P'],
  resume: ['Resume', 'Darshan_P_resume.pdf'], contact: ['Contact', 'say hello'], copilot: ['Copilot', 'darshan-os kernel']
};
const SPRING = 'cubic-bezier(.2,1.15,.3,1)';
const flight = (node, frames, opts) => reduced() ? { finished: Promise.resolve() } : node.animate(frames, { fill: 'both', ...opts });

function updateChrome() {
  $$('[data-app]').forEach(b => { const id = b.dataset.app; b.classList.toggle('open', wins.has(id)); b.classList.toggle('active', id === focusedId || (id === 'home' && !wins.size)); });
  $('#mbApp').textContent = focusedId ? META[focusedId][0] : 'Desktop';
  bloomState.windows = [...wins.values()].filter(w => !w.min).length; document.body.classList.toggle('has-win', bloomState.windows > 0);
}
function focusWin(id) {
  const w = wins.get(id); if (!w) return;
  wins.forEach((o, k) => o.el.classList.toggle('focus', k === id));
  w.el.style.zIndex = ++zTop; focusedId = id; updateChrome();
}
function place(w, id) {
  const vw = innerWidth, vh = innerHeight, [bw, bh] = SIZES[id];
  const W = Math.min(bw, vw - 40), H = Math.min(bh, vh - 36 - 104 - 8), n = wins.size % 5;
  w.style.width = W + 'px'; w.style.height = H + 'px';
  w.style.left = clamp((vw - W) / 2 + n * 30 - 60, 8, vw - W - 8) + 'px';
  w.style.top = clamp(48 + n * 26, 44, Math.max(44, vh - H - 100)) + 'px';
}
function openApp(id) {
  if (id === 'home') { [...wins.keys()].forEach(closeApp); focusedId = null; updateChrome(); return; }
  const ex = wins.get(id);
  if (ex) { if (ex.min) restoreApp(id); focusWin(id); return; }
  const tpl = $('#tpl-' + id); if (!tpl) return;
  const [title, sub] = META[id];
  const w = el(`<section class="win win--${id}" role="dialog" aria-label="${title}">
    <header class="win-bar">
      <button class="win-back" type="button" aria-label="Back to home"><svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L2 8l6 6"/></svg>Home</button>
      <div class="lights"><button class="lt lt-close" type="button" aria-label="Close ${title}" title="Close"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.2 2.2l5.6 5.6M7.8 2.2L2.2 7.8"/></svg></button><button class="lt lt-min" type="button" aria-label="Minimise ${title}" title="Minimise"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5h6"/></svg></button><button class="lt lt-max" type="button" aria-label="Full screen ${title}" title="Full screen"><svg viewBox="0 0 10 10" aria-hidden="true"><path class="ic-exp" d="M5.8 2H8v2.2M4.2 8H2V5.8M8 2L5.6 4.4M2 8l2.4-2.4"/><path class="ic-res" d="M8 4.2H5.8V2M2 5.8h2.2V8M5.8 4.2L8.2 1.8M4.2 5.8L1.8 8.2"/></svg></button></div>
      <h2 class="win-title">${title}</h2><span class="win-sub">${esc(sub)}</span>
    </header>
    <div class="win-body" tabindex="0"></div>
    <button class="win-home" type="button" aria-label="Close and go home"></button>
  </section>`);
  const body = $('.win-body', w); body.appendChild(tpl.content.cloneNode(true));
  $('#windows').appendChild(w); place(w, id);
  const rec = { el: w, body, min: false, max: false, prev: null, cleanup: [] }; wins.set(id, rec);
  INIT[id]?.(body, rec);
  rec.cleanup.push(scrollFx(body, w));
  focusWin(id);
  // spatial open: grow out of the dock / launcher icon
  const src = appButton(id)?.getBoundingClientRect(), r = w.getBoundingClientRect();
  if (src) {
    const dx = src.left + src.width / 2 - (r.left + r.width / 2), dy = src.top + src.height / 2 - (r.top + r.height / 2);
    flight(w, [{ transform: `translate(${dx}px,${dy}px) scale(.1)`, opacity: 0, borderRadius: '40px', offset: 0 }, { opacity: 1, offset: .3 }, { transform: 'none', opacity: 1, borderRadius: isMobile() ? '0px' : '18px', offset: 1 }], { duration: 540, easing: SPRING });
  }
  w.addEventListener('pointerdown', () => focusWin(id), true);
  $('.lt-close', w).onclick = $('.win-back', w).onclick = $('.win-home', w).onclick = () => closeApp(id);
  $('.lt-min', w).onclick = () => minimiseApp(id);
  $('.lt-max', w).onclick = () => zoomApp(id);
  dragify(w, $('.win-bar', w), rec, id);
  if (!isMobile() && id !== 'copilot') setTimeout(() => body.focus({ preventScroll: true }), 600);
}
function toIcon(w, id, reverse) {
  const src = appButton(id)?.getBoundingClientRect(), r = w.getBoundingClientRect();
  if (!src) return [{ opacity: 1 }, { opacity: 0 }];
  const t = `translate(${src.left + src.width / 2 - (r.left + r.width / 2)}px,${src.top + src.height / 2 - (r.top + r.height / 2)}px) scale(.08)`;
  return reverse ? [{ transform: t, opacity: 0 }, { transform: 'none', opacity: 1 }] : [{ transform: 'none', opacity: 1 }, { transform: t, opacity: 0 }];
}
async function closeApp(id) {
  const rec = wins.get(id); if (!rec) return;
  wins.delete(id); rec.cleanup.forEach(f => f());
  if (focusedId === id) { focusedId = null; const top = [...wins.entries()].filter(([, o]) => !o.min).pop(); if (top) focusWin(top[0]); }
  updateChrome();
  if (isMobile()) await flight(rec.el, [{ transform: 'none' }, { transform: 'translateY(100%)' }], { duration: 380, easing: 'cubic-bezier(.5,0,.75,0)' }).finished;
  else await flight(rec.el, toIcon(rec.el, id), { duration: 380, easing: 'cubic-bezier(.5,0,.75,0)' }).finished;
  rec.el.remove();
}
async function minimiseApp(id) {
  const rec = wins.get(id); if (!rec || rec.min) return; rec.min = true;
  await flight(rec.el, toIcon(rec.el, id), { duration: 420, easing: 'cubic-bezier(.5,0,.75,0)' }).finished;
  rec.el.hidden = true; rec.el.getAnimations().forEach(a => a.cancel());
  const top = [...wins.entries()].filter(([, o]) => !o.min).pop(); focusedId = top ? top[0] : null; if (top) focusWin(top[0]); updateChrome();
}
function restoreApp(id) {
  const rec = wins.get(id); if (!rec) return; rec.min = false; rec.el.hidden = false;
  flight(rec.el, toIcon(rec.el, id, true), { duration: 520, easing: SPRING }); focusWin(id);
}
function zoomApp(id) {
  const rec = wins.get(id); if (!rec || isMobile()) return; const w = rec.el;
  w.classList.add('geo'); setTimeout(() => w.classList.remove('geo'), 500);
  if (!rec.max) { rec.prev = [w.style.left, w.style.top, w.style.width, w.style.height]; Object.assign(w.style, { left: '12px', top: '44px', width: innerWidth - 24 + 'px', height: innerHeight - 44 - 100 + 'px' }); }
  else Object.assign(w.style, { left: rec.prev[0], top: rec.prev[1], width: rec.prev[2], height: rec.prev[3] });
  rec.max = !rec.max; w.classList.toggle('is-max', rec.max);
}
function dragify(w, handle, rec, id) {
  handle.addEventListener('pointerdown', e => {
    if (isMobile() || rec.max || e.target.closest('button')) return;
    const sx = e.clientX, sy = e.clientY, ox = w.offsetLeft, oy = w.offsetTop;
    handle.setPointerCapture(e.pointerId); w.classList.add('dragging');
    const mv = ev => {
      w.style.left = clamp(ox + ev.clientX - sx, 120 - w.offsetWidth, innerWidth - 120) + 'px';
      w.style.top = clamp(oy + ev.clientY - sy, 36, innerHeight - 60) + 'px';
    };
    const up = () => { w.classList.remove('dragging'); handle.removeEventListener('pointermove', mv); handle.removeEventListener('pointerup', up); handle.removeEventListener('pointercancel', up); };
    handle.addEventListener('pointermove', mv); handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
  });
  handle.addEventListener('dblclick', e => { if (!e.target.closest('button')) zoomApp(id); });
}

/* ───────── 07 · SCROLL EFFECTS (scoped to each window's own scroller) ───────── */
function scrollFx(body, win) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.dataset.count) countUp(e.target);
  }), { root: body, threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-stagger]', body).forEach(p => [...p.children].forEach((c, i) => c.style.setProperty('--d', i * (+p.dataset.stagger || 70) + 'ms')));
  $$('[data-words]', body).forEach(p => { p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(' '); });
  $$('[data-reveal],[data-count]', body).forEach(n => io.observe(n));
  const pars = $$('[data-par]', body), words = $$('.w', body), progs = $$('[data-progress]', body), marks = $$('.tl li, .jr li', body);
  let queued = false;
  const update = () => {
    queued = false; const b = body.getBoundingClientRect(), mid = b.top + b.height / 2, line = b.top + b.height * .62;
    if (!reduced()) pars.forEach(n => { const r = n.getBoundingClientRect(); n.style.setProperty('--py', (-(r.top + r.height / 2 - mid) * (+n.dataset.par)).toFixed(1) + 'px'); });
    words.forEach(n => n.style.setProperty('--lit', reduced() ? 1 : clamp((line - n.getBoundingClientRect().top) / 90).toFixed(2)));
    progs.forEach(n => { const r = n.getBoundingClientRect(); n.style.setProperty('--p', reduced() ? 1 : clamp((line - r.top) / r.height).toFixed(3)); });
    marks.forEach(n => n.classList.toggle('in', n.getBoundingClientRect().top < line));
    win.style.setProperty('--scroll', clamp(body.scrollTop / Math.max(1, body.scrollHeight - body.clientHeight)).toFixed(3));
  };
  const req = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  body.addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); setTimeout(req, 50);
  return () => { io.disconnect(); removeEventListener('resize', req); };
}
function countUp(node) {
  const to = parseFloat(node.dataset.count), dec = (node.dataset.count.split('.')[1] || '').length, suf = node.dataset.suffix || '';
  if (reduced()) { node.textContent = to.toFixed(dec) + suf; return; }
  const t0 = performance.now();
  const f = now => { const t = clamp((now - t0) / 1400); node.textContent = (to * (1 - Math.pow(1 - t, 3))).toFixed(dec) + suf; if (t < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}

/* ───────── 08 · PROJECTS ───────── */
const STAGES = {
  food: () => `<div class="rbac" data-role="admin">
      <div class="rbac-tabs" role="tablist" aria-label="Preview a role">
        <button role="tab" aria-selected="true" data-r="admin">Admin</button><button role="tab" aria-selected="false" data-r="seller">Seller</button><button role="tab" aria-selected="false" data-r="user">User</button>
      </div>
      <ul class="rbac-list">
        <li data-for="admin">Analytics dashboards</li><li data-for="admin">Order trends and system usage</li>
        <li data-for="admin seller">Order processing</li><li data-for="user">Placing orders</li>
      </ul>
      <div class="rbac-trend" aria-hidden="true">${[40, 62, 48, 80, 66, 92, 74, 100, 84].map((h, k) => `<i style="--h:${h}%;--k:${k}"></i>`).join('')}</div>
      <p class="rbac-cap" data-cap>Admins see everything, including the analytics.</p>
    </div>`,
  voice: () => `<div class="gate-on" data-voice>
      <div class="wave" aria-hidden="true">${Array.from({ length: 58 }, (_, k) => { const q = [3, 4, 9, 10, 11, 17, 18, 19, 20, 27, 28, 36, 37, 38, 39, 45, 46, 52, 53].includes(k); return `<i class="${q ? 'q' : ''}" style="--h:${q ? 16 + (k % 3) * 6 : 34 + ((k * 37) % 66)}%;--k:${k}"></i>`; }).join('')}</div>
      <div class="wave-ctl"><label class="switch"><input type="checkbox" checked data-gate> Adaptive silence detection</label><output class="wave-out" data-out>about 70% of the audio is sent</output></div>
      <ol class="chain"><li>WhisperAI<small>speech to text</small></li><li>ArgosTranslate<small>text translation</small></li><li>PiperTTS<small>text to speech</small></li></ol>
    </div>`,
  health: () => `<div class="health" data-health>
      <button class="orb" type="button" aria-label="Next step" data-orb></button>
      <div class="flow" role="group" aria-label="How a message flows">${['Message', 'Emotion', 'Reply', 'Security'].map((s, i) => `<button type="button" data-s="${i}" ${i ? '' : 'aria-current="step"'}>${s}</button>`).join('')}</div>
      <p class="flow-cap" data-cap>Someone writes how they feel to the AI chatbot.</p>
    </div>`
};
const ROLE_CAP = { admin: 'Admins see everything, including the analytics.', seller: 'Sellers work on order processing inside their own scope.', user: 'Users place orders. Nothing administrative is exposed.' };
const FLOW = [
  ['Someone writes how they feel to the AI chatbot.', '#a78bfa'],
  ['NLP and Transformer-based models detect the emotion in the message.', '#8fd3ff'],
  ['A context-aware reply is shaped around that emotion, with personalised wellness support.', '#b9f36b'],
  ['JWT authentication and role-based REST APIs keep every session secure.', '#ff806b']
];
function initProjects(root) {
  const st = { q: '', stage: 'All', sel: PROJECTS[0].id };
  const stages = ['All', ...new Set(PROJECTS.map(p => p.stage))];
  $('[data-el=count]', root).textContent = `${PROJECTS.length} projects, from prototypes and proposals to AI platforms. Each one is labelled with how far it went.`;
  $('[data-el=tools]', root).innerHTML = `<label class="pe-search"><span class="sr">Search projects</span><input type="search" data-q placeholder="Search by name, stack or topic" autocomplete="off"></label><div class="pe-chips" role="group" aria-label="Filter by stage">${stages.map(s => `<button type="button" data-stage="${s}" aria-pressed="${s === 'All'}">${s}</button>`).join('')}</div>`;
  const index = $('[data-el=index]', root), detail = $('[data-el=detail]', root);
  const match = p => (st.stage === 'All' || p.stage === st.stage) && (!st.q || [p.title, p.kind, p.stage, p.blurb, p.stack.join(' ')].join(' ').toLowerCase().includes(st.q));
  const drawIndex = () => {
    const l = PROJECTS.filter(match);
    index.innerHTML = l.length ? l.map(p => `<li><button type="button" data-id="${p.id}" style="--ac:${p.ac}" ${p.id === st.sel ? 'aria-current="true"' : ''}><i></i><span>${esc(p.title)}</span><small>${p.stage}</small></button></li>`).join('') : '<li class="pe-empty">No project matches. Clear the search or choose another stage.</li>';
  };
  const drawDetail = () => {
    const p = PROJECTS.find(x => x.id === st.sel); const hasStage = !!STAGES[p.id];
    const stage = hasStage ? STAGES[p.id]() : `<div class="gen"><b>${p.stat}</b><span>${esc(p.statLabel)}</span></div>`;
    const links = p.github ? `<a class="btn btn-ghost" href="${p.github}" target="_blank" rel="noopener">GitHub</a>` : '';
    const gap = !p.stack.length && !p.points.length ? '<p class="pd-gap">Stack, architecture and links have not been added for this project yet.</p>' : '';
    detail.innerHTML = `<article class="proj proj--${p.id}" style="--ac:${p.ac}">
      <div class="proj-stage in">${stage}</div>
      <div class="proj-copy">
        <p class="proj-kind">${esc(p.kind)} · <b class="pd-stage">${p.stage}</b></p>
        <h3>${esc(p.title)}</h3>
        <p class="proj-blurb">${esc(p.blurb)}</p>
        ${p.award ? `<p class="pd-award">${esc(p.award)}</p>` : ''}
        <p class="pd-note">${esc(STAGE_NOTE[p.stage] || '')}</p>
        ${p.stack.length ? `<ul class="tags">${p.stack.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
        ${p.points.length ? `<ul class="pd-points">${p.points.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${gap}
        ${links ? `<div class="proj-actions">${links}</div>` : ''}
      </div></article>`;
    wire(detail);
  };
  const wire = box => {
    const rb = $('.rbac', box);
    if (rb) $$('[data-r]', rb).forEach(b => b.addEventListener('click', () => { rb.dataset.role = b.dataset.r; $$('[data-r]', rb).forEach(x => x.setAttribute('aria-selected', x === b)); $('[data-cap]', rb).textContent = ROLE_CAP[b.dataset.r]; }));
    const v = $('[data-voice]', box);
    if (v) { const gate = $('[data-gate]', v); gate.addEventListener('change', () => { v.className = gate.checked ? 'gate-on' : 'gate-off'; $('[data-out]', v).textContent = gate.checked ? 'silent chunks are not sent' : 'every chunk is sent'; }); }
    const hh = $('[data-health]', box);
    if (hh) { let step = 0; const go = n => { step = n % FLOW.length; $$('[data-s]', hh).forEach(b => +b.dataset.s === step ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')); $('[data-cap]', hh).textContent = FLOW[step][0]; $('[data-orb]', hh).style.setProperty('--hue', FLOW[step][1]); }; $('[data-orb]', hh).addEventListener('click', () => go(step + 1)); $$('[data-s]', hh).forEach(b => b.addEventListener('click', () => go(+b.dataset.s))); }
  };
  index.addEventListener('click', e => { const b = e.target.closest('[data-id]'); if (!b) return; st.sel = b.dataset.id; drawIndex(); drawDetail(); if (isMobile()) detail.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); });
  $('[data-q]', root).addEventListener('input', e => { st.q = e.target.value.trim().toLowerCase(); drawIndex(); });
  $('.pe-chips', root).addEventListener('click', e => { const b = e.target.closest('[data-stage]'); if (!b) return; st.stage = b.dataset.stage; $$('[data-stage]', root).forEach(x => x.setAttribute('aria-pressed', x === b)); drawIndex(); });
  drawIndex(); drawDetail();
}

/* ───────── 09 · SKILLS (radial technology constellation) ───────── */
function initSkills(root) {
  const map = $('[data-el=map]', root), info = $('[data-el=info]', root), legend = $('[data-el=legend]', root);
  const all = CATS.flatMap(c => c.items.map(n => ({ n, cat: c })));
  const nb = {}; all.forEach(s => nb[s.n] = new Set());
  WORK.forEach(w => w.uses.forEach(a => w.uses.forEach(b => a !== b && nb[a]?.add(b))));
  let sel = null, cat = null, svg;
  legend.innerHTML = CATS.map(c => `<button type="button" style="--c:${c.c}" aria-pressed="false" data-c="${c.id}">${c.name}</button>`).join('');

  const draw = () => {
    const W = map.clientWidth, H = map.clientHeight; if (!W || !H) return;
    const cx = W / 2, cy = H / 2, small = W < 560, lab = small ? 90 : 98, R = Math.max(60, Math.min(W / 2, H / 2) - lab);
    const gap = .55, per = (Math.PI * 2) / (all.length + gap * CATS.length); let a = -Math.PI / 2, i = 0; const pos = {}, arcs = [];
    CATS.forEach(c => {
      const a0 = a; c.items.forEach(n => { a += per * .5; pos[n] = { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, a }; a += per * .5; });
      arcs.push({ c, a0: a0 + per * .1, a1: a - per * .1 }); a += per * gap;
    });
    const arcPath = (a0, a1, r) => `M${cx + Math.cos(a0) * r} ${cy + Math.sin(a0) * r}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${cx + Math.cos(a1) * r} ${cy + Math.sin(a1) * r}`;
    const seen = new Set(), edges = [];
    Object.entries(nb).forEach(([x, set]) => set.forEach(y => { const k = [x, y].sort().join('|'); if (!seen.has(k)) { seen.add(k); edges.push([x, y]); } }));
    svg = `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="Technology constellation">
      <text class="sk-core" x="${cx}" y="${cy - 4}">what I use</text><text class="sk-core-sub" x="${cx}" y="${cy + 18}">${all.length} technologies</text>
      ${edges.map(([x, y]) => { const p = pos[x], q = pos[y]; return `<path class="sk-edge" data-e="${esc(x)}|${esc(y)}" d="M${p.x} ${p.y}Q${cx + (p.x + q.x - 2 * cx) * .12} ${cy + (p.y + q.y - 2 * cy) * .12} ${q.x} ${q.y}"/>`; }).join('')}
      ${arcs.map(s => `<path class="sk-arc" data-c="${s.c.id}" stroke="${s.c.c}" d="${arcPath(s.a0, s.a1, R - 16)}"/>`).join('')}
      ${all.map(s => { const p = pos[s.n], flip = Math.cos(p.a) < 0, deg = p.a * 180 / Math.PI + (flip ? 180 : 0);
        return `<g class="sk-node" data-n="${esc(s.n)}" data-c="${s.cat.id}" tabindex="0" role="button" aria-label="${esc(s.n)}, ${s.cat.name}" transform="translate(${p.x} ${p.y})" style="--i:${i++}">
          <circle class="hit" r="14" fill="transparent"/><circle class="dot" r="5.5" fill="${s.cat.c}"/><text transform="rotate(${deg}) translate(${flip ? -14 : 14} 0)" text-anchor="${flip ? 'end' : 'start'}">${esc(s.n)}</text></g>`; }).join('')}
    </svg>`;
    map.innerHTML = svg; map.classList.toggle('compact', small); paint();
    $$('.sk-node', map).forEach(n => {
      n.addEventListener('click', () => pick(n.dataset.n)); n.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(n.dataset.n); } });
      n.addEventListener('pointerenter', () => paint(n.dataset.n)); n.addEventListener('pointerleave', () => paint()); n.addEventListener('focus', () => paint(n.dataset.n)); n.addEventListener('blur', () => paint());
    });
  };
  const paint = (hover) => {
    const t = hover || sel; map.classList.toggle('sel', !!t); map.classList.toggle('cat', !!cat);
    $$('.sk-node', map).forEach(n => { const nm = n.dataset.n; n.classList.toggle('on', nm === t); n.classList.toggle('nb', !!t && nb[t].has(nm)); n.classList.toggle('off', !!cat && n.dataset.c !== cat); });
    $$('.sk-arc', map).forEach(a => a.classList.toggle('off', !!cat && a.dataset.c !== cat));
    $$('.sk-edge', map).forEach(e => { const [x, y] = e.dataset.e.split('|'); const hot = t && (x === t || y === t); e.classList.toggle('hot', !!hot); if (hot) e.style.stroke = all.find(s => s.n === t).cat.c; else e.style.stroke = ''; });
  };
  const show = () => {
    if (!sel) { info.innerHTML = `<p class="hint swap">Pick a node to see where I’ve used it.</p><p class="swap">${all.length} technologies in ${CATS.length} groups, taken from my résumé.</p>`; return; }
    const s = all.find(x => x.n === sel), used = WORK.filter(w => w.uses.includes(sel));
    info.style.setProperty('--c', s.cat.c);
    info.innerHTML = `<div class="swap"><span class="cat">${s.cat.name}</span><h4>${esc(s.n)}</h4></div>
      <p class="swap">${esc(NOTES[sel] || 'Part of my everyday toolkit. It isn’t tied to a single project on my résumé.')}</p>
      ${used.length ? `<div class="swap"><h5>Worked with it on</h5><ul>${used.map(w => `<li>${esc(w.name)}<small>${w.type}</small></li>`).join('')}</ul></div>` : ''}
      ${nb[sel].size ? `<div class="swap"><h5>Often paired with</h5><p>${[...nb[sel]].map(esc).join(', ')}</p></div>` : ''}`;
  };
  const pick = n => { sel = sel === n ? null : n; paint(); show(); };
  legend.addEventListener('click', e => {
    const b = e.target.closest('[data-c]'); if (!b) return; cat = cat === b.dataset.c ? null : b.dataset.c;
    $$('[data-c]', legend).forEach(x => x.setAttribute('aria-pressed', x.dataset.c === cat)); paint();
  });
  show(); requestAnimationFrame(draw);
  const ro = new ResizeObserver(() => { clearTimeout(ro.t); ro.t = setTimeout(draw, 80); }); ro.observe(map);
  return ro;
}

/* ───────── 10 · NETWORK (spring-physics node graph) ───────── */
function initNetwork(root, rec) {
  const map = $('[data-el=map]', root), card = $('[data-el=card]', root); let nodes = [], hub, W, H, raf = 0, svgEl;
  const showCard = n => {
    card.innerHTML = `<div class="swap"><h4>${n.label}</h4><p>${esc(n.handle)}. ${esc(n.d)}</p></div>` +
      (n.url ? `<div class="acts swap"><a class="btn" href="${n.url}" ${n.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${n.act}</a>${n.copy ? '<button class="btn btn-ghost" type="button" data-copy>Copy address</button>' : ''}</div>` : '');
    const cp = $('[data-copy]', card); if (cp) cp.onclick = () => navigator.clipboard?.writeText(n.copy).then(() => { cp.textContent = 'Copied'; setTimeout(() => cp.textContent = 'Copy address', 1600); });
  };
  const build = () => {
    W = map.clientWidth; H = map.clientHeight; if (!W || !H) return;
    const cx = W / 2, cy = H / 2, rx = Math.min(W * .38, 360), ry = Math.min(H * .29, 170), start = -Math.PI / 2 - .2;
    hub = { x: cx, y: cy };
    nodes = LINKS.map((l, i) => { const a = start + i / LINKS.length * Math.PI * 2; return { ...l, rx: cx + Math.cos(a) * rx, ry: cy + Math.sin(a) * ry, x: reduced() ? cx + Math.cos(a) * rx : cx, y: reduced() ? cy + Math.sin(a) * ry : cy, vx: 0, vy: 0, drag: false, r: i === 2 ? 36 : 32 }; });
    map.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="Connection graph">
      ${nodes.map((n, i) => `<line class="nw-edge" data-l="${i}" x1="${cx}" y1="${cy}" x2="${n.x}" y2="${n.y}"/>`).join('')}
      <g class="nw-hub" transform="translate(${cx} ${cy})"><circle r="40"/><text>DP</text></g>
      <g data-packets></g>
      ${nodes.map((n, i) => `<g class="nw-node" data-i="${i}" tabindex="0" role="${n.url ? 'link' : 'img'}" aria-label="${n.label}" style="--c:${n.c}" transform="translate(${n.x} ${n.y})"><circle class="ring" r="${n.r + 8}"/><circle r="${n.r}"/><text class="g">${n.g}</text><text class="l" y="${n.r + 22}">${n.label}</text></g>`).join('')}
    </svg>`;
    svgEl = $('svg', map); if (!reduced()) { raf = raf || requestAnimationFrame(physics); }
    $$('.nw-node', map).forEach(g => {
      const n = nodes[+g.dataset.i];
      g.addEventListener('pointerenter', () => { if (!n.drag) { showCard(n); packet(n); } });
      g.addEventListener('focus', () => { showCard(n); packet(n); });
      g.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && n.url) { e.preventDefault(); n.url.startsWith('http') ? open(n.url, '_blank', 'noopener') : location.href = n.url; } });
      g.addEventListener('pointerdown', e => {
        e.preventDefault(); g.setPointerCapture(e.pointerId); n.drag = true; n.moved = false; showCard(n);
        const b = svgEl.getBoundingClientRect(), ox = e.clientX, oy = e.clientY;
        const mv = ev => { if (Math.hypot(ev.clientX - ox, ev.clientY - oy) > 4) n.moved = true; n.x = clamp(ev.clientX - b.left, 40, W - 40); n.y = clamp(ev.clientY - b.top, 40, H - 50); n.vx = n.vy = 0; paintNodes(); if (!raf) raf = requestAnimationFrame(physics); };
        const up = () => { n.drag = false; g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up); if (!n.moved && n.url) n.url.startsWith('http') ? open(n.url, '_blank', 'noopener') : location.href = n.url; if (!raf) raf = requestAnimationFrame(physics); };
        g.addEventListener('pointermove', mv); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
      });
    });
  };
  const paintNodes = () => {
    if (!svgEl) return;
    $$('.nw-node', svgEl).forEach((g, i) => g.setAttribute('transform', `translate(${nodes[i].x.toFixed(1)} ${nodes[i].y.toFixed(1)})`));
    $$('.nw-edge', svgEl).forEach((l, i) => { l.setAttribute('x2', nodes[i].x.toFixed(1)); l.setAttribute('y2', nodes[i].y.toFixed(1)); });
  };
  function physics() {
    let busy = false;
    nodes.forEach(n => {
      if (n.drag) { busy = true; return; }
      n.vx = (n.vx + (n.rx - n.x) * .1) * .8; n.vy = (n.vy + (n.ry - n.y) * .1) * .8; n.x += n.vx; n.y += n.vy;
      if (Math.abs(n.vx) + Math.abs(n.vy) > .05 || Math.abs(n.rx - n.x) + Math.abs(n.ry - n.y) > .3) busy = true; else { n.x = n.rx; n.y = n.ry; }
    });
    paintNodes(); raf = busy ? requestAnimationFrame(physics) : 0;
  }
  function packet(n) {
    if (reduced() || !svgEl) return; const g = $('[data-packets]', svgEl);
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('class', 'nw-packet'); c.setAttribute('r', 4); c.setAttribute('cx', hub.x); c.setAttribute('cy', hub.y); c.style.fill = n.c; g.appendChild(c);
    c.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${n.x - hub.x}px,${n.y - hub.y}px)`, opacity: .2 }], { duration: 650, easing: 'cubic-bezier(.4,0,.2,1)' }).finished.then(() => c.remove());
  }
  showCard(LINKS[2]); build();
  const ro = new ResizeObserver(() => { clearTimeout(ro.t); ro.t = setTimeout(build, 100); }); ro.observe(map);
  rec.cleanup.push(() => { ro.disconnect(); cancelAnimationFrame(raf); });
}

/* ───────── 11 · ABOUT ───────── */
function initAbout(root) {
  const P = id => PROJECTS.find(p => p.id === id);
  const journey = [
    ['Aug 2022', 'Began B.E. in Computer Science & Engineering', 'Nagarjuna College of Engineering & Technology, Bengaluru.', ''],
    ['College years', 'Started building across disciplines', 'Embedded, automation and campus ideas, collected below under Where the ideas began.', ''],
    ['Jan – Apr 2025', 'Backend Developer Intern', 'At Nagarjuna Tech Solutions: RESTful APIs, authentication, menu and order services on Node.js and MongoDB.', ''],
    ['Jun 2026', 'Graduated and joined MECNTEC Solution', 'B.E. complete. Now a Full Stack Developer working on WhatsApp Cloud API workflows and LLM-driven features.', 'now'],
    ['8 Dec 2026', 'Internship period ends', 'A full-time role follows.', 'next']
  ];
  const wins2 = [['Award', 'Best Major Project, 1st Prize', 'Aerlogisim, among final-year engineering teams'], ['Prize', 'Inter-college prize', 'E-card digital driving licence for electric vehicles'], ['Hackathon', 'Top 10 of 200+ ideas', 'E-waste logistics and rare-element recovery, three-day hackathon'], ['Research', 'Paper on AI chatbots', 'Scopus-indexed, presented at ICKECS 2025'], ['Community', 'Red Hat Ambassador', 'Campus representative for open source at NCET']];
  const stats = [['8.94', '', 'CGPA out of 10 in B.E. Computer Science', '#ff806b'], ['250', '+', 'DSA problems solved on LeetCode', '#b9f36b'], ['11', '', 'projects, from prototype to AI platform', '#8fd3ff'], ['30', '+', 'REST APIs built in one internship', '#a78bfa']];
  const groups = CERTS.reduce((m, c) => ((m[c.s] = m[c.s] || []).push(c.t), m), {});
  const gcol = { ServiceNow: '#b9f36b', 'Red Hat': '#ff806b', Oracle: '#8fd3ff', GeeksforGeeks: '#a78bfa' };
  const ideas = ['ev', 'chalk', 'ewaste', 'servicenow'].map(P);
  $('[data-el=root]', root).innerHTML = `
  <section class="ab-open">
    <div>
      <h3 data-reveal="wipe">I enter unfamiliar problems, learn what they need, and build the system that solves them.</h3>
      <p class="ab-by" data-reveal>Darshan P, AI &amp; full-stack engineer in Bengaluru</p>
    </div>
    <figure class="ab-photo" data-par=".05"><img src="assets/portrait.jpg" width="900" height="1350" alt="Darshan P at work" loading="lazy" decoding="async"></figure>
  </section>
  <section class="ab-intro">
    <p class="ab-lead" data-words>I am a Computer Science and Engineering graduate who builds AI-powered products and the full-stack systems behind them. It began with embedded, automation and campus ideas. Backend APIs and full-stack work followed, and now it is LLMs, RAG and real-time integrations.</p>
    <dl class="ab-facts" data-reveal>
      <div><dt>Based in</dt><dd>Bengaluru, India</dd></div>
      <div><dt>Education</dt><dd>B.E. Computer Science &amp; Engineering, NCET, 2022 to 2026</dd></div>
      <div><dt>Now</dt><dd>Full Stack Developer, MECNTEC Solution</dd></div>
      <div><dt>Focus</dt><dd>AI-powered products, full-stack and backend engineering</dd></div>
    </dl>
  </section>
  <section class="ab-stats" data-stagger="90" aria-label="By the numbers">${stats.map(([v, s, l, c]) => `<div data-reveal style="--c:${c}"><b data-count="${v}" data-suffix="${s}">0${s}</b><span>${l}</span></div>`).join('')}</section>
  <section class="ab-journey">
    <h4 data-reveal>The path so far</h4>
    <ol class="jr" data-progress>${journey.map(([w, t, d, k]) => `<li class="${k}"><time>${w}</time><h5>${esc(t)}</h5><p>${esc(d)}</p></li>`).join('')}</ol>
  </section>
  <section class="ab-wins">
    <h4 data-reveal>Recognition</h4>
    <ul class="wl">${wins2.map(([g, t, d], i) => `<li data-reveal style="--i:${i}"><small>${g}</small><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ul>
  </section>
  <section class="ab-certs">
    <h4 data-reveal>Certifications</h4>
    <div class="cg" data-stagger="80">${Object.entries(groups).map(([g, l]) => `<div data-reveal style="--c:${gcol[g] || '#f2f0e9'}"><h5>${esc(g)}</h5><ul>${l.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>
  </section>
  <section class="ab-ideas">
    <h4 data-reveal>Where the ideas began</h4>
    <div class="id" data-stagger="80">${ideas.map(p => `<article data-reveal style="--c:${p.ac}"><small>${p.stage}</small><h5>${esc(p.title)}</h5><p>${esc(p.blurb)}</p>${p.award ? `<em>${esc(p.award)}</em>` : ''}</article>`).join('')}</div>
    <button class="btn" type="button" data-open="projects" data-reveal>Open all projects</button>
  </section>
  <section class="ab-end">
    <p data-reveal>Looking for someone who learns fast and ships? Let’s talk.</p>
    <div class="ab-act" data-reveal><button class="btn" type="button" data-open="contact">Contact</button><button class="btn btn-ghost" type="button" data-open="resume">View résumé</button></div>
  </section>`;
}

/* ───────── 12 · RESUME ───────── */
function initResume(root) {
  const skills = CATS.map(c => `<li><b>${c.name}:</b> ${c.items.join(', ')}</li>`).join('');
  $('[data-el=sheet]', root).innerHTML = `
    <h3>${ME.name.toUpperCase()}</h3>
    <p class="meta">${ME.location} · ${ME.phone}<br>${ME.email}<br>${ME.linkedin.replace('https://www.', '')} · ${ME.github.replace('https://', '')}</p>
    <h4>Summary</h4><p>${esc(ME.summary)}</p>
    <h4>Education</h4><div class="row">${ME.edu.degree}<span>${ME.edu.when}</span></div><p class="sub">${ME.edu.school}. CGPA ${ME.edu.cgpa}</p>
    <h4>Experience</h4>${EXPERIENCE.map(e => `<div class="row">${e.role}<span>${e.when}</span></div><p class="sub">${e.org}</p><ul>${e.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`).join('')}
    <h4>Projects</h4>${PROJECTS.filter(p => p.points.length).map(p => `<div class="row">${esc(p.title)}</div><p class="sub">${p.stack.join(', ')}</p><ul>${p.points.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`).join('')}
    <h4>Skills</h4><ul>${skills}</ul>
    <h4>Achievements</h4><ul>${AWARDS.map(a => `<li>${esc(a.t)}, ${esc(a.s)}</li>`).join('')}</ul>
    <h4>Certifications</h4><ul>${CERTS.map(a => `<li>${esc(a.t)}, ${esc(a.s)}</li>`).join('')}</ul>`;
}

/* ───────── 13 · CONTACT ───────── */
function initContact(root) {
  const lines = [['Email', ME.email, 'mailto:' + ME.email, true], ['Phone', ME.phone, 'tel:' + ME.phone.replace(/-/g, ''), true], ['Location', ME.location], ['LinkedIn', 'in/pdarshan2224', ME.linkedin], ['GitHub', 'DARSHAN2224', ME.github]];
  $('[data-el=lines]', root).innerHTML = lines.map(([k, v, u, c]) => `<li data-reveal><span><small>${k}</small>${u ? `<a href="${u}" ${u.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${esc(v)}</a>` : esc(v)}</span>${c ? `<button type="button" data-copy="${esc(v)}">Copy</button>` : ''}</li>`).join('');
  $$('[data-copy]', root).forEach(b => b.addEventListener('click', () => navigator.clipboard?.writeText(b.dataset.copy).then(() => { b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy', 1500); })));
  const form = $('[data-el=form]', root), status = $('[data-el=status]', root);
  form.addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(form), name = f.get('name').trim(), mail = f.get('email').trim(), msg = f.get('message').trim();
    let bad = false; $$('input,textarea', form).forEach(i => { const v = i.value.trim(); const ok = i.type === 'email' ? /^\S+@\S+\.\S+$/.test(v) : !!v; i.classList.toggle('bad', !ok); bad = bad || !ok; });
    status.classList.toggle('err', bad);
    if (bad) { status.textContent = 'Fill in your name, a valid email and a message.'; return; }
    status.textContent = 'Opening a draft in your mail app. If nothing opens, copy my email on the left.';
    location.href = `mailto:${ME.email}?subject=${encodeURIComponent('Portfolio message from ' + name)}&body=${encodeURIComponent(msg + '\n\n' + name + ' (' + mail + ')')}`;
  });
}

/* ───────── 14 · COPILOT (hacker CLI) ───────── */
const CMDS = ['help', 'projects', 'skills', 'about', 'experience', 'resume', 'contact', 'achievements', 'certs', 'open', 'clear'];
const L = (cls, t) => `<div class="ln ${cls || ''}">${t}</div>`;
const OUT = {
  help: () => [L('c-ok', 'available commands'), ...[['help', 'show this list'], ['projects', 'what I have built'], ['skills', 'technology groups'], ['about', 'who I am'], ['experience', 'internships and roles'], ['resume', 'open the résumé'], ['contact', 'ways to reach me'], ['achievements', 'awards and research'], ['certs', 'certifications'], ['open <app>', 'open a window, e.g. open skills'], ['clear', 'wipe the screen']].map(([a, b]) => L('', `  <span class="c-key">${a.padEnd(14)}</span><span class="c-dim">${b}</span>`)), L('c-dim', 'or just ask a question in plain English.')],
  projects: () => [L('c-ok', `${PROJECTS.length} projects found`), ...PROJECTS.flatMap(p => [L('', `<span class="c-vio">▸ ${esc(p.title)}</span>`), L('c-dim', `  ${p.stage}${p.stack.length ? ' · ' + p.stack.join(' · ') : ''}`), L('', `  ${esc(p.blurb)}`), L('', p.github ? `  <a href="${p.github}" target="_blank" rel="noopener">${p.github.replace('https://', '')}</a>` : `  <span class="c-dim">${esc(STAGE_NOTE[p.stage] || p.award || '')}</span>`)]), L('c-dim', 'try: tell me about voice converter')],
  skills: () => [L('c-ok', 'technology groups'), ...CATS.map(c => L('', `  <span class="c-key">${c.name.padEnd(18)}</span>${c.items.join(', ')}`)), L('c-dim', 'open the Skills app for the interactive map, or ask: where did you use MongoDB?')],
  about: () => [L('c-ok', ME.name + ' · ' + ME.location), L('', esc(ME.summary)), L('', `<span class="c-key">education</span>  ${ME.edu.degree}, ${ME.edu.school}. CGPA ${ME.edu.cgpa}.`)],
  experience: () => [L('c-ok', 'experience log'), ...EXPERIENCE.flatMap(e => [L('', `<span class="c-vio">▸ ${e.role}</span> <span class="c-dim">${e.org} · ${e.when}</span>`), ...e.points.map(p => L('', '   · ' + esc(p)))])],
  resume: () => [L('c-ok', 'opening résumé window…'), L('', `<a href="assets/Darshan_P_resume.pdf" target="_blank" rel="noopener">assets/Darshan_P_resume.pdf</a>`)],
  contact: () => [L('c-ok', 'contact channels'), L('', `<span class="c-key">email    </span><a href="mailto:${ME.email}">${ME.email}</a>`), L('', `<span class="c-key">phone    </span>${ME.phone}`), L('', `<span class="c-key">linkedin </span><a href="${ME.linkedin}" target="_blank" rel="noopener">in/pdarshan2224</a>`), L('', `<span class="c-key">github   </span><a href="${ME.github}" target="_blank" rel="noopener">DARSHAN2224</a>`)],
  achievements: () => [L('c-ok', 'achievements'), ...AWARDS.map(a => L('', `  <span class="c-vio">▸</span> ${esc(a.t)} <span class="c-dim">(${esc(a.s)})</span>`))],
  certs: () => [L('c-ok', 'certifications'), ...CERTS.map(a => L('', `  <span class="c-vio">▸</span> ${esc(a.t)} <span class="c-dim">(${esc(a.s)})</span>`))]
};
const PROJ_KEYS = Object.fromEntries(PROJECTS.map(p => [p.id, p.keys]));
function answer(q) {
  const s = q.toLowerCase(), has = (...w) => w.some(x => s.includes(x));
  const proj = PROJECTS.find(p => PROJ_KEYS[p.id].some(k => s.includes(k)));
  if (proj) return { html: [L('c-ok', proj.title), L('', esc(proj.blurb)), ...proj.points.map(x => L('', '  · ' + esc(x))), L('c-dim', (proj.stack.length ? 'stack: ' + proj.stack.join(', ') : STAGE_NOTE[proj.stage] || ''))] };
  const tech = CATS.flatMap(c => c.items.map(n => ({ n, c }))).find(t => new RegExp('\\b' + t.n.toLowerCase().replace(/[.+]/g, '\\$&') + '(?![a-z])').test(s) || (t.n === 'REST APIs' && has('rest', 'api')));
  if (tech) { const used = WORK.filter(w => w.uses.includes(tech.n)); return { html: [L('c-ok', `${tech.n} · ${tech.c.name}`), L('', esc(NOTES[tech.n] || 'Part of the everyday toolkit; not tied to one project on the résumé.')), ...(used.length ? [L('c-dim', 'used in: ' + used.map(w => w.name).join(', '))] : [])] }; }
  if (has('who are you', 'what are you', 'copilot') || /\bai\b/.test(s) && has('you')) return { html: [L('', 'I am the Darshan-OS Copilot: a small rule-based assistant that answers from the facts in this portfolio. No cloud model is called here.')] };
  if (has('intern', 'work', 'job', 'experience', 'mecntec', 'nagarjuna tech', 'company')) return { run: 'experience' };
  if (has('project', 'built', 'build', 'portfolio')) return { run: 'projects' };
  if (has('skill', 'stack', 'tech', 'language', 'know')) return { run: 'skills' };
  if (has('cgpa', 'college', 'education', 'degree', 'study', 'ncet', 'university', 'graduat')) return { html: [L('c-ok', 'education'), L('', `${ME.edu.degree}, ${ME.edu.school}`), L('', `${ME.edu.when} · CGPA ${ME.edu.cgpa}`)] };
  if (has('award', 'achiev', 'paper', 'research', 'aerlogisim', 'leetcode', 'dsa', 'red hat', 'ambassador')) return { run: 'achievements' };
  if (has('cert', 'servicenow', 'oracle')) return { run: 'certs' };
  if (has('resume', 'résumé', 'cv', 'pdf')) return { run: 'resume', open: 'resume' };
  if (has('contact', 'email', 'mail', 'phone', 'reach', 'hire', 'linkedin', 'github', 'call')) return { run: 'contact' };
  if (has('where', 'location', 'live', 'based', 'bengaluru', 'bangalore')) return { html: [L('', `Based in ${ME.location}.`)] };
  if (has('who', 'about', 'yourself', 'darshan', 'introduce', 'bio')) return { run: 'about' };
  if (/^(hi|hello|hey|yo)\b/.test(s)) return { html: [L('c-ok', 'hello, visitor.'), L('', 'Ask about projects, skills, experience or type <span class="c-key">help</span>.')] };
  return { html: [L('c-err', 'no confident match for that.'), L('', 'I only know what is in this portfolio. Try <span class="c-key">projects</span>, <span class="c-key">skills</span>, <span class="c-key">experience</span> or ask about a technology such as “Node.js”.')] };
}
function initCopilot(root, rec) {
  const log = $('[data-el=log]', root), input = $('[data-el=input]', root), before = $('[data-el=before]', root), after = $('[data-el=after]', root), ghost = $('[data-el=ghost]', root), chips = $('[data-el=chips]', root), term = $('[data-el=term]', root);
  const hist = []; let hi = -1, typing = null;
  const chatContext = [];
  chips.innerHTML = ['help', 'projects', 'skills', 'about', 'experience', 'resume', 'contact', 'clear'].map(c => `<button type="button" data-cmd="${c}">${c}</button>`).join('');
  const caret = () => {
    const v = input.value, p = input.selectionStart ?? v.length; before.textContent = v.slice(0, p); after.textContent = v.slice(p);
    const m = v && !v.includes(' ') ? CMDS.find(c => c.startsWith(v.toLowerCase()) && c !== v.toLowerCase()) : null; ghost.textContent = m ? m.slice(v.length) : '';
  };
  const bottom = () => { rec.body.scrollTop = rec.body.scrollHeight; };
  const typeNode = node => new Promise(res => {
    const w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), items = []; let t; while ((t = w.nextNode())) { items.push([t, t.nodeValue]); t.nodeValue = ''; }
    const total = items.reduce((a, [, s]) => a + s.length, 0); const per = Math.max(2, Math.ceil(total / 90)); let k = 0, shown = 0;
    const finish = () => { items.forEach(([n, s]) => n.nodeValue = s); typing = null; bottom(); res(); };
    if (reduced()) return finish(); typing = finish;
    const tick = () => { if (!typing) return; shown = Math.min(total, shown + per); let left = shown; for (const [n, s] of items) { n.nodeValue = s.slice(0, Math.max(0, Math.min(s.length, left))); left -= s.length; } bottom(); shown >= total ? finish() : requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const print = async (lines, cls = 'out') => { const box = el(`<div class="${cls}">${lines.join('')}</div>`); log.appendChild(box); await typeNode(box); };
  const formatMarkdown = t => esc(t).replace(/\*\*([^*]+)\*\*/g, '<span class="c-vio">$1</span>').replace(/`([^`]+)`/g, '<span class="c-key">$1</span>');
  const run = async raw => {
    const line = raw.trim(); if (typing) typing();
    log.appendChild(el(`<div class="ln"><span class="t-ps">visitor@darshan-os:~$</span> <span class="t-cmd">${esc(line)}</span></div>`));
    if (!line) return; hist.unshift(line); hi = -1;
    const [cmd, ...rest] = line.toLowerCase().split(/\s+/); let key = cmd, o;
    if (cmd === 'clear' || cmd === 'cls') { log.innerHTML = ''; return; }
    if (cmd === 'open') { const a = rest[0]; if (APPS.some(x => x.id === a && a !== 'home')) { await print([L('c-ok', `opening ${a}…`)]); openApp(a); } else await print([L('c-err', `unknown app: ${esc(a || '')}`), L('c-dim', 'apps: ' + APPS.filter(x => x.id !== 'home' && x.id !== 'copilot').map(x => x.id).join(', '))]); return; }
    if (OUT[cmd] && !rest.length) {
      o = { run: cmd, open: cmd === 'resume' ? 'resume' : null };
      await print(OUT[cmd]());
      if (o.open) openApp(o.open);
      chatContext.push({ role: 'user', content: line });
      chatContext.push({ role: 'assistant', content: `Displayed the ${cmd} view in Darshan-OS.` });
      return;
    }
    if (cmd === 'help' || cmd === '?') {
      await print(OUT.help());
      return;
    }

    // Context-aware AI Copilot via Groq LLM
    const thinkingBox = el('<div class="ln c-dim"><span class="c-vio">⟳</span> thinking…</div>');
    log.appendChild(thinkingBox);
    bottom();
    try {
      const res = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: line, history: chatContext.slice(-10) })
      });
      const data = await res.json();
      thinkingBox.remove();
      if (data && data.reply) {
        chatContext.push({ role: 'user', content: line });
        chatContext.push({ role: 'assistant', content: data.reply });
        const replyLines = data.reply
          .split('\n')
          .map(l => {
            const t = l.trim();
            if (!t) return L('', '&nbsp;');
            if (t.startsWith('- ') || t.startsWith('* ')) {
              return L('', `  <span class="c-vio">▸</span> ${formatMarkdown(t.slice(2))}`);
            }
            return L('', formatMarkdown(t));
          });
        await print(replyLines);
        if (data.open && APPS.some(x => x.id === data.open)) {
          openApp(data.open);
        }
        return;
      }
    } catch (e) {
      thinkingBox.remove();
    }

    // Fallback if network or offline
    o = answer(line);
    await print(o.run ? OUT[o.run]() : o.html);
    if (o.open) openApp(o.open);
  };
  input.addEventListener('input', caret); ['keyup', 'click', 'select', 'focus'].forEach(e => input.addEventListener(e, caret));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const v = input.value; input.value = ''; caret(); run(v); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi < hist.length - 1) { input.value = hist[++hi]; caret(); } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); input.value = hi > 0 ? hist[--hi] : (hi = -1, ''); caret(); }
    else if (e.key === 'Tab') { e.preventDefault(); const m = ghost.textContent; if (m) { input.value += m; caret(); } }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); log.innerHTML = ''; }
  });
  chips.addEventListener('click', e => { const b = e.target.closest('[data-cmd]'); if (b) { run(b.dataset.cmd); if (!isMobile()) input.focus(); } });
  term.addEventListener('click', e => { if (!e.target.closest('a,button') && !getSelection().toString()) input.focus(); });
  (async () => {
    await print([L('c-vio', 'darshan-os kernel 4.0 · ai copilot online (Groq LLM)'), L('c-dim', 'context-aware · natural language · multi-turn memory active'), L('', 'type <span class="c-key">help</span>, tap a command below, or ask any question about Darshan.')], 'out');
    if (!isMobile()) input.focus({ preventScroll: true });
  })();
}

const INIT = { projects: initProjects, skills: (r, rec) => { const ro = initSkills(r); rec.cleanup.push(() => ro.disconnect()); }, network: initNetwork, about: initAbout, resume: initResume, contact: initContact, copilot: initCopilot };

/* ───────── 15 · START-UP ───────── */
document.addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openApp(b.dataset.open); });
addEventListener('keydown', e => {
  if (e.key === 'Escape' && focusedId && document.body.dataset.state === 'ready') closeApp(focusedId);
});
addEventListener('resize', () => wins.forEach((rec, id) => { if (!isMobile() && !rec.max) { const w = rec.el; w.style.left = clamp(w.offsetLeft, 8, Math.max(8, innerWidth - w.offsetWidth - 8)) + 'px'; w.style.top = clamp(w.offsetTop, 44, Math.max(44, innerHeight - 100 - Math.min(w.offsetHeight, 200))) + 'px'; } }));
initDock(); initHero(); initBloom(); runBoot();
updateChrome();
})();
