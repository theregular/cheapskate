import { ScreenSkeleton } from "@/components/screen-skeleton";
import { SupabaseSmokePanel } from "@/components/supabase-smoke-panel";

export default function HomeScreen() {
  return (
    <ScreenSkeleton
      title="Home"
      description="Your starting point for finding and tracking the best prices."
      placeholderTitle="Home overview"
      placeholderDescription="Your recent activity and personalized savings will appear here."
    >
      <SupabaseSmokePanel />
    </ScreenSkeleton>
  );
}
