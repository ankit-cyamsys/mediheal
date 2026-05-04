import { View, Image, Pressable } from 'react-native';
import { HeadlineSm, LabelMd, BodyMd } from '../text';
import { Badge } from '../badge';
import { type CardProps, type MentorCardProps, type SessionCardProps } from './types';

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 ${className}`}
    >
      {children}
    </View>
  );
}

export function MentorCard({
  name,
  specialty,
  rating,
  reviews,
  imageSource,
  ...props
}: MentorCardProps) {
  return (
    <Pressable
      className="flex-row items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6"
      {...props}
    >
      <Image source={imageSource} className="h-16 w-16 rounded-full" />
      <View className="flex-1">
        <HeadlineSm className="text-[18px]">{name}</HeadlineSm>
        <LabelMd>{specialty}</LabelMd>
        <LabelMd className="mt-1 text-secondary">
          ★ {rating} ({reviews} reviews)
        </LabelMd>
      </View>
    </Pressable>
  );
}

export function SessionCard({
  title,
  duration,
  views,
  imageSource,
  badge,
  ...props
}: SessionCardProps) {
  return (
    <Pressable
      className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest"
      {...props}
    >
      <View className="relative h-32 w-full">
        <Image source={imageSource} className="h-full w-full" resizeMode="cover" />
        {badge && (
          <View className="absolute left-3 top-3">
            <Badge>{badge}</Badge>
          </View>
        )}
      </View>
      <View className="p-4">
        <HeadlineSm className="text-[18px]">{title}</HeadlineSm>
        <View className="mt-3 flex-row items-center justify-between">
          <BodyMd className="text-on-surface-variant">⏱ {duration}</BodyMd>
          <BodyMd className="text-on-surface-variant">👁 {views}</BodyMd>
        </View>
      </View>
    </Pressable>
  );
}
