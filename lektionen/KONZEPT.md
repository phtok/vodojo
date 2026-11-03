# Wochenprogramm und Lektionen · Konzept

Auftrag des Inhabers (3. 11. 2026): In einer Woche einmal durch das
Prüfungsprogramm 6. Kyu. Jeden Tag eine Technik vertiefen, die vom Vortag
wiederholen, die vom Folgetag vorgreifen. Am siebten Tag alles abfragen und
bewegen. Je Tag eine ausführliche Lektion bis 30 Minuten mit Übungen,
Aufwärmen und Dehnen auf die Technik zugeschnitten. Alles erlaubt: Text,
Ton, Bild, Zeichnung, Anweisung, Gedankenexperiment. Lektion 1 zuerst als
Probe bauen.

Quelle der Inhalte bleibt `quellen/acsa-pruefungsprogramm-ikeda.md`.

## Die Woche

Acht Techniken auf sechs Tage: Omote und Ura einer Technik gehören in eine
Lektion, sie teilen Angriff, Griff und die erste Hälfte des Ablaufs.

| Tag | Angriff               | Technik (Nr.)                  | Wiederholung | Vorgriff   |
|-----|-----------------------|--------------------------------|--------------|------------|
| 1   | Shomenuchi Kiawase    | Iriminage (1)                  | –            | Kotegaeshi |
| 2   | Shomenuchi Kiawase    | Kotegaeshi (2)                 | Iriminage    | Ikkyo      |
| 3   | Katatetori Aihanmi    | Ikkyo Omote + Ura (3, 4)       | Kotegaeshi   | Shihonage  |
| 4   | Katatetori Gyakuhanmi | Shihonage Omote + Ura (5, 6)   | Ikkyo        | Tenchinage |
| 5   | Ryotetori             | Tenchinage (7)                 | Shihonage    | Genkei     |
| 6   | Ryotetori             | Genkeikokyunage (8)            | Tenchinage   | –          |
| 7   | alle                  | Prüfungstag: Ansage, Abfrage, alle acht bewegen | | |

Die Wunschtechnik (wahrscheinlich aus dem 5. Kyu, noch offen) bekommt
später eine eigene Lektion 8 nach demselben Bauplan; sie läuft dann an
Tag 7 mit.

## Der Bauplan einer Lektion (30 Minuten)

Sechs Teile, immer dieselbe Reihenfolge. Die App führt durch, mit Uhr.

1. **Ankommen und Aufwärmen** (5 Min.) – auf die Technik zugeschnitten:
   Tag 1 Iriminage: Tenkan-Drehungen, Hüfte, Nacken; Ukemi rückwärts,
   denn Uke fällt rückwärts. Tag 2 Kotegaeshi: Handgelenke beugen und
   drehen, Vorwärtsrolle. Tag 3 Ikkyo: Schulter, Arm strecken, Knien
   und Aufstehen. Tag 4 Shihonage: Schulter-Aussenrotation, Unterschreiten.
   Tag 5/6 Ryotetori: Haltung, Zentrum, Kokyu-Atmung.
2. **Wiederholung Vortag** (3 Min.) – nur aus dem Gedächtnis, mit
   Ansage im Ton, dann die Zeichnung als Kontrolle. Nichts Neues.
3. **Die Technik in Schichten** (15 Min.) – der Kern:
   - Schicht 1 *Das Bild*: Metapher und Prinzip in einem Satz, dazu die
     Ikeda-Zeichnung (Ablauf) und das Graf-Kärtchen.
   - Schicht 2 *Die Füsse allein*: Tai sabaki der Technik ohne Partner,
     Schritt für Schritt gezählt (Ton). Hier lernt der Körper am meisten.
   - Schicht 3 *Die Hände*: Griff, Kontakt, Schnitt. Mit Griff-Skizze.
   - Schicht 4 *Der ganze Ablauf langsam*: Zeichnung Bild für Bild,
     Video-Abschnitt (Trnava/Heuscher) mit Zeitmarke, selber mitgehen.
   - Schicht 5 *Als Uke*: Angriff und Fallen, so greift man an.
   - Schicht 6 *Drei Fehler und ihre Korrektur*.
