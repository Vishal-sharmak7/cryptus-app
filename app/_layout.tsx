import { Stack } from "expo-router";
import { Image } from "react-native";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",

          // ✅ Global logo in header
          headerTitle: () => (
            <Image
              source={require("../assets/images/logo.png")}
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
        {/* Tabs (no header, tabs manage their own header) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Course detail → keep default back */}
        <Stack.Screen name="course-detail" />

        {/* Login → keep default back */}
        <Stack.Screen name="login" />

        {/* 🔴 Enrolled Courses → REMOVE native back arrow */}
        <Stack.Screen
          name="enrolled-courses"
          options={{
            headerBackVisible: false, // removes back arrow
            headerLeft: () => null,   // extra safety
          }}
        />

        {/* Mark attendance → normal back allowed */}
        <Stack.Screen name="mark-attendance" />
      </Stack>
    </AuthProvider>
  );
}
