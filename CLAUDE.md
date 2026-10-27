# Arbeitsregeln für dieses Repository

## Schlüsselbund: Tokens & API-Keys (schluessel.saetzerei.com)

Freigegebene API-Keys (Resend, Infomaniak, Vercel, …) liegen **verschlüsselt
im Supabase-Vault** des Projekts saetzerei-rechnungen (`wwgzqawlyhtrdofczzka`).
Der Repo-Inhaber verwaltet sie auf **schluessel.saetzerei.com**: freigeben,
pausieren, entziehen — Entzug wirkt sofort. Gilt repo-übergreifend, auch hier:

1. **Holen:** Braucht eine Aufgabe einen Key, per Supabase-MCP im Projekt
   saetzerei-rechnungen: `select public.schluessel_lesen('<name>');`
   Übersicht ohne Werte: `select name, dienst, status, notiz from
   public.schluesselbund;`
2. **Flüchtig verwenden:** nur im Arbeitsspeicher bzw. als Env-Variable eines
   einzelnen Befehls — **nie** in Chat-Antworten, Commits, Dateien, Logs oder
   Fehlermeldungen wiedergeben (auch nicht gekürzt).
3. **Fehlt/pausiert:** Die Fehlermeldung sagt es. Dann auf
   schluessel.saetzerei.com verweisen — den Repo-Inhaber **nicht** bitten,
   Tokens in den Chat zu kleben.
4. **Protokoll:** Jedes Lesen wird automatisch in `schluesselbund_log`
   festgehalten und ist auf der Seite einsehbar.
5. **Immer den direkten Link mitgeben:** Soll der Repo-Inhaber einen Key
   holen, erneuern oder eintragen, steht in der Anweisung die anklickbare
   URL der Seite, auf der der Knopf sitzt — nie „im Dashboard unter
   Einstellungen". Das gilt für die Quelle wie fürs Ziel. Für dieses Repo
   am häufigsten gebraucht:
   - Schlüsselbund verwalten: <https://schluessel.saetzerei.com>
   - Vercel-Token: <https://vercel.com/account/settings/tokens>
   - Repo-Secrets: <https://github.com/phtok/vodojo/settings/secrets/actions>

   Die vollständige Link-Tabelle aller Dienste steht im Repo `designs` in
   `UEBERGABE.md` § Wo ein Schlüssel herkommt.

## Geheimnisse dieses Repos

Die Vercel-Funktionen lesen `CRON_SECRET` und `VAPID_PRIVATE_KEY`
(`api/cron.js`) sowie `KV_REST_API_TOKEN` (`api/subscribe.js`) aus den
Laufzeit-Env-Variablen des Vercel-Projekts — nie aus dem Repo. Beim
Ändern gilt Punkt 2: Werte bleiben flüchtig.

(Ausführliche Fassung dieses Abschnitts: `CLAUDE.md` im Repo `designs`.)

## Supabase: keine Löschaufträge an den Repo-Inhaber

In Cloud-Sessions kann der Supabase-Connector **nichts ausführen, was
`drop` enthält**. Er wartet auf eine Bestätigung, die nie ankommt, und
bricht nach 60 s ab. Wiederholen bringt nichts. Deshalb:

1. **Keine Hilfsobjekte in fremden Projekten anlegen.** Die Datenbank ist
   kein Transportweg für Dateien (Audio, Bilder, Base64). Was ein Skript
   im Container erzeugen kann, wird dort erzeugt.
2. **Wenn doch nötig:** nur in `public` und nur mit Präfix `tmp_`.
   Aufräumen in derselben Session mit
   `select public.claude_tmp_aufraeumen();`. Die Funktion löscht
   ausschliesslich `public.tmp_*` (ohne `cascade`) und meldet, was weg ist.
   Sie liegt im Projekt saetzerei-rechnungen (`wwgzqawlyhtrdofczzka`).
   In anderen Projekten gibt es sie nicht, dort gilt Punkt 1 ohne
   Ausnahme.
3. **Nie** den Repo-Inhaber bitten, `drop`-Befehle im SQL-Editor
   auszuführen.

## Quelle für Prüfungsinhalte

Alles, was die App über Prüfungen sagt (Techniken, Nummern, Reihenfolge,
nächster Grad), richtet sich nach
[`quellen/acsa-pruefungsprogramm-ikeda.md`](quellen/acsa-pruefungsprogramm-ikeda.md):
das ACSA-Prüfungsprogramm von M. Ikeda (23.10.1999), 6. Kyu bis 4. Dan,
mit Fundort-Link. Fragen wie „Was kommt im 5. Kyu?“ dort nachschlagen,
nicht aus dem Gedächtnis oder aus Programmen anderer Verbände
beantworten.

## Sessionwechsel: Zeichen geben, Nachfolgerin oder Archiv anbieten, Modell prüfen

Beschluss des Inhabers (18. 10. 2026), **gilt in allen Repos** (gleicher
Abschnitt in jeder `CLAUDE.md`). Lange Sessions sind der grösste
Kostentreiber: jeder Schritt liest den ganzen Kontext neu.

**Wann.** Die Session gibt das Zeichen, sobald eines zutrifft:
- Kontext über rund 300 000 Tokens (`get_session` ohne ID →
  `external_metadata.context_usage.used_tokens`; fehlt der Wert:
  spätestens nach der ersten Zusammenfassung des Gesprächs);
