import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TeacherLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#2563eb",
      }}
    >
      {/* DASHBOARD */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="speedometer" size={20} color={color} />
          ),
        }}
      />

      {/* COURSES */}
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={20} color={color} />
          ),
        }}
      />

      {/* ATTENDANCE APPROVAL */}
      <Tabs.Screen
        name="pending-attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-done" size={20} color={color} />
          ),
        }}
      />

      {/* STUDENTS */}
      <Tabs.Screen
        name="students"
        options={{
          title: "Students",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
