import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SECTION_TRANSITION_EVENT } from '@/utils/sectionTransitionEvent';
import { scrollToHash } from '@/utils/scrollToHash';

describe('scrollToHash', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav aria-label="Main navigation" style="height: 80px"></nav>
      <section id="contact" style="height: 400px">Contact</section>
    `;
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('dispatches destination section transition for the target id', () => {
    const handler = vi.fn();
    window.addEventListener(SECTION_TRANSITION_EVENT, handler);

    scrollToHash('#contact');

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<{ id: string }>;
    expect(event.detail.id).toBe('contact');

    window.removeEventListener(SECTION_TRANSITION_EVENT, handler);
  });

  it('no-ops when the section id does not exist', () => {
    const handler = vi.fn();
    window.addEventListener(SECTION_TRANSITION_EVENT, handler);

    scrollToHash('#missing');

    expect(handler).not.toHaveBeenCalled();
    window.removeEventListener(SECTION_TRANSITION_EVENT, handler);
  });
});
