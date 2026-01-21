/**
 * ConflictCard Component
 *
 * Displays a single conflicting rule in an expandable card format.
 * Shows rule ID, priority, trigger, action, and S1 code preview.
 *
 * @module components/cognate/conflicts/ConflictCard
 */

import { useState, useCallback } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Code,
  Zap,
  Target,
  Copy,
  Check,
} from 'lucide-react';
import clsx from 'clsx';
import type { ConflictingRule } from './types';

// =============================================================================
// Props Interface
// =============================================================================

export interface ConflictCardProps {
  /** The conflicting rule to display */
  rule: ConflictingRule;
  /** Index for visual differentiation (e.g., Rule A vs Rule B) */
  index: number;
  /** Whether the card is initially expanded */
  defaultExpanded?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// S1 Code Highlighter
// =============================================================================

interface S1HighlightProps {
  code: string;
  className?: string;
}

/**
 * Simple S1 syntax highlighter for code preview
 */
function S1Highlight({ code, className }: S1HighlightProps): JSX.Element {
  const highlightCode = (source: string): string => {
    let highlighted = source
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Keywords
    const keywords = ['RULE', 'TRIGGER', 'WHEN', 'THEN', 'ELSE', 'PRIORITY', 'AND', 'OR', 'NOT', 'IN'];
    keywords.forEach((kw) => {
      highlighted = highlighted.replace(
        new RegExp(`\\b(${kw})\\b`, 'g'),
        '<span class="text-purple-400 font-semibold">$1</span>'
      );
    });

    // Operators
    ['==', '!=', '>=', '<=', '>', '<'].forEach((op) => {
      const escaped = op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      highlighted = highlighted.replace(
        new RegExp(escaped, 'g'),
        `<span class="text-cyan-400">${op}</span>`
      );
    });

    // Strings
    highlighted = highlighted.replace(
      /"([^"]*)"/g,
      '<span class="text-green-400">"$1"</span>'
    );

    // Numbers
    highlighted = highlighted.replace(
      /\b(\d+)\b/g,
      '<span class="text-orange-400">$1</span>'
    );

    // Comments
    highlighted = highlighted.replace(
      /^(#.*)$/gm,
      '<span class="text-zinc-500">$1</span>'
    );

    // Namespaces (word followed by dot)
    const namespaces = ['customer', 'issue', 'automation', 'routing', 'escalation', 'sla', 'ticket', 'tone', 'message', 'sentiment', 'notification', 'data', 'log', 'oncall', 'lead', 'sequence', 'assignment'];
    namespaces.forEach((ns) => {
      highlighted = highlighted.replace(
        new RegExp(`\\b(${ns})\\.`, 'g'),
        '<span class="text-blue-400">$1</span>.'
      );
    });

    return highlighted;
  };

  return (
    <pre
      className={clsx(
        'text-sm font-mono overflow-x-auto whitespace-pre text-zinc-300',
        className
      )}
      dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
    />
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * ConflictCard displays a conflicting rule with expandable details.
 *
 * Features:
 * - Collapsible header showing rule ID and priority
 * - Expanded view with trigger, action, and full S1 code
 * - Copy code functionality
 * - Visual index indicator (Rule A, Rule B, etc.)
 *
 * @example
 * ```tsx
 * <ConflictCard
 *   rule={conflictingRule}
 *   index={0}
 *   defaultExpanded
 * />
 * ```
 */
export function ConflictCard({
  rule,
  index,
  defaultExpanded = false,
  className,
}: ConflictCardProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const handleToggle = useCallback((): void => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleCopy = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(rule.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API failed
    }
  }, [rule.code]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  // Generate rule label (A, B, C, etc.)
  const ruleLabel = String.fromCharCode(65 + index);

  return (
    <div
      className={clsx(
        'border border-zinc-700 rounded-xl overflow-hidden transition-all',
        className
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="w-full p-4 bg-zinc-800/50 flex items-center justify-between hover:bg-zinc-700/50 transition-colors text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          )}
          <div
            className={clsx(
              'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
              index === 0
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-blue-500/20 text-blue-400'
            )}
          >
            {ruleLabel}
          </div>
          <div>
            <p className="font-mono text-sm font-medium text-white">
              {rule.ruleId}
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Priority: {rule.priority}
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-zinc-700 space-y-4">
          {/* Trigger */}
          <div>
            <p className="text-xs text-zinc-500 mb-1.5 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Trigger
            </p>
            <code className="text-sm bg-zinc-800 px-3 py-1.5 rounded-lg inline-block text-amber-400 font-mono">
              {rule.trigger}
            </code>
          </div>

          {/* Action */}
          <div>
            <p className="text-xs text-zinc-500 mb-1.5">Action</p>
            <code className="text-sm bg-zinc-800 px-3 py-1.5 rounded-lg inline-block text-green-400 font-mono">
              {rule.action}
            </code>
          </div>

          {/* S1 Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-zinc-500 flex items-center gap-1">
                <Code className="w-3 h-3" />
                S1 Code
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-zinc-950 rounded-lg p-4 overflow-x-auto">
              <S1Highlight code={rule.code} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConflictCard;
