import { Stack, Redirect } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ActivityIndicator, View } from "react-native";

function RootLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  // 🎯 ROLE BASED REDIRECT
  if (user.role === "teacher") {
    return <Redirect href="/teacher/dashboard" />;
  }

  return <Redirect href="/(tabs)/courses" />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
