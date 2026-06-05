import { SafeAreaView } from "react-native-safe-area-context";

import { SupabaseSmokePanel } from "@/components/supabase-smoke-panel";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <SupabaseSmokePanel />
    </SafeAreaView>
  );
}
