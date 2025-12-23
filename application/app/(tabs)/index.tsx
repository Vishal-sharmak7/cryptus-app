import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* ---------------- TYPES ---------------- */

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
}

/* ---------------- SCREEN ---------------- */

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HERO SECTION */}
      <View style={{ marginTop: 30 }}>
        <Text
          style={{
            color: "#2563eb",
            fontSize: 13,
            letterSpacing: 2,
            marginBottom: 8,
            fontWeight: "600",
          }}
        >
          CYBER SECURITY INSTITUTE
        </Text>

        <Text
          style={{
            color: "#020617",
            fontSize: 28,
            fontWeight: "bold",
            lineHeight: 36,
          }}
        >
          Build a Secure
          {"\n"}Career in Cyber Security
        </Text>

        <Text
          style={{
            color: "#475569",
            fontSize: 15,
            marginTop: 12,
            lineHeight: 22,
          }}
        >
          Learn ethical hacking, penetration testing, network security,
          and cyber defense with real-world practical training.
        </Text>
      </View>

      {/* CTA BUTTON */}
      <Pressable
        onPress={() => router.push("/(tabs)/courses")}
        style={{
          backgroundColor: "#2563eb",
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 25,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
          Explore Courses
        </Text>
      </Pressable>

      {/* FEATURES */}
      <View style={{ marginTop: 40 }}>
        <Text
          style={{
            color: "#020617",
            fontSize: 20,
            fontWeight: "600",
            marginBottom: 20,
          }}
        >
          Why Choose Us
        </Text>

        <FeatureCard
          icon="shield-checkmark"
          title="Industry-Level Training"
          desc="Hands-on labs, real-world attack simulations, and tools."
        />

        <FeatureCard
          icon="bug"
          title="Ethical Hacking"
          desc="Penetration testing, vulnerability analysis & exploits."
        />

        <FeatureCard
          icon="lock-closed"
          title="Cyber Defense"
          desc="Network security, SOC operations, and incident response."
        />
      </View>

      {/* FOOTER */}
      <View style={{ marginTop: 40, marginBottom: 30 }}>
        <Text
          style={{
            color: "#64748b",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          © 2025 Cyber Security Institute. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ---------------- FEATURE CARD ---------------- */

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <View
      style={{
        backgroundColor: "#f8fafc",
        padding: 16,
        borderRadius: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#e0e7ff",
          padding: 10,
          borderRadius: 10,
          marginRight: 14,
        }}
      >
        <Ionicons name={icon} size={22} color="#2563eb" />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "#020617",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: "#475569",
            fontSize: 14,
            marginTop: 4,
          }}
        >
          {desc}
        </Text>
      </View>
    </View>
  );
}
