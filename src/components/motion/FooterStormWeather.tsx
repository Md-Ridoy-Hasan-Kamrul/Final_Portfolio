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
      delay: `${-((r * 4.5) % 4.5).toFixed(2)}s`,
      duration: `${(1.8 + r * 2.4).toFixed(2)}s`,
      height: `${8 + Math.floor(r * 14)}px`,
      opacity: 0.28 + r * 0.55,
      thickness: r > 0.65 ? 1.2 : 0.85,
      drift: `${(-10 - r * 18).toFixed(1)}px`,
    });
  }
  return drops;
}

/* Longer jagged bolts that travel deeper into the footer */
const BOLT_A =
  'M70 0 L66 48 L84 55 L55 130 L72 138 L40 230 L58 242 L28 340 L46 352 L18 450 L34 462 L8 560';
const BOLT_A_BRANCH = 'M55 130 L92 168 L78 182 L112 230';
const BOLT_A_BRANCH2 = 'M40 230 L12 280 L22 292 L0 340';
const BOLT_B =
  'M42 0 L52 55 L28 68 L62 150 L40 165 L78 260 L52 278 L90 380 L64 398 L98 500 L72 520 L105 600';
const BOLT_B_BRANCH = 'M62 150 L18 200 L28 215 L0 265';
const BOLT_B_BRANCH2 = 'M78 260 L110 310 L95 325 L125 380';
const BOLT_C =
  'M88 0 L72 60 L98 72 L60 160 L86 175 L48 280 L74 298 L36 410 L58 428 L22 540';
const BOLT_C_BRANCH = 'M60 160 L95 210 L82 225 L118 280';

export default function FooterStormWeather() {
  const drops = useMemo(() => buildDrops(90), []);

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

      <div className='footer-lightning footer-lightning--a' aria-hidden='true' />
      <div className='footer-lightning footer-lightning--b' aria-hidden='true' />

      <svg
        className='footer-bolt-svg footer-bolt-svg--1'
        viewBox='0 0 130 560'
        preserveAspectRatio='xMidYMin meet'
        aria-hidden='true'
      >
        <defs>
          <filter id='footer-bolt-glow' x='-60%' y='-10%' width='220%' height='120%'>
            <feGaussianBlur stdDeviation='3' result='blur' />
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
          strokeWidth='2.4'
          strokeLinecap='round'
          strokeLinejoin='round'
          filter='url(#footer-bolt-glow)'
        />
        <path
          d={BOLT_A}
          fill='none'
          stroke='rgba(255,255,255,0.95)'
          strokeWidth='1'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d={BOLT_A_BRANCH}
          fill='none'
          stroke='rgba(200,220,255,0.8)'
          strokeWidth='1.5'
          strokeLinecap='round'
          filter='url(#footer-bolt-glow)'
        />
        <path
          d={BOLT_A_BRANCH2}
          fill='none'
          stroke='rgba(190,215,255,0.65)'
          strokeWidth='1.2'
          strokeLinecap='round'
        />
      </svg>

      <svg
        className='footer-bolt-svg footer-bolt-svg--2'
        viewBox='0 0 130 600'
        preserveAspectRatio='xMidYMin meet'
        aria-hidden='true'
      >
        <path
          d={BOLT_B}
          fill='none'
          stroke='rgba(190,215,255,0.92)'
          strokeWidth='2.2'
          strokeLinecap='round'
          strokeLinejoin='round'
          filter='url(#footer-bolt-glow)'
        />
        <path
          d={BOLT_B}
          fill='none'
          stroke='#fff'
          strokeWidth='0.95'
          strokeLinecap='round'
        />
        <path
          d={BOLT_B_BRANCH}
          fill='none'
          stroke='rgba(210,230,255,0.75)'
          strokeWidth='1.4'
          strokeLinecap='round'
        />
        <path
          d={BOLT_B_BRANCH2}
          fill='none'
          stroke='rgba(200,220,255,0.6)'
          strokeWidth='1.15'
          strokeLinecap='round'
        />
      </svg>

      <svg
        className='footer-bolt-svg footer-bolt-svg--3'
        viewBox='0 0 130 540'
        preserveAspectRatio='xMidYMin meet'
        aria-hidden='true'
      >
        <path
          d={BOLT_C}
          fill='none'
          stroke='rgba(200,225,255,0.9)'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          filter='url(#footer-bolt-glow)'
        />
        <path
          d={BOLT_C}
          fill='none'
          stroke='rgba(255,255,255,0.92)'
          strokeWidth='0.85'
          strokeLinecap='round'
        />
        <path
          d={BOLT_C_BRANCH}
          fill='none'
          stroke='rgba(195,220,255,0.7)'
          strokeWidth='1.25'
          strokeLinecap='round'
        />
      </svg>
    </>
  );
}

