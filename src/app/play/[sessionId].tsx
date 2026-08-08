import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import Svg, { Circle } from 'react-native-svg';
import { Icon } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { gradForKey } from '@/lib/gradients';
import { useThemeColors } from '@/hooks/use-theme';
import { api } from '@/services/api';
import { fetchPlayback } from '@/hooks/use-programs';
import { useAuthStore } from '@/stores/auth-store';
import type { PlaybackInfo } from '@/types';

// Play/pause button + the progress ring hugging it.
const BTN = 96;
const RING = 140;
const RING_STROKE = 8;
const RING_R = (RING - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;
// Outer breathing halo diameter.
const BREATH = 272;

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

  // Local-first download so we can show a real download % and play offline.
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [dlPct, setDlPct] = useState(0);
  const [dlFailed, setDlFailed] = useState(false);

  // Play the downloaded file; fall back to streaming the remote URL if the
  // download failed for any reason.
  const source = localUri ?? (dlFailed ? (signed?.url ?? null) : null);
  const player = useAudioPlayer(source, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);

  const playing = status.playing;
  const elapsed = status.currentTime || 0;
  const total = status.duration || (signed?.duration ? signed.duration * 60 : 0);
  const downloading = !localUri && !dlFailed;
  const playProg = total ? Math.min(1, elapsed / total) : 0;
  // The ring shows the download while fetching, then the playback position.
  const ringProg = downloading ? dlPct : playProg;

  // Keep audio playing with the screen off / app backgrounded (the reported bug).
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true }).catch(() => {});
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

  // 2) Download the audio to cache with progress (drives the ring %).
  useEffect(() => {
    if (!signed?.url) return;
    let cancelled = false;
    setLocalUri(null);
    setDlPct(0);
    setDlFailed(false);

    const path = `${FileSystem.cacheDirectory}mh-${sessionId}-${signed.duration ?? 'x'}.mp3`;
    (async () => {
      try {
        const info = await FileSystem.getInfoAsync(path);
        if (info.exists && info.size > 0) {
          if (!cancelled) {
            setDlPct(1);
            setLocalUri(path);
          }
          return;
        }
        const task = FileSystem.createDownloadResumable(signed.url, path, {}, (p) => {
          if (cancelled) return;
          const pct =
            p.totalBytesExpectedToWrite > 0 ? p.totalBytesWritten / p.totalBytesExpectedToWrite : 0;
          setDlPct(pct);
        });
        const res = await task.downloadAsync();
        if (!cancelled && res?.uri) {
          setDlPct(1);
          setLocalUri(res.uri);
        }
      } catch {
        // Fall back to streaming the remote URL directly.
        if (!cancelled) setDlFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [signed?.url, signed?.duration, sessionId]);

  // 3) Auto-play once loaded.
  useEffect(() => {
    if (status.isLoaded && !playing && elapsed === 0 && !submitted.current) {
      player.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.isLoaded]);

  // 4) Complete when the track finishes.
  useEffect(() => {
    if (status.didJustFinish) markComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.didJustFinish]);

  // 5) Breathing cycle while playing.
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

  // Breathing halo scale driven by phase.
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const to = playing ? (phase === 'exhale' ? 0.86 : 1.14) : 1;
    Animated.timing(scale, {
      toValue: to,
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
  const statusLabel = downloading
    ? `Downloading ${Math.round(dlPct * 100)}%`
    : !status.isLoaded
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
          {/* Breathing halo + progress ring + play/pause */}
          <View
            style={{
              width: BREATH,
              height: BREATH,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                width: BREATH,
                height: BREATH,
                borderRadius: 999,
                backgroundColor: colors.primary,
                opacity: 0.06,
                transform: [{ scale }],
              }}
            />
            <Animated.View
              style={{
                position: 'absolute',
                width: BREATH * 0.7,
                height: BREATH * 0.7,
                borderRadius: 999,
                backgroundColor: colors.primary,
                opacity: 0.1,
                transform: [{ scale }],
              }}
            />

            {/* Progress ring hugging the button (download %, then playback) */}
            <Svg
              width={RING}
              height={RING}
              style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
            >
              <Circle
                cx={RING / 2}
                cy={RING / 2}
                r={RING_R}
                stroke={colors['surface-variant']}
                strokeWidth={RING_STROKE}
                fill="none"
              />
              <Circle
                cx={RING / 2}
                cy={RING / 2}
                r={RING_R}
                stroke={colors.primary}
                strokeWidth={RING_STROKE}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={RING_CIRC}
                strokeDashoffset={RING_CIRC * (1 - ringProg)}
              />
            </Svg>

            <Pressable
              onPress={togglePlay}
              disabled={!status.isLoaded}
              style={{
                width: BTN,
                height: BTN,
                borderRadius: 999,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: status.isLoaded ? 1 : 0.55,
              }}
            >
              <Icon name={playing ? 'pause' : 'play'} size={34} color={colors['on-primary']} />
            </Pressable>
          </View>

          {/* Status / breath cue */}
          <Text className="mt-7 text-body-lg font-bold text-on-surface">{statusLabel}</Text>

          {/* Scrubber */}
          <View style={{ width: '100%', maxWidth: 320, marginTop: 20 }}>
            <View className="h-1.5 overflow-hidden rounded-full bg-surface-variant">
              <View
                className="h-full rounded-full bg-primary"
                style={{ width: `${playProg * 100}%` }}
              />
            </View>
            <View className="mt-2 flex-row items-center justify-between">
              <Text className="text-label-md text-on-surface-variant">{fmtClock(elapsed)}</Text>
              <Text className="text-label-md text-on-surface-variant">{fmtClock(total)}</Text>
            </View>
          </View>

          {err && (
            <View className="mt-4 rounded-xl bg-error-container px-4 py-2">
              <Text className="text-label-md text-on-error-container">{err}</Text>
            </View>
          )}

          <Pressable
            onPress={markComplete}
            disabled={submitting || !signed}
            className="mt-8 rounded-full border border-outline-variant px-6 py-3"
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
