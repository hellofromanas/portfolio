import React, { useEffect, useRef, useState } from 'react';
import { useCanvasLoop, reduceMotion } from '../hooks.js';

const T = 'JetBrains Mono, monospace';

function Panel({ title, caption, children }) {
  return (
    <article className="panel">
      <header><span className="mono">{title}</span><i className="pulse" /></header>
      {children}
      {caption && <p className="cap">{caption}</p>}
    </article>
  );
}

const layers = [4, 6, 6, 3];
function drawNN(ctx, W, H, t) {
  ctx.clearRect(0, 0, W, H);
  const pos = layers.map((n, li) => Array.from({ length: n }, (_, i) => ({ x: 70 + li * ((W - 140) / (layers.length - 1)), y: H / 2 + 8 + (i - (n - 1) / 2) * 42 })));
  const wave = (t / 70) % (layers.length + 0.6);
  for (let l = 0; l < layers.length - 1; l++) {
    pos[l].forEach((a) => pos[l + 1].forEach((b) => {
      const on = Math.max(0, 1 - Math.abs(wave - l - 0.5) * 1.3);
      ctx.strokeStyle = `rgba(96,165,250,${0.08 + on * 0.5})`; ctx.lineWidth = 0.7 + on;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }));
  }
  pos.forEach((layer, l) => layer.forEach((n) => {
    const on = Math.max(0, 1 - Math.abs(wave - l) * 1.2);
    ctx.beginPath(); ctx.arc(n.x, n.y, 9 + on * 3, 0, 6.283);
    ctx.fillStyle = l === layers.length - 1 ? `rgba(52,211,153,${0.35 + on})` : `rgba(129,140,248,${0.3 + on})`;
    ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = on * 16; ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 1.2; ctx.stroke();
  }));
  ctx.fillStyle = '#8b9bb4'; ctx.font = `12px ${T}`; ctx.textAlign = 'center';
  ['input', 'hidden 1', 'hidden 2', 'output'].forEach((s, l) => ctx.fillText(s, pos[l][0].x, 22));
}

const pts = Array.from({ length: 120 }, (_, i) => 2.4 * Math.exp(-i / 28) + 0.12 + Math.sin(i * 1.7) * 0.05 * Math.exp(-i / 60));
function drawLoss(ctx, W, H, t) {
  ctx.clearRect(0, 0, W, H);
  const L = 48, R = W - 20, Tp = 24, B = H - 36, shown = Math.min(pts.length, Math.floor((t % 260) / 2));
  ctx.strokeStyle = 'rgba(139,155,180,.18)'; ctx.fillStyle = '#8b9bb4'; ctx.font = `11px ${T}`; ctx.textAlign = 'right';
  for (let g = 0; g <= 4; g++) {
    const y = Tp + (B - Tp) * g / 4;
    ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
    ctx.fillText((2.6 - 2.6 * g / 4).toFixed(1), L - 6, y + 4);
  }
  ctx.textAlign = 'center'; ctx.fillText('epochs →', W / 2, H - 8);
  const X = (i) => L + (R - L) * i / (pts.length - 1), Y = (v) => B - (B - Tp) * v / 2.6;
  const grad = ctx.createLinearGradient(0, Tp, 0, B);
  grad.addColorStop(0, 'rgba(96,165,250,.35)'); grad.addColorStop(1, 'rgba(96,165,250,0)');
  ctx.beginPath(); ctx.moveTo(X(0), B);
  for (let i = 0; i < shown; i++) ctx.lineTo(X(i), Y(pts[i]));
  ctx.lineTo(X(Math.max(shown - 1, 0)), B); ctx.fillStyle = grad; ctx.fill();
  ctx.beginPath();
  for (let i = 0; i < shown; i++) { if (i) ctx.lineTo(X(i), Y(pts[i])); else ctx.moveTo(X(i), Y(pts[i])); }
  ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2.2; ctx.stroke();
  if (shown > 0) {
    const i = shown - 1;
    ctx.beginPath(); ctx.arc(X(i), Y(pts[i]), 5, 0, 6.283); ctx.fillStyle = '#34d399'; ctx.shadowColor = '#34d399'; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
    ctx.textAlign = 'left'; ctx.fillStyle = '#e8eefc'; ctx.fillText(`epoch ${i}  loss ${pts[i].toFixed(3)}`, L + 10, Tp + 14);
  }
}

