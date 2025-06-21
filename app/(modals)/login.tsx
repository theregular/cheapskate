// app/+login.tsx
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";
import { useForm, Controller } from "react-hook-form";

type LoginFormValues = {
  username: string;
  password: string;
};

export default function LoginModal() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<LoginFormValues>();

  const onSubmit = (data: LoginFormValues) => {
    console.log("Login data:", data);
    router.dismissTo("/profile-example");
  };

  return (
    <View className="items-center p-3">
      <Text className="text-lg font-bold">Sign In</Text>
      <Card className="w-4/5 p-5 m-10">
        <View className="flex flex-col gap-3 p-3 pb-5">
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="password"
                value={value}
                secureTextEntry
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </View>
        <View className="items-center">
          <Button className="w-1/2" onPress={handleSubmit(onSubmit)}>
            <Text>Sign In</Text>
          </Button>
        </View>
      </Card>
    </View>
  );
}
