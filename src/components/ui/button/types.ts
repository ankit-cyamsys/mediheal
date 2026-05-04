import { type PressableProps } from 'react-native';

export type ButtonProps = PressableProps & {
  children: string;
  loading?: boolean;
};

export type SocialButtonProps = PressableProps & {
  provider: 'google' | 'apple';
  children: string;
};
