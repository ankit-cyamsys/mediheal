import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { HeadlineLg, HeadlineSm, BodyMd, LabelSm } from '@/components/ui';
import { Icon } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { ProgramTile } from '@/components/program-tile';
import { gradForKey, ON_THUMB } from '@/lib/gradients';
import { localized } from '@/lib/localized';
import { useThemeColors } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/auth-store';
import { usePrograms, useProgress } from '@/hooks/use-programs';
import type { ProgramSummary, Progress } from '@/types';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const colors = useThemeColors();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: programs, isLoading, error } = usePrograms();
  const first = programs?.[0];
  const { data: firstProgress } = useProgress(first?.id);

  const name = user?.name || user?.email?.split('@')[0] || 'Friend';

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 32 }}>
        {/* Header */}
        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-1">
            <LabelSm>{greeting()},</LabelSm>
            <HeadlineLg className="mt-0.5">{name}</HeadlineLg>
          </View>
          <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-surface-container">
            <Icon name="bell" size={20} />
          </Pressable>
        </View>

        {error && (
          <View className="mb-4 rounded-xl bg-error-container px-4 py-3">
            <Text className="text-label-md text-on-error-container">
              {(error as Error).message}
            </Text>
          </View>
        )}

        {/* Continue / featured */}
        {first && firstProgress ? (
          <ContinueCard
            program={first}
            progress={firstProgress}
            onPress={() => router.push(`/programs/${first.id}`)}
          />
        ) : first ? (
          <FeaturedCard program={first} onPress={() => router.push(`/programs/${first.id}`)} />
        ) : null}

        {/* Explore by feeling (horizontal) */}
        {programs && programs.length > 0 && (
          <View className="mt-7">
            <View className="mb-3 flex-row items-center justify-between">
              <HeadlineSm>Explore by feeling</HeadlineSm>
              <Pressable
                onPress={() => router.push('/explore')}
                className="rounded-full bg-surface-container px-3 py-1.5"
              >
                <Text className="text-label-md font-semibold text-on-surface-variant">See all</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {programs.map((p) => (
                  <View key={p.id} style={{ width: 130 }}>
                    <ProgramTile
                      program={p}
                      height={150}
                      onPress={() => router.push(`/programs/${p.id}`)}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* All programs grid */}
        <View className="mt-7">
          <HeadlineSm className="mb-3">All programs</HeadlineSm>
          {isLoading && <ActivityIndicator color={colors.primary} className="mt-6" />}
          {programs && (
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {programs.map((p) => (
                <ProgramTile
                  key={p.id}
                  program={p}
                  width="48%"
                  onPress={() => router.push(`/programs/${p.id}`)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeaturedCard({ program, onPress }: { program: ProgramSummary; onPress: () => void }) {
  const colors = useThemeColors();
  return (
    <Thumb grad={gradForKey(program.slug || program.id)} style={{ height: 200 }} className="p-5">
      <View className="flex-row items-start justify-between">
        <View className="rounded-full bg-white/25 px-3 py-1">
          <Text style={{ color: ON_THUMB, fontWeight: '700', fontSize: 12 }}>{program.kind}</Text>
        </View>
        <Icon name="sparkle" size={22} color={ON_THUMB} />
      </View>
      <View className="flex-1" />
      <Text style={{ color: ON_THUMB, fontWeight: '700', fontSize: 26 }}>
        {localized(program.title)}
      </Text>
      <Text style={{ color: ON_THUMB, opacity: 0.85, marginBottom: 12 }}>
        {program.total_sessions} sessions
      </Text>
      <Pressable
        onPress={onPress}
        className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-white py-3"
      >
        <Icon name="play" size={18} color={colors.primary} />
        <Text className="font-semibold text-primary">Begin program</Text>
      </Pressable>
    </Thumb>
  );
}

function ContinueCard({
  program,
  progress,
  onPress,
}: {
  program: ProgramSummary;
  progress: Progress;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const done = progress.sessions_completed.length;
  const total = program.total_sessions;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <HeadlineSm>Continue {localized(program.title)}</HeadlineSm>
        <Text className="text-label-md font-bold text-primary">{pct}%</Text>
      </View>
      <View className="rounded-2xl bg-surface-container p-4">
        <View className="mb-3.5 h-1.5 overflow-hidden rounded-full bg-surface-variant">
          <View className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </View>
        <Pressable onPress={onPress} className="flex-row items-center gap-3">
          <Thumb
            grad={gradForKey(program.slug || program.id)}
            withOrbs={false}
            className="h-12 w-12 items-center justify-center"
          >
            <Icon name="play" size={18} color={ON_THUMB} />
          </Thumb>
          <View className="flex-1">
            <BodyMd style={{ fontWeight: '700' }}>Day {Math.max(progress.current_day, 1)}</BodyMd>
            <Text className="text-label-md text-on-surface-variant">
              {done} of {total} sessions complete
            </Text>
          </View>
          <Icon name="chevron" size={18} color={colors.outline} />
        </Pressable>
      </View>
    </View>
  );
}
