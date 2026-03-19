import { Smile, Trophy, Cpu } from "lucide-react";

const cards = [
  {
    icon: Smile,
    title: "Happy Employee",
    description: "Technologie, die den Alltag erleichtert — nicht verkompliziert.",
    glowClass: "box-glow-cyan neon-border-cyan",
    iconColor: "text-primary",
  },
  {
    icon: Trophy,
    title: "Happy Boss",
    description: "Messbare Ergebnisse durch smarte Prozesse und klare Datenströme.",
    glowClass: "box-glow-pink neon-border-pink",
    iconColor: "text-secondary",
  },
  {
    icon: Cpu,
    title: "Smart Tools",
    description: "Zoho, KI und DocuWare — intelligent verknüpft, einfach bedient.",
    glowClass: "neon-border-purple",
    iconColor: "text-accent",
  },
];

const AboutSection = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-pixel text-lg md:text-xl text-primary text-glow-cyan mb-6">
          ÜBER UNS
        </h2>
        <p className="text-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
          Technik soll dem Menschen nutzen — nicht umgekehrt. Wir glauben an Systeme,
          die lächeln machen. An Prozesse, die fließen. An Daten, die Sinn ergeben.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`rounded-lg p-8 bg-card transition-transform duration-300 hover:-translate-y-2 ${card.glowClass}`}
            >
              <card.icon className={`w-10 h-10 mx-auto mb-5 ${card.iconColor}`} />
              <h3 className="font-pixel text-xs text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
