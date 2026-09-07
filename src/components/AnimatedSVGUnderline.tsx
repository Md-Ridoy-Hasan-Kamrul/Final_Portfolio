import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type CSSProperties,
  type MouseEventHandler,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const SVG_VARIANTS = [
  'M5 20.9999C26.7762 16.2245 49.5532 11.5572 71.7979 14.6666C84.9553 16.5057 97.0392 21.8432 109.987 24.3888C116.413 25.6523 123.012 25.5143 129.042 22.6388C135.981 19.3303 142.586 15.1422 150.092 13.3333C156.799 11.7168 161.702 14.6225 167.887 16.8333C181.562 21.7212 194.975 22.6234 209.252 21.3888C224.678 20.0548 239.912 17.991 255.42 18.3055C272.027 18.6422 288.409 18.867 305 17.9999',
  'M5 24.2592C26.233 20.2879 47.7083 16.9968 69.135 13.8421C98.0469 9.5853 128.407 4.02322 158.059 5.14674C172.583 5.69708 187.686 8.66104 201.598 11.9696C207.232 13.3093 215.437 14.9471 220.137 18.3619C224.401 21.4596 220.737 25.6575 217.184 27.6168C208.309 32.5097 197.199 34.281 186.698 34.8486C183.159 35.0399 147.197 36.2657 155.105 26.5837C158.11 22.9053 162.993 20.6229 167.764 18.7924C178.386 14.7164 190.115 12.1115 201.624 10.3984C218.367 7.90626 235.528 7.06127 252.521 7.49276C258.455 7.64343 264.389 7.92791 270.295 8.41825C280.321 9.25056 296 10.8932 305 13.0242',
  'M5 29.5014C9.61174 24.4515 12.9521 17.9873 20.9532 17.5292C23.7742 17.3676 27.0987 17.7897 29.6575 19.0014C33.2644 20.7093 35.6481 24.0004 39.4178 25.5014C48.3911 29.0744 55.7503 25.7731 63.3048 21.0292C67.9902 18.0869 73.7668 16.1366 79.3721 17.8903C85.1682 19.7036 88.2173 26.2464 94.4121 27.2514C102.584 28.5771 107.023 25.5064 113.276 20.6125C119.927 15.4067 128.83 12.3333 137.249 15.0014C141.418 16.3225 143.116 18.7528 146.581 21.0014C149.621 22.9736 152.78 23.6197 156.284 24.2514C165.142 25.8479 172.315 17.5185 179.144 13.5014C184.459 10.3746 191.785 8.74853 195.868 14.5292C199.252 19.3205 205.597 22.9057 211.621 22.5014C215.553 22.2374 220.183 17.8356 222.979 15.5569C225.4 13.5845 227.457 11.1105 230.742 10.5292C232.718 10.1794 234.784 12.9691 236.164 14.0014C238.543 15.7801 240.717 18.4775 243.356 19.8903C249.488 23.1729 255.706 21.2551 261.079 18.0014C266.571 14.6754 270.439 11.5202 277.146 13.6125C280.725 14.7289 283.221 17.209 286.393 19.0014C292.321 22.3517 298.255 22.5014 305 22.5014',
  'M17.0039 32.6826C32.2307 32.8412 47.4552 32.8277 62.676 32.8118C67.3044 32.807 96.546 33.0555 104.728 32.0775C113.615 31.0152 104.516 28.3028 102.022 27.2826C89.9573 22.3465 77.3751 19.0254 65.0451 15.0552C57.8987 12.7542 37.2813 8.49399 44.2314 6.10216C50.9667 3.78422 64.2873 5.81914 70.4249 5.96641C105.866 6.81677 141.306 7.58809 176.75 8.59886C217.874 9.77162 258.906 11.0553 300 14.4892',
  'M4.99805 20.9998C65.6267 17.4649 126.268 13.845 187.208 12.8887C226.483 12.2723 265.751 13.2796 304.998 13.9998',
  'M5 29.8857C52.3147 26.9322 99.4329 21.6611 146.503 17.1765C151.753 16.6763 157.115 15.9505 162.415 15.6551C163.28 15.6069 165.074 15.4123 164.383 16.4275C161.704 20.3627 157.134 23.7551 153.95 27.4983C153.209 28.3702 148.194 33.4751 150.669 34.6605C153.638 36.0819 163.621 32.6063 165.039 32.2029C178.55 28.3608 191.49 23.5968 204.869 19.5404C231.903 11.3436 259.347 5.83254 288.793 5.12258C294.094 4.99476 299.722 4.82265 305 5.45025',
];

const globalSVGState = {
  nextIndex: Math.floor(Math.random() * 6),
  getNextIndex() {
    const current = this.nextIndex;
    this.nextIndex = (this.nextIndex + 1) % 6;
    return current;
  },
};

type AnimatedSVGUnderlineProps = {
  text: string;
  textColor?: string;
  underlineColor?: string;
  strokeWidth?: number;
  gap?: number;
  forceShow?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler;
};

/**
 * Port of Framer AnimatedSVGUnderlink
 * https://framer.com/m/AnimatedSVGUnderlink-3znx.js@ft7WMbqy3v8eCTzx4jMM
 */
