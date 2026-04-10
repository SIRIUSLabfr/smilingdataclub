import { useState, useRef } from "react";
import { toast } from "sonner";

const WEBHOOK_URL =
  "https://flow.zoho.eu/20106110113/flow/webhook/incoming?zapikey=1001.77f60d1bef32a7c890168dc859249116.e3cb163ca883cc45cd9d5915f6a5e195&isdebug=true";

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        mode: "no-cors",
      });
      toast.success("Danke! Bitte bestätige deine Anmeldung per E-Mail. 📬");
      setEmail("");
    } catch {
      toast.error("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
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
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            required
            className="flex-1 px-5 py-3 rounded-md bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
          />
          <button type="submit" disabled={isSubmitting} className="neon-btn rounded-md whitespace-nowrap">
            {isSubmitting ? "Wird gesendet..." : "Jetzt beitreten"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default WaitlistSection;
