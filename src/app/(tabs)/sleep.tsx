import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadlineLg, BodyMd, LabelSm } from '@/components/ui';
import { Icon } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { ON_THUMB } from '@/lib/gradients';

export default function SleepScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-6 pt-4">
        <LabelSm>Wind down</LabelSm>
        <HeadlineLg className="mt-1">Sleep</HeadlineLg>
        <Thumb grad="g-night" className="mt-5 h-44 justify-end p-5">
          <View className="mb-2 items-end">
            <Icon name="moon" size={26} color={ON_THUMB} />
          </View>
          <BodyMd className="text-white" style={{ fontWeight: '700', fontSize: 20 }}>
            Sleep stories coming soon
          </BodyMd>
          <BodyMd className="text-white/80">
            Soundscapes and bedtime sessions will live here.
          </BodyMd>
        </Thumb>
      </View>
    </SafeAreaView>
  );
}
