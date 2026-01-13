import { View, Text, ScrollView } from "react-native";

export default function Students() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Students
      </Text>

      <View
        style={{
          backgroundColor: "#f8fafc",
          padding: 16,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#e2e8f0",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Vishal Sharma
        </Text>
        <Text style={{ color: "#64748b", marginTop: 4 }}>
          Enrolled: Network Security
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#f8fafc",
          padding: 16,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Rahul Verma
        </Text>
        <Text style={{ color: "#64748b", marginTop: 4 }}>
          Enrolled: Ethical Hacking
        </Text>
      </View>
    </ScrollView>
  );
}
