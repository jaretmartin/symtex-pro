import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export formatting utilities
export {
  formatDate,
  formatRelativeTime,
  formatDateTime,
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  truncate,
  capitalize,
} from './format';

// Re-export validation utilities
export { isValidEmail, isValidUrl, isNotEmpty } from './validation';
