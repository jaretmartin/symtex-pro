import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SymbiosChat } from '../SymbiosChat';
import { useSymbiosStore } from '../symbios-store';
import type { SymbiosMessage, RoutingStats, SymbiosSuggestion } from '../symbios-store';

// Mock child components to isolate SymbiosChat testing
vi.mock('../SymbiosMessage', () => ({
  SymbiosMessage: ({ message }: { message: SymbiosMessage }) => (
    <div data-testid={`message-${message.id}`}>{message.content}</div>
  ),
  TypingIndicator: ({ cognateName }: { cognateName: string }) => (
    <div data-testid="typing-indicator">{cognateName} is typing...</div>
  ),
}));

vi.mock('../SymbiosSuggestions', () => ({
  SymbiosSuggestions: () => <div data-testid="suggestions">Suggestions</div>,
  SymbiosEmptyState: ({ onSuggestionSelect }: { onSuggestionSelect: (text: string) => void }) => (
    <div data-testid="empty-state" onClick={() => onSuggestionSelect('test')}>
      Empty State
    </div>
  ),
}));

vi.mock('../SymbiosInput', () => ({
  SymbiosInput: ({ onSend }: { onSend: (content: string) => void }) => (
    <div data-testid="input">
      <button onClick={() => onSend('test message')}>Send</button>
    </div>
  ),
}));

// Mock the store
vi.mock('../symbios-store', () => ({
  useSymbiosStore: vi.fn(),
}));

// Mock message data
const mockMessages: SymbiosMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hello! I\'m Aria, your Symbios assistant.',
    status: 'delivered',
    createdAt: new Date().toISOString(),
    cognateName: 'Aria',
    routing: {
      type: 'symbolic',
      patternId: 'greeting_v1',
      patternName: 'Initial Greeting',
      confidence: 1.0,
      estimatedCost: 0.001,
      latencyMs: 12,
    },
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'Can you help me draft an email?',
    status: 'delivered',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: 'Of course! I\'d be happy to help.',
    status: 'delivered',
    createdAt: new Date().toISOString(),
    cognateName: 'Aria',
    routing: {
      type: 'symbolic',
      patternId: 'email_draft_v2',
      patternName: 'Email Helper',
      confidence: 0.94,
      estimatedCost: 0.002,
      latencyMs: 45,
    },
  },
];

const mockRoutingStats: RoutingStats = {
  symbolic: 8,
  neural: 2,
  totalCost: 0.056,
  avgLatencyMs: 250,
};

const mockSuggestions: SymbiosSuggestion[] = [
  { id: 'sug-1', label: 'Check my tasks', action: 'show_tasks', category: 'quick' },
  { id: 'sug-2', label: 'Draft an email', action: 'draft_email', category: 'quick' },
];

const createMockStore = (overrides = {}) => ({
  messages: mockMessages,
  isTyping: false,
  suggestions: mockSuggestions,
  routingStats: mockRoutingStats,
  ariaStatus: 'online' as const,
  isMinimized: false,
  setMinimized: vi.fn(),
  sendMessage: vi.fn(),
  clearMessages: vi.fn(),
  approveMessage: vi.fn(),
  rejectMessage: vi.fn(),
  ...overrides,
});

