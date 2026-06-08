import { ScreenSkeleton } from "@/components/screen-skeleton";

export default function MapScreen() {
  return (
    <ScreenSkeleton
      title="Map"
      description="Explore nearby stores and compare prices around you."
      placeholderTitle="Nearby deals"
      placeholderDescription="A map of stores, prices, and local offers will appear here."
    />
  );
}
