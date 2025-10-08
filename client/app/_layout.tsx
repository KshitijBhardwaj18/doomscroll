import { Stack } from "expo-router";
import "./global.css";
import "@/polyfills.ts"

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="movies" options={{ headerShown: false }} />
    </Stack>
  );
}
