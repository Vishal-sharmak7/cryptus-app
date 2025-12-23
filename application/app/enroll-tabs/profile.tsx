import { View, Text, ScrollView, Alert, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

/* ---------------- INFO ROW ---------------- */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <Ionicons
        name={icon}
        size={18}
        color="#2563eb"
        style={{ marginRight: 12 }}
      />

      <Text style={{ color: "#020617", fontSize: 14 }}>
        <Text style={{ fontWeight: "600" }}>{label}:</Text> {value}
      </Text>
    </View>
  );
}

/* ---------------- PROFILE ---------------- */
export default function Profile() {
  const { logout } = useAuth();
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
            router.replace("/login");
          },
        },
      ]
    );
  };

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
        <InfoRow icon="mail" label="Email" value="vishal@student.com" />
        <InfoRow icon="call" label="Phone" value="+91 98765 43210" />
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
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}
