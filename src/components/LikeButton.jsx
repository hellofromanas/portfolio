import React, { useCallback, useEffect, useState } from 'react';

const ID_KEY = 'portfolio-visitor-id';
const LIKED_KEY = 'portfolio-liked';

const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } };

// Random anonymous id per browser (not the IP), so people on shared networks can each like once.
function visitorId() {
  let id = safeGet(ID_KEY);
  if (!id || id.length < 16) {
    id = (crypto.randomUUID ? crypto.randomUUID() : Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
    safeSet(ID_KEY, id);
  }
  return id;
}

// Global like counter stored on the server (Vercel Function + Blob). Count refreshes while the page is open.
export default function LikeButton() {
  const [count, setCount] = useState(null);
  const [liked, setLiked] = useState(safeGet(LIKED_KEY) === '1');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(`/api/likes?id=${visitorId()}`, { cache: 'no-store' });
      if (!r.ok) throw new Error('bad status');
      const d = await r.json();
      setCount(d.count); setErr('');
      if (d.liked) { setLiked(true); safeSet(LIKED_KEY, '1'); }
    } catch { setErr('Like counter is temporarily unavailable.'); }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(() => { if (!document.hidden) refresh(); }, 30000);
    return () => clearInterval(t);
  }, [refresh]);

  const like = async () => {
    if (liked || busy) return;
    setBusy(true); setErr('');
    setLiked(true); setCount((c) => (c === null ? c : c + 1)); // optimistic
    try {
      const r = await fetch(`/api/likes?id=${visitorId()}`, { method: 'POST' });
      if (!r.ok) throw new Error('bad status');
      const d = await r.json();
      setCount(d.count); safeSet(LIKED_KEY, '1');
    } catch {
      setLiked(false); setCount((c) => (c === null ? c : Math.max(0, c - 1)));
      setErr('Could not save your like. Please try again.');
    }
    setBusy(false);
  };

  return (
    <div className="like">
      <button className={`like-btn${liked ? ' on' : ''}`} onClick={like} disabled={liked || busy} aria-pressed={liked} aria-label={liked ? 'You liked this portfolio' : 'Like this portfolio'}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M12 20.5s-7.5-4.6-9.6-9.3C.9 7.8 2.7 4.5 6 4.5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.3 0 5.1 3.3 3.6 6.7-2.1 4.7-5.6 9.3-5.6 9.3z" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <span>{liked ? 'Thanks for the like!' : 'Like this portfolio'}</span>
        <b>{count === null ? '–' : count.toLocaleString()}</b>
      </button>
      {err && <p className="like-err" role="status">{err}</p>}
    </div>
  );
}