- die Aufgabe ist erledigt, und es kommt eine neue, andere nach;
- die Arbeit wechselt das Thema oder das Repo;
- Modell oder Effort passen nicht mehr zur verbleibenden Arbeit.

**Wie.** Erst den Stand sichern (Commit, Push, offene Punkte in die
Projekt-Doku), dann als letzte Zeile der Antwort:

> Zeit für eine neue Session — <Grund>. Ich starte sie auf <Modell>,
> weil <ein Satz>. **Sag ‹ja›.**

Nie mitten in einer Etappe, nie ungefragt starten.

**Bei ‹ja›** startet die alte Session die neue mit `create_session`:
ein Repo (`source_url`), das gewählte `model`, ein Titel, und als
`prompt` eine Übergabe, die ohne den alten Verlauf trägt — Auftrag,
Stand (Branch, PR, erledigt, offen), wo es geschrieben steht, nächster
Schritt. Verweisen statt nacherzählen. Läuft die neue Session
(`get_session` mit ihrer ID), meldet die alte den Titel und archiviert
sich selbst (`archive_session` mit der eigenen ID aus `get_session` ohne
ID).

**Auftrag erledigt: Archivieren anbieten** (Regel des Inhabers, 18. 10.
2026). Ist der Auftrag erledigt und kommt nichts nach, bietet die
Session von sich aus an, sich zu archivieren — als letzte Zeile der
Antwort:

> Auftrag erledigt — <was>. Soll ich mich archivieren? **Sag ‹ja›.**

Bei ‹ja› (oder ‹fertig›) archiviert sie sich (`archive_session` mit der
eigenen ID). Nie ungefragt archivieren.

**In beiden Fällen** erst, wenn der Stand gesichert ist und alle
beobachteten PRs gemergt oder geschlossen sind. Wartet noch ein PR auf
seine Checks, kommt das Angebot nach dem Merge.

**Modellwahl** bei dieser Gelegenheit, für die Arbeit, die noch kommt:
- **Haiku 5.5** — nur nachschauen und melden: Stand abfragen, einen PR
  bis grün beobachten, Posteingang lesen, Zustellung prüfen. Nichts
  schreiben, was ein Tor prüft.
- **Sonnet 5.5** — Arbeit nach klarem Plan: Korrekturen einarbeiten,
  Doku nachführen, Belege prüfen, Massenänderungen, Deploy begleiten.
- **Opus 5.5** (Standard) — Seiten bauen, gestalten, Texte setzen,
  recherchieren, gewöhnliches Debugging.
- **Fable 5.1** — nur Architektur-Entscheide, Debugging, an dem Opus
  gescheitert ist, adversariales Review grosser Änderungen.

Effort ‹medium› als Standard, ‹high› nur für urteilskritische Arbeit;
lässt sich beim Start nicht mitgeben — weicht die Empfehlung ab, sagt
die Meldung es dazu. Nicht für gesäte Kinder-Sessions und Routinen:
die enden mit ihrem Auftrag.


Urtext: `CLAUDE.md` im Repo `phtok/designs` — dort ändern und von dort verteilen.

## Umbrüche: immer schön

Anweisung des Inhabers (18. 10. 2026: ‹Immer!!!: Umbrüche ausgleichen!›,
erneuert am 26. 10. 2026: ‹Bitte alle Umbrüche immer schön machen›),
**gilt in allen Repos** (gleicher Abschnitt in jeder `CLAUDE.md`). Wo Text
umbricht, wird er gesetzt, nicht dem Zufall überlassen: in Titeln, Karten,
Knöpfen, Listen, Meldungen, Mails und im Fuss.

- **Titel und kurze Texte ausgleichen** (`text-wrap: balance`), Fliesstext
  ohne einzelnes Wort in der Schlusszeile (`text-wrap: pretty`, am `body`).
- **Zusammenhalten, was zusammengehört**, mit festem Leerzeichen (`&nbsp;`,
  in JSON `\u00a0`): Zahl und Wort (‹18 Folgen›, ‹S. 12›), ‹je Folge›,
  ‹z. B.›. Vor- und Nachname nur in Namenslisten (Liste, Tabelle,
  Impressum), nie im Fliesstext: Dort reisst der Block auf schmalen
  Bildschirmen Löcher (Inhaber, 27. 10. 2026). Artikel und Präpositionen
  nie ans nächste Wort binden — aus demselben Grund.
- **Keine Cliffhanger:** kein kleines Wort (der, und, mit …) am
  Zeilenende, unter dem die nächste Zeile schon aufgehört hat. Das sieht
  nur, wer den ganzen Absatz kennt, darum rechnen statt binden (in
  `designs`: `sks/www/umbruch.js`, Verfahren aus Prolog).
- **Mit dem Auge prüfen**, bevor ein Bild gezeigt oder gemergt wird: schmal
  (375 px) und breit, hell und dunkel. Ein grüner Prüfer ersetzt den Blick
  nicht (in `designs` misst K19 nur einen Teil davon).
- Silbentrennung sparsam: Hauswissen in `designs` →
  `rsa/design-system/silbentrennung.md`.

