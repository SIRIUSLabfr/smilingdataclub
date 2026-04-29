// Maßnahmen-Texte je Bereich und Risikostufe für die personalisierte Auswertung.
// Platzhalter — die finalen Texte folgen in einem Folge-Prompt.

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH_RISK" | "GAME_OVER";

export interface AuswertungEntry {
  highlight: string; // "Wenn ihr nur eine Sache macht: ..."
  text: string;      // 3-4 Sätze Maßnahmen-Text
}

export type AuswertungContent = Record<RiskLevel, AuswertungEntry>;

const placeholder = (bereich: string, level: RiskLevel): AuswertungEntry => ({
  highlight: `Wenn ihr nur eine Sache macht: [Platzhalter für ${bereich} / ${level}].`,
  text: `Platzhalter-Maßnahmen für ${bereich} bei ${level}. Hier kommen 3–4 konkrete, umsetzbare Sätze hin, die zeigen, wie ihr eure Risiken in diesem Bereich reduziert. Der echte Text folgt in einem Folge-Prompt.`,
});

function makeBlock(bereich: string): AuswertungContent {
  return {
    LOW: placeholder(bereich, "LOW"),
    MEDIUM: placeholder(bereich, "MEDIUM"),
    HIGH_RISK: placeholder(bereich, "HIGH_RISK"),
    GAME_OVER: placeholder(bereich, "GAME_OVER"),
  };
}

export const AUSWERTUNG_CONTENT: Record<string, AuswertungContent> = {
  buchhaltung: makeBlock("Buchhaltung"),
  vertrieb: makeBlock("Vertrieb"),
  it: makeBlock("IT-Administration"),
  assistenz: makeBlock("Assistenz der GF"),
  technik: makeBlock("Entwicklung / Produktion"),
  geschaeftsfuehrung: makeBlock("Geschäftsführung"),
};

// Mapping vom Game-Risiko-String auf den Content-Key
export function riskKeyFromLabel(risk: string): RiskLevel {
  switch (risk) {
    case "GAME OVER": return "GAME_OVER";
    case "HIGH RISK": return "HIGH_RISK";
    case "MEDIUM RISK": return "MEDIUM";
    default: return "LOW";
  }
}
