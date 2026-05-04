import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { HeadlineLg, LabelMd } from '../text';
import { type ProgressRingProps } from './types';
import { styles } from './styles';

export function ProgressRing({
  progress,
  size = 160,
  strokeWidth = 12,
  label,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <View className={`items-center justify-center ${className}`}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={styles.trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={styles.fillColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <View className="absolute items-center justify-center">
        <HeadlineLg>{progress}%</HeadlineLg>
        {label && <LabelMd>{label}</LabelMd>}
      </View>
    </View>
  );
}
