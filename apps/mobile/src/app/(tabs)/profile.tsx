import { ScreenSkeleton } from "@/components/screen-skeleton";

export default function ProfileScreen() {
  return (
    <ScreenSkeleton
      title="Profile"
      description="Manage your account, preferences, and saved activity."
      placeholderTitle="Your account"
      placeholderDescription="Profile details and application settings will appear here."
    />
  );
}
