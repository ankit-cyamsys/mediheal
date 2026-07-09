import { useEffect, useState } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { HeadlineSm } from '@/components/ui';
import { Icon } from '@/components/icon';
import { colors } from '@/lib/theme';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth-store';

// Last-ditch fallback if the backend is unreachable — keeps the donate path working.
const FALLBACK_URL = 'https://pages.razorpay.com/pl_RZNuhmig9UnpPx/view';

export default function DonateScreen() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [url, setUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    api<{ url?: string }>('GET', '/api/v1/donate/url', { token })
      .then((res) => active && setUrl(res?.url || FALLBACK_URL))
      .catch(() => active && setUrl(FALLBACK_URL));
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center justify-between border-b border-outline-variant px-5 py-4">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface-container"
        >
          <Icon name="back" size={20} />
        </Pressable>
        <View className="flex-row items-center gap-2">
          <Icon name="heart" size={18} color={colors.primary} />
          <HeadlineSm>Support Mediheal</HeadlineSm>
        </View>
        <View className="w-10" />
      </View>

      <View className="flex-1">
        {url && (
          <WebView
            source={{ uri: url }}
            onLoadEnd={() => setLoaded(true)}
            style={{ flex: 1, backgroundColor: '#fff' }}
          />
        )}
        {!loaded && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
