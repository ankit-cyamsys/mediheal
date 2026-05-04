import { type BadgeVariant } from './types';

export const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  error: { bg: 'bg-error-container', text: 'text-on-error-container' },
};
