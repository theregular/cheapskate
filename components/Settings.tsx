import { Pressable, View } from "react-native";
import { Settings } from "lucide-react-native";

export function ToggleSettings() {
  function toggleSettings() {
    alert("Settings toggled!");
  }

  return (
    <Pressable
      onPress={toggleSettings}
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 active:opacity-70"
    >
      <View className="flex-1 aspect-square pt-0.5 justify-center items-start web:px-5">
        <Settings />
      </View>
    </Pressable>
  );
}
