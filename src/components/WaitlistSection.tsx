import { useState, useRef } from "react";
import { toast } from "sonner";

const WEBHOOK_URL =
  "https://flow.zoho.eu/20106110113/flow/webhook/incoming?zapikey=1001.0ccd122c2824a51d4309ea2b4ef7c7e5.e8e31339336bcce2a43b9785fc2ed8a4&isdebug=false";

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
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
