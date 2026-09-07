import { startTransition } from 'react';

type HamburgerMenuProps = {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  strokeColor?: string;
  strokeWidth?: number;
  size?: number;
  className?: string;
};

/**
 * Port of Framer HamburgerMenu (Qm4u / Pixelcot)
 * https://framer.com/m/HamburgerMenu-Qm4u.js@TafFXUpjYkFu9WJ1j0Q9
 */
export default function HamburgerMenu({
  isOpen,
  onToggle,
  strokeColor = 'currentColor',
  strokeWidth = 3,
  size = 40,
  className = '',
}: HamburgerMenuProps) {
  const handleChange = () => {
    const next = !isOpen;
    startTransition(() => onToggle(next));
  };

  return (
    <label
      className={`inline-block cursor-pointer ${className}`}
      style={{ width: size, height: size }}
    >
      <input
        type='checkbox'
        checked={isOpen}
        onChange={handleChange}
        className='sr-only'
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      />
      <svg
        viewBox='0 0 32 32'
        className='h-full w-full'
        style={{
          transform: isOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
          transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-hidden='true'
      >
        <path
          d='M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22'
          fill='none'
          stroke={strokeColor}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={strokeWidth}
          strokeDasharray={isOpen ? '20 300' : '12 63'}
          strokeDashoffset={isOpen ? -32.42 : 0}
          style={{
            transition:
              'stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1), stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        <path
          d='M7 16 27 16'
          fill='none'
          stroke={strokeColor}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={strokeWidth}
          style={{
            transition:
              'stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1), stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
    </label>
  );
}
