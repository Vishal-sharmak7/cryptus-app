import { View, Text, ScrollView, Alert, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login"); // 🔥 prevents back navigation
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Not logged in</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Student Profile
      </Text>

      <View
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      >
        <InfoRow icon="person" label="Username" value={user.username} />
        <InfoRow icon="shield-checkmark" label="Role" value={user.role} />
        <InfoRow icon="key" label="User ID" value={user._id} />
      </View>

      <Pressable
        onPress={handleLogout}
        style={{
          marginTop: 30,
          backgroundColor: "#dc2626",
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Logout
        </Text>
      </Pressable>
    </ScrollView>
  );
}

/* ---------------- INFO ROW ---------------- */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 14 }}>
      <Ionicons name={icon} size={18} color="#2563eb" style={{ marginRight: 12 }} />
      <Text>
        <Text style={{ fontWeight: "600" }}>{label}:</Text> {value || "—"}
      </Text>
    </View>
  );
}
