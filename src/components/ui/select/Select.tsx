import { useState } from 'react';
import { View, Pressable, Text, Modal } from 'react-native';
import { LabelMd } from '../text';
import { type SelectProps } from './types';

export function Select({
  label,
  placeholder = 'Select',
  options,
  value,
  onValueChange,
  error,
  className = '',
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View className="gap-2">
      {label && <LabelMd>{label}</LabelMd>}
      <Pressable
        onPress={() => setOpen(true)}
        className={`w-full flex-row items-center justify-between rounded-xl border bg-surface p-4 dark:bg-d-surface ${error ? 'border-error dark:border-d-error' : 'border-outline-variant dark:border-d-outline-variant'} ${className}`}
      >
        <Text
          className={`text-body-md ${selected ? 'text-on-surface dark:text-d-on-surface' : 'text-outline dark:text-d-outline'}`}
        >
          {selected?.label ?? placeholder}
        </Text>
        <Text className="text-on-surface-variant dark:text-d-on-surface-variant">▼</Text>
      </Pressable>
      {error && (
        <Text className="text-label-md font-semibold text-error dark:text-d-error">{error}</Text>
      )}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/40"
          onPress={() => setOpen(false)}
        >
          <View className="w-72 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-lg dark:border-d-outline-variant/30 dark:bg-d-surface-container">
            <Text className="mb-3 text-label-md font-semibold text-on-surface-variant dark:text-d-on-surface-variant">
              {label ?? placeholder}
            </Text>
            {options.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  onValueChange(option.value);
                  setOpen(false);
                }}
                className={`rounded-lg px-4 py-3 ${value === option.value ? 'bg-primary-fixed/20 dark:bg-d-primary-container/30' : 'active:bg-surface-container dark:active:bg-d-surface-container-high'}`}
              >
                <Text className="text-body-md text-on-surface dark:text-d-on-surface">
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
