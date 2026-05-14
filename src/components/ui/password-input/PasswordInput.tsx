import { useState } from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { LabelMd } from '../text';
import { type PasswordInputProps } from './types';
import { colors } from '@/lib/theme';

export function PasswordInput({ label, error, className = '', ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="gap-2">
      {label && <LabelMd>{label}</LabelMd>}
      <View className="relative">
        <TextInput
          className={`w-full rounded-xl border bg-surface p-4 pr-12 text-body-md text-on-surface dark:bg-d-surface dark:text-d-on-surface ${error ? 'border-error dark:border-d-error' : 'border-outline-variant dark:border-d-outline-variant'} ${className}`}
          placeholderTextColor={colors.outline}
          secureTextEntry={!visible}
          {...props}
        />
        <Pressable
          className="absolute right-4 top-1/2 -translate-y-1/2"
          onPress={() => setVisible((v) => !v)}
          hitSlop={8}
        >
          <Text className="text-on-surface-variant dark:text-d-on-surface-variant">
            {visible ? '🙈' : '👁'}
          </Text>
        </Pressable>
      </View>
      {error && (
        <Text className="text-label-md font-semibold text-error dark:text-d-error">{error}</Text>
      )}
    </View>
  );
}
