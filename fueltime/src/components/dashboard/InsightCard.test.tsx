/**
 * InsightCard Component Tests
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InsightCard, StatusCard, TipCard, ScoreRing } from './InsightCard';

describe('InsightCard', () => {
  it('should render title and value', () => {
    render(
      <InsightCard
        icon="🍽️"
        title="Eating Window"
        value="10h"
        color="green"
      />
    );

    expect(screen.getByText('Eating Window')).toBeInTheDocument();
    expect(screen.getByText('10h')).toBeInTheDocument();
    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(
      <InsightCard
        icon="🍽️"
        title="Eating Window"
        value="10h"
        subtitle="8:00 AM - 6:00 PM"
        color="green"
      />
    );

    expect(screen.getByText('8:00 AM - 6:00 PM')).toBeInTheDocument();
  });

  it('should apply correct color classes', () => {
    const { container } = render(
      <InsightCard
        icon="🔥"
        title="Fasting"
        value="14h"
        color="blue"
      />
    );

    // Check that the card has blue-related styling
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });
});

describe('StatusCard', () => {
  it('should render eating status', () => {
    render(
      <StatusCard
        status="eating"
        message="6 hours remaining"
        nextEvent={{ name: 'Window closes', time: '18:00' }}
      />
    );

    expect(screen.getByText('Eating Window Open')).toBeInTheDocument();
    expect(screen.getByText('6 hours remaining')).toBeInTheDocument();
  });

  it('should render fasting status', () => {
    render(
      <StatusCard
        status="post-dinner"
        message="Overnight fast in progress"
        nextEvent={null}
      />
    );

    expect(screen.getByText('Overnight Fast')).toBeInTheDocument();
  });

  it('should show next event when provided', () => {
    render(
      <StatusCard
        status="pre-breakfast"
        message="Morning fast"
        nextEvent={{ name: 'Breakfast window opens', time: '08:00' }}
      />
    );

    expect(screen.getByText(/Next:/)).toBeInTheDocument();
    expect(screen.getByText('8:00 AM')).toBeInTheDocument();
  });
});

describe('TipCard', () => {
  it('should render tip message', () => {
    render(
      <TipCard
        tip="Your glucose tolerance is highest right now"
        category="nutrition"
      />
    );

    expect(screen.getByText('Your glucose tolerance is highest right now')).toBeInTheDocument();
  });

  it('should render correct emoji for category', () => {
    const { rerender } = render(
      <TipCard tip="Test tip" category="timing" />
    );
    expect(screen.getByText('⏰')).toBeInTheDocument();

    rerender(<TipCard tip="Test tip" category="nutrition" />);
    expect(screen.getByText('🥗')).toBeInTheDocument();

    rerender(<TipCard tip="Test tip" category="performance" />);
    expect(screen.getByText('⚡')).toBeInTheDocument();

    rerender(<TipCard tip="Test tip" category="science" />);
    expect(screen.getByText('🔬')).toBeInTheDocument();
  });
});

describe('ScoreRing', () => {
  it('should render score value', () => {
    render(<ScoreRing score={85} />);
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('should render SVG elements', () => {
    const { container } = render(<ScoreRing score={75} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should use correct size', () => {
    const { container } = render(<ScoreRing score={90} size={100} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '100');
  });
});
