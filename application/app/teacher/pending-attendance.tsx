import { View, Text, ScrollView, Pressable } from "react-native";

export default function PendingAttendance() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Pending Attendance
      </Text>

      <View
        style={{
          backgroundColor: "#f8fafc",
          padding: 16,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#e2e8f0",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Student: Vishal Sharma
        </Text>

        <Text style={{ color: "#64748b", marginTop: 4 }}>
          Course: Network Security
        </Text>

        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Pressable
            style={{
              backgroundColor: "#16a34a",
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 8,
              marginRight: 10,
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>
              Approve
            </Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: "#dc2626",
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>
              Reject
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
