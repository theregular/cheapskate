import { router } from "expo-router";
import { SafeAreaView, View } from "react-native";
import { useSession } from "~/components/auth/SessionContext";
import { useAuth } from "~/components/auth/useAuth";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Login() {
  const { signIn, session } = useSession();

  async function handleLogin() {
    // const response = await fetch("http://localhost:8123/auth/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ username: "admin", password: "password" }),
    // });
    // if (response.ok) {
    //   const data = await response.json();
    //   // await login(data.token); // Assuming login function accepts a token
    //   router.replace("/");
    // } else {
    //   console.error("Login failed");
    // }
    signIn();
    router.replace("/");
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Button onPress={handleLogin}>
        <Text>Login</Text>
      </Button>
      <Text>{session}</Text>
    </SafeAreaView>
  );
}
