import { useEffect, useRef, useState } from 'react';

export const reduceMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal-on-scroll
export function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, shown];
}

// Runs draw(ctx,w,h,t) every frame, but only while the canvas is on screen.
export function useCanvasLoop(draw) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); let vis = false, t = 0, raf;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0.1 });
    io.observe(cv);
    const frame = () => { if (vis || (reduceMotion() && t === 0)) { t++; draw(ctx, cv.width, cv.height, t); } raf = requestAnimationFrame(frame); };
    frame();
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [draw]);
  return ref;
}

// Which section is currently in view (for nav highlighting)
export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 120; let cur = ids[0];
      ids.forEach((id) => { const el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; });
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) cur = ids[ids.length - 1];
      setActive(cur);
    };
    onScroll(); addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
  }, [ids]);
  return active;
}
