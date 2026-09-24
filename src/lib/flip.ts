import { DURATION, EASING } from '@/lib/motion';

type FlipRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * FLIP — First, Last, Invert, Play
 * Simulates layout shifts with GPU transforms only (no width/height/top/left tweens).
 */
export function flip(
  el: HTMLElement,
  mutate: () => void,
  opts: {
    duration?: number;
    easing?: string;
    onComplete?: () => void;
  } = {},
): void {
  const duration = opts.duration ?? DURATION.structural;
  const easing =
    opts.easing ??
    `cubic-bezier(${EASING.easeOutExpo.join(',')})`;

  // FIRST
  const first = el.getBoundingClientRect();

  // LAST
  mutate();
  const last = el.getBoundingClientRect();

  const dx = first.left - last.left;
  const dy = first.top - last.top;
  const sx = first.width / (last.width || 1);
  const sy = first.height / (last.height || 1);

  if (
    Math.abs(dx) < 0.5 &&
    Math.abs(dy) < 0.5 &&
    Math.abs(sx - 1) < 0.01 &&
    Math.abs(sy - 1) < 0.01
  ) {
    opts.onComplete?.();
    return;
  }

  // INVERT — compositor properties only
  el.style.willChange = 'transform';
  el.style.transformOrigin = 'top left';
  el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

  // PLAY
  requestAnimationFrame(() => {
    el.style.transition = `transform ${duration}s ${easing}`;
    el.style.transform = 'translate(0, 0) scale(1, 1)';
  });

  const done = () => {
    el.style.transition = '';
    el.style.transform = '';
    el.style.transformOrigin = '';
    el.style.willChange = 'auto';
    el.removeEventListener('transitionend', done);
    opts.onComplete?.();
  };
  el.addEventListener('transitionend', done, { once: true });
  window.setTimeout(done, duration * 1000 + 80);
}

/** Batch FLIP for a list of elements that reorder / filter in the DOM */
export function flipAll(
  elements: HTMLElement[],
  mutate: () => void,
  opts?: Parameters<typeof flip>[2],
): void {
  const firsts = new Map<HTMLElement, FlipRect>();
  elements.forEach((el) => {
    const r = el.getBoundingClientRect();
    firsts.set(el, {
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
    });
  });

  mutate();

  elements.forEach((el) => {
    const first = firsts.get(el);
    if (!first) return;
    const last = el.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const sx = first.width / (last.width || 1);
    const sy = first.height / (last.height || 1);

    if (
      Math.abs(dx) < 0.5 &&
      Math.abs(dy) < 0.5 &&
      Math.abs(sx - 1) < 0.01 &&
      Math.abs(sy - 1) < 0.01
    ) {
      return;
    }

    const duration = opts?.duration ?? DURATION.structural;
    const easing =
      opts?.easing ??
      `cubic-bezier(${EASING.easeOutExpo.join(',')})`;

    el.style.willChange = 'transform';
    el.style.transformOrigin = 'top left';
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

    requestAnimationFrame(() => {
      el.style.transition = `transform ${duration}s ${easing}`;
      el.style.transform = 'translate(0, 0) scale(1, 1)';
    });

    const done = () => {
      el.style.transition = '';
      el.style.transform = '';
      el.style.transformOrigin = '';
      el.style.willChange = 'auto';
      el.removeEventListener('transitionend', done);
    };
    el.addEventListener('transitionend', done, { once: true });
    window.setTimeout(done, duration * 1000 + 80);
  });
}
