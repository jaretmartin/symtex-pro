import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CognateCard } from '../CognateCard';
import type { ExtendedCognate } from '../types';

// Mock cognate data
const mockCognate: ExtendedCognate = {
  id: 'cognate-1',
  name: 'Aria',
  description: 'Primary assistant for customer support',
  avatar: undefined,
  role: 'Customer Support',
  industry: 'Technology',
  xp: 1500,
  level: 5,
  autonomyLevel: 2,
  skills: [
    { id: 'skill-1', name: 'Email Drafting', category: 'communication', proficiency: 'advanced' },
    { id: 'skill-2', name: 'Data Analysis', category: 'analysis', proficiency: 'intermediate' },
    { id: 'skill-3', name: 'Research', category: 'analysis', proficiency: 'expert' },
  ],
  personality: {
    formality: 0.6,
    verbosity: 0.4,
    creativity: 0.7,
    caution: 0.5,
    humor: 0.3,
    empathy: 0.8,
    assertiveness: 0.5,
  },
  availability: 'available',
  assignedSOPs: ['sop-1', 'sop-2'],
  lastActiveAt: new Date().toISOString(),
  tasksCompleted: 156,
  successRate: 94.5,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2026-01-21T00:00:00.000Z',
};

describe('CognateCard', () => {
  describe('rendering', () => {
    it('renders the cognate name', () => {
      render(<CognateCard cognate={mockCognate} />);
      expect(screen.getByText('Aria')).toBeInTheDocument();
    });

    it('renders the cognate role', () => {
      render(<CognateCard cognate={mockCognate} />);
      expect(screen.getByText('Customer Support')).toBeInTheDocument();
    });

    it('renders the cognate description', () => {
      render(<CognateCard cognate={mockCognate} />);
      expect(screen.getByText('Primary assistant for customer support')).toBeInTheDocument();
    });

    it('renders task count and success rate', () => {
      render(<CognateCard cognate={mockCognate} />);
      expect(screen.getByText('156 tasks')).toBeInTheDocument();
      expect(screen.getByText('95% success')).toBeInTheDocument();
    });

    it('renders availability status', () => {
      render(<CognateCard cognate={mockCognate} />);
      expect(screen.getByText('Available')).toBeInTheDocument();
    });

    it('renders default placeholder when no avatar is provided', () => {
      render(<CognateCard cognate={mockCognate} />);
      // The Brain icon should be rendered as fallback
      const container = document.querySelector('.bg-gradient-to-br');
      expect(container).toBeInTheDocument();
    });

    it('renders avatar image when provided', () => {
      const cognateWithAvatar = { ...mockCognate, avatar: 'https://example.com/avatar.png' };
      render(<CognateCard cognate={cognateWithAvatar} />);
      const avatar = screen.getByAltText('Aria');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.png');
    });

    it('renders "No role assigned" when role is not provided', () => {
      const cognateWithoutRole = { ...mockCognate, role: undefined };
      render(<CognateCard cognate={cognateWithoutRole} />);
      expect(screen.getByText('No role assigned')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<CognateCard cognate={mockCognate} onClick={handleClick} />);

      const card = screen.getByRole('button');
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledWith(mockCognate);
    });

    it('has role="button" when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<CognateCard cognate={mockCognate} onClick={handleClick} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('does not have role="button" when onClick is not provided', () => {
      render(<CognateCard cognate={mockCognate} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onClick on Enter key press', () => {
      const handleClick = vi.fn();
      render(<CognateCard cognate={mockCognate} onClick={handleClick} />);

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(handleClick).toHaveBeenCalledWith(mockCognate);
    });

    it('calls onClick on Space key press', () => {
      const handleClick = vi.fn();
      render(<CognateCard cognate={mockCognate} onClick={handleClick} />);

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });

      expect(handleClick).toHaveBeenCalledWith(mockCognate);
    });
  });

  describe('selected state', () => {
    it('applies selected styling when selected is true', () => {
      const { container } = render(<CognateCard cognate={mockCognate} selected={true} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('border-symtex-primary');
    });

    it('does not apply selected styling when selected is false', () => {
      const { container } = render(<CognateCard cognate={mockCognate} selected={false} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).not.toContain('border-symtex-primary');
    });
  });

  describe('compact variant', () => {
    it('renders compact card when compact prop is true', () => {
      render(<CognateCard cognate={mockCognate} compact={true} />);
      expect(screen.getByText('Aria')).toBeInTheDocument();
      // Compact view shows "No role" instead of "No role assigned"
      expect(screen.queryByText('Primary assistant for customer support')).not.toBeInTheDocument();
    });

    it('renders level badge in compact view', () => {
      render(<CognateCard cognate={mockCognate} compact={true} />);
      expect(screen.getByText('5')).toBeInTheDocument(); // level badge
    });
  });

  describe('availability status variants', () => {
    it('renders busy status correctly', () => {
      const busyCognate = { ...mockCognate, availability: 'busy' as const };
      render(<CognateCard cognate={busyCognate} />);
      expect(screen.getByText('Busy')).toBeInTheDocument();
    });

    it('renders offline status correctly', () => {
      const offlineCognate = { ...mockCognate, availability: 'offline' as const };
      render(<CognateCard cognate={offlineCognate} />);
      expect(screen.getByText('Offline')).toBeInTheDocument();
    });
  });
});
