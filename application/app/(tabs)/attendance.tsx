import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export default function Attendance() {
  const auth = useAuth();
  const router = useRouter();

  // Context not ready yet
  if (!auth) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  const { user } = auth;

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        router.replace("/login");
      } else {
        router.push("/enroll-tabs/enrolled-courses");
      }
    }, [user])
  );

  return <ActivityIndicator style={{ flex: 1 }} />;
}
