import { View, Text } from 'react-native';
import { type DividerProps } from './types';

export function Divider({ label, className = '' }: DividerProps) {
  if (!label) {
    return <View className={`h-[1px] bg-outline-variant dark:bg-d-outline-variant ${className}`} />;
  }

  return (
    <View className={`flex-row items-center ${className}`}>
      <View className="h-[1px] flex-1 bg-outline-variant dark:bg-d-outline-variant" />
      <Text className="px-4 text-[12px] font-semibold uppercase text-on-surface-variant dark:text-d-on-surface-variant">
        {label}
      </Text>
      <View className="h-[1px] flex-1 bg-outline-variant dark:bg-d-outline-variant" />
    </View>
  );
}
