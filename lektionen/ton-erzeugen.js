#!/usr/bin/env node
/* Ton der Lektionen aus den Skripten erzeugen (ElevenLabs) und zu einer
 * durchgehenden Datei je Lektion zusammensetzen.
 *
 *   ELEVENLABS_API_KEY=… node lektionen/ton-erzeugen.js 1        # Tag 1
 *   ELEVENLABS_API_KEY=… node lektionen/ton-erzeugen.js 1 --neu  # alles neu sprechen
 *   node lektionen/ton-erzeugen.js 1 --nur-zusammensetzen         # ohne Key
 *
 * 1. Spricht jeden Eintrag {id, text, stimme} nach audio/tag-N/<id>-<k>.mp3 und
 *    trägt Länge («sek») und Hash («h») ins Skript ein. Unveränderte Texte
 *    werden übersprungen.
 * 2. Setzt audio/tag-N.mp3 zusammen: Sprache, Übungspausen als Stille, die
 *    Prüfungsansage aus den eingebetteten Aufnahmen der App. Eine Datei,
 *    damit der Ton bei gesperrtem Telefon weiterläuft. Die Startzeiten der
 *    Stationen («ab») und die Gesamtlänge («tonSek») gehen ins Skript.
 *
 * Zwei Stimmen, feste Rollen: laura erklärt, leon leitet die Bewegung.
 * Key nur als Env-Variable dieses einen Befehls, nie in Dateien (CLAUDE.md
 * § Schlüsselbund; Name im Schlüsselbund: elevenlabs). Der Key geht per
 * stdin an curl, nicht über die Befehlszeile.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const STIMMEN = {
  laura: 'Qy4b2JlSGxY7I9M9Bqxb',   // Laura Vox – Documentary
  leon: 'MJ0RnG71ty4LH3dvNfSd'     // Leon – calm, soothing, grounded
};
const MODELL = 'eleven_multilingual_v2';
const EINSTELLUNG = { stability: 0.7, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true, speed: 0.9 };
const LUECKE = 0.6;        // Stille zwischen zwei Einträgen (s)
const RATE = 44100;

const tag = process.argv[2];
const neu = process.argv.includes('--neu');
const nurZusammen = process.argv.includes('--nur-zusammensetzen');
if (!tag) { console.error('Tag fehlt: node lektionen/ton-erzeugen.js 1'); process.exit(1); }
const key = process.env.ELEVENLABS_API_KEY;
if (!key && !nurZusammen) { console.error('ELEVENLABS_API_KEY fehlt. Key im Schlüsselbund: https://schluessel.saetzerei.com'); process.exit(1); }

const wurzel = path.join(__dirname, '..');
const datei = path.join(__dirname, `tag-${tag}.json`);
const skript = JSON.parse(fs.readFileSync(datei, 'utf8'));
const clipOrdner = path.join(wurzel, 'audio', `tag-${tag}`);
fs.mkdirSync(clipOrdner, { recursive: true });
const sichern = () => fs.writeFileSync(datei, JSON.stringify(skript, null, 2) + '\n');
const dauer = f => +(+execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim()).toFixed(2);

// 1. Sprechen. Jeder Text wird an den <break>-Marken geteilt: jedes Stück eine
//    eigene Anfrage, die Pausen setzt das Zusammensetzen als Stille ein.
//    (Viele Pausenmarken in einer Anfrage liessen ElevenLabs bei ~24 s abbrechen.)
const stuecke = text => { const r = []; text.split(/(<break time="[\d.]+s" \/>)/).forEach(x => {
  const m = x.match(/<break time="([\d.]+)s"/); if (m) r.push({ p: +m[1] }); else if (x.trim()) r.push({ s: x.trim() }); }); return r; };
let neuGesprochen = 0;
if (!nurZusammen) for (const teil of skript.teile) for (const st of teil.stationen) for (const t of st.ton) {
  if (!t.text) continue;
  const stimme = STIMMEN[t.stimme || 'leon'];
  const h = crypto.createHash('sha1').update(stimme + MODELL + JSON.stringify(EINSTELLUNG) + t.text).digest('hex').slice(0, 10);
  const sp = stuecke(t.text).filter(x => x.s);
  const ziele = sp.map((_, k) => path.join(clipOrdner, `${t.id}-${k + 1}.mp3`));
  if (!neu && t.h === h && ziele.every(f => fs.existsSync(f))) continue;
  let sek = 0;
  sp.forEach((x, k) => {
    const body = JSON.stringify({ text: x.s, model_id: MODELL, language_code: 'de', voice_settings: EINSTELLUNG,
      previous_text: sp[k - 1] ? sp[k - 1].s : undefined, next_text: sp[k + 1] ? sp[k + 1].s : undefined });
    const tmp = ziele[k] + '.tmp';
    const status = execFileSync('curl', ['-sS', '-o', tmp, '-w', '%{http_code}', '-X', 'POST',
      `https://api.elevenlabs.io/v1/text-to-speech/${stimme}?output_format=mp3_44100_128`,
      '-H', 'Content-Type: application/json', '-H', '@-', '--data-binary', body],
      { input: `xi-api-key: ${key}\n` }).toString().trim();
    if (status !== '200') {
      const msg = fs.readFileSync(tmp, 'utf8').slice(0, 300); fs.unlinkSync(tmp);
      sichern(); console.error(`${t.id}-${k + 1}: HTTP ${status} ${msg}`); process.exit(1);
    }
    fs.renameSync(tmp, ziele[k]);
    const d = dauer(ziele[k]); sek += d;
    if (d < x.s.length / 25) console.warn(`  Achtung ${t.id}-${k + 1}: ${d}s für ${x.s.length} Zeichen – abgeschnitten?`);
  });
  sek += stuecke(t.text).reduce((a, x) => a + (x.p || 0), 0);
  t.h = h; t.sek = +sek.toFixed(2); neuGesprochen++;
  console.log(`${t.id} (${t.stimme})  ${sp.length} Stück(e), ${t.sek}s`);
}
sichern();

// 2. Zusammensetzen
const arbeit = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ton-'));
const wav = (ein, aus, filter) => execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', ein, '-ac', '1', '-ar', String(RATE),
  ...(filter ? ['-af', filter] : []), aus]);
const stille = sek => { const f = path.join(arbeit, `stille-${sek}.wav`);
  if (!fs.existsSync(f)) execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', `anullsrc=r=${RATE}:cl=mono`, '-t', String(sek), f]);
  return f; };
// Prüfungsansage: dieselben Aufnahmen wie speakName() in der App (window.AUDIO in index.html)
function ansage(nr) {
  const html = fs.readFileSync(path.join(wurzel, 'index.html'), 'utf8');
  const audio = JSON.parse(html.match(/window\.AUDIO = (\{.*?\});\n/)[1]);
  const marke = html.indexOf('const EXAM=[');
  const zeile = html.slice(marke).split('\n').find(l => l.includes(`{n:${nr},`));
  const a = zeile.match(/a:"([^"]+)"/)[1], t = zeile.match(/t:"([^"]+)"/)[1], d = zeile.match(/d:"([^"]+)"/)[1];
  const teile = [a, d !== '—' ? `${t} ${d}` : t].map((k, i) => {
    const f = path.join(arbeit, `ansage-${i}.mp3`);
    fs.writeFileSync(f, Buffer.from(audio[k].split(',')[1], 'base64'));
    const w = path.join(arbeit, `ansage-${i}.wav`); wav(f, w, 'loudnorm=I=-18:TP=-2'); return w;
  });
  return [teile[0], stille(0.4), teile[1]];
}
const liste = []; let zeit = 0;
const dazu = (f, sek) => { liste.push(f); zeit += sek; };
for (const teil of skript.teile) for (const st of teil.stationen) {
  st.ab = +zeit.toFixed(2);
  for (const t of st.ton) {
    if (t.text) {
      let k = 0;
      for (const x of stuecke(t.text)) {
        if (x.p) { dazu(stille(x.p), x.p); continue; }
        const f = path.join(clipOrdner, `${t.id}-${++k}.mp3`);
        if (!fs.existsSync(f)) { console.error(`${t.id}-${k}: Datei fehlt, erst sprechen.`); process.exit(1); }
        const w = path.join(arbeit, `${t.id}-${k}.wav`); wav(f, w, 'loudnorm=I=-18:TP=-2');
        dazu(w, dauer(w));
      }
      dazu(stille(LUECKE), LUECKE);
    } else if (t.pause) dazu(stille(t.pause), t.pause);
    else if (t.ansage) { for (const w of ansage(skript.nr)) dazu(w, dauer(w)); dazu(stille(LUECKE), LUECKE); }
  }
  dazu(stille(1.5), 1.5);
}
const listeDatei = path.join(arbeit, 'liste.txt');
fs.writeFileSync(listeDatei, liste.map(f => `file '${f}'`).join('\n'));
const ziel = path.join(wurzel, 'audio', `tag-${tag}.mp3`);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', listeDatei,
  '-ac', '1', '-ar', String(RATE), '-c:a', 'libmp3lame', '-b:a', '64k', ziel]);
skript.tonSek = dauer(ziel);
sichern();
fs.rmSync(arbeit, { recursive: true, force: true });

for (const teil of skript.teile) {
  const a = teil.stationen[0].ab;
  console.log(`Teil ${teil.nr} ab ${Math.floor(a / 60)}:${String(Math.round(a % 60)).padStart(2, '0')} (Plan ${teil.von})  ${teil.titel}`);
}
console.log(`${neuGesprochen} Eintrag/Einträge neu gesprochen. audio/tag-${tag}.mp3: ${Math.floor(skript.tonSek / 60)}:${String(Math.round(skript.tonSek % 60)).padStart(2, '0')}`);
