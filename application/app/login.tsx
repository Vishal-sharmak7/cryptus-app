import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!studentId || !password) {
      setError("Student ID and Password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 🔐 Fake login (replace with API later)
      await login({
        id: studentId,
        name: "Student",
      });

      router.replace("/(tabs)/attendance");
    } catch (e) {
      setError("Invalid Student ID or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", padding: 24 }}>
      {/* HEADER */}
      <View style={{ marginTop: 80, marginBottom: 40 }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#020617",
          }}
        >
          Student Login
        </Text>

        <Text
          style={{
            color: "#475569",
            marginTop: 8,
            fontSize: 14,
          }}
        >
          Login using your Student ID provided by the institute
        </Text>
      </View>

      {/* STUDENT ID */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: "#020617", marginBottom: 6, fontWeight: "500" }}>
          Student ID
        </Text>
        <TextInput
          value={studentId}
          onChangeText={setStudentId}
          placeholder="Enter your student ID"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: "#e2e8f0",
            borderRadius: 12,
            padding: 14,
            fontSize: 15,
          }}
        />
      </View>

      {/* PASSWORD */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ color: "#020617", marginBottom: 6, fontWeight: "500" }}>
          Password
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e2e8f0",
            borderRadius: 12,
            paddingHorizontal: 14,
          }}
        >
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            style={{
              flex: 1,
              paddingVertical: 14,
              fontSize: 15,
            }}
          />

          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#64748b"
            />
          </Pressable>
        </View>
      </View>

      {/* ERROR MESSAGE */}
      {error ? (
        <Text style={{ color: "#dc2626", marginBottom: 10 }}>{error}</Text>
      ) : null}

      {/* LOGIN BUTTON */}
      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: "#2563eb",
          paddingVertical: 16,
          borderRadius: 14,
          marginTop: 20,
          alignItems: "center",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
            Login
          </Text>
        )}
      </Pressable>

      {/* FOOTER */}
      <View style={{ marginTop: 30 }}>
        <Text
          style={{
            color: "#64748b",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          © 2025 Cyber Security Institute
        </Text>
      </View>
    </View>
  );
}
