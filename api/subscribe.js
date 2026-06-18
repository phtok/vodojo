// Stores / removes a Web Push subscription. Used by the "Tägliche Erinnerung" toggle.
const { Redis } = require('@upstash/redis');

function store() {
  return new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

module.exports = async (req, res) => {
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = null; } }

  if (req.method === 'POST') {
    if (!body || !body.endpoint) { res.status(400).json({ error: 'no subscription' }); return; }
    try {
      await store().sadd('subs', JSON.stringify(body));
      res.status(201).json({ ok: true });
    } catch (e) { res.status(500).json({ error: String(e && e.message || e) }); }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      if (body && body.endpoint) await store().srem('subs', JSON.stringify(body));
      res.status(200).json({ ok: true });
    } catch (e) { res.status(500).json({ error: String(e && e.message || e) }); }
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
