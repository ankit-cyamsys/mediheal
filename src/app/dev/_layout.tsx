import { Redirect, Stack } from 'expo-router';

export default function DevLayout() {
  if (!__DEV__) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerTitle: 'Dev Showcase', headerBackTitle: 'Back' }} />;
}
