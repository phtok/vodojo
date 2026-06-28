// Daily reminder sender. Triggered by Vercel Cron (see vercel.json) once per day.
// Manual test in a browser: /api/cron?key=<CRON_SECRET>
const webpush = require('web-push');
const { Redis } = require('@upstash/redis');

function store() {
  return new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.vodojo_KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.vodojo_KV_REST_API_TOKEN,
  });
}

module.exports = async (req, res) => {
  const secret = process.env.CRON_SECRET;
  const authed =
    !secret ||
    req.headers.authorization === `Bearer ${secret}` ||
    (req.query && req.query.key === secret);
  if (!authed) { res.status(401).json({ error: 'unauthorized' }); return; }

  if (!process.env.VAPID_PRIVATE_KEY || !process.env.VAPID_PUBLIC_KEY) {
    res.status(500).json({ error: 'VAPID keys not configured' }); return;
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:philipp@saetzerei.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const payload = JSON.stringify({
    title: 'Aikido Vokabel-Dojo',
    body: 'Zeit fürs Dojo – kurze Übungsrunde?',
  });

  const r = store();
  let raw = [];
  try { raw = await r.smembers('subs'); } catch (e) { res.status(500).json({ error: 'store: ' + String(e && e.message || e) }); return; }

  let sent = 0, removed = 0;
  const errors = [];
  for (const item of raw) {
    const sub = typeof item === 'string' ? JSON.parse(item) : item;
    try {
      await webpush.sendNotification(sub, payload);
      sent++;
    } catch (err) {
      const code = err && err.statusCode;
      const detail = err && (err.body || err.message);
      errors.push({ code, detail: typeof detail === 'string' ? detail.slice(0, 200) : detail, host: (() => { try { return new URL(sub.endpoint).host; } catch (_) { return undefined; } })() });
      console.error('push send failed', code, detail);
      const dead = code === 404 || code === 410 || code === 403 ||
        (code === 400 && typeof detail === 'string' && detail.indexOf('VapidPkHashMismatch') !== -1);
      if (dead) {
        try { await r.srem('subs', typeof item === 'string' ? item : JSON.stringify(item)); removed++; } catch (_) {}
      }
    }
  }
  res.status(200).json({ sent, removed, total: raw.length, errors });
};
