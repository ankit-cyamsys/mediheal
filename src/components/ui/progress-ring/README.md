# ProgressRing

Circular SVG progress indicator with a percentage label and optional description. Used for stats and progress tracking.

## Props

| Prop          | Type     | Required | Default | Description                           |
| ------------- | -------- | -------- | ------- | ------------------------------------- |
| `progress`    | `number` | Yes      | —       | Progress value from 0 to 100          |
| `size`        | `number` | No       | `160`   | Diameter of the ring in pixels        |
| `strokeWidth` | `number` | No       | `12`    | Thickness of the ring stroke          |
| `label`       | `string` | No       | —       | Descriptive text below the percentage |
| `className`   | `string` | No       | `''`    | Additional NativeWind classes         |

## Usage

```tsx
import { ProgressRing } from '@/components/ui';

<ProgressRing progress={75} label="Focus" />

<ProgressRing progress={42} size={120} strokeWidth={8} label="Calm" />

<ProgressRing progress={100} className="mt-6" />
```
