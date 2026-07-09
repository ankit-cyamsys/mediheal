import { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { HeadlineLg, HeadlineSm, BodyMd, LabelSm } from '@/components/ui';
import { Icon } from '@/components/icon';
import { ProgramTile } from '@/components/program-tile';
import { colors } from '@/lib/theme';
import { usePrograms } from '@/hooks/use-programs';
import type { ProgramKind } from '@/types';

const KINDS: (ProgramKind | 'All')[] = ['All', 'course', 'collection', 'single'];

export default function ExploreScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<ProgramKind | 'All'>('All');
  const { data: programs, isLoading, error } = usePrograms();

  const list =
    programs && (filter === 'All' ? programs : programs.filter((p) => p.kind === filter));

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 32 }}>
        <View className="mb-5 flex-row items-center justify-between">
          <View>
            <LabelSm>Find your calm</LabelSm>
            <HeadlineLg className="mt-1">Explore</HeadlineLg>
          </View>
          <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-surface-container">
            <Icon name="bookmark" size={20} />
          </Pressable>
        </View>

        {error && (
          <View className="mb-4 rounded-xl bg-error-container px-4 py-3">
            <Text className="text-label-md text-on-error-container">
              {(error as Error).message}
            </Text>
          </View>
        )}

        {/* Topic packs */}
        {programs && programs.length > 0 && (
          <View className="mb-6">
            <HeadlineSm className="mb-3">Topic packs</HeadlineSm>
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {programs.slice(0, 4).map((p) => (
                <ProgramTile
                  key={p.id}
                  program={p}
                  width="48%"
                  height={130}
                  onPress={() => router.push(`/programs/${p.id}`)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginBottom: 18 }}
        >
          {KINDS.map((k) => (
            <Pressable
              key={k}
              onPress={() => setFilter(k)}
              className={`rounded-full px-4 py-2 ${filter === k ? 'bg-primary' : 'bg-surface-container'}`}
            >
              <Text
                className={`text-label-md font-semibold capitalize ${
                  filter === k ? 'text-on-primary' : 'text-on-surface-variant'
                }`}
              >
                {k}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {isLoading && <ActivityIndicator color={colors.primary} className="mt-6" />}

        {list && list.length === 0 && (
          <BodyMd className="mt-6 text-center text-on-surface-variant">Nothing here yet.</BodyMd>
        )}

        {list && list.length > 0 && (
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {list.map((p) => (
              <ProgramTile
                key={p.id}
                program={p}
                width="48%"
                onPress={() => router.push(`/programs/${p.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
