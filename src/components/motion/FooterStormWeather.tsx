import { useMemo, type CSSProperties } from 'react';

/** Deterministic raindrop specs for realistic angled rain */
function buildDrops(count: number) {
  const drops = [];
  for (let i = 0; i < count; i++) {
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    drops.push({
      id: i,
      left: `${(i * 37.7 + r * 11) % 100}%`,
      delay: `${-((r * 2.4) % 2.4).toFixed(2)}s`,
      duration: `${(0.55 + r * 0.85).toFixed(2)}s`,
      height: `${10 + Math.floor(r * 22)}px`,
      opacity: 0.25 + r * 0.55,
      thickness: r > 0.7 ? 1.5 : 1,
      drift: `${(-8 - r * 14).toFixed(1)}px`,
    });
  }
  return drops;
}

const BOLT_A =
  'M72 0 L68 38 L82 42 L58 98 L66 102 L42 168 L54 172 L28 248 L38 252 L18 320';
const BOLT_A_BRANCH = 'M58 98 L78 118 L70 128 L92 155';
const BOLT_B =
  'M40 0 L48 45 L32 52 L55 110 L42 118 L68 185 L52 192 L78 268 L62 275 L88 340';
const BOLT_B_BRANCH = 'M55 110 L28 140 L35 148 L12 180';
const BOLT_C =
  'M90 4 L78 50 L95 58 L70 120 L88 128 L60 200 L76 208 L48 290';

export default function FooterStormWeather() {
  const drops = useMemo(() => buildDrops(72), []);

  return (
    <>
      <div className='footer-storm-clouds' aria-hidden='true' />
      <div className='footer-storm-mist' aria-hidden='true' />

      <div className='footer-rain' aria-hidden='true'>
        {drops.map((d) => (
          <span
            key={d.id}
            className='footer-raindrop'
            style={
              {
                left: d.left,
                animationDelay: d.delay,
                animationDuration: d.duration,
                height: d.height,
                opacity: d.opacity,
                width: d.thickness,
                ['--rain-drift']: d.drift,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* Sky flash fills */}
      <div className='footer-lightning footer-lightning--a' aria-hidden='true' />
      <div className='footer-lightning footer-lightning--b' aria-hidden='true' />

      {/* Realistic SVG bolts */}
      <svg
        className='footer-bolt-svg footer-bolt-svg--1'
        viewBox='0 0 120 340'
        aria-hidden='true'
      >
        <defs>
          <filter id='footer-bolt-glow' x='-50%' y='-20%' width='200%' height='140%'>
            <feGaussianBlur stdDeviation='2.5' result='blur' />
            <feMerge>
              <feMergeNode in='blur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>
        <path
          d={BOLT_A}
          fill='none'
          stroke='rgba(210,230,255,0.95)'
          strokeWidth='2.2'
          strokeLinecap='round'
          strokeLinejoin='round'
          filter='url(#footer-bolt-glow)'
        />
        <path
          d={BOLT_A}
          fill='none'
          stroke='rgba(255,255,255,0.95)'
          strokeWidth='0.9'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d={BOLT_A_BRANCH}
          fill='none'
          stroke='rgba(200,220,255,0.75)'
          strokeWidth='1.4'
          strokeLinecap='round'
          filter='url(#footer-bolt-glow)'
        />
      </svg>

      <svg
        className='footer-bolt-svg footer-bolt-svg--2'
        viewBox='0 0 120 340'
        aria-hidden='true'
      >
        <path
          d={BOLT_B}
          fill='none'
          stroke='rgba(190,215,255,0.9)'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          filter='url(#footer-bolt-glow)'
        />
        <path
          d={BOLT_B}
          fill='none'
          stroke='#fff'
          strokeWidth='0.85'
          strokeLinecap='round'
        />
        <path
          d={BOLT_B_BRANCH}
          fill='none'
          stroke='rgba(210,230,255,0.7)'
          strokeWidth='1.3'
          strokeLinecap='round'
        />
      </svg>

      <svg
        className='footer-bolt-svg footer-bolt-svg--3'
        viewBox='0 0 120 300'
        aria-hidden='true'
      >
        <path
          d={BOLT_C}
          fill='none'
          stroke='rgba(200,225,255,0.85)'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          filter='url(#footer-bolt-glow)'
        />
        <path
          d={BOLT_C}
          fill='none'
          stroke='rgba(255,255,255,0.9)'
          strokeWidth='0.75'
          strokeLinecap='round'
        />
      </svg>
    </>
  );
}
