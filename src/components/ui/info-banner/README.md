# InfoBanner

Informational callout banner with an icon and message. Used for tips, disclaimers, or contextual help.

## Props

| Prop        | Type     | Required | Default | Description                   |
| ----------- | -------- | -------- | ------- | ----------------------------- |
| `message`   | `string` | Yes      | —       | Banner message text           |
| `className` | `string` | No       | `''`    | Additional NativeWind classes |

## Usage

```tsx
import { InfoBanner } from '@/components/ui';

<InfoBanner message="Your data is encrypted and used only to personalize your wellness journey." />

<InfoBanner
  message="Sessions are saved offline for later access."
  className="mt-4"
/>
```