4. **Vorgriff Folgetag** (3 Min.) – nur ansehen: Zeichnung, Video,
   ein Satz. Kein Üben.
5. **Abschluss** (4 Min.) – Dehnung passend zum Aufwärmen, dann das
   Ansage-Quiz der App zur Technik des Tages, eine Frage als eigene Notiz.

## Medien, und was wir nicht tun

- **Ton zuerst.** Die Lektion ist zum Mitbewegen im Raum, ohne auf den
  Bildschirm zu schauen. Ansagen, Zählen, Pausen werden mit ElevenLabs
  produziert (Key im Schlüsselbund, <https://schluessel.saetzerei.com>),
  eine Stimme für alle Tage, deutsch, ruhig, mit Pausen im Skript.
- **Bilder:** Ikeda-Zeichnungen (Ablauf, Angriff), Graf-Kärtchen,
  die SVG-Phasen der App. Keine KI-Bilder von Aikido-Bewegungen: sie
  zeigen falsche Füsse und Hände, und das prägt sich ein.
- **Video:** die vorhandenen Prüfungsvideos (Trnava, Heuscher) mit
  Zeitmarken. Keine generierten Videos, aus demselben Grund.
- **Text:** kurz, als Karten neben dem Ton. Lesen ist Ausnahme, Bewegen
  die Regel.

## Technik in der App

- Neuer Reiter «Woche» mit sieben Tagen und Fortschritt (gespeichert wie
  die übrigen Stände über `Store`).
- Je Lektion eine Datei `lektionen/tag-N.json`: Teile, Dauer, Texte,
  Bild- und Videoverweise, Audio-Dateien. Audio in `audio/tag-N-*.mp3`,
  erzeugt durch `lektionen/ton-erzeugen.js` aus den Skripten.
- Lektionsseite: Uhr, aktueller Teil gross, Ton-Steuerung, Bild des
  Teils, «weiter». Eine Lektion lässt sich unterbrechen und am selben
  Teil fortsetzen.

## Stand

- 3. 11. 2026: Konzept geschrieben. Lektion 1 (Iriminage) ist noch nicht
  gebaut; sie entsteht in einer eigenen Session als Probe, danach Rückschau
  mit dem Inhaber, dann Tage 2 bis 7.
- 3. 11. 2026: Lektion 1 (Iriminage) als Probe gebaut: Skript
  `lektionen/tag-1.json` (fünf Teile mit Zeitmarken, der Kern in sechs
  Schichten; die Überschrift oben sagt «sechs Teile», aufgezählt sind
  fünf), Reiter «Woche», Lektionsseite mit Uhr, Ton, Bild, Video-Abschnitt,
  «weiter», Pause und Fortsetzen (Stand in `Store` unter `aikido_woche`).
  Tag 1 hat keinen Vortag: an der Stelle der Wiederholung steht der
  Angriff Shomenuchi Kiawase.
- **Ton:** läuft vorerst über die Browser-Stimme (`speechSynthesis`, deutsch,
  die `<break>`-Marken werden zu Pausen). Die ElevenLabs-Dateien sind noch
  nicht erzeugt: Der Key liegt im Schlüsselbund (`elevenlabs`), aber die
  Sicherheitsprüfung der Cloud-Session hat den Abruf mit Key abgelehnt.
  Erzeugen: `ELEVENLABS_API_KEY=… node lektionen/ton-erzeugen.js 1`; das
  Skript schreibt `audio/tag-1-*.mp3` und trägt die Länge (`sek`) ins
  Skript ein, die App nimmt dann die Datei statt der Browser-Stimme. Die
  Stimme (`STIMME` im Skript) vorher anhören und festlegen.
- Recherche: stenudd.com war für automatische Abrufe gesperrt; der Ablauf
  stützt sich auf Ikeda-Zeichnung, Graf-Kärtchen, Trnava-Video Nr. 1 und
  die Texte der App.
- Nächster Schritt: Rückschau des Inhabers zu Lektion 1, dann Tage 2 bis 7.
- Offen: die Wunschtechnik.
