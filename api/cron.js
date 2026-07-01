// Reminder sender. Triggered frequently (GitHub Actions ~every 15 min) and once
// daily by Vercel Cron as a fallback. For each stored subscription it sends a
// push only when the device's chosen local time is due today.
// Manual test (send to all now): /api/cron?key=<CRON_SECRET>&force=1
const webpush = require('web-push');
const { Redis } = require('@upstash/redis');

const GRACE = 120; // minutes: still send if a run was missed, but not hours late

function store() {
  return new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.vodojo_KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.vodojo_KV_REST_API_TOKEN,
  });
}

function parseHHMM(s) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s || '');
  if (!m) return null;
  const h = +m[1], mi = +m[2];
  if (h > 23 || mi > 59) return null;
  return h * 60 + mi;
}

// Current wall-clock in a given IANA timezone -> { date: 'YYYY-MM-DD', minutes }
function localNow(tz) {
  let parts;
  try {
    parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  } catch (_) {
    parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  }
  const p = {};
  for (const x of parts) p[x.type] = x.value;
  let h = parseInt(p.hour, 10); if (h === 24) h = 0;
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: h * 60 + parseInt(p.minute, 10) };
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

  const force = !!(req.query && (req.query.force === '1' || req.query.force === 'true'));

  // Einmalige Wartung: /api/cron?key=<CRON_SECRET>&cleanup=1 löscht den
  // Alt-Key 'subs' (Set-Datenmodell vor dem 'reminders'-Hash).
  if (req.query && req.query.cleanup === '1') {
    try {
      const deleted = await store().del('subs');
      res.status(200).json({ cleanup: true, deletedLegacySubsKey: deleted });
    } catch (e) { res.status(500).json({ error: 'store: ' + String(e && e.message || e) }); }
    return;
  }

  const payload = JSON.stringify({
    title: 'Aikido Vokabel-Dojo',
    body: 'Zeit fürs Dojo – kurze Übungsrunde?',
  });

  const r = store();
  let map = {};
  try { map = (await r.hgetall('reminders')) || {}; }
  catch (e) { res.status(500).json({ error: 'store: ' + String(e && e.message || e) }); return; }

  const entries = Object.entries(map);
  let sent = 0, removed = 0, due = 0;
  const errors = [];

  for (const [endpoint, raw] of entries) {
    let rec;
    try { rec = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (_) { continue; }
    if (!rec || !rec.endpoint) continue;

    const tnow = localNow(rec.tz || 'UTC');
    const target = parseHHMM(rec.time);
    let isDue = force;
    if (!force) {
      isDue = target != null && tnow.minutes >= target && (tnow.minutes - target) <= GRACE && rec.lastSent !== tnow.date;
    }
    if (!isDue) continue;
    due++;

    const sub = { endpoint: rec.endpoint, keys: rec.keys, expirationTime: rec.expirationTime || null };
    try {
      await webpush.sendNotification(sub, payload);
      sent++;
      if (!force) {
        rec.lastSent = tnow.date;
        try { await r.hset('reminders', { [endpoint]: rec }); } catch (_) {}
      }
    } catch (err) {
      const code = err && err.statusCode;
      const detail = err && (err.body || err.message);
      errors.push({ code, detail: typeof detail === 'string' ? detail.slice(0, 200) : detail });
      console.error('push send failed', code, detail);
      const dead = code === 404 || code === 410 || code === 403 ||
        (code === 400 && typeof detail === 'string' && detail.indexOf('VapidPkHashMismatch') !== -1);
      if (dead) { try { await r.hdel('reminders', endpoint); removed++; } catch (_) {} }
    }
  }

  res.status(200).json({ sent, removed, due, total: entries.length, errors });
};
