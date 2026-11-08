import React, { useEffect, useState } from 'react';

const KEY = 'portfolio-liked';
const read = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
const write = () => { try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ } };

// Global like counter persisted on the server (Vercel Function + Blob). One like per visitor.
export default function LikeButton() {
  const [count, setCount] = useState(null);
  const [liked, setLiked] = useState(read());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch('/api/likes')
      .then((r) => r.json())
      .then((d) => { setCount(d.count); if (d.liked) { setLiked(true); write(); } })
      .catch(() => setErr('Like counter unavailable right now.'));
  }, []);

  const like = async () => {
    if (liked || busy) return;
    setBusy(true); setErr(''); setLiked(true);
    try {
      const r = await fetch('/api/likes', { method: 'POST' });
      if (!r.ok) throw new Error('failed');
      const d = await r.json();
      setCount(d.count); write();
    } catch {
      setLiked(false); setErr('Could not save your like. Please try again.');
    }
    setBusy(false);
  };

  return (
    <div className="like">
      <button className={`like-btn${liked ? ' on' : ''}`} onClick={like} disabled={liked} aria-pressed={liked} aria-label={liked ? 'You liked this portfolio' : 'Like this portfolio'}>
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
