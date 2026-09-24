import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container, pageContainerClass } from '@/components/ui/Container';

describe('Container', () => {
  it('renders children', () => {
    render(
      <Container>
        <span>Portfolio content</span>
      </Container>,
    );
    expect(screen.getByText('Portfolio content')).toBeInTheDocument();
  });

  it('applies shared page container layout classes', () => {
    const { container } = render(<Container>Hi</Container>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('max-w-7xl');
    expect(el.className).toContain('mx-auto');
    expect(pageContainerClass).toContain('px-4');
  });

  it('supports polymorphic `as` prop', () => {
    const { container } = render(
      <Container as='section'>Section body</Container>,
    );
    expect(container.firstElementChild?.tagName).toBe('SECTION');
  });
});
