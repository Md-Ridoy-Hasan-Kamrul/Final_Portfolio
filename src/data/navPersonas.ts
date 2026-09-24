/**
 * Per-section nav personas — synced with SectionTransitions DEST_META.
 * Colors / motion signatures only; no layout thrash props.
 */

export type NavSectionId =
  | 'home'
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'contact';

export type NavPersona = {
  id: NavSectionId;
  code: string;
  label: string;
  /** Short cinematic tag under the stamp */
  tagline: string;
  /** Accent for active liquid + rail */
  accent: string;
  accentSoft: string;
  /** Text / icon color on this surface */
  ink: string;
  inkMuted: string;
  /** Glass fill (rgba) */
  glass: string;
  border: string;
  /** Bottom energy-rail gradient stops */
  rail: [string, string, string];
  /** Morph entrance clip signature */
  morph: 'orbit' | 'rift' | 'blade' | 'iris' | 'prism' | 'vortex';
  darkSurface: boolean;
};

export const NAV_PERSONAS: Record<NavSectionId, NavPersona> = {
  home: {
    id: 'home',
    code: '01',
    label: 'HOME',
    tagline: 'ORIGIN',
    accent: '#00E6FF',
    accentSoft: 'rgba(0, 230, 255, 0.22)',
    ink: '#E8F7FC',
    inkMuted: 'rgba(232, 247, 252, 0.55)',
    glass: 'rgba(4, 16, 24, 0.55)',
    border: 'rgba(0, 230, 255, 0.28)',
    rail: ['transparent', '#00E6FF', 'transparent'],
    morph: 'orbit',
    darkSurface: true,
  },
  about: {
    id: 'about',
    code: '02',
    label: 'ABOUT',
    tagline: 'HORIZON RIFT',
    accent: '#93C5FD',
    accentSoft: 'rgba(147, 197, 253, 0.2)',
    ink: '#E8E2D6',
    inkMuted: 'rgba(232, 226, 214, 0.5)',
    glass: 'rgba(4, 16, 24, 0.82)',
    border: 'rgba(255, 255, 255, 0.12)',
    rail: ['transparent', '#93C5FD', 'transparent'],
    morph: 'rift',
    darkSurface: true,
  },
  experience: {
    id: 'experience',
    code: '03',
    label: 'EXPERIENCE',
    tagline: 'BLADE EDGE',
    accent: '#DF3640',
    accentSoft: 'rgba(223, 54, 64, 0.22)',
    ink: '#F3EDEA',
    inkMuted: 'rgba(243, 237, 234, 0.5)',
    glass: 'rgba(12, 4, 6, 0.78)',
    border: 'rgba(223, 54, 64, 0.35)',
    rail: ['transparent', '#C6A75E', 'transparent'],
    morph: 'blade',
    darkSurface: true,
  },
  projects: {
    id: 'projects',
    code: '04',
    label: 'PROJECTS',
    tagline: 'IRIS PUNCH',
    accent: '#67E8F9',
    accentSoft: 'rgba(103, 232, 249, 0.18)',
    ink: '#E8F4FF',
    inkMuted: 'rgba(232, 244, 255, 0.5)',
    glass: 'rgba(7, 13, 22, 0.8)',
    border: 'rgba(255, 255, 255, 0.12)',
    rail: ['transparent', '#38BDF8', 'transparent'],
    morph: 'iris',
    darkSurface: true,
  },
  skills: {
    id: 'skills',
    code: '05',
    label: 'SKILLS',
    tagline: 'PRISM BREACH',
    accent: '#C6A75E',
    accentSoft: 'rgba(198, 167, 94, 0.22)',
    ink: '#F5F0E6',
    inkMuted: 'rgba(245, 240, 230, 0.5)',
    glass: 'rgba(7, 11, 20, 0.85)',
    border: 'rgba(198, 167, 94, 0.3)',
    rail: ['#DF3640', '#C6A75E', '#93C5FD'],
    morph: 'prism',
    darkSurface: true,
  },
  contact: {
    id: 'contact',
    code: '06',
    label: 'CONTACT',
    tagline: 'VORTEX LOCK',
    accent: '#C6A75E',
    accentSoft: 'rgba(198, 167, 94, 0.2)',
    ink: '#E8E2D6',
    inkMuted: 'rgba(232, 226, 214, 0.5)',
    glass: 'rgba(8, 10, 25, 0.88)',
    border: 'rgba(232, 226, 214, 0.14)',
    rail: ['transparent', '#DF3640', 'transparent'],
    morph: 'vortex',
    darkSurface: true,
  },
};

export function sectionIdFromHash(hash: string): NavSectionId {
  const id = hash.replace('#', '') as NavSectionId;
  if (id in NAV_PERSONAS) return id;
  return 'home';
}

export function personaFromHash(hash: string): NavPersona {
  return NAV_PERSONAS[sectionIdFromHash(hash)];
}
