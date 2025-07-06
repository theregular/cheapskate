import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { fakeUser } from "~/lib/fakeData";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useSession } from "~/components/auth/SessionContext";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  // const { logout, user } = useAuth();

  const { signOut } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      // Replace with your backend URL
      fetch("http://localhost:8123/") // Or your real backend URL
        .then((res) => res.text()) // or .json() if it's JSON
        .then((data) => {
          setMessage(data);
        })
        .catch((err) => {
          console.error("Error fetching message:", err);
          setMessage("Failed to fetch message");
        });
    };

    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <Text>Welcome Home</Text>
      <Text>Fake User: {fakeUser.name}</Text>
      <Text>Message from backend: {message}</Text>
      {/* {user && (
        <Text>
          User: {user.role} {user.sub}
        </Text>
      )} */}
      <Button onPress={signOut}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
}
