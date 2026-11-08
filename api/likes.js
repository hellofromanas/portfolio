import { get, put } from '@vercel/blob';
import { createHash } from 'node:crypto';

const PATH = 'likes.json';
const opts = { access: 'private' };

async function read() {
  try {
    const r = await get(PATH, opts);
    if (!r || r.statusCode === 404 || !r.stream) return { count: 0, voters: [] };
    const text = await new Response(r.stream).text();
    const j = JSON.parse(text);
    return { count: Number(j.count) || 0, voters: Array.isArray(j.voters) ? j.voters : [] };
  } catch {
    return { count: 0, voters: [] };
  }
}

const visitorId = (req) => {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  return createHash('sha256').update(ip + '|' + (process.env.BLOB_READ_WRITE_TOKEN || '').slice(-12)).digest('hex').slice(0, 20);
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const id = visitorId(req);
  const data = await read();
  if (req.method === 'POST') {
    if (!data.voters.includes(id)) {
      data.voters.push(id);
      data.count += 1;
      await put(PATH, JSON.stringify(data), { ...opts, allowOverwrite: true, addRandomSuffix: false, contentType: 'application/json' });
    }
  } else if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.status(200).json({ count: data.count, liked: data.voters.includes(id) });
}
