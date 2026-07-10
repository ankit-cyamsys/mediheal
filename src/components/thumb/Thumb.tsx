import { View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENT_STOPS, type GradientKey } from '@/lib/gradients';

export interface ThumbProps extends ViewProps {
  grad?: GradientKey;
  /** Show the two decorative translucent orbs (web parity). */
  withOrbs?: boolean;
  children?: React.ReactNode;
}

/** Gradient art tile used everywhere for thumbnails, avatars and hero cards. */
export function Thumb({
  grad = 'g-lilac',
  withOrbs = true,
  children,
  style,
  className,
  ...rest
}: ThumbProps) {
  return (
    <View className={`overflow-hidden rounded-2xl ${className ?? ''}`} style={style} {...rest}>
      <LinearGradient
        colors={GRADIENT_STOPS[grad] as unknown as [string, string, string]}
        locations={[0, 0.65, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {withOrbs && (
        <>
          <View
            style={{
              position: 'absolute',
              top: -30,
              right: -20,
              width: 110,
              height: 110,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.18)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -40,
              left: -24,
              width: 90,
              height: 90,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.12)',
            }}
          />
        </>
      )}
      {children}
    </View>
  );
}
