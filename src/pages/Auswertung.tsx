import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import FooterSection from "@/components/FooterSection";
import { AUSWERTUNG_CONTENT, riskKeyFromLabel } from "@/data/auswertung-content";
import { QUICK_WINS } from "@/data/quick-wins";

import pixelBuchhaltung from "@/assets/pixel-buchhaltung.png";
import pixelVertrieb from "@/assets/pixel-vertrieb.png";
import pixelIt from "@/assets/pixel-it.png";
import pixelAssistenz from "@/assets/pixel-assistenz.png";
import pixelTechnik from "@/assets/pixel-technik.png";
import pixelGf from "@/assets/pixel-gf.png";

const BOOKING_URL = "https://sirius-gmbh.zohobookings.eu/#/240927000000441095";
const ZOHO_TRIAL_URL =
  "https://store.zoho.eu/ResellerCustomerSignUp.do?id=536878a40c51f2a6885a71b6eb727e960c97d34582565f2f7afa0f72e49ccbbe";

// ── Bereichs-Metadaten (Name + Icon) ──────────────────────────────────────────

const BEREICHE: Record<string, { name: string; icon: string }> = {
  buchhaltung: { name: "BUCHHALTUNG", icon: pixelBuchhaltung },
  vertrieb: { name: "VERTRIEB", icon: pixelVertrieb },
  it: { name: "IT-ADMINISTRATION", icon: pixelIt },
  assistenz: { name: "ASSISTENZ DER GF", icon: pixelAssistenz },
  technik: { name: "ENTWICKLUNG / PRODUKTION", icon: pixelTechnik },
  geschaeftsfuehrung: { name: "GESCHÄFTSFÜHRUNG", icon: pixelGf },
};

const BEREICH_ORDER = [
  "buchhaltung",
  "vertrieb",
  "it",
  "assistenz",
  "technik",
  "geschaeftsfuehrung",
];

// ── Risk-Helpers (gespiegelt aus Game.tsx) ────────────────────────────────────

function riskColor(risk: string) {
  switch (risk) {
    case "STABIL":
      return { bar: "bg-green-500", glow: "shadow-[0_0_20px_hsl(120,70%,45%,0.5)]", text: "text-green-400" };
    case "MEDIUM RISK":
      return { bar: "bg-yellow-400", glow: "shadow-[0_0_20px_hsl(50,90%,50%,0.5)]", text: "text-yellow-400" };
    case "VERWUNDBAR":
      return { bar: "bg-yellow-500", glow: "shadow-[0_0_20px_hsl(40,90%,50%,0.5)]", text: "text-yellow-500" };
    case "HIGH RISK":
      return { bar: "bg-orange-500", glow: "shadow-[0_0_20px_hsl(30,90%,50%,0.5)]", text: "text-orange-400" };
    case "GAME OVER":
      return { bar: "bg-red-500", glow: "shadow-[0_0_20px_hsl(0,70%,50%,0.5)]", text: "text-red-500" };
    default:
      return { bar: "bg-muted", glow: "", text: "text-muted-foreground" };
  }
}

