import React, { useEffect, useRef } from 'react';
import { reduceMotion } from '../hooks.js';

// Ambient neural-network background with data packets. No mouse interaction.
export default function Background() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d');
    let W, H, raf;
    const N = innerWidth < 700 ? 30 : 70, still = reduceMotion();
    const nodes = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0003, vy: (Math.random() - 0.5) * 0.0003 }));
    const pulses = [];
    const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
    addEventListener('resize', resize); resize();
    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        if (!still) { n.x += n.vx; n.y += n.vy; }
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        n.px = n.x * W; n.py = n.y * H;
        ctx.beginPath(); ctx.arc(n.px, n.py, 1.8, 0, 6.283); ctx.fillStyle = 'rgba(96,165,250,.5)'; ctx.fill();
      });
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i], b = nodes[j], d = Math.hypot(a.px - b.px, a.py - b.py);
          if (d < 150) {
            ctx.strokeStyle = `rgba(96,165,250,${(1 - d / 150) * 0.2})`; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();
            if (!still && Math.random() < 0.0008 && pulses.length < 20) pulses.push({ a, b, t: 0 });
          }
        }
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k]; p.t += 0.02;
        if (p.t >= 1) { pulses.splice(k, 1); continue; }
        ctx.beginPath(); ctx.arc(p.a.px + (p.b.px - p.a.px) * p.t, p.a.py + (p.b.py - p.a.py) * p.t, 2.6, 0, 6.283);
        ctx.fillStyle = '#34d399'; ctx.shadowColor = '#34d399'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="bg" aria-hidden="true" />;
}
