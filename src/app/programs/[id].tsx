import { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LabelSm } from '@/components/ui';
import { Icon } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { gradForKey, ON_THUMB } from '@/lib/gradients';
import { localized } from '@/lib/localized';
import { useThemeColors } from '@/hooks/use-theme';
import { useProgram } from '@/hooks/use-programs';
import type { Session } from '@/types';

export default function ProgramDetailScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: program, isLoading, error } = useProgram(id);

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <View className="flex-1 px-6 pt-4">
          <BackButton onPress={() => router.back()} />
          <View className="mt-4 rounded-xl bg-error-container px-4 py-3">
            <Text className="text-label-md text-on-error-container">
              {(error as Error).message}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !program) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const grad = gradForKey(program.slug || program.id);
  const done = program.sessions.filter((s) => s.status === 'completed').length;
  const total = program.sessions.length || program.total_sessions || 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <View className="flex-1 bg-surface">
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Hero */}
        <Thumb grad={grad} style={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: 28 }}>
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/60"
            >
              <Icon name="back" size={20} />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/60">
              <Icon name="bookmark" size={18} />
            </Pressable>
          </View>
          <View className="items-center py-3.5">
            <Icon name="leaf" size={92} stroke={1.6} color={ON_THUMB} />
          </View>
          <View className="items-center">
            <Text style={{ color: ON_THUMB, opacity: 0.85, fontWeight: '700', fontSize: 12.5 }}>
              {program.kind} · {total} sessions
            </Text>
            <Text
              style={{
                color: ON_THUMB,
                fontWeight: '800',
                fontSize: 26,
                marginTop: 4,
                textAlign: 'center',
              }}
            >
              {localized(program.title)}
            </Text>
            {localized(program.description) ? (
              <Text
                style={{
                  color: ON_THUMB,
                  opacity: 0.85,
                  maxWidth: 300,
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                {localized(program.description)}
              </Text>
            ) : null}
          </View>
        </Thumb>

        {/* Progress + sessions */}
        <View className="px-6 pt-5">
          <View className="mb-2.5 flex-row items-center justify-between">
            <LabelSm style={{ fontWeight: '800' }}>
              {done} of {total} complete
            </LabelSm>
            <Text className="text-label-md font-extrabold text-primary">{pct}%</Text>
          </View>
          <View className="mb-4.5 h-1.5 overflow-hidden rounded-full bg-surface-variant">
            <View className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </View>

          <View className="mt-2 gap-3">
            {program.sessions.map((s) => (
              <LessonRow
                key={s.id}
                session={s}
                onPlay={(dur) => router.push(`/play/${s.id}?duration=${dur}&program=${program.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-full bg-surface-container"
    >
      <Icon name="back" size={20} />
    </Pressable>
  );
}

function LessonRow({
  session,
  onPlay,
}: {
  session: Session;
  onPlay: (dur: number | string) => void;
}) {
  const colors = useThemeColors();
  const status = session.status || 'locked';
  const locked = status === 'locked';
  const done = status === 'completed';
  const current = status === 'unlocked';
  const durations = session.durations || [];
  const [duration, setDuration] = useState<number | string>(durations[0] ?? '');

  const handle = () => {
    if (locked) return;
    onPlay(duration || durations[0]);
  };

  const cycleDuration = () => {
    if (durations.length < 2) return;
    const idx = durations.indexOf(duration as number);
    setDuration(durations[(idx + 1) % durations.length]);
  };

  return (
    <Pressable
      onPress={handle}
      className={`flex-row items-center gap-3 rounded-2xl bg-surface-container p-3 ${locked ? 'opacity-50' : 'active:opacity-80'}`}
    >
      <View
        className={`h-10 w-10 items-center justify-center rounded-full ${
          done ? 'bg-primary' : current ? 'bg-primary/15' : 'bg-surface-variant'
        }`}
      >
        {done ? (
          <Icon name="check" size={18} color={ON_THUMB} />
        ) : locked ? (
          <Icon name="lock" size={15} color={colors.outline} />
        ) : (
          <Text className={`font-bold ${current ? 'text-primary' : 'text-on-surface-variant'}`}>
            {session.day_number}
          </Text>
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-body-md font-bold text-on-surface" numberOfLines={1}>
          {localized(session.title) || `Day ${session.day_number}`}
        </Text>
        <Text className="text-label-md text-on-surface-variant" numberOfLines={1}>
          {localized(session.description) ||
            (done ? 'Completed' : current ? 'Available today' : 'Locked')}
        </Text>
      </View>
      {durations.length > 1 && !locked && (
        <Pressable
          onPress={cycleDuration}
          hitSlop={8}
          className="rounded-xl bg-surface-variant px-2.5 py-1.5"
        >
          <Text className="text-label-md font-bold text-on-surface-variant">{duration}m</Text>
        </Pressable>
      )}
      {durations.length === 1 && (
        <Text className="text-label-md font-bold text-on-surface-variant">{durations[0]}m</Text>
      )}
    </Pressable>
  );
}
