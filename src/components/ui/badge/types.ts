export type BadgeVariant = 'default' | 'error';

export type BadgeProps = {
  children: string;
  variant?: BadgeVariant;
  className?: string;
};
