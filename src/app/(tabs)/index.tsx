import { View } from 'react-native';
import { Link } from 'expo-router';
import { HeadlineLg, BodyMd, LabelMd } from '@/components/ui';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <HeadlineLg>MediHeal</HeadlineLg>
      <BodyMd className="mt-2 text-on-surface-variant">Welcome to MediHeal</BodyMd>
      {__DEV__ && (
        <Link href="/dev" className="mt-8">
          <LabelMd className="text-secondary">🧪 Open Component Showcase</LabelMd>
        </Link>
      )}
    </View>
  );
}
