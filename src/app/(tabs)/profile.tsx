import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { HeadlineLg, HeadlineSm, BodyMd, LabelSm, Input, PrimaryButton } from '@/components/ui';
import { Icon, type IconName } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { ON_THUMB } from '@/lib/gradients';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { useSignOut } from '@/hooks/use-sign-out';
import { useTheme, useThemeColors } from '@/hooks/use-theme';
import { humanizeError } from '@/lib/errors';
import { TERMS_URL } from '@/lib/constants';
import type { ThemeMode } from '@/stores/theme-store';
import type { User } from '@/types';

function ListItem({
  icon,
  label,
  onPress,
  trailing,
  danger = false,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  danger?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-80"
    >
      <View
        className={`h-9 w-9 items-center justify-center rounded-full ${danger ? 'bg-error-container' : 'bg-surface-container-high'}`}
      >
        <Icon name={icon} size={18} color={danger ? colors['on-error-container'] : undefined} />
      </View>
      <Text className="flex-1 text-body-md font-semibold text-on-surface">{label}</Text>
      {trailing ?? <Icon name="chevron" size={18} color={colors.outline} />}
    </Pressable>
  );
}

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: IconName }[] = [
  { mode: 'light', label: 'Light', icon: 'sun' },
  { mode: 'dark', label: 'Dark', icon: 'moon' },
  { mode: 'system', label: 'Auto', icon: 'settings' },
];

/** Segmented Light / Dark / Auto appearance selector. */
function AppearanceToggle() {
  const { mode, setMode, scheme } = useTheme();
  const colors = useThemeColors();
  return (
    <View className="mt-4 rounded-2xl bg-surface-container p-4">
      <Text className="mb-3 text-label-md font-bold text-on-surface-variant">Appearance</Text>
      <View className="flex-row rounded-xl bg-surface-container-high p-1">
        {THEME_OPTIONS.map((opt) => {
          const active = mode === opt.mode;
          return (
            <Pressable
              key={opt.mode}
              onPress={() => setMode(opt.mode)}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg py-2.5 ${active ? 'bg-surface-container-lowest' : ''}`}
            >
              <Icon name={opt.icon} size={16} color={active ? colors.primary : colors.outline} />
              <Text
                className={`text-label-md font-semibold ${active ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text className="mt-2 text-label-sm text-on-surface-variant">
        {mode === 'system' ? `Following your device (${scheme}).` : `Always ${mode}.`}
      </Text>
    </View>
  );
}

const Divider = () => <View className="ml-16 h-px bg-outline-variant" />;

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const token = useAuthStore((s) => s.token);
  const tokenKind = useAuthStore((s) => s.tokenKind);
  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const signOut = useSignOut();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', timezone: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [saved, setSaved] = useState(false);

  const isGuest = tokenKind === 'guest';
  const displayName = user?.name || user?.email?.split('@')[0] || 'Friend';
  const initial = (user?.name || user?.email || 'F')[0]?.toUpperCase();

  const save = async () => {
    const body: { name?: string; timezone?: string } = {};
    if (form.name.trim()) body.name = form.name.trim();
    if (form.timezone.trim()) body.timezone = form.timezone.trim();
    if (!Object.keys(body).length) return;
    setSaving(true);
    setErr('');
    setSaved(false);
    try {
      const updated = await api<User>('PATCH', '/api/v1/auth/me', { token, body });
      setUser(updated);
      setSaved(true);
      setEditing(false);
      setForm({ name: '', timezone: '' });
    } catch (e) {
      setErr(humanizeError(e, 'profile'));
    } finally {
      setSaving(false);
    }
  };

  const openTerms = () => WebBrowser.openBrowserAsync(TERMS_URL).catch(() => {});

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
      >
        <LabelSm>Mediheal</LabelSm>
        <HeadlineLg className="mt-1">Profile</HeadlineLg>

        {/* Identity card */}
        <View className="mt-5 flex-row items-center gap-4 rounded-2xl bg-surface-container p-5">
          <Thumb grad="g-lilac" withOrbs={false} className="h-16 w-16 items-center justify-center">
            <Text style={{ color: ON_THUMB, fontWeight: '700', fontSize: 24 }}>{initial}</Text>
          </Thumb>
          <View className="flex-1">
            <BodyMd style={{ fontWeight: '700' }}>{displayName}</BodyMd>
            <Text className="text-label-md text-on-surface-variant">
              {isGuest ? 'Guest · progress not synced' : user?.email || 'Member'}
            </Text>
          </View>
          <Pressable
            onPress={() => setEditing((e) => !e)}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-high active:opacity-80"
          >
            <Icon name="settings" size={20} />
          </Pressable>
        </View>

        {/* Edit form */}
        {editing && (
          <View className="mt-4 rounded-2xl bg-surface-container p-5">
            <HeadlineSm className="mb-3">Edit profile</HeadlineSm>
            {err ? (
              <View className="mb-3 rounded-xl bg-error-container px-4 py-3">
                <Text className="text-label-md text-on-error-container">{err}</Text>
              </View>
            ) : null}
            <View className="gap-4">
              <Input
                label="Name"
                placeholder={user?.name || 'Your name'}
                value={form.name}
                onChangeText={(name) => setForm((f) => ({ ...f, name }))}
                autoCapitalize="words"
              />
              <Input
                label="Timezone"
                placeholder={user?.timezone || 'Asia/Kolkata'}
                value={form.timezone}
                onChangeText={(timezone) => setForm((f) => ({ ...f, timezone }))}
                autoCapitalize="none"
              />
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <PrimaryButton onPress={save} loading={saving}>
                    Save
                  </PrimaryButton>
                </View>
                <Pressable
                  onPress={() => setEditing(false)}
                  className="flex-1 items-center justify-center rounded-xl border border-outline-variant active:opacity-80"
                >
                  <Text className="text-body-md font-semibold text-on-surface">Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        {saved && !editing ? (
          <Text className="mt-3 text-label-md font-semibold text-primary">Saved.</Text>
        ) : null}

        {/* Appearance */}
        <AppearanceToggle />

        {/* Settings */}
        <View className="mt-4 overflow-hidden rounded-2xl bg-surface-container">
          <ListItem
            icon="bell"
            label="Daily reminder"
            trailing={<Text className="text-label-md font-bold text-on-surface-variant">—</Text>}
          />
        </View>

        <View className="mt-4 overflow-hidden rounded-2xl bg-surface-container">
          <ListItem icon="sparkle" label="Replay walkthrough" onPress={() => setOnboarded(false)} />
          <Divider />
          <ListItem icon="heart" label="Support Mediheal" onPress={() => router.push('/donate')} />
          <Divider />
          <ListItem icon="info" label="Terms & Conditions" onPress={openTerms} />
          <Divider />
          <ListItem
            icon="back"
            label={isGuest ? 'Exit guest mode' : 'Sign out'}
            onPress={signOut}
            danger
          />
        </View>

        <Text className="mt-6 text-center text-label-md text-on-surface-variant">
          Mediheal · v1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