function HealthBar({ value, max, risk }: { value: number; max: number; risk: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
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

// Sortier-Reihenfolge: GAME OVER → HIGH RISK → MEDIUM → LOW
const RISK_ORDER: Record<string, number> = {
  "GAME OVER": 0,
  "HIGH RISK": 1,
  "MEDIUM RISK": 2,
  STABIL: 3,
};

// ── Datenstruktur aus dem Hash ────────────────────────────────────────────────

interface LevelScoreActive {
  score: number;
  max: number;
  risiko: string;
}
interface LevelScoreSkipped {
  risiko: "NICHT RELEVANT";
}
type LevelScore = LevelScoreActive | LevelScoreSkipped;

export interface AuswertungData {
  vorname?: string;
  gesamtscore: number;
  max_score: number;
  gesamt_risiko: string;
  level_scores: Record<string, LevelScore>;
  skipped_levels: string[];
}

function decodeHashData(hash: string): AuswertungData | null {
  try {
    const m = hash.match(/data=([^&]+)/);
    if (!m) return null;
    const b64 = decodeURIComponent(m[1]);
    // base64 → JSON (utf-8-safe)
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (typeof parsed !== "object" || parsed == null) return null;
    return parsed as AuswertungData;
  } catch {
    return null;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

const Auswertung = () => {
  const [data, setData] = useState<AuswertungData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setData(decodeHashData(window.location.hash));
    setLoaded(true);
    window.scrollTo(0, 0);
    setFadeIn(true);
  }, []);

  // SEO
  useEffect(() => {
    document.title = "Eure Auswertung — Krisen Simulator | Smiling Data Club";
    const desc = "Eure personalisierte Auswertung des Krisen Simulators mit Brennpunkten, Quick Wins und nächsten Schritten.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  // ── Sortierte Brennpunkte (nur aktive Bereiche) ──
  const brennpunkte = useMemo(() => {
    if (!data) return [];
    const skipped = new Set(data.skipped_levels ?? []);
    const entries = BEREICH_ORDER
      .filter((key) => !skipped.has(key))
      .map((key) => {
        const ls = data.level_scores?.[key];
        if (!ls || (ls as LevelScoreSkipped).risiko === "NICHT RELEVANT") return null;
        const active = ls as LevelScoreActive;
        return {
          key,
          ...active,
        };
      })
      .filter((x): x is { key: string; score: number; max: number; risiko: string } => x !== null);

    return entries.sort((a, b) => {
      const ra = RISK_ORDER[a.risiko] ?? 99;
      const rb = RISK_ORDER[b.risiko] ?? 99;
      if (ra !== rb) return ra - rb;
      // gleicher Risiko-Bucket: höherer Risiko-Anteil zuerst
      return b.score / b.max - a.score / a.max;
    });
  }, [data]);

  const top3Keys = useMemo(() => brennpunkte.slice(0, 3).map((b) => b.key), [brennpunkte]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link kopiert!");
    } catch {
      toast.error("Konnte Link nicht kopieren");
    }
  };

  // ── Empty-State ──
  if (loaded && !data) {
    return (
      <div className="min-h-screen scanlines relative">
        <div className="absolute inset-0 synthwave-grid pointer-events-none" />
        <nav className="relative z-20 flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-pixel text-[10px] text-primary hover:text-glow-cyan transition-all">
            ← SMILING DATA CLUB
          </Link>
        </nav>
        <main className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-pixel text-2xl md:text-4xl text-secondary text-glow-pink mb-6 leading-relaxed">
            KEINE AUSWERTUNG GEFUNDEN
          </h1>
          <p className="text-foreground/80 max-w-md mb-8">
            Bitte starte das Quiz neu, damit wir dir deine personalisierte Auswertung zeigen können.
          </p>
          <Link to="/game" className="neon-btn rounded-md px-10 py-4 text-xs">
            QUIZ STARTEN
          </Link>
        </main>
        <FooterSection />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen scanlines relative">
        <div className="absolute inset-0 synthwave-grid pointer-events-none" />
      </div>
    );
  }

  const overallColors = riskColor(data.gesamt_risiko);

  return (
    <div className="min-h-screen scanlines relative">
      <div className="absolute inset-0 synthwave-grid pointer-events-none" />

      <nav className="relative z-20 flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-pixel text-[10px] text-primary hover:text-glow-cyan transition-all">
          ← SMILING DATA CLUB
        </Link>
      </nav>

      <main className={`relative z-10 transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
        {/* ════════ HERO ════════ */}
        <section className="max-w-3xl mx-auto px-6 pt-8 pb-16 text-center">
          <h1 className="font-pixel text-2xl md:text-4xl lg:text-5xl text-secondary text-glow-pink mb-6 leading-relaxed">
            EURE AUSWERTUNG
          </h1>
          {data.vorname && (
            <p className="font-pixel text-xs md:text-sm text-primary text-glow-cyan mb-8 tracking-widest">
              HI {data.vorname.toUpperCase()}
            </p>
          )}

          <p
            className={`font-pixel text-5xl md:text-7xl mb-4 ${overallColors.text} ${
              data.gesamt_risiko === "GAME OVER" ? "animate-pulse" : ""
            }`}
            style={{
              textShadow:
                data.gesamt_risiko === "GAME OVER"
                  ? "0 0 20px hsl(0 70% 50% / 0.8), 0 0 40px hsl(0 70% 50% / 0.4)"
                  : undefined,
            }}
          >
            {data.gesamtscore}/{data.max_score}
          </p>

          <div className="max-w-md mx-auto mb-4">
            <HealthBar value={data.gesamtscore} max={data.max_score} risk={data.gesamt_risiko} />
          </div>

          <p className={`font-pixel text-lg md:text-2xl mt-4 ${overallColors.text}`}>
            {data.gesamt_risiko}
          </p>
        </section>

        {/* ════════ BRENNPUNKTE ════════ */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <h2 className="font-pixel text-lg md:text-2xl text-secondary text-glow-pink mb-10 text-center leading-relaxed">
            EURE BRENNPUNKTE
          </h2>

          {brennpunkte.length === 0 ? (
            <p className="text-center text-foreground/70">
              Keine kritischen Brennpunkte erkannt — euer Setup ist solide.
            </p>
          ) : (
            <div className="space-y-6">
              {brennpunkte.map((b) => {
                const meta = BEREICHE[b.key];
                const colors = riskColor(b.risiko);
                const content = AUSWERTUNG_CONTENT[b.key]?.[riskKeyFromLabel(b.risiko)];
                if (!meta) return null;
                return (
                  <article
                    key={b.key}
                    className={`rounded-lg border border-border/50 bg-card/60 p-6 ${colors.glow} transition-all`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={meta.icon}
                        alt={meta.name}
                        className="w-10 h-10"
                        style={{ imageRendering: "pixelated" }}
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <h3 className="font-pixel text-[11px] md:text-xs text-foreground">{meta.name}</h3>
                        <p className={`font-pixel text-[10px] mt-1 ${colors.text}`}>{b.risiko}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <HealthBar value={b.score} max={b.max} risk={b.risiko} />
                    </div>

                    {content && (
                      <>
                        <p className="text-foreground/80 text-sm leading-relaxed mb-4">{content.text}</p>
                        <p className="border-l-2 border-secondary/60 pl-4 text-secondary text-glow-pink text-sm italic">
                          {content.highlight}
                        </p>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ════════ QUICK WINS ════════ */}
        {top3Keys.length > 0 && (
          <section className="max-w-4xl mx-auto px-6 pb-20">
            <h2 className="font-pixel text-lg md:text-2xl text-secondary text-glow-pink mb-10 text-center leading-relaxed">
              QUICK WINS DIESE WOCHE
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {top3Keys
                .map((k) => QUICK_WINS[k])
                .filter((q): q is NonNullable<typeof q> => Boolean(q))
                .map((q) => (
                  <div
                    key={q.bereichKey}
                    className="rounded-lg border border-border/50 bg-card/60 p-5 hover:border-primary/50 transition-all"
                  >
                    <p className="font-pixel text-[9px] text-primary mb-3 tracking-widest">{q.bereich.toUpperCase()}</p>
                    <h3 className="font-pixel text-[11px] text-foreground mb-3 leading-relaxed">{q.titel}</h3>
                    <p className="text-foreground/70 text-xs mb-4 leading-relaxed">{q.beschreibung}</p>
                    <div className="space-y-1 text-[11px]">
                      <p className="text-muted-foreground">
                        <span className="font-pixel text-[9px] text-primary mr-2">AUFWAND</span>
                        {q.aufwand}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-pixel text-[9px] text-secondary mr-2">WIRKUNG</span>
                        {q.wirkung}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ════════ STACK ════════ */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <h2 className="font-pixel text-lg md:text-2xl text-secondary text-glow-pink mb-3 text-center leading-relaxed">
            UNSER STACK
          </h2>
          <p className="text-foreground/70 text-center mb-10 text-sm">
            Wir empfehlen, was wir selbst nutzen.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { name: "Zoho One", desc: "All-in-One Business-Suite" },
              { name: "DocuWare", desc: "Dokumenten- & Workflow-Mgmt" },
              { name: "Make", desc: "Automatisierung & Integrationen" },
              { name: "Claude", desc: "KI für Wissensarbeit" },
            ].map((tool) => (
              <div
                key={tool.name}
                className="rounded-lg border border-border/50 bg-card/60 p-5 text-center hover:border-primary/50 transition-all"
              >
                <p className="font-pixel text-[11px] text-primary mb-2 text-glow-cyan">{tool.name}</p>
                <p className="text-foreground/60 text-xs leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href={ZOHO_TRIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md border border-primary/60 text-primary hover:bg-primary/10 px-6 py-3 text-[11px] font-pixel tracking-widest transition-all"
            >
              ZOHO ONE UNVERBINDLICH TESTEN
            </a>
          </div>
        </section>

        {/* ════════ CTA ════════ */}
        <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
          <h2 className="font-pixel text-base md:text-xl text-secondary text-glow-pink mb-6 leading-relaxed">
            WENN IHR NICHT ALLEINE DURCH WOLLT
          </h2>
          <p className="text-foreground/80 mb-10 max-w-xl mx-auto">
            Wir gehen mit euch eure Brennpunkte durch und zeigen, wo ihr mit überschaubarem Aufwand den
            größten Hebel habt. Unverbindlich, kostenlos, ehrlich.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-btn rounded-md px-10 py-4 text-xs"
            >
              TERMIN BUCHEN →
            </a>
            <button
              onClick={copyShareLink}
              className="rounded-md border border-border/60 text-foreground/80 hover:text-primary hover:border-primary/60 px-6 py-3 text-[11px] font-pixel tracking-widest transition-all"
            >
              DIESE SEITE TEILEN
            </button>
          </div>

          <p className="text-muted-foreground text-xs max-w-lg mx-auto">
            Speichert diesen Link, um eure Auswertung später wiederzufinden — wir senden ihn euch auch per Mail.
          </p>
        </section>

        {/* Restart */}
        <div className="text-center pb-12">
          <Link to="/game" className="text-muted-foreground text-xs hover:text-primary transition-colors">
            ↻ Quiz wiederholen
          </Link>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Auswertung;
