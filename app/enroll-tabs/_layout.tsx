import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EnrollTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2563eb",
      }}
    >
      <Tabs.Screen
        name="enrolled-courses"
        options={{
          title: "My Courses",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-circle" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={20} color={color} />
          ),
        }}
      />

       <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
