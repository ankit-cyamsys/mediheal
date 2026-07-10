import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { HeadlineLg, BodyMd } from '@/components/ui';
import { Icon } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { ON_THUMB } from '@/lib/gradients';
import { useProgress } from '@/hooks/use-programs';

export default function CompleteScreen() {
  const router = useRouter();
  const { programId, percent, duration } = useLocalSearchParams<{
    programId?: string;
    percent?: string;
    duration?: string;
  }>();
  const pct = percent ? Number(percent) : undefined;
  const { data: progress } = useProgress(programId || undefined);

  const low = pct !== undefined && pct < 80;
  const headline = low ? 'Logged.' : 'Nicely done.';
  const sub = low
    ? "You'll need 80% played for it to count toward your streak."
    : "Today's session is in the book. Come back tomorrow.";

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center px-6">
        <Thumb grad="g-forest" withOrbs={false} className="h-28 w-28 items-center justify-center">
          <Icon name="check" size={64} color={ON_THUMB} />
        </Thumb>

        <HeadlineLg className="mt-5 text-center">{headline}</HeadlineLg>
        <BodyMd className="mt-2 max-w-[280px] text-center text-on-surface-variant">{sub}</BodyMd>

        {progress && (
          <View className="my-7 w-full max-w-[320px] flex-row justify-around">
            <Stat label="STREAK" value={`${progress.current_streak}d`} />
            <Stat label="MINUTES" value={String(progress.total_minutes || duration || '—')} />
            <Stat label="SESSIONS" value={String(progress.sessions_completed?.length ?? 0)} />
          </View>
        )}

        <View className="mt-4 flex-row items-center justify-center gap-3">
          {programId ? (
            <Pressable
              onPress={() => router.replace(`/programs/${programId}`)}
              className="rounded-full bg-primary px-6 py-3"
            >
              <Text className="font-semibold text-on-primary">Back to program</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            className="rounded-full border border-outline-variant px-6 py-3"
          >
            <Text className="font-semibold text-on-surface">Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-center">
      <Text className="text-headline-sm font-bold text-on-surface">{value}</Text>
      <Text className="mt-1 text-label-sm uppercase text-on-surface-variant">{label}</Text>
    </View>
  );
}
