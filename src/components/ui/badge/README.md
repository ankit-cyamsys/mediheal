# Badge

Small pill-shaped label for tags, statuses, or categories.

## Props

| Prop        | Type                     | Required | Default     | Description                   |
| ----------- | ------------------------ | -------- | ----------- | ----------------------------- |
| `children`  | `string`                 | Yes      | —           | Badge label text              |
| `variant`   | `'default'` \| `'error'` | No       | `'default'` | Color scheme — pink or red    |
| `className` | `string`                 | No       | `''`        | Additional NativeWind classes |

## Variants

| Variant   | Background            | Text Color               |
| --------- | --------------------- | ------------------------ |
| `default` | `secondary-container` | `on-secondary-container` |
| `error`   | `error-container`     | `on-error-container`     |

## Usage

```tsx
import { Badge } from '@/components/ui';

<Badge>Recommended</Badge>
<Badge variant="error">Expired</Badge>
```
