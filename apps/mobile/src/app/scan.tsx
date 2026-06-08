import { router } from "expo-router";
import { ScanLine, X } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTheme } from "@react-navigation/native";

export default function ScanScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 gap-1">
            <Text variant="h2" className="border-b-0 pb-0">
              Scan
            </Text>
            <Text variant="muted">Scan a barcode to look up and compare product prices.</Text>
          </View>
          <Pressable
            accessibilityLabel="Close Scan"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-muted"
          >
            <X color={colors.text} size={22} />
          </Pressable>
        </View>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Barcode scanner</CardTitle>
            <CardDescription>Camera scanning will be added here in a future step.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 items-center justify-center">
            <View className="h-44 w-44 items-center justify-center rounded-3xl bg-muted">
              <ScanLine color={colors.text} size={64} strokeWidth={1.5} />
            </View>
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}
