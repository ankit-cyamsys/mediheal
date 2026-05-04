# Avatar

Circular profile image with a themed border. Supports three preset sizes.

## Props

| Prop        | Type                       | Required | Default | Description                       |
| ----------- | -------------------------- | -------- | ------- | --------------------------------- |
| `source`    | `ImageSourcePropType`      | Yes      | —       | Image source (URI or require)     |
| `size`      | `'sm'` \| `'md'` \| `'lg'` | No       | `'md'`  | Preset size — 32px, 40px, or 64px |
| `className` | `string`                   | No       | `''`    | Additional NativeWind classes     |

## Sizes

| Size | Dimensions |
| ---- | ---------- |
| `sm` | 32 × 32    |
| `md` | 40 × 40    |
| `lg` | 64 × 64    |

## Usage

```tsx
import { Avatar } from '@/components/ui';

<Avatar source={{ uri: 'https://example.com/photo.jpg' }} />
<Avatar source={{ uri: 'https://example.com/photo.jpg' }} size="lg" />
<Avatar source={require('@/assets/profile.png')} size="sm" />
```
