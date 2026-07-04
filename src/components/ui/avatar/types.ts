import { type ImageSourcePropType } from 'react-native';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
  source: ImageSourcePropType;
  size?: AvatarSize;
  className?: string;
};
