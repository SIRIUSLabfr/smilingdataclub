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

const PongBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;
    const P = 3; // pixel size

    const paddleW = P * 2;
    const paddleH = P * 8;
    const ballSize = P * 2;

    // State
    let ballX = W / 2, ballY = H / 2;
    let bvx = 1.5, bvy = 1;
    let leftY = H / 2 - paddleH / 2;
    let rightY = H / 2 - paddleH / 2;
    let leftScore = 0, rightScore = 0;

    const resetBall = () => {
      ballX = W / 2;
      ballY = H / 2;
      bvx = (Math.random() > 0.5 ? 1 : -1) * 1.5;
      bvy = (Math.random() - 0.5) * 2;
    };

    const drawPixelRect = (x: number, y: number, w: number, h: number) => {
      // Draw as blocky pixels
      for (let py = 0; py < h; py += P) {
        for (let px = 0; px < w; px += P) {
          ctx.fillRect(Math.floor(x + px), Math.floor(y + py), P, P);
        }
      }
    };

    const drawScore = (score: number, cx: number) => {
      const s = score.toString();
      ctx.font = `${P * 5}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(s, cx, P * 8);
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'hsl(172, 100%, 45%)';

      // Center dashed line
      for (let y = 0; y < H; y += P * 4) {
        ctx.fillRect(W / 2 - P / 2, y, P, P * 2);
      }

      // AI paddles (simple tracking)
      const leftTarget = ballY - paddleH / 2;
      const rightTarget = ballY - paddleH / 2;
      leftY += (leftTarget - leftY) * 0.04;
      rightY += (rightTarget - rightY) * 0.045;
      leftY = Math.max(0, Math.min(H - paddleH, leftY));
      rightY = Math.max(0, Math.min(H - paddleH, rightY));

      // Move ball
      ballX += bvx;
      ballY += bvy;

      // Top/bottom bounce
      if (ballY <= 0 || ballY >= H - ballSize) bvy *= -1;

      // Paddle collisions
      if (ballX <= P * 4 + paddleW && ballY + ballSize >= leftY && ballY <= leftY + paddleH && bvx < 0) {
        bvx *= -1;
        bvy += (Math.random() - 0.5) * 0.5;
      }
      if (ballX >= W - P * 4 - paddleW - ballSize && ballY + ballSize >= rightY && ballY <= rightY + paddleH && bvx > 0) {
        bvx *= -1;
        bvy += (Math.random() - 0.5) * 0.5;
      }

      // Scoring
      if (ballX < 0) { rightScore = (rightScore + 1) % 10; resetBall(); }
      if (ballX > W) { leftScore = (leftScore + 1) % 10; resetBall(); }

      // Draw paddles
      drawPixelRect(P * 3, leftY, paddleW, paddleH);
      drawPixelRect(W - P * 3 - paddleW, rightY, paddleW, paddleH);

      // Draw ball
      drawPixelRect(ballX, ballY, ballSize, ballSize);

      // Draw scores
      drawScore(leftScore, W / 4);
      drawScore(rightScore, (W / 4) * 3);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      style={{ imageRendering: 'pixelated', opacity: 0.25 }}
    />
  );
};

const PixelBomb = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const explodingRef = useRef(false);
  const timerRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const S = 48; // canvas size
    const P = 3;  // pixel size for that chunky look

    // Draw a pixel-art bomb centered in canvas (16x16 grid at P=3)
    const OX = 4; // offset to center the 8-wide bomb in 16-wide canvas
    const OY = 4;
    const drawBomb = () => {
      ctx.clearRect(0, 0, S, S);
      const bombPixels = [
        // fuse spark (yellow)
        { x: 5, y: 0, c: '#ffff00' }, { x: 6, y: 1, c: '#ffaa00' },
        // fuse
        { x: 5, y: 2, c: '#888' }, { x: 4, y: 1, c: '#888' },
        // body (dark)
        { x: 3, y: 3, c: '#333' }, { x: 4, y: 3, c: '#333' }, { x: 5, y: 3, c: '#333' },
        { x: 2, y: 4, c: '#333' }, { x: 3, y: 4, c: '#222' }, { x: 4, y: 4, c: '#222' }, { x: 5, y: 4, c: '#222' }, { x: 6, y: 4, c: '#333' },
        { x: 2, y: 5, c: '#333' }, { x: 3, y: 5, c: '#222' }, { x: 4, y: 5, c: '#222' }, { x: 5, y: 5, c: '#222' }, { x: 6, y: 5, c: '#333' },
        { x: 2, y: 6, c: '#333' }, { x: 3, y: 6, c: '#222' }, { x: 4, y: 6, c: '#222' }, { x: 5, y: 6, c: '#222' }, { x: 6, y: 6, c: '#333' },
        { x: 3, y: 7, c: '#333' }, { x: 4, y: 7, c: '#333' }, { x: 5, y: 7, c: '#333' },
        // highlight
        { x: 3, y: 4, c: '#555' },
      ];
      for (const p of bombPixels) {
        ctx.fillStyle = p.c;
        ctx.fillRect((p.x + OX) * P, (p.y + OY) * P, P, P);
      }
    };

    // Explosion: blocky expanding squares
    const drawExplosion = (t: number) => {
      ctx.clearRect(0, 0, S, S);
      const colors = ['#ff0000', '#ff4400', '#ffaa00', '#ffff00', '#ff6600', '#ffffff'];
      // Frame-based blocky explosion
      const frame = Math.floor(t * 5); // 0-4 frames
      const rng = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280;

      if (frame === 0) {
        // small center flash
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(6, 6, 4, 4);
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(5, 5, 6, 6);
      } else if (frame <= 2) {
        // expanding pixel blocks
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2;
          const dist = frame * 3 + rng(i * 7) * 3;
          const bx = Math.floor(8 + Math.cos(angle) * dist) * P;
          const by = Math.floor(8 + Math.sin(angle) * dist) * P;
          ctx.fillStyle = colors[Math.floor(rng(i * 13) * colors.length)];
          ctx.fillRect(bx, by, P, P);
        }
        // center glow
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(6, 6, 4, 4);
      } else {
        // fading debris pixels
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2;
          const dist = frame * 4 + rng(i * 11) * 4;
          const bx = Math.floor(8 + Math.cos(angle) * dist) * P;
          const by = Math.floor(8 + Math.sin(angle) * dist) * P;
          ctx.globalAlpha = Math.max(0, 1 - t);
          ctx.fillStyle = colors[Math.floor(rng(i * 17) * 3)];
          ctx.fillRect(bx, by, P, P);
        }
        ctx.globalAlpha = 1;
      }
    };

    let explodeStart = 0;
    const EXPLODE_DURATION = 1000;

    const animate = () => {
      const now = performance.now();

      if (explodingRef.current) {
        const t = Math.min((now - explodeStart) / EXPLODE_DURATION, 1);
        drawExplosion(t);
        if (t >= 1) {
          explodingRef.current = false;
          drawBomb();
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    drawBomb();
    frameRef.current = requestAnimationFrame(animate);

    const startExplode = () => {
      explodingRef.current = true;
      explodeStart = performance.now();
    };

    const initial = setTimeout(startExplode, 3000);
    const interval = setInterval(startExplode, 10000);
    timerRef.current = interval as unknown as number;

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={48}
      height={48}
      className="inline-block align-middle mx-auto"
      style={{ imageRendering: 'pixelated', width: 32, height: 32 }}
    />
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
      {/* No top-right button anymore */}
      <div className="absolute inset-0 synthwave-grid" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-accent/20 via-secondary/5 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-background to-transparent" />

      {/* Pac-Man animation */}
      <PacmanGhost />

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

        <a
          href="/game"
          className="font-pixel text-[10px] md:text-xs py-2 px-3 border border-accent rounded bg-background/80 text-primary hover:bg-accent/20 hover:shadow-[0_0_15px_hsl(var(--accent)/0.4)] transition-all duration-300 backdrop-blur-sm inline-flex items-center justify-center"
        >
          <span className="flex-shrink-0 w-8 flex justify-center"><PixelBomb /></span>
          <span className="mx-1">KRISEN SIMULATOR</span>
          <span className="flex-shrink-0 w-8 flex justify-center"><PixelBomb /></span>
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
