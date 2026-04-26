import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import FooterSection from "@/components/FooterSection";
import pixelBuchhaltung from "@/assets/pixel-buchhaltung.png";
import pixelVertrieb from "@/assets/pixel-vertrieb.png";
import pixelIt from "@/assets/pixel-it.png";
import pixelAssistenz from "@/assets/pixel-assistenz.png";
import pixelTechnik from "@/assets/pixel-technik.png";
import pixelGf from "@/assets/pixel-gf.png";

const WEBHOOK_URL = "https://PLATZHALTER.zohoflow.eu/webhook/...";
const BOOKING_URL = "https://PLATZHALTER.zohobookings.eu/...";

// ── Data ──────────────────────────────────────────────────────────────────────

interface Question {
  text: string;
  answers: { text: string; points: number }[];
}

interface Level {
  key: string;
  name: string;
  icon: string;
  intro: string;
  questions: Question[];
}

const LEVELS: Level[] = [
  {
    key: "buchhaltung",
    name: "BUCHHALTUNG",
    icon: pixelBuchhaltung,
    intro: "Eure Buchhaltung. 14 Jahre Erfahrung. Kennt jeden Posten. Was, wenn sie morgen nicht mehr kommt?",
    questions: [
      {
        text: "Sind eure Buchhaltungsprozesse so dokumentiert, dass eine neue Person sofort übernehmen könnte?",
        answers: [
          { text: "Ja, vollständig dokumentiert", points: 3 },
          { text: "Teilweise, die wichtigsten Sachen stehen irgendwo", points: 2 },
          { text: "Nein, das Wissen steckt in einer Person", points: 0 },
        ],
      },
      {
        text: "Haben mindestens zwei Personen Zugang zu allen relevanten Buchhaltungssystemen und Konten?",
        answers: [
          { text: "Ja, alles ist redundant abgesichert", points: 3 },
          { text: "Teilweise, manche Zugänge sind geteilt", points: 2 },
          { text: "Nein, nur eine Person hat alle Zugänge", points: 0 },
        ],
      },
    ],
  },
  {
    key: "vertrieb",
    name: "VERTRIEB",
    icon: pixelVertrieb,
    intro: "Euer Vertriebsleiter. 120 Kontakte. Die besten davon nicht im CRM, sondern in seinem Kopf.",
    questions: [
      {
        text: "Sind alle Kundenkontakte, Ansprechpartner und Beziehungshistorien im CRM dokumentiert?",
        answers: [
          { text: "Ja, vollständig und aktuell", points: 3 },
          { text: "Das CRM wird genutzt, aber vieles fehlt", points: 2 },
          { text: "CRM???", points: 0 },
        ],
      },
      {
        text: "Gibt es dokumentierte Informationen zu Kundenvorlieben, Empfindlichkeiten oder besonderen Vereinbarungen?",
        answers: [
          { text: "Ja, das ist Standard bei uns", points: 3 },
          { text: "Bei manchen Kunden", points: 2 },
          { text: "Das weiß nur der jeweilige Betreuer", points: 0 },
        ],
      },
      {
        text: "Könnte ein neuer Vertriebsmitarbeiter innerhalb von 2 Wochen die wichtigsten Kunden eigenständig betreuen?",
        answers: [
          { text: "Ja, alles ist übergabefähig", points: 3 },
          { text: "Mit intensiver Einarbeitung vielleicht", points: 2 },
          { text: "Unmöglich, die Beziehungen sind personengebunden", points: 0 },
        ],
      },
    ],
  },
  {
    key: "it",
    name: "IT-ADMINISTRATION",
    icon: pixelIt,
    intro: "Euer IT-Admin. Hält alles am Laufen. Aber weiß jemand anders, WIE?",
    questions: [
      {
        text: "Gibt es eine aktuelle Dokumentation aller Serverzugänge, Passwörter und Systemkonfigurationen?",
        answers: [
          { text: "Ja, in einem Passwort-Manager mit geteiltem Zugang", points: 3 },
          { text: "Teilweise, manches ist dokumentiert", points: 2 },
          { text: "Das meiste kennt nur eine Person", points: 0 },
        ],
      },
      {
        text: "Wisst ihr, welche Lizenzen wann auslaufen und was sie kosten?",
        answers: [
          { text: "Ja, alles zentral verwaltet", points: 3 },
          { text: "Grob, aber nicht vollständig", points: 2 },
          { text: "Das weiß nur der IT-Mensch", points: 0 },
        ],
      },
    ],
  },
  {
    key: "assistenz",
    name: "ASSISTENZ DER GF",
    icon: pixelAssistenz,
    intro: "Sie kennt jede Frist, jeden Vertrag, jeden Code. Das organisatorische Gedächtnis eures Unternehmens.",
    questions: [
      {
        text: "Sind alle Verträge, Fristen und Kündigungstermine zentral und digital erfasst?",
        answers: [
          { text: "Ja, in einem DMS oder Vertragstool", points: 3 },
          { text: "Teilweise digital, teilweise in Ordnern", points: 2 },
          { text: "Das meiste ist im Kopf der Assistenz", points: 0 },
        ],
      },
      {
        text: "Weiß jemand anders, wo Gesellschafterverträge, Versicherungspolicen und wichtige Originaldokumente liegen?",
        answers: [
          { text: "Ja, mindestens zwei Personen", points: 3 },
          { text: "Der GF weiß es ungefähr", points: 2 },
          { text: "Nur eine Person weiß das", points: 0 },
        ],
      },
      {
        text: "Gibt es ein dokumentiertes System für wiederkehrende Aufgaben (Jahresabschluss-Fristen, Vertragsverlängerungen, Behördentermine)?",
        answers: [
          { text: "Ja, digitaler Kalender oder Workflow", points: 3 },
          { text: "Teilweise, vieles läuft über Erinnerungen einer Person", points: 2 },
          { text: "Das läuft alles über eine Person", points: 0 },
        ],
      },
    ],
  },
  {
    key: "technik",
    name: "ENTWICKLUNG / PRODUKTION",
    icon: pixelTechnik,
    intro: "Eure Produktion. Qualitätsstandards, Wissensmanagement, Prozessdokumentation — wer weiß, wie es wirklich läuft?",
    questions: [
      {
        text: "Ist euer Qualitätsmanagement (QM) so dokumentiert, dass eine neue Person die Standards sofort umsetzen könnte?",
        answers: [
          { text: "Ja, QM-Handbuch ist aktuell und vollständig", points: 3 },
          { text: "Teilweise, aber vieles ist veraltet oder lückenhaft", points: 2 },
          { text: "QM existiert nur in den Köpfen einzelner Mitarbeiter", points: 0 },
        ],
      },
      {
        text: "Gibt es ein funktionierendes Wissensmanagement-System, in dem Produktionswissen, Rezepturen oder Verfahren festgehalten werden?",
        answers: [
          { text: "Ja, systematisch gepflegt und für alle zugänglich", points: 3 },
          { text: "Teilweise, aber nicht einheitlich oder aktuell", points: 2 },
          { text: "Nein, das Wissen steckt in einzelnen Köpfen", points: 0 },
        ],
      },
      {
        text: "Werden Änderungen an Produktionsprozessen, Rezepturen oder Qualitätsstandards nachvollziehbar dokumentiert?",
        answers: [
          { text: "Ja, mit Versionierung und Freigabeprozess", points: 3 },
          { text: "Manchmal, aber nicht konsequent", points: 2 },
          { text: "Nein, Änderungen werden einfach gemacht", points: 0 },
        ],
      },
    ],
  },
  {
    key: "geschaeftsfuehrung",
    name: "GESCHÄFTSFÜHRUNG",
    icon: pixelGf,
    intro: "Und jetzt die unbequemste Frage: Was passiert, wenn IHR morgen nicht mehr da seid?",
    questions: [
      {
        text: "Weiß euer Team, welche Bankzugänge es gibt und wer im Notfall handlungsfähig ist?",
        answers: [
          { text: "Ja, Prokura und Notfallplan existieren", points: 3 },
          { text: "Teilweise geregelt", points: 2 },
          { text: "Nein, alles läuft über mich", points: 0 },
        ],
      },
      {
        text: "Gibt es einen dokumentierten Notfallplan, der regelt, wer welche Entscheidungen treffen darf, wenn die GF ausfällt?",
        answers: [
          { text: "Ja, schriftlich festgelegt und kommuniziert", points: 3 },
          { text: "Mündlich besprochen, aber nichts Schriftliches", points: 2 },
          { text: "Nein", points: 0 },
        ],
      },
      {
        text: "Könnten eure strategischen Partnerschaften und laufenden Verhandlungen von jemand anderem weitergeführt werden?",
        answers: [
          { text: "Ja, Kolleg:innen sind eingebunden", points: 3 },
          { text: "Bei manchen ja", points: 2 },
          { text: "Nein, das bin nur ich", points: 0 },
        ],
      },
    ],
  },
];

