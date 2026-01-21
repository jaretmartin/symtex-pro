/**
 * ThemeToggle Component
 *
 * A segmented toggle for switching between light, dark, and system themes.
 * Uses the existing useTheme hook for state management and persistence.
 *
 * Features:
 * - Animated sliding indicator (Framer Motion)
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Proper ARIA roles (radiogroup, radio)
 * - Size variants (sm, default, lg)
 * - Tooltips on hover
 */

import * as React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, type Theme } from '@/hooks/useTheme';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Re-export Theme type for convenience
export type { Theme };

export type ThemeToggleSize = 'sm' | 'default' | 'lg';

export interface ThemeOption {
  value: Theme;
  label: string;
  icon: typeof Sun;
}

const themeOptions: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export interface ThemeToggleProps {
  /** Additional class names for the container */
  className?: string;
  /** Size variant */
  size?: ThemeToggleSize;
  /** Disable all toggle options */
  disabled?: boolean;
}

const sizeConfig = {
  sm: {
    container: 'p-0.5 gap-0.5',
    button: 'h-7 w-7',
    icon: 'h-3.5 w-3.5',
    indicator: 'inset-y-0.5',
  },
  default: {
    container: 'p-1 gap-1',
    button: 'h-8 w-8',
    icon: 'h-4 w-4',
    indicator: 'inset-y-1',
  },
  lg: {
    container: 'p-1.5 gap-1',
    button: 'h-10 w-10',
    icon: 'h-5 w-5',
    indicator: 'inset-y-1.5',
  },
} as const;

/**
 * ThemeToggle - A segmented control for theme selection
 *
 * Uses the useTheme hook internally for state management.
 * No need to pass value/onChange - it manages itself.
 *
 * @example
 * // Basic usage
 * <ThemeToggle />
 *
 * @example
 * // With size variant
 * <ThemeToggle size="lg" />
 *
 * @example
 * // Disabled state
 * <ThemeToggle disabled />
 */
export function ThemeToggle({
  className,
  size = 'default',
  disabled = false,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Map<Theme, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const config = sizeConfig[size];

  // Update indicator position based on active theme
  const updateIndicator = useCallback(() => {
    const activeButton = optionRefs.current.get(theme);
    const container = containerRef.current;

    if (!activeButton || !container) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setIndicatorStyle({
      left: buttonRect.left - containerRect.left,
      width: buttonRect.width,
    });
  }, [theme]);

  // Update indicator when theme changes or on mount
  useEffect(() => {
    // Small delay to ensure refs are populated
    const timer = requestAnimationFrame(updateIndicator);
    return () => cancelAnimationFrame(timer);
  }, [theme, updateIndicator]);

  // Update indicator on window resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      updateIndicator();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [updateIndicator]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      if (disabled) return;

      let newIndex = currentIndex;
      const optionCount = themeOptions.length;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : optionCount - 1;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          newIndex = currentIndex < optionCount - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = optionCount - 1;
          break;
        default:
          return;
      }

      const newOption = themeOptions[newIndex];
      if (newOption) {
        setTheme(newOption.value);
        optionRefs.current.get(newOption.value)?.focus();
      }
    },
    [disabled, setTheme]
  );

  // Store button ref
  const setButtonRef = useCallback(
    (value: Theme) => (el: HTMLButtonElement | null) => {
      if (el) {
        optionRefs.current.set(value, el);
      } else {
        optionRefs.current.delete(value);
      }
    },
    []
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div
        ref={containerRef}
        className={cn(
          'relative inline-flex items-center rounded-lg bg-muted/50',
          config.container,
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        role="radiogroup"
        aria-label="Theme selection"
      >
        {/* Animated sliding indicator */}
        <motion.div
          className={cn(
            'absolute rounded-md bg-background shadow-sm ring-1 ring-border/10',
            config.indicator
          )}
          initial={false}
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
          }}
        />

        {/* Theme option buttons */}
        {themeOptions.map((option, index) => {
          const isActive = option.value === theme;
          const Icon = option.icon;

          return (
            <Tooltip key={option.value}>
              <TooltipTrigger asChild>
                <button
                  ref={setButtonRef(option.value)}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`${option.label} theme`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => !disabled && setTheme(option.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={disabled}
                  className={cn(
                    'relative z-10 flex items-center justify-center rounded-md',
                    'transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:pointer-events-none',
                    config.button,
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      config.icon,
                      'transition-transform duration-200',
                      isActive && 'scale-110'
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                <p>{option.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
