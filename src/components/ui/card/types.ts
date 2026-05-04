import { type PressableProps, type ImageSourcePropType } from 'react-native';

export type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export type MentorCardProps = PressableProps & {
  name: string;
  specialty: string;
  rating: string;
  reviews: string;
  imageSource: ImageSourcePropType;
};

export type SessionCardProps = PressableProps & {
  title: string;
  duration: string;
  views: string;
  imageSource: ImageSourcePropType;
  badge?: string;
};
