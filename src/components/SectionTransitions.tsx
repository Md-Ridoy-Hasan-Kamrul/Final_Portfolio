import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

/**
 * Wraps the page sections and registers a single ScrollTrigger per section
 * that drives a "transition veil" — a full-bleed overlay that sweeps across
 * as you scroll from one section into the next, creating the feeling of a
 * unified, animated single-page experience rather than disconnected pages.
 *
 * Each adjacent pair gets a different directional wipe so the transitions
 * feel varied and intentional.
 */

const WIPE_DIRECTIONS = [
  'left-to-right',
  'top-to-bottom',
  'right-to-left',
  'bottom-to-top',
  'diagonal-tl',
  'diagonal-br',
] as const;

type WipeDir = (typeof WIPE_DIRECTIONS)[number];

function clipFor(dir: WipeDir, progress: number): string {
  // progress 0 = veil covers nothing, 1 = veil covers everything
  const p = Math.max(0, Math.min(1, progress));
  switch (dir) {
    case 'left-to-right':
      return `polygon(0 0, ${p * 100}% 0, ${p * 100}% 100%, 0 100%)`;
    case 'right-to-left':
      return `polygon(${100 - p * 100}% 0, 100% 0, 100% 100%, ${
        100 - p * 100
      }% 100%)`;
    case 'top-to-bottom':
      return `polygon(0 0, 100% 0, 100% ${p * 100}%, 0 ${p * 100}%)`;
    case 'bottom-to-top':
      return `polygon(0 ${100 - p * 100}%, 100% ${
        100 - p * 100
      }%, 100% 100%, 0 100%)`;
    case 'diagonal-tl':
      return `polygon(0 0, ${p * 140}% 0, ${p * 140 - 40}% 100%, 0 100%)`;
    case 'diagonal-br':
      return `polygon(${100 - p * 140}% 0, 100% 0, 100% 100%, ${
        100 - (p * 140 - 40)
      }% 100%)`;
    default:
      return 'polygon(0 0, 0 0, 0 0, 0 0)';
  }
}

type SectionTransitionsProps = {
  children: ReactNode;
};

export default function SectionTransitions({
  children,
}: SectionTransitionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>(':scope > section, :scope > * > section')
    ).filter((el) => el.id);

    if (sections.length < 2) return;

    const ctx = gsap.context(() => {
      sections.forEach((section, i) => {
        if (i === sections.length - 1) return;

        const dir: WipeDir = WIPE_DIRECTIONS[i % WIPE_DIRECTIONS.length];

        // Create veil element
        const veil = document.createElement('div');
        veil.setAttribute('aria-hidden', 'true');
        veil.style.cssText = `
          position: absolute;
          inset: 0;
          z-index: 30;
          pointer-events: none;
          clip-path: polygon(0 0, 0 0, 0 0, 0 0);
          background: linear-gradient(135deg, rgba(4,16,24,0.92), rgba(10,30,50,0.88));
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          will-change: clip-path;
          transition: none;
        `;
        section.style.position = section.style.position || 'relative';
        section.appendChild(veil);

        // Streak element (a bright accent line that leads the wipe)
        const streak = document.createElement('div');
        streak.setAttribute('aria-hidden', 'true');
        streak.style.cssText = `
          position: absolute;
          z-index: 31;
          pointer-events: none;
          opacity: 0;
          will-change: transform, opacity;
          background: linear-gradient(90deg, transparent, rgba(59,130,246,0.8), rgba(168,85,247,0.6), transparent);
          filter: blur(2px);
        `;

        // Position streak based on direction
        if (dir === 'left-to-right' || dir === 'right-to-left') {
          streak.style.cssText += `
            top: 0;
            bottom: 0;
            width: 3px;
            left: 0;
          `;
        } else if (dir === 'top-to-bottom' || dir === 'bottom-to-top') {
          streak.style.cssText += `
            left: 0;
            right: 0;
            height: 3px;
            top: 0;
          `;
        } else {
          streak.style.cssText += `
            top: 0;
            left: 0;
            width: 4px;
            height: 140%;
            transform-origin: top left;
            transform: rotate(35deg);
          `;
        }
        section.appendChild(streak);

        const setVeil = (progress: number) => {
          veil.style.clipPath = clipFor(dir, progress);
        };

        const setStreak = (progress: number) => {
          const op = Math.max(0, Math.sin(progress * Math.PI));
          streak.style.opacity = String(op * 0.9);

          if (dir === 'left-to-right') {
            streak.style.transform = `translateX(${progress * section.offsetWidth}px)`;
          } else if (dir === 'right-to-left') {
            streak.style.transform = `translateX(${
              section.offsetWidth - progress * section.offsetWidth
            }px)`;
          } else if (dir === 'top-to-bottom') {
            streak.style.transform = `translateY(${progress * section.offsetHeight}px)`;
          } else if (dir === 'bottom-to-top') {
            streak.style.transform = `translateY(${
              section.offsetHeight - progress * section.offsetHeight
            }px)`;
          } else {
            const dist = progress * section.offsetWidth * 1.4;
            streak.style.transform = `translate(${dist}px, ${dist * 0.7}px) rotate(35deg)`;
          }
        };

        ScrollTrigger.create({
          trigger: section,
          start: 'bottom 92%',
          end: 'bottom 8%',
          scrub: 0.6,
          onUpdate: (self) => {
            setVeil(self.progress);
            setStreak(self.progress);
          },
          onLeave: () => {
            setVeil(1);
            setStreak(0);
          },
          onLeaveBack: () => {
            setVeil(0);
            setStreak(0);
          },
        });
      });

      // Refresh after a tick so all section heights are settled
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
