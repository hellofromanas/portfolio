import { list, put } from '@vercel/blob';

// Each like is its own tiny blob: likes/<anonymous-browser-id>.
// - No read-modify-write, so any number of people can like at the same moment without losing likes.
// - One like per browser id (re-posting the same id is a no-op), not per IP, so shared networks work.
const PREFIX = 'likes/';
const ID_RE = /^[a-zA-Z0-9-]{16,64}$/;
const opts = { access: 'private' };

async function countAll() {
  let n = 0, cursor;
  do {
    const r = await list({ prefix: PREFIX, limit: 1000, cursor });
    n += r.blobs.length;
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return n;
}

async function hasLiked(id) {
  if (!id) return false;
  const r = await list({ prefix: PREFIX + id, limit: 1 });
  return r.blobs.some((b) => b.pathname === PREFIX + id);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const id = String((req.query && req.query.id) || '');
  const valid = ID_RE.test(id);
  try {
    if (req.method === 'POST') {
      if (!valid) return res.status(400).json({ error: 'Invalid visitor id' });
      try {
        await put(PREFIX + id, '1', { ...opts, allowOverwrite: false, addRandomSuffix: false, contentType: 'text/plain' });
      } catch (e) {
        // Already liked from this browser -> fine, just report the count.
        if (!/exist/i.test(String(e && e.message))) throw e;
      }
      return res.status(200).json({ count: await countAll(), liked: true });
    }
    if (req.method === 'GET') {
      const [count, liked] = await Promise.all([countAll(), valid ? hasLiked(id) : false]);
      return res.status(200).json({ count, liked });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'Like service error' });
  }
}
