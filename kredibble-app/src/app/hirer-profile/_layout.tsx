import { Stack } from 'expo-router';

export default function HirerProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="company" />
      <Stack.Screen name="recruiter" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="postings" />
      <Stack.Screen name="channels" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="security" />
    </Stack>
  );
}
