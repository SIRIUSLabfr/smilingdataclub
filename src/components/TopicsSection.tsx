import pixelGlobe from "@/assets/pixel-globe.png";
import pixelBot from "@/assets/pixel-bot.png";
import pixelDocument from "@/assets/pixel-document.png";
import pixelNetwork from "@/assets/pixel-network.png";

const topics = [
  {
    icon: pixelGlobe,
    title: "Zoho One",
    description: "40+ Apps. Ein Ökosystem. Alles verbunden — CRM, Finanzen, HR, Support.",
    border: "neon-border-cyan",
  },
  {
    icon: pixelBot,
    title: "KI & Automatisierung",
    description: "Von Chatbots bis Workflow-Automation — KI, die wirklich hilft.",
    border: "neon-border-pink",
  },
  {
    icon: pixelDocument,
    title: "DocuWare & IDP",
    description: "Intelligente Dokumentenverarbeitung. Vom Scan zum strukturierten Datensatz.",
    border: "neon-border-purple",
  },
  {
    icon: pixelNetwork,
    title: "MCP",
    description: "Model Context Protocol — die Brücke zwischen KI-Modellen und Ihren Systemen.",
    border: "neon-border-cyan",
  },
];

const TopicsSection = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-pixel text-lg md:text-xl text-secondary text-glow-pink mb-16">
          THEMEN
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className={`rounded-lg p-8 bg-card ${topic.border} transition-all duration-300 hover:scale-[1.02] text-left`}
            >
              <img src={topic.icon} alt={topic.title} className="w-8 h-8 mb-4" style={{ imageRendering: "pixelated" }} loading="lazy" />
              <h3 className="font-pixel text-xs text-foreground mb-3">{topic.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopicsSection;