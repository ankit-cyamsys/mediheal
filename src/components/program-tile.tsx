import { Pressable, Text, type DimensionValue } from 'react-native';
import { Thumb } from '@/components/thumb';
import { gradForKey, ON_THUMB } from '@/lib/gradients';
import { localized } from '@/lib/localized';
import type { ProgramSummary } from '@/types';

interface ProgramTileProps {
  program: ProgramSummary;
  onPress: () => void;
  height?: number;
  width?: DimensionValue;
}

/** Gradient program thumbnail with title + kind/session meta (Home & Explore grids). */
export function ProgramTile({ program, onPress, height = 150, width = '100%' }: ProgramTileProps) {
  return (
    <Pressable onPress={onPress} style={{ width }}>
      <Thumb
        grad={gradForKey(program.slug || program.id)}
        style={{ height }}
        className="justify-end p-4"
      >
        <Text style={{ color: ON_THUMB, fontWeight: '700', fontSize: 17 }} numberOfLines={2}>
          {localized(program.title)}
        </Text>
        <Text style={{ color: ON_THUMB, opacity: 0.85, fontSize: 12.5, marginTop: 2 }}>
          {program.kind} · {program.total_sessions} sessions
        </Text>
      </Thumb>
    </Pressable>
  );
}
