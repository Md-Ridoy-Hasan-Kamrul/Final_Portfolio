import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared horizontal layout for the navbar and every page section.
 * Keep this the single source of truth for max-width + horizontal padding.
 */
export const pageContainerClass =
  'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export function Container({
  children,
  className,
  as: Tag = 'div',
}: ContainerProps) {
  return <Tag className={cn(pageContainerClass, className)}>{children}</Tag>;
}
