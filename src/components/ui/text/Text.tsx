import { Text as RNText } from 'react-native';
import { type TypographyProps } from './types';

export function HeadlineLg({ className = '', ...props }: TypographyProps) {
  return (
    <RNText
      className={`text-headline-lg text-primary dark:text-d-on-surface ${className}`}
      {...props}
    />
  );
}

export function HeadlineMd({ className = '', ...props }: TypographyProps) {
  return (
    <RNText
      className={`text-headline-md text-primary dark:text-d-on-surface ${className}`}
      {...props}
    />
  );
}

export function HeadlineSm({ className = '', ...props }: TypographyProps) {
  return (
    <RNText
      className={`text-headline-sm text-primary dark:text-d-on-surface ${className}`}
      {...props}
    />
  );
}

export function BodyLg({ className = '', ...props }: TypographyProps) {
  return (
    <RNText
      className={`text-body-lg text-on-surface dark:text-d-on-surface ${className}`}
      {...props}
    />
  );
}

export function BodyMd({ className = '', ...props }: TypographyProps) {
  return (
    <RNText
      className={`text-body-md text-on-surface dark:text-d-on-surface ${className}`}
      {...props}
    />
  );
}

export function LabelMd({ className = '', ...props }: TypographyProps) {
  return (
    <RNText
      className={`text-label-md text-on-surface-variant dark:text-d-on-surface-variant ${className}`}
      {...props}
    />
  );
}

export function LabelSm({ className = '', ...props }: TypographyProps) {
  return (
    <RNText
      className={`text-label-sm uppercase tracking-wider text-outline dark:text-d-outline ${className}`}
      {...props}
    />
  );
}
