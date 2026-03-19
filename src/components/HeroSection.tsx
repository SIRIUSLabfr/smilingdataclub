import sdcLogo from "@/assets/sdc-logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Synthwave grid background */}
      <div className="absolute inset-0 synthwave-grid" />
      
      {/* Gradient overlay - horizon glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-neon-purple/20 via-neon-pink/5 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-background to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="animate-float mb-8">
          <img
            src={sdcLogo}
            alt="Smiling Data Club Logo"
            className="w-32 h-32 md:w-40 md:h-40 mx-auto drop-shadow-[0_0_30px_hsl(172,100%,45%,0.3)]"
          />
        </div>

        <h1 className="font-pixel text-2xl md:text-4xl lg:text-5xl text-glow-cyan text-primary mb-6 leading-relaxed">
          SMILING DATA CLUB
        </h1>

        <p className="font-pixel text-xs md:text-sm text-secondary mb-12 text-glow-pink tracking-wider">
          Today's complexity. Retro simplicity.
        </p>

        <a href="#waitlist" className="neon-btn rounded-md inline-block">
          Jetzt beitreten
        </a>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
