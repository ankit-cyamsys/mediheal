import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useThemeColors } from '@/hooks/use-theme';

export type IconName =
  | 'home'
  | 'compass'
  | 'moon'
  | 'chart'
  | 'user'
  | 'play'
  | 'pause'
  | 'back'
  | 'fwd'
  | 'skipf'
  | 'skipb'
  | 'bell'
  | 'flame'
  | 'clock'
  | 'heart'
  | 'sparkle'
  | 'leaf'
  | 'wind'
  | 'headphones'
  | 'settings'
  | 'check'
  | 'chevron'
  | 'close'
  | 'star'
  | 'download'
  | 'sun'
  | 'bookmark'
  | 'info'
  | 'eye'
  | 'eyeoff'
  | 'lock';

export interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  /** Icon color. Defaults to on-surface; pass white for gradient backgrounds. */
  color?: string;
}

/** Line-icon set ported from the web design (react-native-svg). */
export function Icon({ name, size = 24, stroke = 2, color }: IconProps) {
  const themeColors = useThemeColors();
  const resolved = color ?? themeColors['on-surface'];
  const s = {
    stroke: resolved,
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  const fill = { fill: resolved };

  const content = (() => {
    switch (name) {
      case 'home':
        return (
          <>
            <Path {...s} d="M3 10.5 12 3l9 7.5" />
            <Path {...s} d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
          </>
        );
      case 'compass':
        return (
          <>
            <Circle {...s} cx={12} cy={12} r={9} />
            <Path {...s} d="M15.5 8.5 13 13l-4.5 2.5L11 11z" />
          </>
        );
      case 'moon':
        return <Path {...s} d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />;
      case 'chart':
        return (
          <>
            <Path {...s} d="M4 19V5" />
            <Path {...s} d="M4 19h16" />
            <Path {...s} d="M8 16v-4" />
            <Path {...s} d="M12.5 16V8" />
            <Path {...s} d="M17 16v-6" />
          </>
        );
      case 'user':
        return (
          <>
            <Circle {...s} cx={12} cy={8} r={3.5} />
            <Path {...s} d="M5 20a7 7 0 0 1 14 0" />
          </>
        );
      case 'play':
        return <Path {...fill} d="M8 5.5v13l11-6.5z" />;
      case 'pause':
        return (
          <>
            <Rect {...fill} x={7} y={5.5} width={3.5} height={13} rx={1.2} />
            <Rect {...fill} x={13.5} y={5.5} width={3.5} height={13} rx={1.2} />
          </>
        );
      case 'back':
        return <Path {...s} d="M15 5l-7 7 7 7" />;
      case 'fwd':
        return <Path {...s} d="M9 5l7 7-7 7" />;
      case 'skipf':
        return (
          <>
            <Path {...fill} d="M6 5l8 7-8 7z" />
            <Rect {...fill} x={16} y={5} width={2.6} height={14} rx={1} />
          </>
        );
      case 'skipb':
        return (
          <>
            <Path {...fill} d="M18 5l-8 7 8 7z" />
            <Rect {...fill} x={5.4} y={5} width={2.6} height={14} rx={1} />
          </>
        );
      case 'bell':
        return (
          <>
            <Path {...s} d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
            <Path {...s} d="M10 19a2 2 0 0 0 4 0" />
          </>
        );
      case 'flame':
        return (
          <Path
            {...s}
            d="M12 3s5 3.5 5 9a5 5 0 0 1-10 0c0-1.5.6-2.7 1.4-3.6C8.3 9 9 8 9 6.5c1.5 1 2 2.5 2 2.5s.5-3 1-6z"
          />
        );
      case 'clock':
        return (
          <>
            <Circle {...s} cx={12} cy={12} r={9} />
            <Path {...s} d="M12 7v5l3 2" />
          </>
        );
      case 'heart':
        return (
          <Path
            {...s}
            d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7-2.7c0 4.9-7 9.7-7 9.7z"
          />
        );
      case 'sparkle':
        return <Path {...s} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />;
      case 'leaf':
        return (
          <>
            <Path {...s} d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13z" />
            <Path {...s} d="M5 19c3-5 6-7 10-9" />
          </>
        );
      case 'wind':
        return (
          <>
            <Path {...s} d="M3 9h11a3 3 0 1 0-3-3" />
            <Path {...s} d="M3 14h15a3 3 0 1 1-3 3" />
          </>
        );
      case 'headphones':
        return (
          <>
            <Path {...s} d="M4 13a8 8 0 0 1 16 0" />
            <Rect {...s} x={3} y={13} width={4} height={7} rx={1.6} />
            <Rect {...s} x={17} y={13} width={4} height={7} rx={1.6} />
          </>
        );
      case 'settings':
        return (
          <>
            <Circle {...s} cx={12} cy={12} r={3} />
            <Path
              {...s}
              d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2l-.3-2.5H10.7l-.3 2.5a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1c.6.5 1.3.9 2 1.2l.3 2.5h2.6l.3-2.5c.7-.3 1.4-.7 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"
            />
          </>
        );
      case 'check':
        return <Path {...s} d="M5 12.5l4.5 4.5L19 7" />;
      case 'chevron':
        return <Path {...s} d="M9 6l6 6-6 6" />;
      case 'close':
        return <Path {...s} d="M6 6l12 12M18 6 6 18" />;
      case 'star':
        return (
          <Path {...s} d="M12 4l2.3 5.6 6 .5-4.6 4 1.4 5.9L12 17l-5.1 3 1.4-5.9-4.6-4 6-.5z" />
        );
      case 'download':
        return (
          <>
            <Path {...s} d="M12 4v10" />
            <Path {...s} d="M8 11l4 4 4-4" />
            <Path {...s} d="M5 19h14" />
          </>
        );
      case 'sun':
        return (
          <>
            <Circle {...s} cx={12} cy={12} r={4} />
            <Path
              {...s}
              d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"
            />
          </>
        );
      case 'bookmark':
        return <Path {...s} d="M7 4h10v16l-5-3.5L7 20z" />;
      case 'info':
        return (
          <>
            <Circle {...s} cx={12} cy={12} r={9} />
            <Path {...s} d="M12 11v5M12 8h.01" />
          </>
        );
      case 'eye':
        return (
          <>
            <Path {...s} d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12z" />
            <Circle {...s} cx={12} cy={12} r={3} />
          </>
        );
      case 'eyeoff':
        return (
          <>
            <Path {...s} d="M3 3l18 18" />
            <Path
              {...s}
              d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6.2 0 10 7 10 7a16.3 16.3 0 0 1-3.3 3.7M6.5 7.6A15.6 15.6 0 0 0 2 13s3.8 7 10 7a9.4 9.4 0 0 0 4-.9"
            />
            <Path {...s} d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
          </>
        );
      case 'lock':
        return (
          <>
            <Rect {...s} x={5} y={11} width={14} height={9} rx={2} />
            <Path {...s} d="M8 11V8a4 4 0 0 1 8 0v3" />
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {content}
    </Svg>
  );
}
