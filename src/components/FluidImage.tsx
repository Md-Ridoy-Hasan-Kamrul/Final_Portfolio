/**
 * Interactive fluid portrait — Canvas 2D (works without WebGL).
 * Hover / drag creates wave distortion + color wash over the photo.
 */
import { useEffect, useRef } from 'react';

export type FluidImageProps = {
  image?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  colors?: {
    preset?:
      | 'tropical'
      | 'ocean'
      | 'sunset'
      | 'neon'
      | 'forest'
      | 'monochrome'
      | 'custom';
    customColors?: string[];
  };
  effect?: {
    showGradient?: boolean;
    radius?: number;
    strength?: number;
    distortion?: number;
    hueShift?: number;
    colorCycle?: number;
  };
  animation?: {
    speed?: number;
    persistence?: number;
    pointerSmooth?: number;
  };
  advanced?: {
    fadeIn?: boolean;
    fadeInDuration?: number;
    maxDpr?: number;
    overflowPadding?: number;
    quality?: 'high' | 'low';
  };
};

const PRESETS: Record<string, string[]> = {
  tropical: ['#0D9488', '#A78BFA', '#F472B6', '#FBBF24'],
  ocean: ['#0EA5E9', '#6366F1', '#14B8A6', '#818CF8'],
  sunset: ['#F97316', '#EF4444', '#A855F7', '#FBBF24'],
  neon: ['#22D3EE', '#A3E635', '#F472B6', '#FACC15'],
  forest: ['#16A34A', '#065F46', '#A3E635', '#D9F99D'],
  monochrome: ['#E5E5E5', '#A3A3A3', '#525252', '#171717'],
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function coverRect(
  cw: number,
  ch: number,
  iw: number,
  ih: number,
  fit: 'cover' | 'contain' | 'fill'
) {
  if (fit === 'fill') return { dx: 0, dy: 0, dw: cw, dh: ch };
  const scale =
    fit === 'contain'
      ? Math.min(cw / iw, ch / ih)
      : Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  return { dx: (cw - dw) / 2, dy: (ch - dh) / 2, dw, dh };
}

export default function FluidImage({
  image = '/images/Profile2.png',
  objectFit = 'cover',
  colors = {},
  effect = {},
  animation = {},
  advanced = {},
}: FluidImageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { preset = 'tropical', customColors = [] } = colors;
  const palette =
    preset === 'custom' && customColors.length > 0
      ? customColors
      : PRESETS[preset] ?? PRESETS.tropical;

  const {
    showGradient = true,
    strength = 0.9,
    distortion = 0.4,
  } = effect;
  const { speed = 0.4, pointerSmooth = 0.08 } = animation;
  const { fadeIn = true, fadeInDuration = 0.6, maxDpr = 1.75 } = advanced;

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let cancelled = false;
    let raf = 0;
    let img: HTMLImageElement | null = null;
    let cw = 1;
    let ch = 1;

    let target = { x: 0.5, y: 0.5 };
    let smooth = { x: 0.5, y: 0.5 };
    let pointerInside = false;
    let active = 0;
    const start = performance.now();
    let last = start;

    if (fadeIn) {
      canvas.style.opacity = '0';
      canvas.style.transition = `opacity ${fadeInDuration}s ease`;
    }

    const imgEl = new Image();
    imgEl.decoding = 'async';
    imgEl.onload = () => {
      if (cancelled) return;
      img = imgEl;
      if (fadeIn) canvas.style.opacity = '1';
      kick();
    };
    imgEl.onerror = () => {
      if (cancelled) return;
      // still animate empty so UI never shows an error box
      kick();
    };
    imgEl.src = image;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        cw = Math.max(1, Math.floor(entry.contentRect.width));
        ch = Math.max(1, Math.floor(entry.contentRect.height));
      }
      kick();
    });
    ro.observe(host);

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      target = {
        x: clamp((e.clientX - rect.left) / rect.width, 0, 1),
        y: clamp((e.clientY - rect.top) / rect.height, 0, 1),
      };
      pointerInside = true;
      kick();
    };
    const onLeave = () => {
      pointerInside = false;
      kick();
    };

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

    let running = false;
    function kick() {
      if (!running && !cancelled) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    function frame(now: number) {
      if (cancelled) {
        running = false;
        return;
      }

      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const dtScale = dt * 60;
      const t = (now - start) * 0.001 * speed;

      const smoothK = 1 - Math.pow(1 - clamp(pointerSmooth, 0.01, 1), dtScale);
      smooth.x += (target.x - smooth.x) * smoothK;
      smooth.y += (target.y - smooth.y) * smoothK;

      const fadeTarget = pointerInside ? 1 : 0;
      const fadeK = 1 - Math.pow(1 - 0.08, dtScale);
      active += (fadeTarget - active) * fadeK;

      const dpr = Math.min(window.devicePixelRatio || 1, Math.max(0.5, maxDpr));
      const pw = Math.floor(cw * dpr);
      const ph = Math.floor(ch * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);

      const waveAmp = (8 + distortion * 28) * (0.25 + active * 0.85);
      const waveFreq = 0.035 + distortion * 0.02;
      const pointerPull = strength * active;

      if (img && img.naturalWidth > 0) {
        const { dx, dy, dw, dh } = coverRect(
          cw,
          ch,
          img.naturalWidth,
          img.naturalHeight,
          objectFit
        );

        // Offscreen buffer for strip warp
        const slice = 2;
        for (let y = 0; y < ch; y += slice) {
          const ny = y / ch;
          const wave =
            Math.sin(ny * (1 / waveFreq) * 0.15 + t * 2.2 + smooth.x * 6) *
              waveAmp +
            Math.sin(ny * 8 + t * 1.4 + smooth.y * 4) * waveAmp * 0.35 +
            (smooth.x - 0.5) * 18 * pointerPull * Math.sin(ny * Math.PI);

          const sy = ((y - dy) / dh) * img.naturalHeight;
          if (sy < 0 || sy >= img.naturalHeight) continue;

          ctx.drawImage(
            img,
            0,
            sy,
            img.naturalWidth,
            (slice / dh) * img.naturalHeight,
            dx + wave,
            y,
            dw,
            slice + 0.5
          );
        }
      }

      if (showGradient && palette && palette.length > 0) {
        const r = (0.35 + strength * 0.35) * Math.min(cw, ch);
        const gx = smooth.x * cw;
        const gy = smooth.y * ch;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
        const c0 = palette[0] ?? '#fff';
        const c1 = palette[1] ?? c0;
        const c2 = palette[2] ?? c1;
        const a = 0.12 + active * 0.28;
        grad.addColorStop(0, hexAlpha(c0, a));
        grad.addColorStop(0.45, hexAlpha(c1, a * 0.55));
        grad.addColorStop(0.75, hexAlpha(c2, a * 0.25));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
        ctx.globalCompositeOperation = 'source-over';
      }

      // Soft idle shimmer so it always feels alive
      const idle =
        Math.sin(t * 1.1) * 0.015 + Math.sin(t * 0.7 + 1.3) * 0.01;
      if (Math.abs(idle) > 0.001) {
        ctx.globalAlpha = 0.08 + active * 0.05;
        ctx.fillStyle = palette?.[0] ?? '#fff';
        ctx.fillRect(0, 0, cw, ch);
        ctx.globalAlpha = 1;
      }

      const stillIdle = !pointerInside && active < 0.02;
      // Keep a gentle loop so waves keep moving
      if (stillIdle) {
        raf = requestAnimationFrame(frame);
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    kick();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [
    image,
    objectFit,
    preset,
    showGradient,
    strength,
    distortion,
    speed,
    pointerSmooth,
    fadeIn,
    fadeInDuration,
    maxDpr,
    // palette identity
    palette.join(','),
  ]);

  return (
    <div
      ref={hostRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* Instant paint while canvas boots */}
      <img
        src={image}
        alt=''
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
          pointerEvents: 'none',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function hexAlpha(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h.slice(0, 6);
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return `rgba(255,255,255,${alpha})`;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${clamp(alpha, 0, 1)})`;
}
