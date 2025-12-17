import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",

        // ✅ LOGO ON ALL TAB PAGES
        headerTitle: () => (
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 160, height: 40 }}
            resizeMode="contain"
          />
        ),

        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
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
    </Tabs>
  );
}