const SOLUTIONS: Record<string, Record<string, string>> = {
  buchhaltung: {
    "MEDIUM RISK": "Grundstruktur vorhanden. Ein dokumentierter Notfallplan und Vier-Augen-Prinzip bei Zugängen würden euch absichern.",
    "HIGH RISK": "Wissensinsel in der Buchhaltung. Prozessdokumentation und ein digitales Belegmanagement reduzieren eure Abhängigkeit sofort.",
    "GAME OVER": "Eure Finanzbuchhaltung hängt an einer Person. Keine Doku, keine Redundanz. Ein Ausfall bedeutet: keine Rechnungen, keine Bilanz, kein Überblick.",
  },
  vertrieb: {
    "MEDIUM RISK": "CRM wird genutzt, aber lückenhaft. Konsequente Kontaktpflege im System statt im Kopf macht euch unabhängiger.",
    "HIGH RISK": "Kundenbeziehungen sind personengebunden. Ohne strukturiertes CRM und dokumentierte Kundenhistorie baut ihr auf Sand.",
    "GAME OVER": "Eure Kundenbeziehungen existieren nur im Kopf einer Person. Wenn sie geht, gehen eure Kunden mit. Euer Vertrieb startet bei null.",
  },
  it: {
    "MEDIUM RISK": "Teilweise dokumentiert. Ein zentraler Passwort-Manager und regelmäßige Backup-Tests schließen die größten Lücken.",
    "HIGH RISK": "Kritisches IT-Wissen liegt bei einer Person. Zugangsdaten, Backup-Routinen und Lizenzen gehören zentral und redundant dokumentiert.",
    "GAME OVER": "Euer IT-Admin ist euer Single Point of Failure. Kein dokumentiertes Backup, keine geteilten Zugänge. Wenn er ausfällt, steht alles.",
  },
  assistenz: {
    "MEDIUM RISK": "Basisstruktur vorhanden. Ein zentrales Vertrags- und Fristenmanagement würde das organisatorische Wissen vom Kopf ins System bringen.",
    "HIGH RISK": "Das organisatorische Gedächtnis steckt in einer Person. Fristen, Verträge und Abläufe gehören in ein digitales System mit geteiltem Zugang.",
    "GAME OVER": "Verträge, Fristen, Zugangscodes — alles im Kopf einer Person. Fällt sie aus, verpasst ihr Fristen, von denen ihr nicht mal wisst.",
  },
  technik: {
    "MEDIUM RISK": "QM-Grundlagen vorhanden. Ein aktuelles Wissensmanagement-System und konsequente Prozessdokumentation würden euch absichern.",
    "HIGH RISK": "Produktionswissen und Qualitätsstandards sind personengebunden. Ohne systematisches Wissensmanagement riskiert ihr Qualitätsverlust bei jedem Personalwechsel.",
    "GAME OVER": "Kein dokumentiertes QM, kein Wissensmanagement. Eure Produktionsqualität hängt an einzelnen Köpfen. Fällt jemand aus, fehlt das Know-how.",
  },
  geschaeftsfuehrung: {
    "MEDIUM RISK": "Teilweise geregelt, aber nicht vollständig. Prokura, Notfallplan und dokumentierte Partnerschaften machen euch resilient.",
    "HIGH RISK": "Strategische Entscheidungen und Schlüsselbeziehungen liegen bei einer Person. Ohne Notfallplan ist euer Unternehmen führungslos.",
    "GAME OVER": "Kein Notfallplan, keine geteilte Prokura, keine dokumentierten Strategien. Euer Unternehmen ist führungslos ab Tag 1.",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDeptRisk(score: number, maxScore: number): string {
  const pct = score / maxScore;
  if (pct >= 0.75) return "MEDIUM RISK";
  if (pct >= 0.4) return "HIGH RISK";
  return "GAME OVER";
}

function getOverallRisk(score: number, maxScore: number): string {
  const pct = score / maxScore;
  if (pct >= 0.75) return "STABIL";
  if (pct >= 0.45) return "VERWUNDBAR";
  return "GAME OVER";
}

function riskColor(risk: string) {
  switch (risk) {
    case "STABIL": return { bar: "bg-green-500", glow: "shadow-[0_0_20px_hsl(120,70%,45%,0.5)]", text: "text-green-400" };
    case "MEDIUM RISK": return { bar: "bg-yellow-400", glow: "shadow-[0_0_20px_hsl(50,90%,50%,0.5)]", text: "text-yellow-400" };
    case "VERWUNDBAR": return { bar: "bg-yellow-500", glow: "shadow-[0_0_20px_hsl(40,90%,50%,0.5)]", text: "text-yellow-500" };
    case "HIGH RISK": return { bar: "bg-orange-500", glow: "shadow-[0_0_20px_hsl(30,90%,50%,0.5)]", text: "text-orange-400" };
    case "GAME OVER": return { bar: "bg-red-500", glow: "shadow-[0_0_20px_hsl(0,70%,50%,0.5)]", text: "text-red-500" };
    default: return { bar: "bg-muted", glow: "", text: "text-muted-foreground" };
  }
}

// ── Components ────────────────────────────────────────────────────────────────

function HealthBar({ value, max, risk }: { value: number; max: number; risk: string }) {
  const pct = Math.round((value / max) * 100);
  const colors = riskColor(risk);
  const isGameOver = risk === "GAME OVER";
  return (
    <div className="w-full h-5 bg-muted/50 rounded-sm border border-border/50 overflow-hidden relative">
      <div
        className={`h-full transition-all duration-1000 ease-out ${colors.bar} ${isGameOver ? "animate-pulse" : ""}`}
        style={{ width: `${pct}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-pixel text-foreground/80">
        {value}/{max}
      </span>
    </div>
  );
}

function LevelProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-sm transition-all duration-300 ${
            i < current ? "bg-primary" : i === current ? "bg-secondary animate-pulse" : "bg-muted/30"
          }`}
        />
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type Screen = "start" | "quiz" | "result";

const Game = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [skippedLevels, setSkippedLevels] = useState<Set<string>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ vorname: "", nachname: "", email: "", unternehmen: "", rolle: "", mitarbeiter: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setFadeIn(true);
  }, [screen]);

  // ── Scoring ──
  const levelScores = LEVELS.map((level, li) => {
    const start = LEVELS.slice(0, li).reduce((sum, l) => sum + l.questions.length, 0);
    let score = 0;
    for (let q = 0; q < level.questions.length; q++) score += answers[start + q] ?? 0;
    return score;
  });
  const activeLevels = LEVELS.filter(l => !skippedLevels.has(l.key));
  const totalQuestions = activeLevels.reduce((sum, l) => sum + l.questions.length, 0);
  const maxScore = totalQuestions * 3;
  const totalScore = LEVELS.reduce((sum, l, i) => skippedLevels.has(l.key) ? sum : sum + levelScores[i], 0);
  const overallRisk = getOverallRisk(totalScore, maxScore);

  const advanceFromLevel = useCallback((fromLevel: number) => {
    let next = fromLevel + 1;
    if (next >= LEVELS.length) {
      setScreen("result");
      return;
    }
    setTransitioning(true);
    setTimeout(() => { setCurrentLevel(next); setCurrentQuestion(0); setTransitioning(false); }, 500);
  }, []);

  const handleSkipLevel = useCallback(() => {
    const key = LEVELS[currentLevel].key;
    setSkippedLevels(prev => {
      const n = new Set(prev);
      n.add(key);
      return n;
    });
    // Pad answers array so subsequent indexing stays aligned
    const start = LEVELS.slice(0, currentLevel).reduce((sum, l) => sum + l.questions.length, 0);
    const needed = start + LEVELS[currentLevel].questions.length;
    setAnswers(prev => {
      const padded = [...prev];
      while (padded.length < needed) padded.push(0);
      return padded;
    });
    advanceFromLevel(currentLevel);
  }, [currentLevel, advanceFromLevel]);

  const handleAnswer = useCallback((points: number) => {
    setSelectedAnswer(points);
    setTimeout(() => {
      const newAnswers = [...answers, points];
      setAnswers(newAnswers);
      setSelectedAnswer(null);

      const nextQ = currentQuestion + 1;
      if (nextQ < LEVELS[currentLevel].questions.length) {
        setTransitioning(true);
        setTimeout(() => { setCurrentQuestion(nextQ); setTransitioning(false); }, 300);
      } else {
        advanceFromLevel(currentLevel);
      }
    }, 400);
  }, [answers, currentLevel, currentQuestion, advanceFromLevel]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const levelScoreData: Record<string, { score: number; max: number; risiko: string } | { risiko: string }> = {};
    LEVELS.forEach((l, i) => {
      if (skippedLevels.has(l.key)) {
        levelScoreData[l.key] = { risiko: "NICHT RELEVANT" };
      } else {
        const lMax = l.questions.length * 3;
        levelScoreData[l.key] = { score: levelScores[i], max: lMax, risiko: getDeptRisk(levelScores[i], lMax) };
      }
    });

    const payload = {
      ...formData,
      gesamtscore: totalScore,
      max_score: maxScore,
      gesamt_risiko: overallRisk,
      level_scores: levelScoreData,
      skipped_levels: Array.from(skippedLevels),
      gameover_count: LEVELS.filter((l, i) => !skippedLevels.has(l.key) && getDeptRisk(levelScores[i], l.questions.length * 3) === "GAME OVER").length,
      highrisk_count: LEVELS.filter((l, i) => !skippedLevels.has(l.key) && getDeptRisk(levelScores[i], l.questions.length * 3) === "HIGH RISK").length,
      antworten: answers,
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(
          Object.entries(payload).map(([k, v]) => [k, typeof v === "object" ? JSON.stringify(v) : String(v)])
        ),
      });
    } catch {
      // silent
    }
    setFormSubmitted(true);
    setSubmitting(false);
  };

  const restart = () => {
    setScreen("start");
    setCurrentLevel(0);
    setCurrentQuestion(0);
    setAnswers([]);
    setSkippedLevels(new Set());
    setFormData({ vorname: "", nachname: "", email: "", unternehmen: "", rolle: "", mitarbeiter: "" });
    setFormSubmitted(false);
  };

  // ── Render ──

  return (
    <div className="min-h-screen scanlines relative">
      <div className="absolute inset-0 synthwave-grid pointer-events-none" />

      {/* Minimal nav link back */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-pixel text-[10px] text-primary hover:text-glow-cyan transition-all">
          ← SMILING DATA CLUB
        </Link>
      </nav>

      <main className={`relative z-10 transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>

        {/* ════════ START SCREEN ════════ */}
        {screen === "start" && (
          <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
            <h1 className="font-pixel text-3xl md:text-5xl lg:text-6xl text-glow-pink text-secondary mb-6 leading-relaxed">
              KRISEN SIMULATOR
            </h1>
            <p className="text-foreground/80 max-w-xl text-base md:text-lg mb-10">
              Wie krisenanfällig ist euer Unternehmen? Findet es in 3&nbsp;Minuten heraus.
            </p>
            <button
              onClick={() => { setFadeIn(false); setTimeout(() => { setScreen("quiz"); }, 300); }}
              className="neon-btn rounded-md text-sm px-12 py-4"
            >
              START
            </button>
            <p className="text-muted-foreground text-xs mt-6">
              6 Level · {LEVELS.reduce((s, l) => s + l.questions.length, 0)} Fragen · 1 ehrliches Ergebnis.
            </p>
          </section>
        )}

        {/* ════════ QUIZ SCREEN ════════ */}
        {screen === "quiz" && (
          <section className="max-w-2xl mx-auto px-6 py-8 min-h-[80vh]">
            <LevelProgress current={currentLevel} total={LEVELS.length} />

            <p className="font-pixel text-xs text-primary mb-2 tracking-widest">
              LEVEL {currentLevel + 1}/{LEVELS.length}
            </p>
            <h2 className="font-pixel text-sm md:text-base text-secondary mb-4 text-glow-pink flex items-center gap-2">
              <img src={LEVELS[currentLevel].icon} alt="" className="w-6 h-6" style={{ imageRendering: "pixelated" }} /> {LEVELS[currentLevel].name}
            </h2>

            {currentQuestion === 0 && (
              <p className="text-foreground/70 text-sm mb-8 italic border-l-2 border-primary/40 pl-4">
                {LEVELS[currentLevel].intro}
              </p>
            )}

            <div className={`transition-all duration-300 ${transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
              <p className="font-pixel text-[10px] text-muted-foreground mb-2">
                FRAGE {currentQuestion + 1}/{LEVELS[currentLevel].questions.length}
              </p>
              <p className="text-foreground text-base md:text-lg mb-8 leading-relaxed">
                {LEVELS[currentLevel].questions[currentQuestion].text}
              </p>

              <div className="space-y-3">
                {LEVELS[currentLevel].questions[currentQuestion].answers.map((a, i) => (
                  <button
                    key={i}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswer(a.points)}
                    className={`w-full text-left px-5 py-4 rounded-md border transition-all duration-200 
                      ${selectedAnswer === a.points
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card text-foreground/90"
                      }
                      ${selectedAnswer !== null && selectedAnswer !== a.points ? "opacity-40" : ""}
                      disabled:cursor-default
                    `}
                  >
                    <span className="text-sm">{a.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ════════ RESULT SCREEN ════════ */}
        {screen === "result" && (
          <section className="max-w-4xl mx-auto px-6 py-8">
            {/* Overall Score */}
            <div className="text-center mb-12">
              <p className="font-pixel text-xs text-muted-foreground mb-4 tracking-widest">ERGEBNIS</p>
              <p className={`font-pixel text-5xl md:text-7xl mb-4 ${riskColor(overallRisk).text} ${overallRisk === "GAME OVER" ? "animate-pulse" : ""}`}
                style={{ textShadow: overallRisk === "GAME OVER" ? "0 0 20px hsl(0 70% 50% / 0.8), 0 0 40px hsl(0 70% 50% / 0.4)" : undefined }}
              >
                {totalScore}/{maxScore}
              </p>
              <p className={`font-pixel text-lg md:text-2xl mb-3 ${riskColor(overallRisk).text}`}>
                {overallRisk}
              </p>
              <div className="max-w-md mx-auto mb-4">
                <HealthBar value={totalScore} max={maxScore} risk={overallRisk} />
              </div>
              <p className="text-foreground/70 max-w-lg mx-auto">
                {overallRisk === "STABIL" && "Euer Unternehmen ist gut abgesichert. Ihr gehört zur Minderheit."}
                {overallRisk === "VERWUNDBAR" && "Ihr habt blinde Flecken. Und vermutlich wisst ihr, welche."}
                {overallRisk === "GAME OVER" && "GAME OVER — zumindest wenn morgen die falsche Person ausfällt."}
              </p>
            </div>

            {/* Department Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
              {LEVELS.map((level, i) => {
                const lMax = level.questions.length * 3;
                const score = levelScores[i];
                const risk = getDeptRisk(score, lMax);
                const colors = riskColor(risk);
                const solution = SOLUTIONS[level.key]?.[risk] ?? "";
                return (
                  <div
                    key={level.key}
                    className={`rounded-lg border border-border/50 bg-card/60 p-5 ${colors.glow} transition-all`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <img src={level.icon} alt={level.name} className="w-8 h-8" style={{ imageRendering: "pixelated" }} loading="lazy" />
                      <h3 className="font-pixel text-[10px] text-foreground">{level.name}</h3>
                    </div>
                    <HealthBar value={score} max={lMax} risk={risk} />
                    <p className={`font-pixel text-[9px] mt-2 ${colors.text}`}>{risk}</p>
                    <p className="text-foreground/60 text-xs mt-2 leading-relaxed">{solution}</p>
                  </div>
                );
              })}
            </div>

            {/* ── Detail Gate ── */}
            <div className="border-t border-primary/30 pt-12">
              {!formSubmitted ? (
                <div className="max-w-lg mx-auto">
                  <h2 className="font-pixel text-sm md:text-base text-primary text-center mb-3 text-glow-cyan">
                    Ihr wisst jetzt WO es brennt.
                  </h2>
                  <p className="font-pixel text-sm md:text-base text-secondary text-center mb-2 text-glow-pink">
                    Wir zeigen euch WIE ihr löscht.
                  </p>
                  <p className="text-muted-foreground text-sm text-center mb-8">
                    Detailanalyse mit konkreten Maßnahmen pro Abteilung — individuell auf euer Ergebnis abgestimmt. Kostenlos.
                  </p>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input required placeholder="Vorname *" value={formData.vorname}
                        onChange={e => setFormData(p => ({ ...p, vorname: e.target.value }))}
                        className="bg-card/50 border border-border/50 rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                      />
                      <input required placeholder="Nachname *" value={formData.nachname}
                        onChange={e => setFormData(p => ({ ...p, nachname: e.target.value }))}
                        className="bg-card/50 border border-border/50 rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <input required type="email" placeholder="E-Mail *" value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-card/50 border border-border/50 rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                    <input required placeholder="Unternehmen *" value={formData.unternehmen}
                      onChange={e => setFormData(p => ({ ...p, unternehmen: e.target.value }))}
                      className="w-full bg-card/50 border border-border/50 rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                    <select required value={formData.rolle}
                      onChange={e => setFormData(p => ({ ...p, rolle: e.target.value }))}
                      className="w-full bg-card/50 border border-border/50 rounded-md px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">Rolle im Unternehmen *</option>
                      <option value="Geschäftsführung">Geschäftsführung</option>
                      <option value="Abteilungsleitung">Abteilungsleitung</option>
                      <option value="Teamleitung">Teamleitung</option>
                      <option value="Mitarbeiter:in">Mitarbeiter:in</option>
                      <option value="Sonstiges">Sonstiges</option>
                    </select>
                    <select required value={formData.mitarbeiter}
                      onChange={e => setFormData(p => ({ ...p, mitarbeiter: e.target.value }))}
                      className="w-full bg-card/50 border border-border/50 rounded-md px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">Anzahl Mitarbeiter *</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="200+">200+</option>
                    </select>

                    <button type="submit" disabled={submitting} className="neon-btn rounded-md w-full py-4 text-xs">
                      {submitting ? "WIRD GESENDET..." : "DETAILANALYSE ANFORDERN"}
                    </button>

                    <p className="text-muted-foreground/60 text-[10px] text-center">
                      Mit dem Absenden stimmst du unserer{" "}
                      <Link to="/datenschutz" className="underline hover:text-primary">Datenschutzerklärung</Link> zu.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="text-center max-w-lg mx-auto">
                  <p className="font-pixel text-sm text-primary mb-4 text-glow-cyan">
                    ✓ EURE ANALYSE IST UNTERWEGS
                  </p>
                  <p className="text-foreground/70 mb-2">Check eure Inbox.</p>
                  <p className="text-foreground/70 mb-6">Und wenn ihr nicht warten wollt:</p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="neon-btn rounded-md inline-block px-8 py-3 text-xs">
                    TERMIN BUCHEN
                  </a>
                </div>
              )}
            </div>

            {/* Restart */}
            <div className="text-center mt-12">
              <button onClick={restart} className="text-muted-foreground text-xs hover:text-primary transition-colors">
                ↻ Quiz wiederholen
              </button>
            </div>
          </section>
        )}
      </main>

      <FooterSection />
    </div>
  );
};

export default Game;
