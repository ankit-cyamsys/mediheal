import { View, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/auth-store';
import { ThemeToggle } from '../theme-toggle';
import { LanguageSwitcher } from '../language-switcher';
import { HeadlineMd, LabelMd } from '../text';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { colors, darkColors } from '@/lib/theme';

type DrawerMenuProps = {
  visible: boolean;
  onClose: () => void;
};

function MenuItem({
  icon,
  label,
  onPress,
  iconColor,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  onPress: () => void;
  iconColor: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-xl px-4 py-3 active:bg-surface-container-high dark:active:bg-d-surface-container-high"
    >
      <MaterialIcons name={icon} size={22} color={iconColor} />
      <LabelMd className="text-[15px] text-on-surface dark:text-d-on-surface">{label}</LabelMd>
    </Pressable>
  );
}

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const { isDark } = useAppColorScheme();
  const isGuest = !token;

  const iconColor = isDark ? darkColors['on-surface'] : colors['on-surface'];

  const handleProfile = () => {
    onClose();
    router.push('/(tabs)/profile');
  };

  const handleLogin = () => {
    onClose();
    router.push('/auth/login');
  };

  const handleLogout = () => {
    onClose();
    logout();
    router.replace('/auth/login');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 flex-row" onPress={onClose}>
        {/* Drawer panel */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-72 bg-surface-container-lowest shadow-2xl dark:bg-d-surface-container"
          style={{ paddingTop: insets.top }}
        >
          {/* Header */}
          <View className="border-b border-outline-variant/20 px-6 py-5 dark:border-d-outline-variant/20">
            <HeadlineMd className="text-[20px]">Menu</HeadlineMd>
          </View>

          {/* Menu items */}
          <View className="flex-1 px-2 pt-4">
            <MenuItem icon="person" label="Profile" onPress={handleProfile} iconColor={iconColor} />

            {/* Language - inline switcher trigger */}
            <View className="flex-row items-center justify-between rounded-xl px-4 py-3">
              <View className="flex-row items-center gap-4">
                <MaterialIcons name="translate" size={22} color={iconColor} />
                <LabelMd className="text-[15px] text-on-surface dark:text-d-on-surface">
                  Language
                </LabelMd>
              </View>
              <LanguageSwitcher />
            </View>

            {/* Theme */}
            <View className="px-4 py-3">
              <View className="mb-3 flex-row items-center gap-4">
                <MaterialIcons name="palette" size={22} color={iconColor} />
                <LabelMd className="text-[15px] text-on-surface dark:text-d-on-surface">
                  Theme
                </LabelMd>
              </View>
              <ThemeToggle />
            </View>

            {/* Divider */}
            <View className="mx-4 my-2 h-px bg-outline-variant/30 dark:bg-d-outline-variant/30" />

            {isGuest && (
              <MenuItem
                icon="login"
                label="Login"
                onPress={handleLogin}
                iconColor={isDark ? darkColors.primary : colors['primary-container']}
              />
            )}

            <MenuItem icon="logout" label="Logout" onPress={handleLogout} iconColor={iconColor} />
          </View>
        </Pressable>

        {/* Scrim overlay */}
        <View className="flex-1 bg-black/40" />
      </Pressable>
    </Modal>
  );
}
