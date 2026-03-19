import { Globe, Bot, FileText, Network } from "lucide-react";

const topics = [
  {
    icon: Globe,
    title: "Zoho One",
    description: "40+ Apps. Ein Ökosystem. Alles verbunden — CRM, Finanzen, HR, Support.",
    color: "text-primary",
    border: "neon-border-cyan",
  },
  {
    icon: Bot,
    title: "KI & Automatisierung",
    description: "Von Chatbots bis Workflow-Automation — KI, die wirklich hilft.",
    color: "text-secondary",
    border: "neon-border-pink",
  },
  {
    icon: FileText,
    title: "DocuWare & IDP",
    description: "Intelligente Dokumentenverarbeitung. Vom Scan zum strukturierten Datensatz.",
    color: "text-accent",
    border: "neon-border-purple",
  },
  {
    icon: Network,
    title: "MCP",
    description: "Model Context Protocol — die Brücke zwischen KI-Modellen und Ihren Systemen.",
    color: "text-primary",
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
              <topic.icon className={`w-8 h-8 mb-4 ${topic.color}`} />
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
