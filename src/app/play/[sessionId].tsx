import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import Svg, { Circle } from 'react-native-svg';
import { Icon } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { gradForKey } from '@/lib/gradients';
import { useThemeColors } from '@/hooks/use-theme';
import { api } from '@/services/api';
import { fetchPlayback } from '@/hooks/use-programs';
import { useAuthStore } from '@/stores/auth-store';
import type { PlaybackInfo } from '@/types';

const R = 130;
const SIZE = 280;
const CENTER = SIZE / 2;
const CIRC = 2 * Math.PI * R;

const fmtClock = (s: number) =>
  `${Math.floor((s || 0) / 60)}:${String(Math.floor((s || 0) % 60)).padStart(2, '0')}`;

type Phase = 'inhale' | 'hold' | 'exhale';
const SEQ: [Phase, number][] = [
  ['inhale', 4000],
  ['hold', 2000],
  ['exhale', 5000],
];

export default function PlayScreen() {
  const colors = useThemeColors();
  const {
    sessionId,
    duration: durationParam,
    program: programId,
  } = useLocalSearchParams<{
    sessionId: string;
    duration?: string;
    program?: string;
  }>();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const [signed, setSigned] = useState<PlaybackInfo | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const submitted = useRef(false);

  const player = useAudioPlayer(signed?.url ?? null, { downloadFirst: true, updateInterval: 500 });
  const status = useAudioPlayerStatus(player);

  const playing = status.playing;
  const elapsed = status.currentTime || 0;
  const total = status.duration || (signed?.duration ? signed.duration * 60 : 0);
  const ringProg = total ? Math.min(1, elapsed / total) : 0;

  // Configure audio to play in silent mode.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // 1) Fetch signed playback URL.
  useEffect(() => {
    let active = true;
    setSigned(null);
    setErr(null);
    fetchPlayback(sessionId, token, durationParam)
      .then((s) => active && setSigned(s))
      .catch((e) => active && setErr(e instanceof Error ? e.message : 'Failed to load audio'));
    return () => {
      active = false;
    };
  }, [sessionId, durationParam, token]);

  // 2) Auto-play once loaded.
  useEffect(() => {
    if (status.isLoaded && !playing && elapsed === 0 && !submitted.current) {
      player.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.isLoaded]);

  // 3) Complete when the track finishes.
  useEffect(() => {
    if (status.didJustFinish) markComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.didJustFinish]);

  // 4) Breathing cycle while playing.
  useEffect(() => {
    if (!playing) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      setPhase(SEQ[i][0]);
      timer = setTimeout(() => {
        i = (i + 1) % SEQ.length;
        step();
      }, SEQ[i][1]);
    };
    step();
    return () => clearTimeout(timer);
  }, [playing]);

  // Breathing core scale animation driven by phase.
  const scale = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    const to = phase === 'inhale' ? 1 : phase === 'hold' ? 1 : 0.7;
    Animated.timing(scale, {
      toValue: playing ? to : 0.85,
      duration: phase === 'exhale' ? 5000 : phase === 'inhale' ? 4000 : 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [phase, playing, scale]);

  const togglePlay = () => {
    if (!status.isLoaded) return;
    if (playing) player.pause();
    else player.play();
  };

  const skip = (delta: number) => {
    if (!status.isLoaded) return;
    player.seekTo(Math.max(0, Math.min(total, elapsed + delta)));
  };

  const markComplete = async () => {
    if (submitting || submitted.current) return;
    submitted.current = true;
    setSubmitting(true);
    try {
      const pct = total ? Math.min(100, Math.round((elapsed / total) * 100)) : 100;
      await api('POST', '/api/v1/progress/complete', {
        token,
        body: {
          session_id: sessionId,
          duration_played: signed?.duration ?? Number(durationParam) ?? Math.round(total / 60),
          completion_percentage: pct,
        },
      });
      router.replace({
        pathname: '/complete',
        params: {
          programId: programId ?? '',
          sessionId,
          percent: String(pct),
          duration: String(signed?.duration ?? ''),
        },
      });
    } catch (e) {
      submitted.current = false;
      setErr(e instanceof Error ? e.message : 'Failed to save progress');
    } finally {
      setSubmitting(false);
    }
  };

  const grad = gradForKey(sessionId);
  const breathLabel = !status.isLoaded
    ? 'Loading…'
    : playing
      ? phase === 'inhale'
        ? 'Breathe in'
        : phase === 'hold'
          ? 'Hold'
          : 'Breathe out'
      : 'Paused';

  return (
    <View className="flex-1 bg-surface">
      <Thumb
        grad={grad}
        withOrbs={false}
        style={{ position: 'absolute', inset: 0, borderRadius: 0, opacity: 0.16 }}
      />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface-container"
          >
            <Icon name="close" size={20} />
          </Pressable>
          <View className="items-center">
            <Text className="text-label-md font-bold uppercase text-on-surface-variant">
              Now playing
            </Text>
            <Text className="text-body-lg font-bold text-on-surface">
              {signed
                ? `${signed.duration} min`
                : durationParam
                  ? `${durationParam} min`
                  : 'Session'}
            </Text>
          </View>
          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface-container">
            <Icon name="heart" size={20} />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          {/* Ring + breathing */}
          <View
            style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}
          >
            <Svg
              width={SIZE}
              height={SIZE}
              style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
            >
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={R}
                stroke={colors['surface-variant']}
                strokeWidth={6}
                fill="none"
              />
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={R}
                stroke={colors.primary}
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - ringProg)}
              />
            </Svg>
            <Animated.View
              style={{
                width: 150,
                height: 150,
                borderRadius: 999,
                backgroundColor: colors['primary-container'],
                transform: [{ scale }],
                position: 'absolute',
              }}
            />
            <Text className="text-body-lg font-bold text-on-surface">{breathLabel}</Text>
          </View>

          {/* Scrubber */}
          <View style={{ width: '100%', maxWidth: 320, marginTop: 34 }}>
            <View className="h-1.5 overflow-hidden rounded-full bg-surface-variant">
              <View
                className="h-full rounded-full bg-primary"
                style={{ width: `${ringProg * 100}%` }}
              />
            </View>
            <View className="mt-2 flex-row items-center justify-between">
              <Text className="text-label-md text-on-surface-variant">{fmtClock(elapsed)}</Text>
              <Text className="text-label-md text-on-surface-variant">{fmtClock(total)}</Text>
            </View>
          </View>

          {err && (
            <View className="mt-3 rounded-xl bg-error-container px-4 py-2">
              <Text className="text-label-md text-on-error-container">{err}</Text>
            </View>
          )}

          {/* Controls */}
          <View className="mt-8 flex-row items-center gap-6">
            <Pressable
              onPress={() => skip(-15)}
              className="h-14 w-14 items-center justify-center rounded-full bg-surface-container"
            >
              <Icon name="skipb" size={24} />
            </Pressable>
            <Pressable
              onPress={togglePlay}
              disabled={!status.isLoaded}
              className="h-20 w-20 items-center justify-center rounded-full bg-primary"
              style={{ opacity: status.isLoaded ? 1 : 0.6 }}
            >
              <Icon name={playing ? 'pause' : 'play'} size={30} color={colors['on-primary']} />
            </Pressable>
            <Pressable
              onPress={() => skip(15)}
              className="h-14 w-14 items-center justify-center rounded-full bg-surface-container"
            >
              <Icon name="skipf" size={24} />
            </Pressable>
          </View>

          <Pressable
            onPress={markComplete}
            disabled={submitting || !signed}
            className="mt-6 rounded-full border border-outline-variant px-6 py-3"
            style={{ opacity: submitting || !signed ? 0.6 : 1 }}
          >
            <Text className="text-label-md font-semibold text-on-surface">
              {submitting ? 'Saving…' : "I'm done"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
