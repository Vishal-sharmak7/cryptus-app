import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";

const API_URL = "http://192.168.1.30:3000/api/v1/login";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          // ❌ DO NOT hard-code role here
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save JWT + user
      await login({
        token: data.token,
        user: data.user,
      });

      // 🎯 ROLE-BASED REDIRECT
      if (data.user.role === "teacher") {
        router.replace("/teacher/dashboard");
      } else {
        router.replace("/(tabs)/courses");
      }

    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", padding: 24 }}>
      {/* HEADER */}
      <View style={{ marginTop: 80, marginBottom: 40 }}>
        <Text style={{ fontSize: 26, fontWeight: "bold", color: "#020617" }}>
          Login
        </Text>

        <Text style={{ color: "#475569", marginTop: 8, fontSize: 14 }}>
          Login using your credentials
        </Text>
      </View>

      {/* USERNAME */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 6, fontWeight: "500" }}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="stu101 / teacher01"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: "#e2e8f0",
            borderRadius: 12,
            padding: 14,
          }}
        />
      </View>

      {/* PASSWORD */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ marginBottom: 6, fontWeight: "500" }}>Password</Text>

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
            placeholder="******"
            secureTextEntry={!showPassword}
            style={{ flex: 1, paddingVertical: 14 }}
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

      {/* ERROR */}
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
    </View>
  );
}
