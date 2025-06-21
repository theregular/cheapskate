import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
  const router = useRouter();
  return (
    <View className="p-3 items-center">
      <Text>Profile</Text>
      <Button className="w-1/2" onPress={() => router.navigate("/login")}>
        <Text>Sign In</Text>
      </Button>
    </View>
  );
}
