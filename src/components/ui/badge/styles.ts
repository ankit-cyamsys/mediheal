import { type BadgeVariant } from './types';

export const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: {
    bg: 'bg-secondary-container dark:bg-d-secondary-container',
    text: 'text-on-secondary-container dark:text-d-on-secondary-container',
  },
  error: {
    bg: 'bg-error-container dark:bg-d-error-container',
    text: 'text-on-error-container dark:text-d-on-error-container',
  },
};
