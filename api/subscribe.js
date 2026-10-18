// Stores / removes a Web Push subscription plus its reminder time.
// Used by the "Tägliche Erinnerung" toggle. Subscriptions live in the Redis
// hash `reminders`, keyed by endpoint, value = { endpoint, keys, time, tz }.
const { Redis } = require('@upstash/redis');

function store() {
  return new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.vodojo_KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.vodojo_KV_REST_API_TOKEN,
  });
}

function cleanTime(t) {
  return (typeof t === 'string' && /^\d{2}:\d{2}$/.test(t)) ? t : '18:00';
}

module.exports = async (req, res) => {
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = null; } }

  const r = store();

  if (req.method === 'POST') {
    if (!body || !body.endpoint) { res.status(400).json({ error: 'no subscription' }); return; }
    const rec = {
      endpoint: body.endpoint,
      keys: body.keys,
      expirationTime: body.expirationTime || null,
      time: cleanTime(body.time),
      tz: typeof body.tz === 'string' && body.tz ? body.tz : 'UTC',
    };
    try {
      await r.hset('reminders', { [body.endpoint]: rec });
      res.status(201).json({ ok: true, time: rec.time, tz: rec.tz });
    } catch (e) { res.status(500).json({ error: String(e && e.message || e) }); }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      if (body && body.endpoint) await r.hdel('reminders', body.endpoint);
      res.status(200).json({ ok: true });
    } catch (e) { res.status(500).json({ error: String(e && e.message || e) }); }
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
