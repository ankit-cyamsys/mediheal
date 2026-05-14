import { View, ScrollView, Pressable, Text } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import { useLoginForm } from '@/hooks/use-login-form';
import {
  HeadlineLg,
  BodyMd,
  LabelMd,
  PrimaryButton,
  SocialButton,
  Input,
  PasswordInput,
  Divider,
} from '@/components/ui';

export default function LoginScreen() {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useLoginForm();

  const onSubmit = handleSubmit((data) => {
    // TODO: implement auth logic
    console.log(data);
  });

  return (
    <View className="flex-1 bg-surface dark:bg-d-surface">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-margin-mobile py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Login Card */}
        <View className="w-full max-w-md self-center rounded-xl border border-surface-variant/30 bg-surface-container-lowest p-8 shadow-sm dark:border-d-outline-variant/20 dark:bg-d-surface-container">
          {/* Header */}
          <View className="mb-8 items-center">
            <HeadlineLg className="dark:text-d-on-surface">{t('auth.loginTitle')}</HeadlineLg>
            <BodyMd className="mt-2 text-on-surface-variant dark:text-d-on-surface-variant">
              {t('auth.loginSubtitle')}
            </BodyMd>
          </View>

          {/* Form */}
          <View className="gap-6">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.email')}
                  placeholder={t('auth.emailPlaceholder')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                  className="dark:border-d-outline-variant/20 dark:bg-d-surface dark:text-d-on-surface"
                />
              )}
            />

            <View className="gap-2">
              <View className="flex-row items-center justify-between px-1">
                <LabelMd className="dark:text-d-on-surface-variant">{t('auth.password')}</LabelMd>
                <Pressable hitSlop={8}>
                  <Text className="text-label-md font-semibold text-secondary dark:text-d-primary">
                    {t('auth.forgotPassword')}
                  </Text>
                </Pressable>
              </View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordInput
                    placeholder={t('auth.passwordPlaceholder')}
                    autoComplete="password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                    className="dark:border-d-outline-variant/20 dark:bg-d-surface dark:text-d-on-surface"
                  />
                )}
              />
            </View>

            <PrimaryButton
              onPress={onSubmit}
              loading={isSubmitting}
              className="dark:bg-d-primary-container"
            >
              {t('common.signIn')}
            </PrimaryButton>
          </View>

          {/* Divider */}
          <Divider label={t('common.orContinueWith')} className="my-8" />

          {/* Social Logins */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <SocialButton
                provider="google"
                onPress={() => {}}
                className="dark:border-d-outline-variant/20"
              >
                {t('common.signInWithGoogle')}
              </SocialButton>
            </View>
            <View className="flex-1">
              <SocialButton
                provider="apple"
                onPress={() => {}}
                className="dark:border-d-outline-variant/20"
              >
                {t('common.signInWithApple')}
              </SocialButton>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-10 items-center gap-4">
            <BodyMd className="text-on-surface-variant dark:text-d-on-surface-variant">
              {t('auth.noAccount')}{' '}
              <Text className="font-semibold text-secondary dark:text-d-secondary">
                {t('auth.createAccount')}
              </Text>
            </BodyMd>
            <Link href="/(tabs)">
              <Text className="text-label-md font-semibold text-outline dark:text-d-outline">
                {t('common.continueAsGuest')}
              </Text>
            </Link>
          </View>
        </View>

        {/* Accessibility Note */}
        <View className="mt-8 items-center opacity-60">
          <LabelMd className="text-center text-[12px] dark:text-d-on-surface-variant">
            {t('auth.accessibilityNote')}
          </LabelMd>
        </View>
      </ScrollView>
    </View>
  );
}
