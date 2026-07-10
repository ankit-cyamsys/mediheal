import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { HeadlineLg, HeadlineSm, LabelSm } from '@/components/ui';
import { Icon } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { ON_THUMB } from '@/lib/gradients';
import { localized } from '@/lib/localized';
import { colors } from '@/lib/theme';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth-store';
import type { ProgramSummary, Progress } from '@/types';

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface Row {
  program: ProgramSummary;
  progress: Progress;
}

function useProgressStats() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      const programs = await api<ProgramSummary[]>('GET', '/api/v1/programs');
      const progresses = await Promise.all(
        programs.map((p) =>
          api<Progress>('GET', `/api/v1/progress/${p.id}`, { token }).catch(() => null),
        ),
      );
      const rows: Row[] = programs
        .map((p, i) => ({ program: p, progress: progresses[i] }))
        .filter((r): r is Row => r.progress != null);
      const minutes = rows.reduce((s, r) => s + (r.progress.total_minutes || 0), 0);
      const sessions = rows.reduce((s, r) => s + (r.progress.sessions_completed?.length || 0), 0);
      const longest = rows.reduce((m, r) => Math.max(m, r.progress.longest_streak || 0), 0);
      const current = rows.reduce((m, r) => Math.max(m, r.progress.current_streak || 0), 0);
      return { minutes, sessions, longest, current, rows };
    },
  });
}

export default function ProgressScreen() {
  const { data: stats, isLoading } = useProgressStats();
  const todayIdx = new Date().getDay();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 32 }}>
        <View className="mb-5">
          <LabelSm>Keep it going</LabelSm>
          <HeadlineLg className="mt-1">Your Progress</HeadlineLg>
        </View>

        {isLoading && <ActivityIndicator color={colors.primary} className="mt-6" />}

        {/* Streak hero */}
        <Thumb
          grad="g-dusk"
          style={{ height: 150, marginBottom: 18 }}
          className="items-center justify-center"
        >
          <View className="flex-row items-center gap-2.5">
            <Icon name="flame" size={40} stroke={1.6} color={ON_THUMB} />
            <Text style={{ color: ON_THUMB, fontWeight: '800', fontSize: 56, lineHeight: 60 }}>
              {stats?.current ?? 0}
            </Text>
          </View>
          <Text style={{ color: ON_THUMB, opacity: 0.85, marginTop: 6, fontSize: 14 }}>
            day streak — you&apos;re on a roll
          </Text>
        </Thumb>

        {/* Stat row */}
        <View className="mb-6 flex-row justify-around">
          <Stat label="MINUTES" value={String(stats?.minutes ?? '—')} />
          <Stat label="SESSIONS" value={String(stats?.sessions ?? '—')} />
          <Stat label="BEST STREAK" value={String(stats?.longest ?? '—')} />
        </View>

        {/* This week */}
        <HeadlineSm className="mb-3">This week</HeadlineSm>
        <View className="mb-6 rounded-2xl bg-surface-container p-4">
          <View className="flex-row justify-between">
            {WEEK.map((d, i) => (
              <View key={i} className="items-center gap-2">
                <View
                  className={`h-9 w-9 items-center justify-center rounded-full ${
                    i === todayIdx ? 'bg-primary' : 'bg-surface-variant'
                  }`}
                >
                  {i === todayIdx && <Icon name="check" size={18} color={ON_THUMB} />}
                </View>
                <Text className="text-label-sm text-on-surface-variant">{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* By program */}
        <HeadlineSm className="mb-3">By program</HeadlineSm>
        <View className="gap-3">
          {stats?.rows?.length ? (
            stats.rows.map(({ program, progress }) => (
              <View
                key={program.id}
                className="flex-row items-center gap-3 rounded-2xl bg-surface-container p-3"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-variant">
                  <Icon name="leaf" size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-body-md font-bold text-on-surface" numberOfLines={1}>
                    {localized(program.title) || program.slug}
                  </Text>
                  <Text className="text-label-md text-on-surface-variant" numberOfLines={1}>
                    Day {progress.current_day} · {progress.total_minutes} min · streak{' '}
                    {progress.current_streak}d
                  </Text>
                </View>
                <Text className="text-label-md font-bold text-on-surface-variant">
                  {progress.sessions_completed.length}/{program.total_sessions}
                </Text>
              </View>
            ))
          ) : (
            <View className="rounded-2xl bg-surface-container p-4">
              <Text className="text-label-md text-on-surface-variant">
                Complete a session to see your activity.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