const bars = Array.from({ length: 8 }, () => Math.random());
const targets = bars.map(() => Math.random());
const series = Array.from({ length: 40 }, (_, i) => 0.5 + Math.sin(i / 4) * 0.2);
function drawDash(ctx, W, H, t) {
  ctx.clearRect(0, 0, W, H);
  if (t % 90 === 0) targets.forEach((_, i) => { targets[i] = 0.2 + Math.random() * 0.8; });
  if (t % 6 === 0) { series.shift(); series.push(Math.max(0.1, Math.min(0.95, series[series.length - 1] + (Math.random() - 0.5) * 0.18))); }
  const cols = ['#60a5fa', '#818cf8', '#34d399', '#fbbf24'], bw = 26, gap = 10, base = H - 40, maxH = H - 100;
  bars.forEach((v, i) => {
    bars[i] += (targets[i] - v) * 0.06;
    const h = bars[i] * maxH, x = 24 + i * (bw + gap);
    ctx.fillStyle = cols[i % 4]; ctx.globalAlpha = 0.85; ctx.fillRect(x, base - h, bw, h); ctx.globalAlpha = 1;
  });
  ctx.fillStyle = '#8b9bb4'; ctx.font = `11px ${T}`; ctx.textAlign = 'left'; ctx.fillText('Revenue by region', 24, 20);
  ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].forEach((s, i) => ctx.fillText(s, 28 + i * (bw + gap), base + 16));
  const x0 = 24 + 8 * (bw + gap) + 20, w = W - x0 - 20;
  ctx.fillText('Live KPI', x0, 20);
  ctx.beginPath();
  series.forEach((v, i) => { const x = x0 + w * i / (series.length - 1), y = base - v * maxH; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
  ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.stroke();
  const cx = x0 + w / 2, cy = 80, r = 34, parts = [0.45, 0.3, 0.25];
  let a0 = -Math.PI / 2 + t / 120;
  parts.forEach((p, i) => { ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + p * 6.283); ctx.strokeStyle = cols[i]; ctx.lineWidth = 12; ctx.stroke(); a0 += p * 6.283; });
}

const steps = ['Query', 'Embed', 'Vector DB', 'Ollama LLM', 'Answer'];
const glyph = ['?', '[ ]', 'DB', 'AI', '✓'];
function drawRag(ctx, W, H, t) {
  ctx.clearRect(0, 0, W, H);
  const n = steps.length, gx = (W - 80) / (n - 1), y = H / 2 - 10, p = (t / 90) % (n + 0.5);
  ctx.lineWidth = 2;
  for (let i = 0; i < n - 1; i++) {
    ctx.strokeStyle = p > i + 0.5 ? '#60a5fa' : 'rgba(139,155,180,.3)'; ctx.setLineDash([6, 5]); ctx.lineDashOffset = -t / 2;
    ctx.beginPath(); ctx.moveTo(40 + i * gx + 26, y); ctx.lineTo(40 + (i + 1) * gx - 26, y); ctx.stroke();
  }
  ctx.setLineDash([]);
  steps.forEach((label, i) => {
    const x = 40 + i * gx, on = Math.max(0, 1 - Math.abs(p - i) * 1.4);
    ctx.beginPath(); ctx.arc(x, y, 26, 0, 6.283); ctx.fillStyle = 'rgba(12,18,34,.95)'; ctx.fill();
    ctx.strokeStyle = on > 0.2 ? '#34d399' : '#60a5fa'; ctx.lineWidth = 1.5 + on * 2; ctx.shadowColor = '#34d399'; ctx.shadowBlur = on * 18; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.font = `600 13px ${T}`; ctx.textAlign = 'center'; ctx.fillStyle = '#e8eefc'; ctx.fillText(glyph[i], x, y + 5);
    ctx.font = `11px ${T}`; ctx.fillStyle = '#8b9bb4'; ctx.fillText(label, x, y + 50);
  });
  for (let k = 0; k < 3; k++) {
    const x = 40 + 2 * gx - 30 + k * 24, hit = p > 2.2 && p < 3.6;
    ctx.fillStyle = hit ? '#fbbf24' : 'rgba(139,155,180,.35)'; ctx.fillRect(x, y + 78 + (hit ? -4 : 0), 16, 20);
  }
  ctx.fillStyle = '#8b9bb4'; ctx.font = `11px ${T}`; ctx.fillText('top-k chunks', 40 + 2 * gx, y + 112);
  if (p < n - 1) {
    const i = Math.floor(p), f = p - i, x = 40 + (i + f) * gx;
    ctx.beginPath(); ctx.arc(x, y, 5, 0, 6.283); ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
  }
}

