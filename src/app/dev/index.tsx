import { Redirect } from 'expo-router';
import { ScrollView, View, Platform } from 'react-native';
import {
  HeadlineLg,
  HeadlineMd,
  HeadlineSm,
  BodyLg,
  BodyMd,
  LabelMd,
  LabelSm,
  PrimaryButton,
  SecondaryButton,
  SocialButton,
  Input,
  Card,
  MentorCard,
  SessionCard,
  Avatar,
  Badge,
  InfoBanner,
  ProgressRing,
} from '@/components/ui';

const PLACEHOLDER_IMG = {
  uri: 'https://placehold.co/200x200/1E3F35/FFFFFF/png?text=MH',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-4 border-b border-outline-variant/30 pb-8">
      <LabelMd className="uppercase tracking-widest text-secondary">{title}</LabelMd>
      {children}
    </View>
  );
}

export default function DevShowcase() {
  if (!__DEV__) return <Redirect href="/" />;

  const noop = () =>
    Platform.OS === 'web'
      ? window.alert('Pressed')
      : require('react-native').Alert.alert('Pressed');

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerClassName="gap-8 px-margin-mobile py-8"
    >
      <HeadlineLg>Component Showcase</HeadlineLg>
      <BodyMd className="text-on-surface-variant">
        Dev-only screen. Hidden in production builds.
      </BodyMd>

      {/* Typography */}
      <Section title="Typography">
        <HeadlineLg>HeadlineLg — 32/700</HeadlineLg>
        <HeadlineMd>HeadlineMd — 24/600</HeadlineMd>
        <HeadlineSm>HeadlineSm — 20/600</HeadlineSm>
        <BodyLg>BodyLg — 18/400</BodyLg>
        <BodyMd>BodyMd — 16/400</BodyMd>
        <LabelMd>LabelMd — 14/600</LabelMd>
        <LabelSm>LabelSm — 11/700</LabelSm>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <PrimaryButton onPress={noop}>Primary Button</PrimaryButton>
        <PrimaryButton loading>Loading State</PrimaryButton>
        <PrimaryButton disabled>Disabled State</PrimaryButton>
        <SecondaryButton onPress={noop}>Secondary Outlined</SecondaryButton>
        <SocialButton provider="google" onPress={noop}>
          Sign in with Google
        </SocialButton>
        <SocialButton provider="apple" onPress={noop}>
          Sign in with Apple
        </SocialButton>
      </Section>

      {/* Inputs */}
      <Section title="Input Fields">
        <Input label="Full Name" placeholder="Sarah Mitchell" />
        <Input label="Email" placeholder="you@example.com" error="Invalid email address" />
        <Input label="Age" placeholder="28" keyboardType="numeric" />
      </Section>

      {/* Avatar */}
      <Section title="Avatar">
        <View className="flex-row items-center gap-4">
          <Avatar source={PLACEHOLDER_IMG} size="sm" />
          <Avatar source={PLACEHOLDER_IMG} size="md" />
          <Avatar source={PLACEHOLDER_IMG} size="lg" />
        </View>
      </Section>

      {/* Badge */}
      <Section title="Badge">
        <View className="flex-row gap-3">
          <Badge>Recommended</Badge>
          <Badge variant="error">Expired</Badge>
        </View>
      </Section>

      {/* Info Banner */}
      <Section title="Info Banner">
        <InfoBanner message="Your data is encrypted and used only to personalize your wellness journey." />
      </Section>

      {/* Progress Ring */}
      <Section title="Progress Ring">
        <View className="flex-row items-center justify-around">
          <ProgressRing progress={75} label="Focus" />
          <ProgressRing progress={42} size={100} strokeWidth={8} label="Calm" />
        </View>
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <Card>
          <HeadlineMd>Generic Card</HeadlineMd>
          <BodyMd className="mt-2">Any content can go inside a Card wrapper.</BodyMd>
        </Card>

        <MentorCard
          name="Sarah Mitchell"
          specialty="Cognitive Specialist"
          rating="4.9"
          reviews="120"
          imageSource={PLACEHOLDER_IMG}
          onPress={noop}
        />

        <SessionCard
          title="Mindful Dawn Session"
          duration="15 min"
          views="12.4k views"
          imageSource={PLACEHOLDER_IMG}
          badge="Recommended"
          onPress={noop}
        />

        <SessionCard
          title="Evening Wind Down"
          duration="20 min"
          views="8.2k views"
          imageSource={PLACEHOLDER_IMG}
          onPress={noop}
        />
      </Section>
    </ScrollView>
  );
}
