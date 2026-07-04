import { useState } from 'react';
import { View, Pressable, Text, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage, SUPPORTED_LANGUAGES } from '@/lib/i18n';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language);

  return (
    <View className={className}>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-10 w-10 items-center justify-center rounded-full active:bg-outline-variant/20 dark:active:bg-d-outline-variant/20"
      >
        <Text className="text-[18px]">🌐</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/40"
          onPress={() => setOpen(false)}
        >
          <View className="w-64 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-lg dark:border-d-outline-variant/30 dark:bg-d-surface-container">
            <Text className="mb-3 text-label-md font-semibold text-on-surface-variant dark:text-d-on-surface-variant">
              Select Language
            </Text>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => {
                  changeLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex-row items-center justify-between rounded-lg px-4 py-3 ${i18n.language === lang.code ? 'bg-primary-fixed/20 dark:bg-d-primary-container/30' : 'active:bg-surface-container dark:active:bg-d-surface-container-high'}`}
              >
                <Text className="text-body-md text-on-surface dark:text-d-on-surface">
                  {lang.label}
                </Text>
                {i18n.language === lang.code && (
                  <Text className="text-primary dark:text-d-primary">✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
