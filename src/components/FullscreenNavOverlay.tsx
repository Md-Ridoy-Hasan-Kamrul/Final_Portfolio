import { useEffect, useState, type MouseEvent } from 'react';
import { Github, Linkedin, Mail, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { site } from '../data/site';
import { ThemeToggle } from './ThemeToggle';
import type { NavPersona } from '@/data/navPersonas';
import { DURATION, EASING, STAGGER, transition } from '@/lib/motion';

export type FullscreenNavLink = {
  href: string;
  label: string;
};

type FullscreenNavOverlayProps = {
  isOpen: boolean;
  links: FullscreenNavLink[];
  activeSection: string;
  dark: boolean;
  persona: NavPersona;
  morphKey: number;
  onClose: () => void;
  onLinkClick: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

/**
 * Fullscreen nav ≤1020px — persona-synced accents + clip morph.
 * Transform / opacity / clip-path only.
 */
export default function FullscreenNavOverlay({
  isOpen,
  links,
  activeSection,
  dark,
  persona,
  morphKey,
  onClose,
  onLinkClick,
}: FullscreenNavOverlayProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [clock, setClock] = useState('');
  const reduced = useReducedMotion();
  const effectiveHovered = isOpen ? hovered : null;

  useEffect(() => {
    if (!isOpen) return;
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const textMain = dark ? 'text-[#E8E2D6]' : 'text-[#14110f]';
  const textMuted = dark ? 'text-white/45' : 'text-black/40';
  const hairline = dark ? 'border-white/10' : 'border-black/10';
  const closeBorder = dark ? 'border-white/25' : 'border-black/20';
  const closeHover = dark ? 'hover:bg-white/10' : 'hover:bg-black/5';

  const clipEnter =
    persona.morph === 'rift'
      ? 'inset(0 46% 0 46%)'
      : persona.morph === 'blade'
        ? 'inset(48% 0 48% 0)'
        : persona.morph === 'iris'
          ? 'circle(0% at 80% 0%)'
          : 'inset(0 0 100% 0)';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={`overlay-${persona.id}-${morphKey}`}
          className='fixed inset-0 z-[60] flex flex-col min-[1021px]:hidden'
          style={{ background: dark ? '#060b12' : '#f3eee6' }}
          role='dialog'
          aria-modal='true'
          aria-label='Fullscreen navigation'
          initial={
            reduced
              ? { opacity: 0 }
              : { opacity: 1, clipPath: clipEnter }
          }
          animate={
            reduced
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  clipPath:
                    persona.morph === 'iris'
                      ? 'circle(150% at 50% 40%)'
                      : 'inset(0 0 0% 0)',
                }
          }
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 1, clipPath: 'inset(0 0 100% 0)' }
          }
          transition={transition.hero}
        >
          <div
            className='pointer-events-none absolute inset-0 opacity-50'
            style={{
              background: `radial-gradient(ellipse at top right, ${persona.accentSoft}, transparent 55%)`,
            }}
            aria-hidden
          />

          {/* Header: section stamp + close */}
          <div className='absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 px-5 pt-[max(1rem,env(safe-area-inset-top))] min-[375px]:px-6 md:px-12'>
            <div className='min-w-0 pt-3'>
              <p
                className='font-mono text-[10px] tracking-[0.28em]'
                style={{ color: persona.accent }}
              >
                {persona.code} · {persona.tagline}
              </p>
            </div>

            <motion.button
              type='button'
              onClick={onClose}
              className={`cursor-target mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${closeBorder} ${closeHover} ${textMain}`}
              aria-label='Close menu'
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={reduced ? undefined : { scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={transition.structural}
            >
              <X className='h-5 w-5' strokeWidth={2.25} aria-hidden />
            </motion.button>
          </div>

          <div className='relative flex min-h-0 flex-1 flex-col px-5 pb-6 pt-24 min-[375px]:px-6 min-[425px]:px-8 sm:px-10 md:px-12 md:pt-28'>
            <nav
              className='flex min-h-0 flex-1 flex-col justify-center gap-1 overflow-y-auto py-2 min-[375px]:gap-2 md:gap-3'
              aria-label='Fullscreen menu links'
            >
              {links.map((link, index) => {
                const isActive = activeSection === link.href;
                const isDim =
                  effectiveHovered !== null &&
                  effectiveHovered !== link.href &&
                  !isActive;
                const indexLabel = String(index + 1).padStart(2, '0');

                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => onLinkClick(e, link.href)}
                    onMouseEnter={() => setHovered(link.href)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(link.href)}
                    onBlur={() => setHovered(null)}
                    className={`cursor-target group flex items-baseline gap-3 min-[375px]:gap-4 md:gap-6 ${textMain}`}
                    initial={
                      reduced ? { opacity: 0 } : { opacity: 0, y: 28 }
                    }
                    animate={{
                      opacity: isDim ? 0.28 : 1,
                      y: 0,
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      delay: STAGGER.delay + index * STAGGER.children,
                      duration: DURATION.hero,
                      ease: EASING.easeOutExpo,
                    }}
                  >
                    <span
                      className={`font-inter text-[10px] font-medium tracking-[0.18em] tabular-nums min-[375px]:text-xs md:text-sm ${
                        isActive ? '' : textMuted
                      }`}
                      style={isActive ? { color: persona.accent } : undefined}
                    >
                      {indexLabel}
                    </span>
                    <span
                      className='font-instrument text-[clamp(2.15rem,9.5vw,5.5rem)] leading-[0.95] tracking-tight transition-transform duration-[var(--motion-structural)] ease-[var(--ease-out-expo)] group-hover:translate-x-1'
                      style={isActive ? { color: persona.accent } : undefined}
                    >
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId='fs-nav-liquid'
                        className='ml-auto hidden h-px w-12 self-center sm:block'
                        style={{ background: persona.accent }}
                        transition={transition.structural}
                        aria-hidden
                      />
                    )}
                  </motion.a>
                );
              })}
            </nav>

            <motion.footer
              className={`mt-auto flex flex-col gap-5 border-t pt-5 ${hairline} sm:flex-row sm:items-end sm:justify-between sm:gap-6`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...transition.structural,
                delay: 0.2,
              }}
            >
              <div className='space-y-1'>
                <p
                  className={`font-inter text-[10px] uppercase tracking-[0.22em] ${textMuted}`}
                >
                  Contact
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className={`cursor-target font-inter text-sm underline-offset-4 transition-opacity hover:underline min-[375px]:text-base ${textMain}`}
                >
                  {site.email}
                </a>
              </div>

              <div className='flex items-center gap-3'>
                <ThemeToggle variant='mobile' />
                <a
                  href={site.github}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={
                    dark
                      ? 'nav-mobile-icon cursor-target'
                      : 'cursor-target grid h-11 w-11 place-items-center rounded-full border border-black/15 bg-black/5 text-[#14110f]'
                  }
                  aria-label='GitHub Profile'
                >
                  <Github className='h-5 w-5' />
                </a>
                <a
                  href={site.linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={
                    dark
                      ? 'nav-mobile-icon nav-mobile-icon--accent cursor-target'
                      : 'cursor-target grid h-11 w-11 place-items-center rounded-full border border-black/15 bg-black/5 text-[#14110f]'
                  }
                  aria-label='LinkedIn Profile'
                >
                  <Linkedin className='h-5 w-5' />
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className={
                    dark
                      ? 'nav-mobile-icon cursor-target'
                      : 'cursor-target grid h-11 w-11 place-items-center rounded-full border border-black/15 bg-black/5 text-[#14110f]'
                  }
                  aria-label='Email'
                >
                  <Mail className='h-5 w-5' />
                </a>
              </div>

              <div className='text-left sm:text-right'>
                <p
                  className={`font-inter text-[10px] uppercase tracking-[0.22em] ${textMuted}`}
                >
                  Local time
                </p>
                <p
                  className={`font-inter text-sm tabular-nums min-[375px]:text-base ${textMain}`}
                  aria-live='polite'
                >
                  {clock || '—:—:—'}
                </p>
              </div>
            </motion.footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
