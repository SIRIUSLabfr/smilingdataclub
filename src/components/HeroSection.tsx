import { useEffect, useRef, useState, useCallback } from "react";
import sdcLogo from "@/assets/sdc-logo.png";

const FlickerTagline = ({ text }: { text: string }) => {
  const [flickerIndices, setFlickerIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    const triggerFlicker = () => {
      const count = 2 + Math.floor(Math.random() * 2);
      const indices = new Set<number>();
      const validIndices = [...text].reduce<number[]>((acc, ch, i) => {
        if (ch !== ' ' && ch !== '.') return [...acc, i];
        return acc;
      }, []);
      while (indices.size < count && indices.size < validIndices.length) {
        indices.add(validIndices[Math.floor(Math.random() * validIndices.length)]);
      }
      setFlickerIndices(indices);
      setTimeout(() => setFlickerIndices(new Set()), 300);
    };

    const interval = setInterval(triggerFlicker, 10000);
    const initial = setTimeout(triggerFlicker, 4000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, [text]);

  return (
    <span>
      {[...text].map((ch, i) => (
        <span
          key={i}
          className={flickerIndices.has(i) ? 'opacity-20 transition-opacity duration-150' : 'transition-opacity duration-150'}
        >
          {ch}
        </span>
      ))}
    </span>
  );
};

const PixelShip = () => {
  const [ships, setShips] = useState<{ id: number; y: number; direction: number }[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const launch = () => {
      const id = idCounter++;
      const y = 10 + Math.random() * 80;
      const direction = Math.random() > 0.5 ? 1 : -1;
      setShips(prev => [...prev, { id, y, direction }]);
      setTimeout(() => {
        setShips(prev => prev.filter(s => s.id !== id));
      }, 3000);
    };

    const interval = setInterval(launch, 15000);
    const initial = setTimeout(launch, 7000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, []);

  return (
    <>
      {ships.map(ship => (
        <div
          key={ship.id}
          className="pixel-ship fixed pointer-events-none z-50"
          style={{
            top: `${ship.y}%`,
            animationDirection: ship.direction === 1 ? 'normal' : 'reverse',
          }}
        >
          <span className="text-xs" style={{ imageRendering: 'pixelated', fontSize: '14px' }}>
            {ship.direction === 1 ? '▶' : '◀'}
          </span>
        </div>
      ))}
    </>
  );
};

const PixelBomb = () => {
  const [exploding, setExploding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setExploding(true);
      setTimeout(() => setExploding(false), 800);
    }, 10000);
    const initial = setTimeout(() => {
      setExploding(true);
      setTimeout(() => setExploding(false), 800);
    }, 3000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, []);

  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 20 + Math.random() * 15;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      char: ['▪', '▫', '◾', '◽', '■', '□', '▮', '▯'][Math.floor(Math.random() * 8)],
    };
  });

  return (
    <span className="relative inline-block w-8 h-8 align-middle">
      {!exploding && (
        <span className="absolute inset-0 flex items-center justify-center text-lg" style={{ imageRendering: 'pixelated' }}>
          💣
        </span>
      )}
      {exploding && (
        <>
          <span className="absolute inset-0 flex items-center justify-center text-lg animate-ping" style={{ imageRendering: 'pixelated' }}>
            💥
          </span>
          {particles.map((p, i) => (
            <span
              key={i}
              className="absolute text-[8px] text-primary"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${p.x}px, ${p.y}px)`,
                opacity: 0,
                animation: 'bomb-particle 0.8s ease-out forwards',
                animationDelay: `${i * 30}ms`,
              }}
            >
              {p.char}
            </span>
          ))}
        </>
      )}
    </span>
  );
};

const PixelateCanvas = ({
  imageSrc,
  width,
  height,
  active,
}: {
  imageSrc: string;
  width: number;
  height: number;
  active: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const phaseRef = useRef<'idle' | 'pixelate' | 'depixelate'>('idle');
  const progressRef = useRef(0);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
    };
  }, [imageSrc]);

  useEffect(() => {
    if (active && phaseRef.current === 'idle') {
      phaseRef.current = 'pixelate';
      progressRef.current = 0;
    }
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const drawPixelated = (pixelSize: number) => {
      if (!imgRef.current) return;
      const small = document.createElement('canvas');
      const sw = Math.max(1, Math.floor(width / pixelSize));
      const sh = Math.max(1, Math.floor(height / pixelSize));
      small.width = sw;
      small.height = sh;
      const sctx = small.getContext('2d')!;
      sctx.imageSmoothingEnabled = false;
      sctx.drawImage(imgRef.current, 0, 0, sw, sh);
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, sw, sh, 0, 0, width, height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (phaseRef.current === 'idle') {
        if (imgRef.current) {
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(imgRef.current, 0, 0, width, height);
        }
      } else if (phaseRef.current === 'pixelate') {
        progressRef.current += 0.02;
        const t = Math.min(progressRef.current, 1);
        // pixel size goes from 1 (sharp) to 32 (very blocky)
        const pixelSize = 1 + Math.floor(t * t * 31);
        drawPixelated(pixelSize);

        if (t >= 1) {
          phaseRef.current = 'depixelate';
          progressRef.current = 0;
        }
      } else if (phaseRef.current === 'depixelate') {
        progressRef.current += 0.025;
        const t = Math.min(progressRef.current, 1);
        // pixel size goes from 32 (blocky) back to 1 (sharp)
        const pixelSize = 1 + Math.floor((1 - t) * (1 - t) * 31);
        drawPixelated(pixelSize);

        if (t >= 1) {
          phaseRef.current = 'idle';
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        imageRendering: 'pixelated',
        width,
        height,
      }}
    />
  );
};

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [glitchKey, setGlitchKey] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [drifting, setDrifting] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const isMd = typeof window !== 'undefined' && window.innerWidth >= 768;
  const logoSize = isMd ? 256 : 192;

  const triggerGlitch = () => {
    setGlitchKey((k) => k + 1);
    setGlitching(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setGlitching(false), 400);
  };

  const triggerDrift = useCallback(() => {
    setDrifting(true);
    setTimeout(() => setDrifting(false), 3000);
  }, []);

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

  useEffect(() => {
    const initial = setTimeout(triggerDrift, 5000);
    const interval = setInterval(triggerDrift, 12000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [triggerDrift]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Krisen Simulator Button top-right */}
      <a
        href="/game"
        className="absolute top-4 right-4 z-50 font-pixel text-[10px] md:text-xs px-3 py-2 border border-primary/60 rounded bg-background/80 text-primary hover:bg-primary/20 hover:shadow-[0_0_15px_hsl(var(--primary)/0.4)] transition-all duration-300 backdrop-blur-sm"
      >
        ⚡ KRISEN SIMULATOR
      </a>
      <div className="absolute inset-0 synthwave-grid" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-accent/20 via-secondary/5 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-background to-transparent" />

      {/* Pixel ship Easter egg */}
      <PixelShip />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <div
            className={`inline-block relative ${glitching ? 'glitch-active' : ''}`}
            onMouseEnter={triggerGlitch}
            style={{ width: logoSize, height: logoSize }}
          >
            <div
              className={`drop-shadow-[0_0_40px_hsl(172,100%,45%,0.4)] ${
                loaded ? 'animate-fade-in' : 'opacity-0'
              }`}
            >
              <PixelateCanvas
                imageSrc={sdcLogo}
                width={logoSize}
                height={logoSize}
                active={drifting}
              />
            </div>
          </div>
        </div>

        <h1 className="font-pixel text-2xl md:text-4xl lg:text-5xl text-glow-cyan text-primary mb-6 leading-relaxed">
          SMILING DATA CLUB
        </h1>

        <p className="font-pixel text-xs md:text-sm text-secondary mb-12 text-glow-pink tracking-wider">
          <FlickerTagline text="Today's complexity. Retro simplicity." />
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