function Cv({ draw, label }) {
  const ref = useCanvasLoop(draw);
  return <canvas ref={ref} width="520" height="300" role="img" aria-label={label} />;
}

const script = [
  ['$ ', 'p'], ['ollama run llama3\n', ''], ['>>> ', 'q'], ['Explain RAG in one line.\n', ''],
  ['RAG retrieves relevant documents and feeds them to an LLM so answers stay grounded in your data.\n\n', ''],
  ['$ ', 'p'], ['python train.py --epochs 50\n', ''],
  ['epoch 10/50  loss=0.842  acc=0.71\nepoch 25/50  loss=0.391  acc=0.86\nepoch 50/50  loss=0.147  acc=0.95\n\n', ''],
];

function Terminal() {
  const [done, setDone] = useState([]);
  const [cur, setCur] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (reduceMotion()) { setDone(script); return undefined; }
    let dead = false, started = false;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const run = async () => {
      while (!dead) {
        setDone([]); setCur(null);
        for (const [txt, cls] of script) {
          for (let i = 1; i <= txt.length; i++) {
            if (dead) return;
            setCur([txt.slice(0, i), cls]); await sleep(14);
          }
          setDone((d) => [...d, [txt, cls]]); setCur(null);
          await sleep(cls ? 100 : 500);
        }
        await sleep(2500);
      }
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { started = true; run(); } });
    io.observe(ref.current);
    return () => { dead = true; io.disconnect(); };
  }, []);
  const all = cur ? [...done, cur] : done;
  return <pre className="term" ref={ref} aria-hidden="true">{all.map(([t, c], i) => <span key={i} className={c}>{t}</span>)}</pre>;
}

export default function Labs() {
  return (
    <div className="lab-grid">
      <Panel title="Neural network (diagram)" caption="A feed-forward network: signals flow input → hidden → output."><Cv draw={drawNN} label="Animated diagram of a feed-forward neural network with four layers" /></Panel>
      <Panel title="Loss curve (simulated)" caption="Gradient descent: loss falls as epochs progress. Illustrative curve, not a real training run."><Cv draw={drawLoss} label="Animated line chart of a training loss curve falling over epochs (simulated)" /></Panel>
      <Panel title="Dashboard (simulated data)" caption="Random streaming data drawn like a Power BI dashboard. See the Sales Dashboard project for the real model."><Cv draw={drawDash} label="Animated bar, line and donut charts of simulated sales data" /></Panel>
      <Panel title="RAG pipeline (diagram)" caption="Query → Embed → Vector search → LLM (Ollama) → Answer. The working code is in the rag-ollama-local project."><Cv draw={drawRag} label="Animated diagram of a RAG pipeline: query, embed, vector database, Ollama LLM, answer" /></Panel>
      <article className="panel wide"><header><span className="mono">Terminal (scripted example)</span><i className="pulse" /></header><Terminal /></article>
    </div>
  );
}
