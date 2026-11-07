(() => {
  const D = window.PORTFOLIO;
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Render content from data.js ---------- */
  $('h-name').textContent = D.name;
  $('h-summary').textContent = D.summary;
  $('about-text').textContent = D.summary;
  $('year').textContent = new Date().getFullYear();
  $('socials').innerHTML =
    `<a href="${esc(D.github)}" target="_blank" rel="noopener">GitHub ↗</a><a href="${esc(D.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>`;
  const em = $('c-email'); em.textContent = D.email; em.href = 'mailto:' + D.email;
  $('c-gh').textContent = D.github.replace('https://github.com/', '@'); $('c-gh').href = D.github;
  $('c-li').href = D.linkedin; $('c-loc').textContent = D.location;
  $('contact-form').action = D.formspree;

  D.education.forEach((e) => $('education').append(el('div', 't-item',
    `<span class="date">${esc(e.period)}</span><h3>${esc(e.title)}<span class="badge">${esc(e.level)}</span></h3><div class="org">${esc(e.place)}</div><ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`)));
  D.skills.forEach((s) => $('skill-grid').append(el('div', 'skill',
    `<span class="grp">${esc(s.group)}</span><div class="ic">${s.icon}</div><h3>${esc(s.name)}</h3><p>${esc(s.note)}</p>`)));
  D.projects.forEach((p) => $('projects-list').append(el('article', 'card',
    `<span class="tag">${esc(p.tag)}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>${p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener">Live site ↗</a> &nbsp;·&nbsp; ` : ''}<a href="${esc(p.link)}" target="_blank" rel="noopener">GitHub ↗</a>`)));
  D.experience.forEach((x) => $('exp-list').append(el('div', 't-item',
    `<span class="date">${esc(x.period)}</span><h3>${esc(x.org)}</h3><div class="org">${esc(x.role)}</div><p>${esc(x.desc)}</p>`)));
  D.goals.forEach((g) => $('goals').append(el('li', '', esc(g))));

  /* ---------- Nav ---------- */
  $('menu-btn').onclick = () => $('nav-links').classList.toggle('open');
  document.querySelectorAll('#nav-links a').forEach((a) => a.addEventListener('click', () => $('nav-links').classList.remove('open')));

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((s) => io.observe(s));

  /* ---------- Typing effect ---------- */
  (function typer() {
    const t = $('typed'); let r = 0, c = 0, del = false;
    if (reduceMotion) { t.textContent = D.roles[0]; return; }
    (function tick() {
      const w = D.roles[r];
      c += del ? -1 : 1; t.textContent = w.slice(0, c);
      let d = del ? 35 : 70;
      if (!del && c === w.length) { del = true; d = 1400; }
      else if (del && c === 0) { del = false; r = (r + 1) % D.roles.length; d = 350; }
      setTimeout(tick, d);
    })();
  })();

  /* ---------- Helper: run animation only while visible ---------- */
  function animate(canvas, draw) {
    const ctx = canvas.getContext('2d'); let vis = false, t = 0;
    new IntersectionObserver((e) => { vis = e[0].isIntersecting; }, { threshold: 0.1 }).observe(canvas);
    (function frame() { if (vis || reduceMotion && t === 0) { t++; draw(ctx, canvas.width, canvas.height, t); } requestAnimationFrame(frame); })();
  }

  /* ---------- Background: neural particles + data pulses ---------- */
  (function bg() {
    const cv = $('bg'), ctx = cv.getContext('2d'); let W, H;
    const ptr = { x: -999, y: -999 };
    const N = innerWidth < 700 ? 32 : 80;
    const nodes = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * 0.0004, vy: (Math.random() - .5) * 0.0004 }));
    const pulses = [];
    const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
    addEventListener('resize', resize); resize();
    addEventListener('pointermove', (e) => { ptr.x = e.clientX; ptr.y = e.clientY; });
    (function frame() {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        if (!reduceMotion) { n.x += n.vx; n.y += n.vy; }
        if (n.x < 0 || n.x > 1) n.vx *= -1; if (n.y < 0 || n.y > 1) n.vy *= -1;
        n.px = n.x * W; n.py = n.y * H;
        const d = Math.hypot(n.px - ptr.x, n.py - ptr.y);
        ctx.beginPath(); ctx.arc(n.px, n.py, d < 140 ? 3.5 : 2, 0, 6.283);
        ctx.fillStyle = d < 140 ? 'rgba(167,139,250,.95)' : 'rgba(34,211,238,.6)'; ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = nodes[i], b = nodes[j], d = Math.hypot(a.px - b.px, a.py - b.py);
        if (d < 140) {
          ctx.strokeStyle = `rgba(34,211,238,${(1 - d / 140) * 0.28})`; ctx.lineWidth = .8;
          ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();
          if (!reduceMotion && Math.random() < 0.0009 && pulses.length < 25) pulses.push({ a, b, t: 0 });
        }
      }
      for (let k = pulses.length - 1; k >= 0; k--) { // data packets travelling along edges
        const p = pulses[k]; p.t += 0.02;
        if (p.t >= 1) { pulses.splice(k, 1); continue; }
        ctx.beginPath(); ctx.arc(p.a.px + (p.b.px - p.a.px) * p.t, p.a.py + (p.b.py - p.a.py) * p.t, 3, 0, 6.283);
        ctx.fillStyle = '#34d399'; ctx.shadowColor = '#34d399'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
      }
      requestAnimationFrame(frame);
    })();
  })();

  /* ---------- Lab 1: neural network forward pass ---------- */
  (function nn() {
    const layers = [4, 6, 6, 3];
    animate($('nn-canvas'), (ctx, W, H, t) => {
      ctx.clearRect(0, 0, W, H);
      const pos = layers.map((n, li) => Array.from({ length: n }, (_, i) => ({ x: 70 + li * ((W - 140) / (layers.length - 1)), y: H / 2 + (i - (n - 1) / 2) * 44 })));
      const wave = (t / 70) % (layers.length + 0.6); // signal front moving through layers
      for (let l = 0; l < layers.length - 1; l++) pos[l].forEach((a) => pos[l + 1].forEach((b) => {
        const on = Math.max(0, 1 - Math.abs(wave - l - 0.5) * 1.3);
        ctx.strokeStyle = `rgba(34,211,238,${0.08 + on * 0.5})`; ctx.lineWidth = 0.7 + on; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }));
      pos.forEach((layer, l) => layer.forEach((n, i) => {
        const on = Math.max(0, 1 - Math.abs(wave - l) * 1.2);
        ctx.beginPath(); ctx.arc(n.x, n.y, 9 + on * 3, 0, 6.283);
        ctx.fillStyle = l === layers.length - 1 ? `rgba(52,211,153,${0.35 + on})` : `rgba(167,139,250,${0.3 + on})`;
        ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = on * 18; ctx.fill(); ctx.shadowBlur = 0;
        ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.2; ctx.stroke();
      }));
      ctx.fillStyle = '#8fa3c0'; ctx.font = '12px JetBrains Mono, monospace'; ctx.textAlign = 'center';
      ['input', 'hidden 1', 'hidden 2', 'output'].forEach((s, l) => ctx.fillText(s, pos[l][0].x, 22));
    });
  })();

  /* ---------- Lab 2: loss curve (gradient descent) ---------- */
  (function loss() {
    const pts = Array.from({ length: 120 }, (_, i) => 2.4 * Math.exp(-i / 28) + 0.12 + Math.sin(i * 1.7) * 0.05 * Math.exp(-i / 60));
    animate($('loss-canvas'), (ctx, W, H, t) => {
      ctx.clearRect(0, 0, W, H);
      const L = 48, R = W - 20, T = 24, B = H - 36, shown = Math.min(pts.length, Math.floor((t % 260) / 2));
      ctx.strokeStyle = 'rgba(143,163,192,.18)'; ctx.fillStyle = '#8fa3c0'; ctx.font = '11px JetBrains Mono, monospace'; ctx.textAlign = 'right';
      for (let g = 0; g <= 4; g++) { const y = T + (B - T) * g / 4; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); ctx.fillText((2.6 - 2.6 * g / 4).toFixed(1), L - 6, y + 4); }
      ctx.textAlign = 'center'; ctx.fillText('epochs →', W / 2, H - 8);
      const X = (i) => L + (R - L) * i / (pts.length - 1), Y = (v) => B - (B - T) * v / 2.6;
      const grad = ctx.createLinearGradient(0, T, 0, B); grad.addColorStop(0, 'rgba(34,211,238,.35)'); grad.addColorStop(1, 'rgba(34,211,238,0)');
      ctx.beginPath(); ctx.moveTo(X(0), B); for (let i = 0; i < shown; i++) ctx.lineTo(X(i), Y(pts[i])); ctx.lineTo(X(Math.max(shown - 1, 0)), B); ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath(); for (let i = 0; i < shown; i++) i ? ctx.lineTo(X(i), Y(pts[i])) : ctx.moveTo(X(i), Y(pts[i]));
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2.2; ctx.stroke();
      if (shown > 0) { const i = shown - 1; ctx.beginPath(); ctx.arc(X(i), Y(pts[i]), 5, 0, 6.283); ctx.fillStyle = '#34d399'; ctx.shadowColor = '#34d399'; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0;
        ctx.textAlign = 'left'; ctx.fillStyle = '#e6edf7'; ctx.fillText(`epoch ${i}  loss ${pts[i].toFixed(3)}`, L + 10, T + 14); }
    });
  })();

  /* ---------- Lab 3: Power BI–style streaming dashboard ---------- */
  (function dash() {
    const bars = Array.from({ length: 8 }, () => Math.random()); const targets = bars.map(() => Math.random()); const series = Array.from({ length: 40 }, (_, i) => 0.5 + Math.sin(i / 4) * 0.2);
    animate($('chart-canvas'), (ctx, W, H, t) => {
      ctx.clearRect(0, 0, W, H);
      if (t % 90 === 0) targets.forEach((_, i) => targets[i] = 0.2 + Math.random() * 0.8);
      if (t % 6 === 0) { series.shift(); series.push(Math.max(0.1, Math.min(0.95, series[series.length - 1] + (Math.random() - .5) * .18))); }
      const cols = ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24'];
      const bw = 26, gap = 10, base = H - 40, maxH = H - 100;
      bars.forEach((v, i) => { bars[i] += (targets[i] - v) * 0.06; const h = bars[i] * maxH, x = 24 + i * (bw + gap);
        ctx.fillStyle = cols[i % 4]; ctx.globalAlpha = .85; ctx.fillRect(x, base - h, bw, h); ctx.globalAlpha = 1; });
      ctx.fillStyle = '#8fa3c0'; ctx.font = '11px JetBrains Mono, monospace'; ctx.textAlign = 'left'; ctx.fillText('Revenue by region', 24, 20);
      ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].forEach((s, i) => ctx.fillText(s, 28 + i * (bw + gap), base + 16));
      // line chart
      const x0 = 24 + 8 * (bw + gap) + 20, w = W - x0 - 20; ctx.fillText('Live KPI', x0, 20);
      ctx.beginPath(); series.forEach((v, i) => { const x = x0 + w * i / (series.length - 1), y = base - v * maxH; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.stroke();
      // donut
      const cx = x0 + w / 2, cy = 80, r = 34, parts = [.45, .3, .25]; let a0 = -Math.PI / 2 + t / 120;
      parts.forEach((p, i) => { ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + p * 6.283); ctx.strokeStyle = cols[i]; ctx.lineWidth = 12; ctx.stroke(); a0 += p * 6.283; });
    });
  })();

  /* ---------- Lab 4: RAG pipeline ---------- */
  (function rag() {
    const steps = [['Query', '❓'], ['Embed', '🧮'], ['Vector DB', '🗄️'], ['Ollama LLM', '🦙'], ['Answer', '✅']];
    animate($('rag-canvas'), (ctx, W, H, t) => {
      ctx.clearRect(0, 0, W, H);
      const n = steps.length, gx = (W - 80) / (n - 1), y = H / 2, p = (t / 90) % (n + 0.5);
      ctx.lineWidth = 2; for (let i = 0; i < n - 1; i++) { ctx.strokeStyle = p > i + 0.5 ? '#22d3ee' : 'rgba(143,163,192,.3)'; ctx.setLineDash([6, 5]); ctx.lineDashOffset = -t / 2; ctx.beginPath(); ctx.moveTo(40 + i * gx + 26, y); ctx.lineTo(40 + (i + 1) * gx - 26, y); ctx.stroke(); }
      ctx.setLineDash([]);
      steps.forEach(([label, ic], i) => { const x = 40 + i * gx, on = Math.max(0, 1 - Math.abs(p - i) * 1.4);
        ctx.beginPath(); ctx.arc(x, y, 26, 0, 6.283); ctx.fillStyle = `rgba(14,22,44,.95)`; ctx.fill();
        ctx.strokeStyle = on > .2 ? '#34d399' : '#22d3ee'; ctx.lineWidth = 1.5 + on * 2; ctx.shadowColor = '#34d399'; ctx.shadowBlur = on * 20; ctx.stroke(); ctx.shadowBlur = 0;
        ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(ic, x, y + 7);
        ctx.font = '11px JetBrains Mono, monospace'; ctx.fillStyle = '#8fa3c0'; ctx.fillText(label, x, y + 50); });
      // retrieved chunk "documents" under the vector DB
      for (let k = 0; k < 3; k++) { const x = 40 + 2 * gx - 30 + k * 24, hit = p > 2.2 && p < 3.6; ctx.fillStyle = hit ? '#fbbf24' : 'rgba(143,163,192,.35)'; ctx.fillRect(x, y + 78 + (hit ? -4 : 0), 16, 20); }
      ctx.fillStyle = '#8fa3c0'; ctx.font = '11px JetBrains Mono, monospace'; ctx.fillText('top-k chunks', 40 + 2 * gx, y + 112);
      // packet
      if (p < n - 1) { const i = Math.floor(p), f = p - i, x = 40 + (i + f) * gx; ctx.beginPath(); ctx.arc(x, y, 5, 0, 6.283); ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0; }
    });
  })();

  /* ---------- Animated terminal (Ollama / Python) ---------- */
  (function term() {
    const t = $('term');
    const script = [
      ['<span class="p">$</span> ollama run llama3 ', 700], ['\n<span class="q">>>> </span>Explain RAG in one line.\n', 900],
      ['RAG retrieves relevant documents and feeds them to an LLM so answers stay grounded in your data.\n\n', 700],
      ['<span class="p">$</span> python train.py --epochs 50\n', 600], ['epoch 10/50  loss=0.842  acc=0.71\nepoch 25/50  loss=0.391  acc=0.86\nepoch 50/50  loss=0.147  acc=0.95\n', 500],
      ['\n<span class="p">$</span> claude "build my portfolio"\n', 600], ['✔ analysing → ✔ coding → ✔ shipping 🚀\n', 2500]
    ];
    if (reduceMotion) { t.innerHTML = script.map((s) => s[0]).join(''); return; }
    let started = false;
    new IntersectionObserver((e) => { if (e[0].isIntersecting && !started) { started = true; run(); } }).observe(t);
    async function run() {
      while (true) {
        t.innerHTML = '';
        for (const [html, wait] of script) {
          // type visible text char-by-char while keeping tags intact
          const tokens = html.match(/<[^>]+>|[^<]/g); let out = t.innerHTML;
          for (const tk of tokens) { out += tk; t.innerHTML = out; if (tk[0] !== '<') await new Promise((r) => setTimeout(r, 14)); }
          await new Promise((r) => setTimeout(r, wait));
        }
      }
    }
  })();

  /* ---------- Contact form (Formspree) ---------- */
  const form = $('contact-form'), status = $('form-status'), btn = $('submit-btn');
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); btn.disabled = true; btn.textContent = 'Sending...'; status.textContent = ''; status.className = 'status';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { status.textContent = 'Thanks! Your message has been sent.'; status.className = 'status success'; form.reset(); btn.textContent = 'Message Sent!'; setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; }, 3000); return; }
      const r = await res.json().catch(() => ({}));
      throw new Error(r.errors ? r.errors.map((x) => x.message).join(', ') : 'Oops! There was a problem submitting your form.');
    } catch (err) { status.textContent = err.message; status.className = 'status error'; btn.disabled = false; btn.textContent = 'Send Message'; }
  });

  /* ---------- Dynamic CV (generated from data.js on every click) ---------- */
  function buildCV() {
    if (!window.jspdf) { alert('PDF library could not load. Check your connection and try again.'); return; }
    const doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
    const M = 48, PW = doc.internal.pageSize.getWidth(), PH = doc.internal.pageSize.getHeight(), CW = PW - M * 2; let y = M;
    const need = (h) => { if (y + h > PH - M) { doc.addPage(); y = M; } };
    const text = (s, size, style, color, indent = 0, gap = 4) => {
      doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(...color);
      doc.splitTextToSize(s, CW - indent).forEach((ln) => { need(size + 3); doc.text(ln, M + indent, y + size); y += size + 3; }); y += gap;
    };
    const section = (title) => { need(40); y += 8; text(title.toUpperCase(), 12, 'bold', [14, 116, 144], 0, 1); doc.setDrawColor(14, 116, 144); doc.line(M, y, M + CW, y); y += 8; };

    text(D.name, 24, 'bold', [15, 23, 42], 0, 2);
    text(D.title, 12, 'normal', [71, 85, 105], 0, 2);
    text([D.email, D.github.replace('https://', ''), D.linkedin.replace('https://', ''), D.location].join('  |  '), 9, 'normal', [71, 85, 105], 0, 4);
    text(`Date of birth: ${D.dob}  |  Nationality: ${D.nationality}`, 9, 'normal', [71, 85, 105], 0, 2);
    section('Profile'); text(D.summary, 10, 'normal', [30, 41, 59]);
    section('Education');
    D.education.forEach((e) => { text(`${e.title} — ${e.place}`, 10.5, 'bold', [15, 23, 42], 0, 0); text(`${e.period}  |  ${e.level}`, 9, 'normal', [100, 116, 139], 0, 2); e.points.forEach((p) => text('•  ' + p, 9.5, 'normal', [30, 41, 59], 10, 1)); y += 6; });
    section('Skills');
    const groups = {}; D.skills.forEach((s) => (groups[s.group] = groups[s.group] || []).push(s.name));
    Object.entries(groups).forEach(([g, list]) => text(`${g}: ${list.join(', ')}`, 10, 'normal', [30, 41, 59], 0, 2));
    section('Projects');
    D.projects.forEach((p) => { text(`${p.name}  (${p.tag})`, 10.5, 'bold', [15, 23, 42], 0, 0); text(p.desc, 9.5, 'normal', [30, 41, 59], 10, 0); text((p.live ? p.live + '  |  ' : '') + p.link, 9, 'normal', [14, 116, 144], 10, 6); });
    section('Experience & Leadership');
    D.experience.forEach((x) => { text(`${x.role} — ${x.org}`, 10.5, 'bold', [15, 23, 42], 0, 0); text(x.period, 9, 'normal', [100, 116, 139], 0, 2); text(x.desc, 9.5, 'normal', [30, 41, 59], 10, 6); });
    section('Goals'); D.goals.forEach((g) => text('•  ' + g, 9.5, 'normal', [30, 41, 59], 10, 1));
    const stamp = new Date().toISOString().slice(0, 10);
    doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.text(`Generated from live portfolio on ${stamp}`, M, PH - 24);
    doc.save(`${D.name.replace(/\s+/g, '_')}_CV_${stamp}.pdf`);
  }
  ['cv-btn', 'cv-btn-nav', 'cv-btn-contact'].forEach((id) => $(id).addEventListener('click', buildCV));
})();
