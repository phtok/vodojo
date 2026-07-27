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

(Ausführliche Fassung dieses Abschnitts: `CLAUDE.md` im Repo `designs`.)
