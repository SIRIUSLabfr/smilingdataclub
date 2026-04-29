// Quick Wins pro Bereich. Platzhalter — finale Inhalte folgen.

export interface QuickWin {
  bereich: string;       // Anzeige-Name des Bereichs
  bereichKey: string;    // Key wie in LEVELS / AUSWERTUNG_CONTENT
  titel: string;
  beschreibung: string;
  aufwand: string;       // z.B. "2 Stunden"
  wirkung: string;       // z.B. "Reduziert Single-Point-of-Failure-Risiko sofort"
}

export const QUICK_WINS: Record<string, QuickWin> = {
  buchhaltung: {
    bereich: "Buchhaltung",
    bereichKey: "buchhaltung",
    titel: "Vier-Augen-Prinzip auf Bankzugängen",
    beschreibung: "Zweite Person mit Lese-/Freigaberecht in Banking-Tool und DATEV/Buchhaltungssystem hinzufügen.",
    aufwand: "1–2 Stunden",
    wirkung: "Sofortige Redundanz bei kritischen Finanzzugängen.",
  },
  vertrieb: {
    bereich: "Vertrieb",
    bereichKey: "vertrieb",
    titel: "Top-20-Kunden ins CRM zwingen",
    beschreibung: "In einem Workshop alle Top-Kunden mit Ansprechpartner, Historie und Besonderheiten ins CRM überführen.",
    aufwand: "1 Tag",
    wirkung: "Eure wichtigsten Beziehungen leben nicht mehr nur in einem Kopf.",
  },
  it: {
    bereich: "IT-Administration",
    bereichKey: "it",
    titel: "Geteilter Passwort-Manager",
    beschreibung: "Bitwarden, 1Password o. ä. einrichten und alle kritischen Zugänge dort hinterlegen — mit Notfall-Zugriff für eine zweite Person.",
    aufwand: "Halber Tag",
    wirkung: "Kein Single-Point-of-Failure mehr bei IT-Zugängen.",
  },
  assistenz: {
    bereich: "Assistenz der GF",
    bereichKey: "assistenz",
    titel: "Fristen- und Vertragsregister",
    beschreibung: "Alle laufenden Verträge mit Kündigungsfristen in eine zentrale Tabelle oder ein DMS überführen.",
    aufwand: "1 Tag",
    wirkung: "Keine verpassten Fristen mehr, auch wenn die Assistenz ausfällt.",
  },
  technik: {
    bereich: "Entwicklung / Produktion",
    bereichKey: "technik",
    titel: "QM-Kernprozesse dokumentieren",
    beschreibung: "Die 5 wichtigsten Produktions-/QM-Prozesse als kurze Step-by-Step-Anleitungen in einem Wiki festhalten.",
    aufwand: "2–3 Tage",
    wirkung: "Produktionsqualität wird unabhängig von einzelnen Köpfen.",
  },
  geschaeftsfuehrung: {
    bereich: "Geschäftsführung",
    bereichKey: "geschaeftsfuehrung",
    titel: "Notfall-Mappe für die GF",
    beschreibung: "Prokura, Bankvollmachten, Passwörter, Schlüsselverträge und strategische Kontakte in einer dokumentierten Notfall-Mappe ablegen.",
    aufwand: "1 Tag",
    wirkung: "Euer Unternehmen bleibt handlungsfähig, auch wenn ihr ausfallt.",
  },
};
