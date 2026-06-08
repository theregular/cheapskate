import { ScreenSkeleton } from "@/components/screen-skeleton";

export default function SearchScreen() {
  return (
    <ScreenSkeleton
      title="Search"
      description="Look up products and compare available prices."
      placeholderTitle="Product search"
      placeholderDescription="Search controls and matching products will appear here."
    />
  );
}
