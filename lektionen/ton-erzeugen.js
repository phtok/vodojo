#!/usr/bin/env node
/* Ton der Lektionen aus den Skripten erzeugen (ElevenLabs).
 *
 *   ELEVENLABS_API_KEY=… node lektionen/ton-erzeugen.js 1        # Tag 1
 *   ELEVENLABS_API_KEY=… node lektionen/ton-erzeugen.js 1 --neu  # alles neu
 *
 * Liest lektionen/tag-N.json, spricht jeden Eintrag {id, text} in
 * audio/tag-N-<id>.mp3 und trägt die Länge in Sekunden als «sek» ins Skript.
 * Unveränderte Texte (gleicher Hash in «h») werden übersprungen.
 * Key nur als Env-Variable dieses einen Befehls, nie in Dateien (CLAUDE.md
 * § Schlüsselbund; Name im Schlüsselbund: elevenlabs).
 *
 * Läuft über curl, damit der Proxy der Umgebung greift. Der Key geht per
 * stdin an curl, nicht über die Befehlszeile.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const STIMME = process.env.ELEVENLABS_VOICE || 'eUdJpUEN3EslrgE24PKx'; // eine Stimme für alle Tage
const MODELL = 'eleven_multilingual_v2';
const EINSTELLUNG = { stability: 0.7, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true, speed: 0.9 };

const tag = process.argv[2];
const neu = process.argv.includes('--neu');
if (!tag) { console.error('Tag fehlt: node lektionen/ton-erzeugen.js 1'); process.exit(1); }
const key = process.env.ELEVENLABS_API_KEY;
if (!key) { console.error('ELEVENLABS_API_KEY fehlt. Key im Schlüsselbund: https://schluessel.saetzerei.com'); process.exit(1); }

const wurzel = path.join(__dirname, '..');
const datei = path.join(__dirname, `tag-${tag}.json`);
const skript = JSON.parse(fs.readFileSync(datei, 'utf8'));
fs.mkdirSync(path.join(wurzel, 'audio'), { recursive: true });

function dauer(f) {
  return +(+execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim()).toFixed(2);
}

let neuGesprochen = 0;
for (const teil of skript.teile) for (const st of teil.stationen) for (const t of st.ton) {
  if (!t.text) continue;
  const h = crypto.createHash('sha1').update(STIMME + MODELL + JSON.stringify(EINSTELLUNG) + t.text).digest('hex').slice(0, 10);
  const ziel = path.join(wurzel, 'audio', `tag-${tag}-${t.id}.mp3`);
  if (!neu && t.h === h && fs.existsSync(ziel)) continue;
  const body = JSON.stringify({ text: t.text, model_id: MODELL, language_code: 'de', voice_settings: EINSTELLUNG });
  const tmp = ziel + '.tmp';
  const status = execFileSync('curl', ['-sS', '-o', tmp, '-w', '%{http_code}', '-X', 'POST',
    `https://api.elevenlabs.io/v1/text-to-speech/${STIMME}?output_format=mp3_44100_64`,
    '-H', 'Content-Type: application/json', '-H', '@-', '--data-binary', body],
    { input: `xi-api-key: ${key}\n` }).toString().trim();
  if (status !== '200') {
    const msg = fs.readFileSync(tmp, 'utf8').slice(0, 300); fs.unlinkSync(tmp);
    console.error(`${t.id}: HTTP ${status} ${msg}`); process.exit(1);
  }
  fs.renameSync(tmp, ziel);
  t.h = h; t.sek = dauer(ziel); neuGesprochen++;
  console.log(`${t.id}  ${t.sek}s`);
}
fs.writeFileSync(datei, JSON.stringify(skript, null, 2) + '\n');

// Summe je Teil, mit Übungspausen, als Abgleich zur Zeitmarke
for (const teil of skript.teile) {
  const s = teil.stationen.flatMap(st => st.ton).reduce((a, t) => a + (t.sek || 0) + (t.pause || 0) + (t.ansage ? 4 : 0), 0);
  console.log(`Teil ${teil.nr} ${teil.titel}: ${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')} (Plan ${teil.von}–${teil.bis})`);
}
console.log(`${neuGesprochen} Datei(en) neu gesprochen.`);
