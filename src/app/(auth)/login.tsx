import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, PrimaryButton, SocialButton, HeadlineMd, BodyMd, LabelSm } from '@/components/ui';
import { Icon } from '@/components/icon';
import { Thumb } from '@/components/thumb';
import { ON_THUMB } from '@/lib/gradients';
import { useAuthActions } from '@/hooks/use-auth-actions';

type Mode = 'signin' | 'signup';

export default function LoginScreen() {
  const { signIn, signUp, continueAsGuest } = useAuthActions();
  const [mode, setMode] = useState<Mode>('signin');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // shared form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setErr('');
    try {
      await fn();
      // Navigation handled by the auth gate once the token is set.
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = () => {
    if (mode === 'signin') run(() => signIn(email, password));
    else run(() => signUp({ email, password, name: name || undefined }));
  };

  const socialSoon = (provider: string) =>
    Alert.alert('Coming soon', `${provider} sign-in will be available soon.`);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand */}
          <View className="mb-8 flex-row items-center gap-4">
            <Thumb
              grad="g-lilac"
              withOrbs={false}
              className="h-16 w-16 items-center justify-center"
            >
              <Icon name="leaf" size={32} stroke={1.7} color={ON_THUMB} />
            </Thumb>
            <View>
              <HeadlineMd>Mediheal</HeadlineMd>
              <BodyMd className="mt-1 text-on-surface-variant">
                A calmer mind, a few minutes a day.
              </BodyMd>
            </View>
          </View>

          {/* Segmented control */}
          <View className="mb-6 flex-row rounded-2xl bg-surface-container p-1">
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <Pressable
                key={m}
                onPress={() => {
                  setMode(m);
                  setErr('');
                }}
                className={`flex-1 items-center rounded-xl py-2.5 ${mode === m ? 'bg-surface-container-lowest' : ''}`}
              >
                <Text
                  className={`text-label-md font-semibold ${mode === m ? 'text-primary' : 'text-on-surface-variant'}`}
                >
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              </Pressable>
            ))}
          </View>

          {err ? (
            <View className="mb-4 rounded-xl bg-error-container px-4 py-3">
              <Text className="text-label-md text-on-error-container">{err}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="gap-4">
            {mode === 'signup' && (
              <Input
                label="Name"
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <View>
              <Input
                label="Password"
                placeholder="8+ characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPw((v) => !v)}
                className="absolute right-4 top-10 p-1"
                hitSlop={8}
              >
                <Icon name={showPw ? 'eyeoff' : 'eye'} size={20} color="#717975" />
              </Pressable>
            </View>

            <PrimaryButton onPress={onSubmit} loading={busy} className="mt-1">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </PrimaryButton>
          </View>

          {/* Divider */}
          <View className="my-6 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-outline-variant" />
            <LabelSm>or</LabelSm>
            <View className="h-px flex-1 bg-outline-variant" />
          </View>

          {/* Social (deferred) */}
          <View className="gap-3">
            <SocialButton provider="google" onPress={() => socialSoon('Google')}>
              Continue with Google
            </SocialButton>
            <SocialButton provider="apple" onPress={() => socialSoon('Apple')}>
              Sign in with Apple
            </SocialButton>
          </View>

          {/* Guest */}
          <Pressable
            onPress={() => run(continueAsGuest)}
            disabled={busy}
            className="mt-6 flex-row items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-4 active:opacity-80"
          >
            <Icon name="user" size={22} color="#717975" />
            <View>
              <Text className="text-body-md font-semibold text-on-surface">Continue as Guest</Text>
              <Text className="text-label-md text-on-surface-variant">
                Progress won&apos;t be synced
              </Text>
            </View>
          </Pressable>

          <Text className="mt-6 text-center text-label-md text-on-surface-variant">
            By continuing you agree to our Terms &amp; Privacy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
