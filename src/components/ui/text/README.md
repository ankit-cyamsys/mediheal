# Text

Typography components that map to the design system's type scale. Each variant applies preset font size, weight, line height, and color.

## Variants

| Component    | Size | Weight   | Line Height | Default Color        |
| ------------ | ---- | -------- | ----------- | -------------------- |
| `HeadlineLg` | 32px | Bold     | 40px        | `primary`            |
| `HeadlineMd` | 24px | SemiBold | 32px        | `primary`            |
| `HeadlineSm` | 20px | SemiBold | 28px        | `primary`            |
| `BodyLg`     | 18px | Regular  | 28px        | `on-surface`         |
| `BodyMd`     | 16px | Regular  | 24px        | `on-surface`         |
| `LabelMd`    | 14px | SemiBold | 20px        | `on-surface-variant` |
| `LabelSm`    | 11px | Bold     | 16px        | `outline`            |

## Props

All variants share the same props — `TypographyProps`:

| Prop        | Type              | Required | Description                                      |
| ----------- | ----------------- | -------- | ------------------------------------------------ |
| `children`  | `React.ReactNode` | Yes      | Text content to render                           |
| `className` | `string`          | No       | Additional NativeWind classes to override styles |
| `...rest`   | `TextProps`       | No       | All React Native `Text` props are supported      |

## Usage

```tsx
import { HeadlineLg, BodyMd, LabelMd } from '@/components/ui';

<HeadlineLg>Page Title</HeadlineLg>
<BodyMd>Standard paragraph text for descriptions.</BodyMd>
<LabelMd className="text-secondary">ACTIVE SESSION</LabelMd>
```
