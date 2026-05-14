import { View, Image } from 'react-native';
import { type AvatarProps } from './types';
import { sizeClasses } from './styles';

export function Avatar({ source, size = 'md', className = '' }: AvatarProps) {
  return (
    <View
      className={`overflow-hidden rounded-full border-2 border-primary-fixed dark:border-d-primary ${sizeClasses[size]} ${className}`}
    >
      <Image source={source} className="h-full w-full" resizeMode="cover" />
    </View>
  );
}
