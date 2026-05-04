# Button

Action buttons in three styles: filled primary, outlined secondary, and social login.

## Components

### PrimaryButton

Filled button with `primary` background. Used for main CTAs.

### SecondaryButton

Outlined button with `secondary` border. Used for secondary actions.

### SocialButton

Social login button styled for Google (light) or Apple (dark).

## Props

### ButtonProps (PrimaryButton, SecondaryButton)

| Prop        | Type             | Required | Default | Description                              |
| ----------- | ---------------- | -------- | ------- | ---------------------------------------- |
| `children`  | `string`         | Yes      | —       | Button label text                        |
| `loading`   | `boolean`        | No       | `false` | Shows a spinner and disables the button  |
| `disabled`  | `boolean`        | No       | `false` | Reduces opacity and disables interaction |
| `className` | `string`         | No       | `''`    | Additional NativeWind classes            |
| `...rest`   | `PressableProps` | No       | —       | All React Native `Pressable` props       |

### SocialButtonProps (SocialButton)

| Prop        | Type                    | Required | Description                                     |
| ----------- | ----------------------- | -------- | ----------------------------------------------- |
| `provider`  | `'google'` \| `'apple'` | Yes      | Determines light (Google) or dark (Apple) style |
| `children`  | `string`                | Yes      | Button label text                               |
| `className` | `string`                | No       | Additional NativeWind classes                   |
| `...rest`   | `PressableProps`        | No       | All React Native `Pressable` props              |

## Usage

```tsx
import { PrimaryButton, SecondaryButton, SocialButton } from '@/components/ui';

<PrimaryButton onPress={handleSubmit}>Get Started</PrimaryButton>
<PrimaryButton loading>Submitting...</PrimaryButton>

<SecondaryButton onPress={handleCancel}>Cancel</SecondaryButton>

<SocialButton provider="google" onPress={handleGoogle}>Sign in with Google</SocialButton>
<SocialButton provider="apple" onPress={handleApple}>Sign in with Apple</SocialButton>
```
