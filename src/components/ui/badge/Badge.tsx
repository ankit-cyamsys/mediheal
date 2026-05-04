import { View } from 'react-native';
import { LabelSm } from '../text';
import { type BadgeProps } from './types';
import { variantStyles } from './styles';

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const { bg, text } = variantStyles[variant];
  return (
    <View className={`rounded-full px-3 py-1 ${bg} ${className}`}>
      <LabelSm className={`uppercase tracking-wider ${text}`}>{children}</LabelSm>
    </View>
  );
}
