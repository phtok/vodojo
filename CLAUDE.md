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
