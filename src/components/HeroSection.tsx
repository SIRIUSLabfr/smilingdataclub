import { useEffect, useRef, useState } from "react";
import sdcLogo from "@/assets/sdc-logo.png";

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [glitchKey, setGlitchKey] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const triggerGlitch = () => {
    setGlitchKey((k) => k + 1);
    setGlitching(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setGlitching(false), 400);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(triggerGlitch, 8000);
    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 synthwave-grid" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-accent/20 via-secondary/5 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-background to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <div
            className={`logo-glitch-container inline-block relative ${glitching ? 'glitch-active' : ''}`}
            onMouseEnter={triggerGlitch}
          >
            <img
              src={sdcLogo}
              alt="Smiling Data Club Logo"
              className={`logo-main-img w-32 h-32 md:w-40 md:h-40 mx-auto drop-shadow-[0_0_30px_hsl(172,100%,45%,0.3)] ${
                loaded ? 'logo-glitch-load' : 'opacity-0'
              }`}
            />
            <div key={`r-${glitchKey}`} className="logo-rgb-layer logo-rgb-red absolute inset-0">
              <img src={sdcLogo} alt="" aria-hidden="true" className="w-32 h-32 md:w-40 md:h-40" />
            </div>
            <div key={`c-${glitchKey}`} className="logo-rgb-layer logo-rgb-cyan absolute inset-0">
              <img src={sdcLogo} alt="" aria-hidden="true" className="w-32 h-32 md:w-40 md:h-40" />
            </div>
          </div>
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

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
