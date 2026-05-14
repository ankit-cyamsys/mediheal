import { Pressable, ActivityIndicator, Text } from 'react-native';
import { type ButtonProps, type SocialButtonProps } from './types';
import { styles } from './styles';

export function PrimaryButton({
  children,
  loading,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={`w-full items-center justify-center rounded-xl bg-primary-container px-6 py-4 opacity-100 active:opacity-90 dark:bg-d-primary-container ${disabled ? 'opacity-50' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={styles.primaryLoaderColor} />
      ) : (
        <Text className="text-body-md font-semibold text-white dark:text-d-on-primary-container">
          {children}
        </Text>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  children,
  loading,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={`w-full items-center justify-center rounded-xl border-2 border-secondary px-6 py-4 active:bg-secondary/5 dark:border-d-secondary ${disabled ? 'opacity-50' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={styles.secondaryLoaderColor} />
      ) : (
        <Text className="text-body-md font-semibold text-secondary dark:text-d-secondary">
          {children}
        </Text>
      )}
    </Pressable>
  );
}

export function SocialButton({ provider, children, className = '', ...props }: SocialButtonProps) {
  const isApple = provider === 'apple';
  return (
    <Pressable
      className={`w-full flex-row items-center justify-center gap-3 rounded-xl px-6 py-3 ${isApple ? 'bg-on-surface active:bg-on-surface/90 dark:bg-d-surface-container-highest' : 'border border-outline-variant bg-surface-container-lowest active:bg-surface-container-low dark:border-d-outline-variant dark:bg-d-surface-container'} ${className}`}
      {...props}
    >
      <Text
        className={`text-label-md font-semibold ${isApple ? 'text-white' : 'text-on-surface dark:text-d-on-surface'}`}
      >
        {children}
      </Text>
    </Pressable>
  );
}
