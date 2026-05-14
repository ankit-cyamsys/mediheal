import { View, TextInput, Text } from 'react-native';
import { LabelMd } from '../text';
import { type InputProps } from './types';
import { styles } from './styles';

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View className="gap-2">
      {label && <LabelMd>{label}</LabelMd>}
      <TextInput
        className={`w-full rounded-xl border bg-surface p-4 text-body-md text-on-surface dark:bg-d-surface dark:text-d-on-surface ${error ? 'border-error dark:border-d-error' : 'border-outline-variant dark:border-d-outline-variant'} ${className}`}
        placeholderTextColor={styles.placeholderColor}
        {...props}
      />
      {error && (
        <Text className="text-label-md font-semibold text-error dark:text-d-error">{error}</Text>
      )}
    </View>
  );
}
