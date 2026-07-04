import { View } from 'react-native';
import { HeadlineMd } from '@/components/ui';

export default function LibraryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface dark:bg-d-surface">
      <HeadlineMd>Library</HeadlineMd>
    </View>
  );
}
