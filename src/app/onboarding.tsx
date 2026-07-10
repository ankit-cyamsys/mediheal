import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { HeadlineLg, HeadlineSm, BodyMd, LabelSm, PrimaryButton } from '@/components/ui';
import { Icon, type IconName } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { ON_THUMB, type GradientKey } from '@/lib/gradients';
import { localized } from '@/lib/localized';
import { usePrograms, useProgram } from '@/hooks/use-programs';
import { useAppStore } from '@/stores/app-store';

const WELCOME: { grad: GradientKey; icon: IconName; title: string; body: string }[] = [
  {
    grad: 'g-dawn',
    icon: 'sun',
    title: 'Welcome to Mediheal',
    body: 'A few quiet minutes a day is all it takes to feel more like yourself.',
  },
  {
    grad: 'g-lilac',
    icon: 'leaf',
    title: 'Start with the basics',
    body: 'Short guided sessions teach you to meditate — no experience needed.',
  },
  {
    grad: 'g-sea',
    icon: 'moon',
    title: 'Breathe. Focus. Sleep.',
    body: 'Guided sessions and calming sounds for every moment of your day.',
  },
];

const MOODS = [
  { id: 'great', name: 'Great', color: '#63c088' },
  { id: 'good', name: 'Good', color: '#a6c85f' },
  { id: 'okay', name: 'Okay', color: '#e0be6b' },
  { id: 'low', name: 'Low', color: '#e6a06f' },
  { id: 'stress', name: 'Stressed', color: '#e08a7a' },
];

const STEP_GRADS: GradientKey[] = ['g-lilac', 'g-dawn', 'g-sea', 'g-forest', 'g-mist'];

export default function OnboardingScreen() {
  const router = useRouter();
  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const setMood = useAppStore((s) => s.setMood);
  const [step, setStep] = useState(0);
  const [mood, setMoodLocal] = useState<string | null>(null);

  const { data: programs } = usePrograms();
  const firstId = programs?.[0]?.id;
  const { data: firstProgram } = useProgram(step === 3 ? firstId : undefined);

  const finish = (finalMood: string | null) => {
    if (finalMood) setMood(finalMood);
    setOnboarded(true);
    router.replace('/(tabs)');
  };
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  /* Welcome slides */
  if (step <= 2) {
    const w = WELCOME[step];
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 px-6">
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-2">
              <Thumb
                grad="g-lilac"
                withOrbs={false}
                style={{ width: 26, height: 26, borderRadius: 8 }}
              />
              <HeadlineSm>Mediheal</HeadlineSm>
            </View>
            <Pressable onPress={() => finish(null)} className="px-3 py-1.5">
              <Text className="text-label-md text-on-surface-variant">Skip</Text>
            </Pressable>
          </View>

          <View className="flex-1 items-center justify-center">
            <Thumb grad={w.grad} className="h-44 w-44 items-center justify-center">
              <Icon name={w.icon} size={64} stroke={1.6} color={ON_THUMB} />
            </Thumb>
            <HeadlineLg className="mt-8 text-center">{w.title}</HeadlineLg>
            <BodyMd className="mt-3 max-w-[300px] text-center text-on-surface-variant">
              {w.body}
            </BodyMd>
          </View>

          <View className="mb-4 flex-row justify-center gap-2">
            {WELCOME.map((_, i) => (
              <View
                key={i}
                className={`h-2 rounded-full ${i === step ? 'w-6 bg-primary' : 'w-2 bg-surface-variant'}`}
              />
            ))}
          </View>
          <View className="pb-6">
            <PrimaryButton onPress={next}>{step === 2 ? "Let's begin" : 'Continue'}</PrimaryButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /* Kick-start walkthrough */
  if (step === 3) {
    const preview = firstProgram?.sessions?.slice(0, 5) ?? [];
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 px-6 pt-2">
          <Pressable
            onPress={back}
            className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-surface-container"
          >
            <Icon name="back" size={20} />
          </Pressable>
          <LabelSm>Your kick-start</LabelSm>
          <HeadlineLg className="mt-1">
            {firstProgram ? localized(firstProgram.title) : 'The Basics'}
          </HeadlineLg>
          <BodyMd className="mt-2 text-on-surface-variant">
            {firstProgram
              ? `${firstProgram.total_sessions} short sessions to build your foundation. Take one a day, or go at your own pace.`
              : 'Short guided sessions teach you the essentials, one calm day at a time.'}
          </BodyMd>

          <ScrollView
            className="mt-5 flex-1"
            contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
          >
            {preview.length > 0 ? (
              preview.map((s) => (
                <View key={s.id} className="flex-row items-center gap-3">
                  <Thumb
                    grad={STEP_GRADS[(s.day_number - 1) % STEP_GRADS.length]}
                    withOrbs={false}
                    className="h-11 w-11 items-center justify-center"
                  >
                    <Text style={{ color: ON_THUMB, fontWeight: '700' }}>{s.day_number}</Text>
                  </Thumb>
                  <View className="min-w-0 flex-1">
                    <Text className="text-body-md font-bold text-on-surface" numberOfLines={1}>
                      {localized(s.title) || `Day ${s.day_number}`}
                    </Text>
                    <Text className="text-label-md text-on-surface-variant" numberOfLines={1}>
                      {localized(s.description) || 'A guided practice for today.'}
                    </Text>
                  </View>
                  <Text className="text-label-md font-bold text-on-surface-variant">
                    {(s.durations?.[0] ?? '—') + 'm'}
                  </Text>
                </View>
              ))
            ) : (
              <BodyMd className="text-center text-on-surface-variant">
                Loading your first program…
              </BodyMd>
            )}
            {firstProgram && firstProgram.sessions.length > 5 && (
              <Text className="text-center text-label-md font-bold text-on-surface-variant">
                + {firstProgram.sessions.length - 5} more sessions
              </Text>
            )}
          </ScrollView>

          <View className="pb-6">
            <PrimaryButton onPress={next}>Next</PrimaryButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /* Mood check-in */
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-6 pt-2">
        <Pressable
          onPress={back}
          className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-surface-container"
        >
          <Icon name="back" size={20} />
        </Pressable>
        <View className="flex-1 justify-center">
          <View className="items-center">
            <LabelSm>Check in</LabelSm>
            <HeadlineLg className="mt-1 text-center">How are you{'\n'}feeling today?</HeadlineLg>
            <BodyMd className="mt-2 text-center text-on-surface-variant">
              We&apos;ll remember your mood so you can see how it changes.
            </BodyMd>
          </View>
          <View className="mt-8 flex-row flex-wrap justify-center gap-4">
            {MOODS.map((m) => {
              const sel = mood === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setMoodLocal(m.id)}
                  className={`items-center rounded-2xl border p-3 ${sel ? 'border-primary bg-primary/10' : 'border-outline-variant'}`}
                  style={{ width: 92 }}
                >
                  <View
                    style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: m.color }}
                  />
                  <Text className="mt-2 text-label-md font-semibold text-on-surface">{m.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View className="pb-6">
          <PrimaryButton onPress={() => finish(mood)} disabled={!mood}>
            {mood ? 'Start meditating' : 'Pick a mood'}
          </PrimaryButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
