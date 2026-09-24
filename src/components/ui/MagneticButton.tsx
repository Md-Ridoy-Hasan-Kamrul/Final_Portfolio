import type { ReactNode, HTMLAttributes } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';
import { useMotionProfile } from '@/contexts/MotionContext';
import { cn } from '@/lib/utils';

type MagneticButtonProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  strength?: number;
  className?: string;
};

/**
 * Premium magnetic wrapper — desktop advanced only.
 * Transform-only; no layout thrash.
 */
export default function MagneticButton({
  children,
  strength = 0.28,
  className,
  ...rest
}: MagneticButtonProps) {
  const { isAdvanced } = useMotionProfile();
  const ref = useMagnetic<HTMLDivElement>({
    strength: isAdvanced ? strength : 0,
  });

  return (
    <div
      ref={isAdvanced ? ref : undefined}
      className={cn('inline-block', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
