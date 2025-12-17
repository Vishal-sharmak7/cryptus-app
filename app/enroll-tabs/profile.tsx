import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "#020617",
          marginBottom: 20,
        }}
      >
        Student Profile
      </Text>

      {/* PROFILE CARD */}
      <View
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      >
        {/* AVATAR */}
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: "#e0e7ff",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginBottom: 16,
          }}
        >
          <Ionicons name="person" size={48} color="#2563eb" />
        </View>

        {/* NAME */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#020617",
            textAlign: "center",
          }}
        >
          Vishal Sharma
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#475569",
            textAlign: "center",
            marginTop: 4,
          }}
        >
          Student ID: STU-1023
        </Text>

        {/* DIVIDER */}
        <View
          style={{
            height: 1,
            backgroundColor: "#e2e8f0",
            marginVertical: 20,
          }}
        />

        {/* INFO ROWS */}
        <InfoRow icon="mail" label="Email" value="vishal@student.com" />
        <InfoRow icon="call" label="Phone" value="+91 98765 43210" />
        <InfoRow icon="school" label="Course" value="Cyber Security" />
        <InfoRow icon="calendar" label="Joined" value="Jan 2025" />
      </View>

      {/* FOOTER */}
      <Text
        style={{
          fontSize: 13,
          color: "#64748b",
          textAlign: "center",
          marginTop: 30,
        }}
      >
        Keep your profile information updated
      </Text>
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
