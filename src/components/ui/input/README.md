# Input

Text input field with optional label and error message. Styled with rounded corners and theme-aware border colors.

## Props

`InputProps` extends React Native's `TextInputProps`:

| Prop        | Type             | Required | Default | Description                                                                 |
| ----------- | ---------------- | -------- | ------- | --------------------------------------------------------------------------- |
| `label`     | `string`         | No       | —       | Label text displayed above the input                                        |
| `error`     | `string`         | No       | —       | Error message displayed below; switches border to red                       |
| `className` | `string`         | No       | `''`    | Additional NativeWind classes for the TextInput                             |
| `...rest`   | `TextInputProps` | No       | —       | All React Native `TextInput` props (placeholder, value, onChangeText, etc.) |

## Usage

```tsx
import { Input } from '@/components/ui';

<Input label="Full Name" placeholder="Sarah Mitchell" />

<Input
  label="Email"
  placeholder="you@example.com"
  keyboardType="email-address"
  error="Invalid email address"
/>

<Input
  label="Age"
  placeholder="28"
  keyboardType="numeric"
/>
```
