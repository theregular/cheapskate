import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";

type ScreenSkeletonProps = {
  title: string;
  description: string;
  placeholderTitle: string;
  placeholderDescription: string;
  children?: ReactNode;
};

export function ScreenSkeleton({
  title,
  description,
  placeholderTitle,
  placeholderDescription,
  children,
}: ScreenSkeletonProps) {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-6 p-4 pb-8"
    >
      <View className="gap-2 pt-2">
        <Text variant="h2" className="border-b-0 pb-0">
          {title}
        </Text>
        <Text variant="muted">{description}</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>{placeholderTitle}</CardTitle>
          <CardDescription>{placeholderDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <View className="h-24 rounded-lg bg-muted" />
        </CardContent>
      </Card>

      {children}
    </ScrollView>
  );
}
