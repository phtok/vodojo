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
- **Ton (3. 11. 2026, mit Zustimmung des Inhabers):** ElevenLabs, zwei
  Stimmen mit festen Rollen. **Laura** (Laura Vox) erklärt: Begrüssung,
  Bild, Prinzip, Fehler, Abschied. **Leon** leitet die Bewegung:
  Anweisungen, Zählen, Prüfung. Die Rolle steht je Eintrag als `stimme` in
  `tag-N.json`. Die Texte werden an den `<break>`-Marken in Stücke geteilt
  und einzeln gesprochen (`audio/tag-N/<id>-<k>.mp3`): Viele Pausenmarken in
  einer Anfrage liessen ElevenLabs bei rund 24 s abbrechen.
- **Eine Datei je Lektion:** `audio/tag-1.mp3` (26:45), mit den
  Übungspausen als Stille und der Prüfungsansage aus den Aufnahmen der App.
  Sie läuft bei gesperrtem Telefon weiter. Die Station folgt der
  Abspielzeit (`ab` je Station im Skript). Pause und Weiter liegen auf dem
  Sperrbildschirm (Media Session), das Display bleibt wach, solange der Ton
  läuft (Wake Lock). Ohne `tonSek` im Skript fällt die App auf die
  Browser-Stimme zurück.
- Neu erzeugen nach Textänderung:
  `ELEVENLABS_API_KEY=… node lektionen/ton-erzeugen.js 1` (spricht nur
  geänderte Einträge neu und setzt die Datei neu zusammen), danach die
  Cache-Version in `sw.js` hochzählen.
- Recherche: stenudd.com war für automatische Abrufe gesperrt; der Ablauf
  stützt sich auf Ikeda-Zeichnung, Graf-Kärtchen, Trnava-Video Nr. 1 und
  die Texte der App.
- 3. 11. 2026: Lektion 2 (Kotegaeshi) gebaut, auf Wunsch des Inhabers
  parallel zur Rückschau von Lektion 1: `lektionen/tag-2.json`,
  `audio/tag-2.mp3` (26:49), Tag 2 in der Woche freigeschaltet. Abweichung
  vom Konzept: Das Aufwärmen übt nicht die Vorwärtsrolle, sondern das
  seitliche Absetzen und Rückwärtsrollen, denn auf der Ikeda-Zeichnung
  liegt Uke am Ende auf dem Rücken. Wiederholung Iriminage mit Ansage
  (`{"ansage": 1}`), Vorgriff Ikkyo mit Zeichnung und Video Nr. 3.
- Vollbild der Zeichnungen: richtet sich bei jeder Drehung neu aus und
  blendet die Browserleisten aus, wo der Browser es erlaubt (iPad, Android).
- Nächster Schritt: Rückschau des Inhabers zu Lektion 1 und 2, dann Tage 3
  bis 7.
- Offen: die Wunschtechnik.
