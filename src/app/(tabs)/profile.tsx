import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadlineLg, BodyMd, LabelSm } from '@/components/ui';
import { Icon } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { ON_THUMB } from '@/lib/gradients';
import { useAuthStore } from '@/stores/auth-store';
import { useSignOut } from '@/hooks/use-sign-out';

// NOTE: placeholder Profile with working sign-out — full settings ported in the screens pass.
export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const tokenKind = useAuthStore((s) => s.tokenKind);
  const signOut = useSignOut();
  const isGuest = tokenKind === 'guest';
  const displayName = user?.name || user?.email?.split('@')[0] || 'Friend';
  const initial = (user?.name || user?.email || 'F')[0]?.toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-6 pt-4">
        <LabelSm>Mediheal</LabelSm>
        <HeadlineLg className="mt-1">Profile</HeadlineLg>

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
        </View>

        <Pressable
          onPress={signOut}
          className="mt-6 flex-row items-center gap-3 rounded-2xl bg-surface-container p-4 active:opacity-80"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-error-container">
            <Icon name="back" size={18} color="#93000A" />
          </View>
          <Text className="flex-1 text-body-md font-semibold text-on-surface">
            {isGuest ? 'Exit guest mode' : 'Sign out'}
          </Text>
          <Icon name="chevron" size={18} color="#717975" />
        </Pressable>

        <Text className="mt-6 text-center text-label-md text-on-surface-variant">
          Mediheal · v1.0
        </Text>
      </View>
    </SafeAreaView>
  );
}
