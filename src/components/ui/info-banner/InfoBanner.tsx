import { View } from 'react-native';
import { LabelMd } from '../text';
import { type InfoBannerProps } from './types';

export function InfoBanner({ message, className = '' }: InfoBannerProps) {
  return (
    <View className={`flex-row items-center gap-3 rounded-xl bg-primary-fixed/20 p-4 ${className}`}>
      <LabelMd className="text-primary">ℹ</LabelMd>
      <LabelMd className="flex-1 text-on-primary-fixed-variant">{message}</LabelMd>
    </View>
  );
}
