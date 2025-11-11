import React, { useState, useRef, useEffect } from 'react';

export interface ScrambledTextProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  radius?: number;
  duration?: number;
  scrambleChars?: string;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  className = '',
  style = {},
  children,
  radius = 100,
  duration = 800,
  scrambleChars = '.:!@#$%&*',
}) => {
  const [displayText, setDisplayText] = useState<string[]>([]);
  const originalText = String(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const animatingChars = useRef<Set<number>>(new Set());

  useEffect(() => {
    setDisplayText(originalText.split(''));
  }, [originalText]);

  const scrambleCharacter = (index: number) => {
    if (animatingChars.current.has(index)) return;

    const originalChar = originalText[index];
    if (originalChar === ' ') return;

    animatingChars.current.add(index);

    let iterations = 0;
    const maxIterations = Math.floor(duration / 50);

    const interval = setInterval(() => {
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayText((prev) => {
          const newText = [...prev];
          newText[index] = originalChar;
          return newText;
        });
        animatingChars.current.delete(index);
        return;
      }

      setDisplayText((prev) => {
        const newText = [...prev];
        newText[index] =
          scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        return newText;
      });

      iterations++;
    }, 50);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    charsRef.current.forEach((charElement, index) => {
      if (!charElement) return;

      const rect = charElement.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - charCenterX, 2) +
          Math.pow(e.clientY - charCenterY, 2)
      );

      if (distance < radius) {
        scrambleCharacter(index);
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className={`cursor-default ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
    >
      {displayText.map((char, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) charsRef.current[index] = el;
          }}
          className='inline-block'
          style={{ minWidth: char === ' ' ? '0.25em' : 'auto' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default ScrambledText;
