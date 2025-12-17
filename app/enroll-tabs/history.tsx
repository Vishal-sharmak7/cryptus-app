import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

/* ---------------- TYPES ---------------- */

interface AttendanceRecord {
  courseId?: string;
  courseName?: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
}

/* ---------------- SCREEN ---------------- */

export default function AttendanceHistory() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem("attendance_history");
    if (stored) {
      setRecords(JSON.parse(stored));
    }
  };

  /* ---------------- CLEAR HISTORY ---------------- */

  const clearHistory = () => {
    Alert.alert(
      "Clear Attendance History",
      "Are you sure you want to delete all attendance records? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("attendance_history");
            setRecords([]);
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#020617",
          }}
        >
          Attendance History
        </Text>

        {records.length > 0 && (
          <Pressable onPress={clearHistory}>
            <Ionicons name="trash-outline" size={22} color="#dc2626" />
          </Pressable>
        )}
      </View>

      {/* EMPTY STATE */}
      {records.length === 0 && (
        <View style={{ alignItems: "center", marginTop: 60 }}>
          <Ionicons name="time-outline" size={48} color="#94a3b8" />
          <Text
            style={{
              marginTop: 12,
              color: "#64748b",
              fontSize: 14,
            }}
          >
            No attendance records found
          </Text>
        </View>
      )}

      {/* RECORD LIST */}
      {records.map((item, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#f8fafc",
            padding: 18,
            borderRadius: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#e2e8f0",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#020617",
            }}
          >
            {item.courseName}
          </Text>

          {item.checkIn && (
            <Text
              style={{
                fontSize: 13,
                color: "#64748b",
                marginTop: 6,
              }}
            >
              {new Date(item.checkIn).toLocaleDateString()}
            </Text>
          )}

          <View style={{ marginTop: 12 }}>
            <InfoRow
              label="Check In"
              value={
                item.checkIn
                  ? new Date(item.checkIn).toLocaleTimeString()
                  : "—"
              }
              color="#16a34a"
            />

            <InfoRow
              label="Check Out"
              value={
                item.checkOut
                  ? new Date(item.checkOut).toLocaleTimeString()
                  : "—"
              }
              color="#2563eb"
            />
          </View>

          <Text
            style={{
              marginTop: 10,
              fontSize: 13,
              color: "#475569",
            }}
          >
            Status: {item.status ?? "Present"}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

/* ---------------- INFO ROW ---------------- */

function InfoRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
      }}
    >
      <Text style={{ color: "#020617", fontSize: 14 }}>{label}</Text>
      <Text style={{ color, fontSize: 14, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}