export default function AnimatedSVGUnderline({
  text,
  textColor = 'currentColor',
  underlineColor = '#3B82F6',
  strokeWidth = 3,
  gap = 2,
  forceShow = false,
  className = '',
  style,
  onClick,
}: AnimatedSVGUnderlineProps) {
  const prefersReducedMotion = useReducedMotion();
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [svgPath, setSvgPath] = useState(SVG_VARIANTS[0]);
  const [svgKey, setSvgKey] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [underlineWidth, setUnderlineWidth] = useState<number>();
  const [underlineHeightPx, setUnderlineHeightPx] = useState<number>();

  useEffect(() => {
    if (nextIndex === null) setNextIndex(globalSVGState.getNextIndex());
  }, [nextIndex]);

  const scalePathCoordinates = useCallback((path: string, scaleX: number) => {
    return path.replace(
      /([ML])\s*([\d.]+)\s+([\d.]+)|([C])\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/g,
      (
        _match,
        cmd1: string,
        x1: string,
        y1: string,
        cmd2: string,
        cx1: string,
        cy1: string,
        cx2: string,
        cy2: string,
        x2: string,
        y2: string,
      ) => {
        if (cmd1) {
          return `${cmd1}${parseFloat(x1) * scaleX} ${y1}`;
        }
        if (cmd2) {
          return `${cmd2}${parseFloat(cx1) * scaleX} ${cy1} ${parseFloat(cx2) * scaleX} ${cy2} ${parseFloat(x2) * scaleX} ${y2}`;
        }
        return _match;
      },
    );
  }, []);

  const handleHoverStart = useCallback(() => {
    if (nextIndex === null) return;
    setSvgPath(SVG_VARIANTS[nextIndex]);
    setSvgKey((prev) => prev + 1);
    setIsHovered(true);
    setNextIndex(globalSVGState.getNextIndex());
  }, [nextIndex]);

  useEffect(() => {
    if (!textRef.current) return;
    const el = textRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setUnderlineWidth(rect.width);
      setUnderlineHeightPx((rect.width * 40) / 310);
    };
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      update();
      return () => ro.disconnect();
    }
    update();
  }, [text]);

  // Keep active underline visible / refresh path when forceShow turns on
  useEffect(() => {
    if (forceShow && nextIndex !== null) {
      setSvgPath(SVG_VARIANTS[nextIndex]);
      setSvgKey((prev) => prev + 1);
      setNextIndex(globalSVGState.getNextIndex());
    }
  }, [forceShow]); // eslint-disable-line react-hooks/exhaustive-deps

  const show = isHovered || forceShow;
  const effectiveStroke = useMemo(() => {
    const cap = underlineHeightPx ? underlineHeightPx * 0.8 : undefined;
    return cap ? Math.min(strokeWidth, cap) : strokeWidth;
  }, [strokeWidth, underlineHeightPx]);

  const pathScaleFactor = underlineWidth ? underlineWidth / 310 : 1;
  const scaledSvgPath = useMemo(
    () => scalePathCoordinates(svgPath, pathScaleFactor),
    [svgPath, pathScaleFactor, scalePathCoordinates],
  );

  const paddedViewBox = useMemo(() => {
    const BASE_H = 40;
    const padPx = Math.max(1, (effectiveStroke ?? 0) * 0.5 + 2);
    const pxPerUnitY = underlineHeightPx ? underlineHeightPx / BASE_H : null;
    const padUnitsY = pxPerUnitY ? padPx / pxPerUnitY : 2;
    const w = underlineWidth || 310;
    const h = BASE_H + padUnitsY * 2;
    return `0 ${-padUnitsY} ${w} ${h}`;
  }, [effectiveStroke, underlineHeightPx, underlineWidth]);

  const pathVariants = useMemo(
    () => ({
      hidden: { pathLength: 0, pathOffset: 0 },
      visible: {
        pathLength: 1,
        pathOffset: 0,
        transition: prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.4, 0, 0.2, 1] as const },
      },
      erase: {
        pathLength: 1,
        pathOffset: 1,
        transition: prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
      },
    }),
    [prefersReducedMotion],
  );

  return (
    <motion.span
      className={`relative inline-flex flex-col items-center ${className}`}
      style={{ color: textColor, textDecoration: 'none', ...style }}
      onHoverStart={handleHoverStart}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <span ref={textRef} className='m-0 p-0'>
        {text}
      </span>
      <div
        style={{
          color: underlineColor,
          width: underlineWidth ? `${underlineWidth}px` : '100%',
          height: underlineHeightPx ? `${underlineHeightPx}px` : '0.45em',
          marginTop: gap,
          position: 'relative',
          visibility: underlineWidth ? 'visible' : 'hidden',
          overflow: 'visible',
          flexShrink: 0,
        }}
      >
        <AnimatePresence mode='wait'>
          {show && (
            <motion.svg
              key={`${svgKey}-${svgPath}`}
              viewBox={paddedViewBox}
              preserveAspectRatio='none'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible'
              shapeRendering='geometricPrecision'
            >
              <motion.path
                d={scaledSvgPath}
                stroke='currentColor'
                strokeWidth={effectiveStroke}
                strokeLinecap='round'
                fill='none'
                vectorEffect='non-scaling-stroke'
                variants={pathVariants}
                initial='hidden'
                animate='visible'
                exit='erase'
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
    </motion.span>
  );
}
