import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/* ---------------- TYPES ---------------- */

type CourseParams = {
  title?: string;
  duration?: string;
};

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

interface BulletProps {
  text: string;
}

/* ---------------- SCREEN ---------------- */

export default function CourseDetail() {
  const { title, duration } =
    useLocalSearchParams<CourseParams>();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            color: "#2563eb",
            fontSize: 13,
            letterSpacing: 2,
            fontWeight: "600",
          }}
        >
          COURSE DETAILS
        </Text>

        <Text
          style={{
            color: "#020617",
            fontSize: 26,
            fontWeight: "bold",
            marginTop: 8,
          }}
        >
          {title ?? "Course"}
        </Text>

        <Text
          style={{
            color: "#475569",
            fontSize: 15,
            marginTop: 10,
            lineHeight: 22,
          }}
        >
          This course is designed to provide in-depth knowledge and hands-on
          experience in real-world cyber security scenarios.
        </Text>
      </View>

      {/* INFO CARDS */}
      <View style={{ marginTop: 30 }}>
        <InfoRow icon="time" label="Duration" value={duration ?? "N/A"} />
        <InfoRow
          icon="shield-checkmark"
          label="Mode"
          value="Practical + Labs"
        />
        <InfoRow icon="ribbon" label="Certificate" value="Yes" />
      </View>

      {/* DESCRIPTION */}
      <View style={{ marginTop: 30 }}>
        <Text
          style={{
            color: "#020617",
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 12,
          }}
        >
          What You Will Learn
        </Text>

        <Bullet text="Ethical hacking methodologies" />
        <Bullet text="Vulnerability assessment & scanning" />
        <Bullet text="Penetration testing tools & techniques" />
        <Bullet text="Real-world attack simulations" />
        <Bullet text="Defensive security strategies" />
      </View>

      {/* CTA BUTTON */}
      <Pressable
        onPress={() => alert("Enroll flow coming next 🚀")}
        style={{
          backgroundColor: "#2563eb",
          paddingVertical: 16,
          borderRadius: 14,
          marginTop: 40,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
          Enroll Now
        </Text>
      </Pressable>

      {/* FOOTER */}
      <View style={{ marginTop: 40, marginBottom: 20 }}>
        <Text
          style={{
            color: "#64748b",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          Secure your future with cyber security skills.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        backgroundColor: "#f8fafc",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#2563eb"
        style={{ marginRight: 14 }}
      />
      <Text style={{ color: "#020617", fontSize: 15 }}>
        <Text style={{ fontWeight: "600" }}>{label}:</Text> {value}
      </Text>
    </View>
  );
}

function Bullet({ text }: BulletProps) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      <Ionicons
        name="checkmark-circle"
        size={18}
        color="#2563eb"
        style={{ marginRight: 10, marginTop: 2 }}
      />
      <Text style={{ color: "#475569", fontSize: 14, lineHeight: 20 }}>
        {text}
      </Text>
    </View>
  );
}
