# Card

Container components for content sections. Includes a generic `Card` wrapper and two specialized variants.

## Components

### Card

Generic container with rounded border and surface background. Wrap any content inside it.

### MentorCard

Horizontal card displaying a mentor's avatar, name, specialty, and rating. Pressable.

### SessionCard

Vertical card with a cover image, optional badge, title, duration, and view count. Pressable.

## Props

### CardProps

| Prop        | Type              | Required | Default | Description                   |
| ----------- | ----------------- | -------- | ------- | ----------------------------- |
| `children`  | `React.ReactNode` | Yes      | —       | Card content                  |
| `className` | `string`          | No       | `''`    | Additional NativeWind classes |

### MentorCardProps

Extends `PressableProps`:

| Prop          | Type                  | Required | Description                 |
| ------------- | --------------------- | -------- | --------------------------- |
| `name`        | `string`              | Yes      | Mentor's display name       |
| `specialty`   | `string`              | Yes      | Mentor's area of expertise  |
| `rating`      | `string`              | Yes      | Rating value (e.g. `"4.9"`) |
| `reviews`     | `string`              | Yes      | Review count (e.g. `"120"`) |
| `imageSource` | `ImageSourcePropType` | Yes      | Avatar image source         |
| `...rest`     | `PressableProps`      | No       | All Pressable props         |

### SessionCardProps

Extends `PressableProps`:

| Prop          | Type                  | Required | Default | Description                                 |
| ------------- | --------------------- | -------- | ------- | ------------------------------------------- |
| `title`       | `string`              | Yes      | —       | Session title                               |
| `duration`    | `string`              | Yes      | —       | Duration text (e.g. `"15 min"`)             |
| `views`       | `string`              | Yes      | —       | View count (e.g. `"12.4k views"`)           |
| `imageSource` | `ImageSourcePropType` | Yes      | —       | Cover image source                          |
| `badge`       | `string`              | No       | —       | Optional badge label (e.g. `"Recommended"`) |
| `...rest`     | `PressableProps`      | No       | —       | All Pressable props                         |

## Usage

```tsx
import { Card, MentorCard, SessionCard, HeadlineMd } from '@/components/ui';

<Card>
  <HeadlineMd>Custom Content</HeadlineMd>
</Card>

<MentorCard
  name="Sarah Mitchell"
  specialty="Cognitive Specialist"
  rating="4.9"
  reviews="120"
  imageSource={{ uri: 'https://example.com/avatar.jpg' }}
  onPress={() => router.push('/mentor/1')}
/>

<SessionCard
  title="Mindful Dawn Session"
  duration="15 min"
  views="12.4k views"
  imageSource={require('@/assets/session.jpg')}
  badge="Recommended"
  onPress={() => router.push('/session/1')}
/>
```
