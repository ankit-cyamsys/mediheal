import { View } from 'react-native';
import { Link } from 'expo-router';
import { HeadlineLg, BodyMd, LabelMd, ThemeToggle } from '@/components/ui';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface dark:bg-d-surface">
      <HeadlineLg>MediHeal</HeadlineLg>
      <BodyMd className="mt-2 text-on-surface-variant dark:text-d-on-surface-variant">
        Welcome to MediHeal
      </BodyMd>
      <ThemeToggle className="mt-8" />
      {__DEV__ && (
        <View className="mt-8 items-center gap-4">
          <Link href="/auth/login">
            <LabelMd className="text-secondary dark:text-d-secondary">🔐 Login Page</LabelMd>
          </Link>
          <Link href="/dev">
            <LabelMd className="text-secondary dark:text-d-secondary">
              🧪 Component Showcase
            </LabelMd>
          </Link>
        </View>
      )}
    </View>
  );
}
