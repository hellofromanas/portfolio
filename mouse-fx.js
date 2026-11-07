// Mouse / touch effects themed around data science & AI. Fully disabled for prefers-reduced-motion.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fine = matchMedia('(pointer: fine)').matches;

  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  let W, H;
  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  addEventListener('resize', resize); resize();

  const glyphs = ['0', '1', '0', '1', 'σ', 'λ', '∑', '∇', 'μ', 'π', 'β', 'θ', '∫', '{ }', '[ ]', 'x²'];
  const colors = ['#22d3ee', '#a78bfa', '#34d399'];
  const trail = [], bursts = [], rings = [];
  const m = { x: -100, y: -100, rx: -100, ry: -100, lastX: 0, lastY: 0, down: false };
  let hoverBig = false;

  /* ---- 1. Trail of data glyphs behind the cursor ---- */
  /* ---- 2. Cursor ring + live coordinates readout (desktop) ---- */
  addEventListener('pointermove', (e) => {
    m.x = e.clientX; m.y = e.clientY;
    if (e.pointerType === 'touch') return;
    if (Math.hypot(m.x - m.lastX, m.y - m.lastY) > 22 && trail.length < 60) {
      m.lastX = m.x; m.lastY = m.y;
      trail.push({ x: m.x, y: m.y, vy: -0.4 - Math.random() * 0.5, vx: (Math.random() - .5) * .6, life: 1, g: glyphs[(Math.random() * glyphs.length) | 0], c: colors[(Math.random() * 3) | 0], s: 11 + Math.random() * 7 });
    }
    hoverBig = !!e.target.closest && !!e.target.closest('a,button,input,textarea,.card,.skill');
  }, { passive: true });

  /* ---- 3. Click / tap: a "neuron firing" burst + expanding ring ---- */
  const burst = (x, y) => {
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283 + Math.random() * .3, sp = 2 + Math.random() * 3;
      bursts.push({ x, y, ox: x, oy: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: colors[i % 3] });
    }
    rings.push({ x, y, r: 6, life: 1 });
  };
  addEventListener('pointerdown', (e) => { m.down = true; burst(e.clientX, e.clientY); });
  addEventListener('pointerup', () => { m.down = false; });

  /* ---- 4. 3-D tilt + spotlight on cards, panels and skills ---- */
  if (fine) {
    const sel = '.card,.skill,.panel';
    document.addEventListener('pointermove', (e) => {
      const t = e.target.closest && e.target.closest(sel);
      if (!t) return;
      const r = t.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      t.style.setProperty('--mx', px * 100 + '%'); t.style.setProperty('--my', py * 100 + '%');
      if (!t.classList.contains('panel')) t.style.transform = `perspective(700px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg) translateY(-4px)`;
    }, { passive: true });
    document.addEventListener('pointerout', (e) => {
      const t = e.target.closest && e.target.closest(sel);
      if (t && !t.contains(e.relatedTarget)) t.style.transform = '';
    });
    /* ---- 5. Magnetic buttons ---- */
    document.addEventListener('pointermove', (e) => {
      document.querySelectorAll('.btn').forEach((b) => {
        const r = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, d = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (d < 110) { b.style.setProperty('--tx', (e.clientX - cx) * 0.18 + 'px'); b.style.setProperty('--ty', (e.clientY - cy) * 0.28 + 'px'); }
        else { b.style.setProperty('--tx', '0px'); b.style.setProperty('--ty', '0px'); }
      });
    }, { passive: true });
    /* ---- 6. Hero photo parallax ---- */
    const av = document.querySelector('.avatar-wrap');
    if (av) addEventListener('pointermove', (e) => {
      const dx = (e.clientX / innerWidth - .5), dy = (e.clientY / innerHeight - .5);
      av.style.transform = `translate(${dx * 16}px,${dy * 16}px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg)`;
    }, { passive: true });
  }

  (function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.018;
      if (p.life <= 0) { trail.splice(i, 1); continue; }
      ctx.globalAlpha = p.life * .85; ctx.fillStyle = p.c; ctx.font = `${p.s}px JetBrains Mono, monospace`; ctx.fillText(p.g, p.x, p.y);
    }
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i]; b.x += b.vx; b.y += b.vy; b.vx *= 0.94; b.vy *= 0.94; b.life -= 0.03;
      if (b.life <= 0) { bursts.splice(i, 1); continue; }
      ctx.globalAlpha = b.life * .6; ctx.strokeStyle = b.c; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(b.ox, b.oy); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.globalAlpha = b.life; ctx.fillStyle = b.c; ctx.beginPath(); ctx.arc(b.x, b.y, 2.6, 0, 6.283); ctx.fill();
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i]; r.r += 3.2; r.life -= 0.03;
      if (r.life <= 0) { rings.splice(i, 1); continue; }
      ctx.globalAlpha = r.life * .7; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 6.283); ctx.stroke();
    }
    if (fine && m.x > -50) { // crosshair ring that lags the pointer + coordinate readout
      m.rx += (m.x - m.rx) * 0.18; m.ry += (m.y - m.ry) * 0.18;
      const R = hoverBig ? 26 : m.down ? 10 : 16;
      ctx.globalAlpha = .9; ctx.strokeStyle = hoverBig ? '#a78bfa' : '#22d3ee'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(m.rx, m.ry, R, 0, 6.283); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(m.rx - R - 5, m.ry); ctx.lineTo(m.rx - R + 4, m.ry); ctx.moveTo(m.rx + R - 4, m.ry); ctx.lineTo(m.rx + R + 5, m.ry);
      ctx.moveTo(m.rx, m.ry - R - 5); ctx.lineTo(m.rx, m.ry - R + 4); ctx.moveTo(m.rx, m.ry + R - 4); ctx.lineTo(m.rx, m.ry + R + 5); ctx.stroke();
      ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(m.x, m.y, 2.5, 0, 6.283); ctx.fill();
      ctx.globalAlpha = .55; ctx.fillStyle = '#8fa3c0'; ctx.font = '10px JetBrains Mono, monospace'; ctx.textAlign = 'left';
      ctx.fillText(`x:${m.x | 0} y:${m.y | 0}`, m.rx + R + 10, m.ry + R + 10);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  })();
})();
