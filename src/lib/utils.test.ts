import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('resolves conflicting Tailwind classes (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('ignores falsy values', () => {
    const hidden = false as boolean;
    expect(cn('text-sm', hidden && 'hidden', undefined, null, 'font-bold')).toBe(
      'text-sm font-bold',
    );
  });
});
