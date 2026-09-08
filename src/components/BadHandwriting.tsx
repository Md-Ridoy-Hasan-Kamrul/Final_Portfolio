import { useEffect, useRef } from 'react';

const HANDWRITING_FONTS = [
  'Caveat',
  'Indie Flower',
  'Nothing You Could Do',
  'Reenie Beanie',
  'Shadows Into Light',
] as const;

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Indie+Flower&family=Nothing+You+Could+Do&family=Reenie+Beanie&family=Shadows+Into+Light&display=swap');`;

/** Some fonts don't render certain letters well */
const BLACKLIST: Record<string, string[]> = {
  l: ['Nothing You Could Do'],
};

export type BadHandwritingProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  fontWeight?: number;
  /** Change to get a different random letter-font pattern */
  seed?: number;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
};

function seededRandom(seedValue: number) {
  const x = Math.sin(seedValue) * 10000;
  return x - Math.floor(x);
}

function wrapLetters(str: string, element: HTMLElement, seedValue: number) {
  const lastUsed: Record<string, string> = {};
  element.innerHTML = '';
  let currentSeed = seedValue;

  for (const char of str) {
    const span = document.createElement('span');

    if (char === ' ') {
      span.textContent = ' ';
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre';
      element.appendChild(span);
      currentSeed++;
      continue;
    }

    const lowerChar = char.toLowerCase();
    let availableFonts: string[] = [...HANDWRITING_FONTS];

    if (BLACKLIST[lowerChar]) {
      availableFonts = availableFonts.filter(
        (f) => !BLACKLIST[lowerChar].includes(f)
      );
    }

    if (lastUsed[lowerChar]) {
      availableFonts = availableFonts.filter((f) => f !== lastUsed[lowerChar]);
    }

    const fontIndex = Math.floor(
      seededRandom(currentSeed) * availableFonts.length
    );
    const font = availableFonts[fontIndex] || HANDWRITING_FONTS[0];
    lastUsed[lowerChar] = font;

    span.style.fontFamily = `"${font}", cursive`;
    span.textContent = char;
    element.appendChild(span);
    currentSeed++;
  }
}

/**
 * Port of Framer Bad handwriting
 * https://framer.com/m/Bad-handwriting-7RLRfb.js@I6TKxjBq5bXosmoBhfAG
 *
 * Each letter uses a different handwritten Google Font for a natural messy look.
 */
export default function BadHandwriting({
  text = 'The quick brown fox jumps over the lazy dog.',
  fontSize = 48,
  color = '#000000',
  letterSpacing = 0,
  lineHeight = 1.2,
  fontWeight = 400,
  seed = 12,
  alignment = 'left',
  className = '',
}: BadHandwritingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      wrapLetters(text, containerRef.current, seed);
    }
  }, [text, seed]);

  return (
    <>
      <style>{FONT_IMPORT}</style>
      <div
        ref={containerRef}
        className={className}
        style={{
          fontSize: `${fontSize}px`,
          color,
          letterSpacing: `${letterSpacing}px`,
          lineHeight,
          fontWeight,
          textAlign: alignment,
          width: '100%',
          height: 'auto',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
        aria-label={text}
      />
    </>
  );
}
