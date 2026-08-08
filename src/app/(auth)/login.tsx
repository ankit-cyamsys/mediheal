import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { Input, PrimaryButton, SocialButton, HeadlineMd, BodyMd, LabelSm } from '@/components/ui';
import { Icon } from '@/components/icon';
import { useAuthActions } from '@/hooks/use-auth-actions';
import { useThemeColors } from '@/hooks/use-theme';
import { signInWithGoogle } from '@/lib/social-auth';
import { humanizeError } from '@/lib/errors';
import { TERMS_URL } from '@/lib/constants';

const logo = require('../../../assets/akhand.png');

type Mode = 'signin' | 'signup';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  email?: string;
  password?: string;
  name?: string;
}

export default function LoginScreen() {
  const { signIn, signUp, continueAsGuest, loginSocial } = useAuthActions();
  const colors = useThemeColors();
  const [mode, setMode] = useState<Mode>('signin');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // shared form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);

  const run = async (fn: () => Promise<void>, context?: Parameters<typeof humanizeError>[1]) => {
    setBusy(true);
    setErr('');
    try {
      await fn();
      // Navigation handled by the auth gate once the token is set.
    } catch (e) {
      setErr(humanizeError(e, context));
    } finally {
      setBusy(false);
    }
  };

  /** Client-side checks so people get instant, readable feedback. */
  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(trimmedEmail)) next.email = 'Please enter a valid email address.';

    if (!password) next.password = 'Password is required.';
    else if (mode === 'signup' && password.length < 8)
      next.password = 'Password must be at least 8 characters.';

    return next;
  };

  const onSubmit = () => {
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    if (mode === 'signin') run(() => signIn(email.trim(), password), 'signin');
    else
      run(
        () => signUp({ email: email.trim(), password, name: name.trim() || undefined }),
        'signup',
      );
  };

  const onGoogle = () =>
    run(async () => {
      const idToken = await signInWithGoogle();
      if (!idToken) return; // user cancelled the account picker
      await loginSocial(idToken);
    }, 'social');

  const openTerms = () => WebBrowser.openBrowserAsync(TERMS_URL).catch(() => {});

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
            <View className="h-16 w-16 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-lowest">
              <Image source={logo} style={{ width: 52, height: 52 }} resizeMode="contain" />
            </View>
            <View className="flex-1">
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
                  setFieldErrors({});
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
              onChangeText={(t) => {
                setEmail(t);
                if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={fieldErrors.email}
            />
            <View>
              <Input
                label="Password"
                placeholder="8+ characters"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined }));
                }}
                secureTextEntry={!showPw}
                autoCapitalize="none"
                error={fieldErrors.password}
              />
              <Pressable
                onPress={() => setShowPw((v) => !v)}
                className="absolute right-4 top-10 p-1"
                hitSlop={8}
              >
                <Icon name={showPw ? 'eyeoff' : 'eye'} size={20} color={colors.outline} />
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

          {/* Social */}
          <View className="gap-3">
            <SocialButton provider="google" onPress={onGoogle}>
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
            <Icon name="user" size={22} color={colors.outline} />
            <View>
              <Text className="text-body-md font-semibold text-on-surface">Continue as Guest</Text>
              <Text className="text-label-md text-on-surface-variant">
                Progress won&apos;t be synced
              </Text>
            </View>
          </Pressable>

          <Text className="mt-6 text-center text-label-md text-on-surface-variant">
            By continuing you agree to our{' '}
            <Text className="font-semibold text-primary underline" onPress={openTerms}>
              Terms &amp; Privacy
            </Text>
            .
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
