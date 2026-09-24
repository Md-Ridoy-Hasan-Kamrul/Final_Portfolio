import { useEffect, useMemo, useState } from 'react';
import type { NavDockAnchor, NavPersona } from '@/data/navPersonas';
import { isBottomDock } from '@/data/navPersonas';
import { SPRING } from '@/lib/motion';

export type DockPose = {
  /** translateX px — compositor only */
  x: number;
  /** translateY px — compositor only */
  y: number;
  scale: number;
  borderRadius: number;
  /** Horizontal inset as % of viewport (visual pill width via scaleX feel) */
  insetPct: number;
  edge: 'top' | 'bottom';
};

const NAV_H_DESKTOP = 112;
const NAV_H_COMPACT = 88;
const GAP = 20;

function readCompact(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(max-width: 1020px)').matches;
}

/**
 * Map persona dock → GPU transform pose.
 * Never animates top/left/width — only x / y / scale / radius.
 */
export function computeDockPose(
  dock: NavDockAnchor,
  opts: {
    viewportH: number;
    viewportW: number;
    compact: boolean;
    menuOpen: boolean;
    reduced: boolean;
  },
): DockPose {
  const { viewportH, compact, menuOpen, reduced } = opts;

  // Mobile / open menu / reduced: always top-full for usability
  if (compact || menuOpen || reduced) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      borderRadius: 0,
      insetPct: 0,
      edge: 'top',
    };
  }

  const navH = NAV_H_DESKTOP;
  const bottomY = Math.max(GAP, viewportH - navH - GAP);

  switch (dock) {
    case 'top-full':
      return {
        x: 0,
        y: 0,
        scale: 1,
        borderRadius: 0,
        insetPct: 0,
        edge: 'top',
      };
    case 'top-center':
      return {
        x: 0,
        y: GAP,
        scale: 0.94,
        borderRadius: 999,
        insetPct: 4,
        edge: 'top',
      };
    case 'top-left':
      return {
        x: -Math.min(56, opts.viewportW * 0.04),
        y: GAP + 4,
        scale: 0.9,
        borderRadius: 28,
        insetPct: 8,
        edge: 'top',
      };
    case 'top-right':
      return {
        x: Math.min(56, opts.viewportW * 0.04),
        y: GAP + 4,
        scale: 0.9,
        borderRadius: 28,
        insetPct: 8,
        edge: 'top',
      };
    case 'bottom-wide':
      return {
        x: 0,
        y: bottomY,
        scale: 0.96,
        borderRadius: 28,
        insetPct: 3,
        edge: 'bottom',
      };
    case 'bottom-center':
      return {
        x: 0,
        y: bottomY,
        scale: 0.88,
        borderRadius: 999,
        insetPct: 10,
        edge: 'bottom',
      };
    default:
      return {
        x: 0,
        y: 0,
        scale: 1,
        borderRadius: 0,
        insetPct: 0,
        edge: 'top',
      };
  }
}

export function useNavDockPose(
  persona: NavPersona,
  menuOpen: boolean,
  reduced: boolean | null,
) {
  const [viewport, setViewport] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [compact, setCompact] = useState(readCompact);

  useEffect(() => {
    const onResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      setCompact(readCompact());
    };
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pose = useMemo(
    () =>
      computeDockPose(persona.dock, {
        viewportH: viewport.h,
        viewportW: viewport.w,
        compact,
        menuOpen,
        reduced: Boolean(reduced),
      }),
    [persona.dock, viewport.h, viewport.w, compact, menuOpen, reduced],
  );

  // Publish dock edge for Lenis offset / CSS scroll-padding
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.navDock = pose.edge;
    root.dataset.navSection = persona.id;
    root.style.setProperty(
      '--nav-dock-y',
      `${pose.edge === 'bottom' ? 0 : pose.y}px`,
    );
    root.style.setProperty(
      '--nav-height',
      `${compact ? NAV_H_COMPACT : NAV_H_DESKTOP}px`,
    );
  }, [pose.edge, pose.y, persona.id, compact]);

  const springTransition = {
    type: 'spring' as const,
    stiffness: SPRING.soft.stiffness,
    damping: SPRING.soft.damping,
    mass: SPRING.soft.mass,
  };

  return {
    pose,
    compact,
    springTransition,
    isBottom: isBottomDock(persona.dock) && !compact && !menuOpen && !reduced,
  };
}
