import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/global.css";
import { NAV_THEME } from "@/lib/theme";

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const colorScheme = systemColorScheme === "dark" ? "dark" : "light";

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="scan"
            options={{
              animation: "slide_from_bottom",
              presentation: "modal",
            }}
          />
        </Stack>
        <PortalHost />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
