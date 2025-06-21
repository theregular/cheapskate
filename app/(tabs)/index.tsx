import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { fakeUser } from "~/lib/fakeData";

export default function TabTwoScreen() {
  return (
    <View>
      <Text>Welcome Home</Text>
      <Text>Fake User: {fakeUser.name}</Text>
    </View>
  );
}