describe('SymbiosChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders when isOpen is true', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('Symbios')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      const { container } = render(<SymbiosChat isOpen={false} onClose={vi.fn()} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders the Aria status indicator', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('online')).toBeInTheDocument();
    });

    it('displays symbolic percentage in header', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      // 8 symbolic out of 10 total = 80%
      expect(screen.getByText('80% symbolic')).toBeInTheDocument();
    });
  });

  describe('message display', () => {
    it('renders messages when there are more than 1', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByTestId('message-msg-1')).toBeInTheDocument();
      expect(screen.getByTestId('message-msg-2')).toBeInTheDocument();
      expect(screen.getByTestId('message-msg-3')).toBeInTheDocument();
    });

    it('shows empty state when there is only 1 message', () => {
      const mockStore = createMockStore({
        messages: [mockMessages[0]],
      });
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    it('shows typing indicator when isTyping is true', () => {
      const mockStore = createMockStore({ isTyping: true });
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
      expect(screen.getByText('Aria is typing...')).toBeInTheDocument();
    });
  });

  describe('routing stats bar', () => {
    it('displays symbolic count', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('8 symbolic')).toBeInTheDocument();
    });

    it('displays neural count', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('2 neural')).toBeInTheDocument();
    });

    it('displays total cost', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('0.056')).toBeInTheDocument();
    });
  });

  describe('user actions', () => {
    it('calls onClose when close button is clicked', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);
      const onClose = vi.fn();

      render(<SymbiosChat isOpen={true} onClose={onClose} />);

      const closeButton = screen.getByTitle('Close');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('calls clearMessages when clear button is clicked', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);

      const clearButton = screen.getByTitle('Clear chat');
      fireEvent.click(clearButton);

      expect(mockStore.clearMessages).toHaveBeenCalled();
    });

    it('toggles minimized state when minimize button is clicked', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);

      const minimizeButton = screen.getByTitle('Minimize');
      fireEvent.click(minimizeButton);

      expect(mockStore.setMinimized).toHaveBeenCalledWith(true);
    });
  });

  describe('variants', () => {
    it('renders panel variant with correct positioning', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      const { container } = render(
        <SymbiosChat isOpen={true} onClose={vi.fn()} variant="panel" />
      );

      // Panel should have fixed positioning classes
      const chatDiv = container.querySelector('.fixed');
      expect(chatDiv).toBeInTheDocument();
    });

    it('renders modal variant with backdrop', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      const { container } = render(
        <SymbiosChat isOpen={true} onClose={vi.fn()} variant="modal" />
      );

      // Modal should have a backdrop (first child with bg-black)
      const backdrop = container.querySelector('.backdrop-blur-sm');
      expect(backdrop).toBeInTheDocument();
    });

    it('renders embedded variant without fixed positioning', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      const { container } = render(
        <SymbiosChat isOpen={true} onClose={vi.fn()} variant="embedded" />
      );

      // Embedded should have w-full h-full classes
      const chatDiv = container.querySelector('.w-full.h-full');
      expect(chatDiv).toBeInTheDocument();
    });

    it('closes modal when backdrop is clicked', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);
      const onClose = vi.fn();

      const { container } = render(
        <SymbiosChat isOpen={true} onClose={onClose} variant="modal" />
      );

      const backdrop = container.querySelector('.backdrop-blur-sm');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(onClose).toHaveBeenCalled();
      }
    });
  });

  describe('aria status variations', () => {
    it('displays busy status', () => {
      const mockStore = createMockStore({ ariaStatus: 'busy' });
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('busy')).toBeInTheDocument();
    });

    it('displays away status', () => {
      const mockStore = createMockStore({ ariaStatus: 'away' });
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('away')).toBeInTheDocument();
    });

    it('displays offline status', () => {
      const mockStore = createMockStore({ ariaStatus: 'offline' });
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('offline')).toBeInTheDocument();
    });
  });

  describe('minimized state', () => {
    it('hides input area when minimized', () => {
      const mockStore = createMockStore({ isMinimized: true });
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);

      // Input should not be visible when minimized
      expect(screen.queryByTestId('input')).not.toBeInTheDocument();
    });

    it('shows expand button when minimized', () => {
      const mockStore = createMockStore({ isMinimized: true });
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByTitle('Expand')).toBeInTheDocument();
    });

    it('shows minimize button when not minimized', () => {
      const mockStore = createMockStore({ isMinimized: false });
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByTitle('Minimize')).toBeInTheDocument();
    });
  });

  describe('suggestions display', () => {
    it('shows suggestions when there are messages and suggestions', () => {
      const mockStore = createMockStore();
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByTestId('suggestions')).toBeInTheDocument();
    });

    it('hides suggestions when minimized', () => {
      const mockStore = createMockStore({ isMinimized: true });
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);

      expect(screen.queryByTestId('suggestions')).not.toBeInTheDocument();
    });

    it('hides suggestions when there are no suggestions', () => {
      const mockStore = createMockStore({ suggestions: [] });
      (useSymbiosStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<SymbiosChat isOpen={true} onClose={vi.fn()} />);

      expect(screen.queryByTestId('suggestions')).not.toBeInTheDocument();
    });
  });
});
