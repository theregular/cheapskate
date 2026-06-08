import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { House, Map, ScanLine, Search, UserRound, type LucideIcon } from "lucide-react-native";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { THEME } from "@/lib/theme";

type TabDefinition = {
  routeName: string;
  label: string;
  icon: LucideIcon;
};

const LEFT_TABS: TabDefinition[] = [
  { routeName: "index", label: "Home", icon: House },
  { routeName: "map", label: "Map", icon: Map },
];

const RIGHT_TABS: TabDefinition[] = [
  { routeName: "search", label: "Search", icon: Search },
  { routeName: "profile", label: "Profile", icon: UserRound },
];

export function MainTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const systemColorScheme = useColorScheme();
  const colorScheme = systemColorScheme === "dark" ? "dark" : "light";
  const inactiveColor = THEME[colorScheme].mutedForeground;

  const renderTab = ({ routeName, label, icon: Icon }: TabDefinition) => {
    const routeIndex = state.routes.findIndex((route) => route.name === routeName);
    if (routeIndex === -1) {
      return null;
    }

    const route = state.routes[routeIndex];
    const isFocused = state.index === routeIndex;
    const color = isFocused ? colors.primary : inactiveColor;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: "tabLongPress",
        target: route.key,
      });
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel ?? label}
        onLongPress={onLongPress}
        onPress={onPress}
        className="min-h-12 flex-1 items-center justify-center gap-1"
      >
        <Icon color={color} size={22} strokeWidth={isFocused ? 2.5 : 2} />
        <Text
          style={{ color, fontSize: 11, fontWeight: isFocused ? "600" : "400" }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      <View className="h-16 flex-row items-center">
        {LEFT_TABS.map(renderTab)}

        <View className="min-h-12 flex-1 items-center justify-end">
          <Pressable
            accessibilityHint="Opens the scanner screen"
            accessibilityLabel="Open Scan"
            accessibilityRole="button"
            onPress={() => router.push("/scan")}
            className="-mt-8 items-center gap-1"
          >
            <View
              className="h-16 w-16 items-center justify-center rounded-full bg-primary"
              style={{
                borderColor: colors.card,
                borderWidth: 4,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.18)",
              }}
            >
              <ScanLine color={colors.card} size={28} strokeWidth={2.25} />
            </View>
            <Text style={{ color: colors.text, fontSize: 11, fontWeight: "600" }}>Scan</Text>
          </Pressable>
        </View>

        {RIGHT_TABS.map(renderTab)}
      </View>
    </View>
  );
}
