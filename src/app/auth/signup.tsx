import { View, ScrollView, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import { useSignupForm } from '@/hooks/use-signup-form';
import {
  HeadlineLg,
  BodyMd,
  LabelMd,
  Input,
  PasswordInput,
  Select,
  PrimaryButton,
  InfoBanner,
} from '@/components/ui';

const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export default function SignupScreen() {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useSignupForm();

  const onSubmit = handleSubmit((data) => {
    // TODO: implement signup API
    console.log(data);
    router.replace('/(tabs)');
  });

  return (
    <View className="flex-1 bg-surface dark:bg-d-surface">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-margin-mobile py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Icon */}
        <View className="mb-8 items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/20 dark:bg-d-primary/20">
            <Text className="text-[48px]">✏️</Text>
          </View>
        </View>

        {/* Header */}
        <View className="mb-12 items-center">
          <HeadlineLg className="text-center dark:text-d-on-surface">
            {t('auth.signupTitle')}
          </HeadlineLg>
          <BodyMd className="mt-3 text-center text-on-surface-variant dark:text-d-on-surface-variant">
            {t('auth.signupSubtitle')}
          </BodyMd>
        </View>

        {/* Form */}
        <View className="w-full max-w-md gap-6 self-center">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.name')}
                placeholder={t('auth.namePlaceholder')}
                autoCapitalize="words"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
              />
            )}
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="age"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.age')}
                    placeholder={t('auth.agePlaceholder')}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.age?.message}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <Select
                    label={t('auth.gender')}
                    placeholder={t('auth.genderPlaceholder')}
                    options={GENDER_OPTIONS}
                    value={value}
                    onValueChange={onChange}
                    error={errors.gender?.message}
                  />
                )}
              />
            </View>
          </View>

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
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label={t('auth.password')}
                placeholder={t('auth.passwordPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label={t('auth.confirmPassword')}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          {/* Privacy Card */}
          <InfoBanner message={t('auth.privacyMessage')} />

          {/* Sign Up Button */}
          <PrimaryButton onPress={onSubmit} loading={isSubmitting}>
            {t('common.signUp')}
          </PrimaryButton>

          {/* Footer */}
          <View className="items-center">
            <BodyMd className="text-on-surface-variant dark:text-d-on-surface-variant">
              {t('auth.hasAccount')}{' '}
              <Link href="/auth/login">
                <Text className="font-semibold text-secondary dark:text-d-secondary">
                  {t('common.signIn')}
                </Text>
              </Link>
            </BodyMd>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
