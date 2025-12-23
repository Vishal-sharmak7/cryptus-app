import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>404</Text>
      <Text>Page Not Found</Text>

      <Pressable
        onPress={() => router.replace("/(tabs)")}
        style={{
          marginTop: 20,
          backgroundColor: "#2563eb",
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff" }}>Go to Home</Text>
      </Pressable>
    </View>
  );
}
