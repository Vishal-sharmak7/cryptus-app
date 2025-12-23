import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* ---------------- TYPES ---------------- */

interface CourseCardProps {
  title: string;
  level: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

/* ---------------- SCREEN ---------------- */

export default function Courses() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            color: "#2563eb",
            fontSize: 13,
            letterSpacing: 2,
            marginBottom: 8,
            fontWeight: "600",
          }}
        >
          OUR PROGRAMS
        </Text>

        <Text
          style={{
            color: "#020617",
            fontSize: 26,
            fontWeight: "bold",
            lineHeight: 34,
          }}
        >
          Cyber Security Courses
        </Text>

        <Text
          style={{
            color: "#475569",
            fontSize: 15,
            marginTop: 12,
            lineHeight: 22,
          }}
        >
          Choose from industry-focused cyber security programs designed
          to make you job-ready.
        </Text>
      </View>

      {/* COURSES LIST */}
      <View style={{ marginTop: 30 }}>
        <CourseCard
          title="Ethical Hacking"
          level="Beginner to Advanced"
          duration="6 Weeks"
          icon="bug"
          onPress={() =>
            router.push({
              pathname: "/course-detail",
              params: {
                title: "Ethical Hacking",
                level: "Beginner to Advanced",
                duration: "6 Weeks",
              },
            })
          }
        />

        <CourseCard
          title="Network Security"
          level="Intermediate"
          duration="5 Weeks"
          icon="shield-checkmark"
          onPress={() =>
            router.push({
              pathname: "/course-detail",
              params: {
                title: "Network Security",
                level: "Intermediate",
                duration: "5 Weeks",
              },
            })
          }
        />

        <CourseCard
          title="Penetration Testing"
          level="Advanced"
          duration="8 Weeks"
          icon="lock-closed"
          onPress={() =>
            router.push({
              pathname: "/course-detail",
              params: {
                title: "Penetration Testing",
                level: "Advanced",
                duration: "8 Weeks",
              },
            })
          }
        />

        <CourseCard
          title="SOC Analyst Training"
          level="Professional"
          duration="6 Weeks"
          icon="server"
          onPress={() =>
            router.push({
              pathname: "/course-detail",
              params: {
                title: "SOC Analyst Training",
                level: "Professional",
                duration: "6 Weeks",
              },
            })
          }
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
          Learn. Secure. Succeed.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ---------------- COURSE CARD ---------------- */

function CourseCard({
  title,
  level,
  duration,
  icon,
  onPress,
}: CourseCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#f8fafc",
        padding: 18,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#e0e7ff",
            padding: 12,
            borderRadius: 12,
            marginRight: 16,
          }}
        >
          <Ionicons name={icon} size={24} color="#2563eb" />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#020617",
              fontSize: 17,
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
            Level: {level}
          </Text>

          <Text
            style={{
              color: "#475569",
              fontSize: 14,
              marginTop: 2,
            }}
          >
            Duration: {duration}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
