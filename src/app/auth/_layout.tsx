import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { LanguageSwitcher } from '@/components/ui';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';

export default function AuthLayout() {
  const { isDark, setTheme } = useAppColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-d-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-outline-variant/30 px-6 py-3 dark:border-d-outline-variant/30">
        <View className="flex-row items-center gap-3">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-fixed-dim dark:bg-d-primary-container">
            <Text className="text-[14px]">🧘</Text>
          </View>
          <Text className="text-[20px] font-bold tracking-tight text-primary dark:text-d-on-surface">
            MediHeal
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={() => setTheme(isDark ? 'light' : 'dark')}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-outline-variant/20 dark:active:bg-d-outline-variant/20"
          >
            <Text className="text-[18px]">{isDark ? '☀️' : '🌙'}</Text>
          </Pressable>
          <LanguageSwitcher />
        </View>
      </View>

      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
