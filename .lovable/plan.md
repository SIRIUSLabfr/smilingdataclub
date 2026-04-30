# Score-Anzeige umdrehen: hoher Score = hohes Risiko

## Problem
Aktuell vergibt der Quiz für „gut dokumentiert / abgesichert" **3 Punkte**, für „alles im Kopf einer Person" **0 Punkte**. Der angezeigte Score ist also ein **Resilienz-Score** (hoch = stabil). Da die Seite aber „Krisen Simulator" heißt und ein **Risiko-Score** erwartet wird, fühlt sich das verkehrt an: jemand mit 19/39 sieht eine halbleere Bar und liest „VERWUNDBAR" — intuitiv würde man bei einem Risiko-Score erwarten, dass eine **hohe**, **rote**, **volle** Bar das schlechte Ergebnis darstellt.

## Lösung: Anzeige invertieren (nicht die Quiz-Logik)
Wir lassen die Punkte pro Antwort und die Risiko-Schwellen (Buckets) **unverändert** — das hält Webhook-Daten, Quiz-Fragen und alle bestehenden Inhalte konsistent. Wir drehen nur die **Anzeige**: aus `score` wird ein `risikoScore = max - score`.

### Beispiele nach der Änderung
- Vorher: `19/39 — VERWUNDBAR` (Bar halb gefüllt, gelb)
- Nachher: `20/39 — VERWUNDBAR` (Bar halb gefüllt, gelb)
- Vorher: `0/39 — GAME OVER` (Bar leer, rot)
- Nachher: `39/39 — GAME OVER` (Bar voll, rot, pulsiert)
- Vorher: `39/39 — STABIL` (Bar voll, grün)
- Nachher: `0/39 — STABIL` (Bar leer, grün)

Die Risiko-Buckets (STABIL / VERWUNDBAR / HIGH RISK / GAME OVER) und Farben bleiben identisch — sie werden weiterhin aus dem Original-Score berechnet, sodass auch alle Maßnahmen-Texte korrekt zugeordnet bleiben.

## Konkrete Änderungen

### `src/pages/Auswertung.tsx`
1. **Hero-Score** (Zeile ~254): `{data.gesamtscore}/{data.max_score}` → `{data.max_score - data.gesamtscore}/{data.max_score}`
2. **Hero-HealthBar** (Zeile ~258): `value={data.gesamtscore}` → `value={data.max_score - data.gesamtscore}`
3. **Brennpunkt-HealthBar** (Zeile ~303): `value={b.score} max={b.max}` → `value={b.max - b.score} max={b.max}`
4. **Sortier-Tiebreaker** in `brennpunkte` (Zeile ~170): `a.score / a.max - b.score / b.max` → `b.score / b.max - a.score / a.max` (höherer Risiko-Anteil zuerst — die Sortier-Reihenfolge bleibt also gleich, nur korrekt zur neuen Logik)

### `src/pages/Game.tsx` (interne Quiz-Anzeige am Ende)
Der Erfolgs-/Recap-Screen am Quiz-Ende (Zeilen ~567 und ~610) zeigt aktuell denselben Original-Score. Falls dieser Screen noch User-sichtbar ist (er wird seit dem letzten Refactor durch Redirect zur Auswertung ersetzt — sollte nicht mehr erreicht werden), passen wir ihn analog an:
- Score-Zahl in der Hero: `{totalScore}/{maxScore}` → `{maxScore - totalScore}/{maxScore}`
- HealthBar Hero und je Bereich: `value` invertieren

Falls dieser Screen wirklich tot ist, lassen wir ihn unverändert — bestätige mir das gern oder ich entferne ihn beim Umbau.

### **Nicht** geändert (bewusst)
- **Quiz-Antwort-Punkte** (3 / 2 / 0) — bleiben wie sie sind
- **Risiko-Bucket-Schwellen** in `getDeptRisk` und `getOverallRisk` — bleiben wie sie sind
- **Webhook-Payload** (`gesamtscore`, `level_scores[*].score`) — bleibt wie er ist (= Resilienz-Score, wie bisher in Zoho)
- **Maßnahmen-Texte** und Farben

## Webhook-Hinweis
Der an Zoho gesendete `gesamtscore` bleibt der Resilienz-Score (hoch = gut). Falls du in Zoho lieber den Risiko-Score speicherst, sag Bescheid — dann fügen wir entweder ein zusätzliches Feld `risiko_score` hinzu oder drehen das Feld komplett um (Achtung: bricht bestehende Zoho-Auswertungen).

## Verifikation nach Implementierung
- `/game` durchspielen mit nur „Nein"-Antworten → Auswertung zeigt **maximalen** Score, rote volle Bar, GAME OVER
- `/game` durchspielen mit nur „Ja, vollständig"-Antworten → Auswertung zeigt **0**, leere Bar, STABIL
- Brennpunkte-Reihenfolge: schlimmster Bereich oben
