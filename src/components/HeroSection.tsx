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

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
}

const PixelScatterCanvas = ({
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
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const phaseRef = useRef<'idle' | 'scatter' | 'reassemble'>('idle');
  const progressRef = useRef(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Canvas is 3x the logo size to give scatter room
  const pad = width; // padding on each side = logo width
  const cw = width + pad * 2;
  const ch = height + pad * 2;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      const tmpCanvas = document.createElement('canvas');
      const pixelSize = 4;
      tmpCanvas.width = width;
      tmpCanvas.height = height;
      const ctx = tmpCanvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const particles: Particle[] = [];

      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          const i = (y * width + x) * 4;
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];
          if (a < 30) continue;

          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 4;
          particles.push({
            x: x + pad, y: y + pad,
            originX: x + pad,
            originY: y + pad,
            color: `rgba(${r},${g},${b},${a / 255})`,
            size: pixelSize,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
          });
        }
      }
      particlesRef.current = particles;
    };
  }, [imageSrc, width, height, pad]);

  useEffect(() => {
    if (active && phaseRef.current === 'idle') {
      phaseRef.current = 'scatter';
      progressRef.current = 0;
    }
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const animate = () => {
      ctx.clearRect(0, 0, cw, ch);
      const particles = particlesRef.current;

      if (phaseRef.current === 'idle') {
        if (imgRef.current) {
          ctx.drawImage(imgRef.current, pad, pad, width, height);
        }
      } else if (phaseRef.current === 'scatter') {
        progressRef.current += 0.018;
        const t = Math.min(progressRef.current, 1);
        const eased = t * t;

        for (const p of particles) {
          p.x = p.originX + p.vx * eased * 60;
          p.y = p.originY + p.vy * eased * 60;
          p.alpha = Math.max(0, 1 - eased * 1.2);

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.globalAlpha = 1;

        if (t >= 1) {
          phaseRef.current = 'reassemble';
          progressRef.current = 0;
        }
      } else if (phaseRef.current === 'reassemble') {
        progressRef.current += 0.025;
        const t = Math.min(progressRef.current, 1);
        const eased = 1 - (1 - t) * (1 - t);

        for (const p of particles) {
          const scatteredX = p.originX + p.vx * 60;
          const scatteredY = p.originY + p.vy * 60;
          p.x = scatteredX + (p.originX - scatteredX) * eased;
          p.y = scatteredY + (p.originY - scatteredY) * eased;
          p.alpha = Math.min(1, eased * 1.3);

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.globalAlpha = 1;

        if (t >= 1) {
          phaseRef.current = 'idle';
          for (const p of particles) {
            p.x = p.originX;
            p.y = p.originY;
            p.alpha = 1;
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [cw, ch, width, height, pad]);

  return (
    <canvas
      ref={canvasRef}
      width={cw}
      height={ch}
      style={{
        imageRendering: 'pixelated',
        width: cw,
        height: ch,
        margin: `-${pad}px`,
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
              <PixelScatterCanvas
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
