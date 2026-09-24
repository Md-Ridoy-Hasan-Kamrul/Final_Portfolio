import { useEffect, useState, type MouseEvent } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '../data/site';
import { ThemeToggle } from './ThemeToggle';

export type FullscreenNavLink = {
  href: string;
  label: string;
};

type FullscreenNavOverlayProps = {
  isOpen: boolean;
  links: FullscreenNavLink[];
  activeSection: string;
  dark: boolean;
  onLinkClick: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

/**
 * Port of Framer Fullscreen Navbars (Matt / kfEGbm)
 * https://framer.com/m/Fullscreen-Navbars-kfEGbm.js@laKlaWcHyClflGlbZlhN
 *
 * Cinematic full-viewport overlay: oversized indexed links, hover focus,
 * email / social / clock footer. Used only at ≤1020px.
 */
export default function FullscreenNavOverlay({
  isOpen,
  links,
  activeSection,
  dark,
  onLinkClick,
}: FullscreenNavOverlayProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [clock, setClock] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const tick = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString([], {
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
    if (!isOpen) {
      setHovered(null);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const panelBg = dark
    ? 'bg-[#060b12]'
    : 'bg-[#f3eee6]';
  const textMain = dark ? 'text-[#E8E2D6]' : 'text-[#14110f]';
  const textMuted = dark ? 'text-white/45' : 'text-black/40';
  const accent = dark ? 'text-[#93C5FD]' : 'text-[#175A67]';
  const hairline = dark ? 'border-white/10' : 'border-black/10';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-[60] flex flex-col min-[1021px]:hidden ${panelBg}`}
          role='dialog'
          aria-modal='true'
          aria-label='Fullscreen navigation'
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          <div
            className={`pointer-events-none absolute inset-0 opacity-40 ${
              dark
                ? 'bg-[radial-gradient(ellipse_at_top_right,rgba(147,197,253,0.18),transparent_55%)]'
                : 'bg-[radial-gradient(ellipse_at_top_right,rgba(23,90,103,0.12),transparent_55%)]'
            }`}
            aria-hidden='true'
          />

          <div className='relative flex min-h-0 flex-1 flex-col px-5 pb-6 pt-24 min-[375px]:px-6 min-[425px]:px-8 sm:px-10 md:px-12 md:pt-28'>
            <nav
              className='flex min-h-0 flex-1 flex-col justify-center gap-1 overflow-y-auto py-2 min-[375px]:gap-2 md:gap-3'
              aria-label='Fullscreen menu links'
            >
              {links.map((link, index) => {
                const isActive = activeSection === link.href;
                const isDim =
                  hovered !== null && hovered !== link.href && !isActive;
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
                    initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
                    animate={{
                      opacity: isDim ? 0.28 : 1,
                      y: 0,
                      filter: 'blur(0px)',
                    }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{
                      delay: 0.12 + index * 0.06,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span
                      className={`font-inter text-[10px] font-medium tracking-[0.18em] tabular-nums min-[375px]:text-xs md:text-sm ${
                        isActive ? accent : textMuted
                      }`}
                    >
                      {indexLabel}
                    </span>
                    <span
                      className={`font-instrument text-[clamp(2.15rem,9.5vw,5.5rem)] leading-[0.95] tracking-tight transition-transform duration-300 group-hover:translate-x-1 ${
                        isActive ? accent : ''
                      }`}
                    >
                      {link.label}
                    </span>
                  </motion.a>
                );
              })}
            </nav>

            <motion.footer
              className={`mt-auto flex flex-col gap-5 border-t pt-5 ${hairline} sm:flex-row sm:items-end sm:justify-between sm:gap-6`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.45 }}
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
                      : 'cursor-target grid h-11 w-11 place-items-center rounded-full border border-black/15 bg-black/5 text-[#14110f] transition hover:border-black/30 hover:bg-black/10'
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
                      : 'cursor-target grid h-11 w-11 place-items-center rounded-full border border-black/15 bg-black/5 text-[#14110f] transition hover:border-[#175A67]/40 hover:bg-[#175A67]/10 hover:text-[#175A67]'
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
                      : 'cursor-target grid h-11 w-11 place-items-center rounded-full border border-black/15 bg-black/5 text-[#14110f] transition hover:border-black/30 hover:bg-black/10'
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
