import { useState } from "react";
import { toast } from "sonner";

const WaitlistSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Willkommen im Club! 🎉", {
        description: "Wir melden uns bei dir.",
      });
      setEmail("");
    }
  };

  return (
    <section id="waitlist" className="py-24 px-6 relative">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-pixel text-lg md:text-xl text-primary text-glow-cyan mb-4">
          JOIN THE CLUB
        </h2>
        <p className="text-foreground/80 text-lg mb-10">
          Sei dabei wenn es losgeht.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            required
            className="flex-1 px-5 py-3 rounded-md bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
          />
          <button type="submit" className="neon-btn rounded-md whitespace-nowrap">
            Jetzt beitreten
          </button>
        </form>
      </div>
    </section>
  );
};

export default WaitlistSection;
