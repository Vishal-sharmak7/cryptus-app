import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function MarkAttendance() {
  const { courseId, courseName } = useLocalSearchParams<{
    courseId?: string;
    courseName?: string;
  }>();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  /* ---------------- LIVE TIME ---------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ---------------- CHECK IN ---------------- */

  const handleCheckIn = async () => {
    const time = new Date().toISOString();
    setCheckInTime(time);

    const record = {
      courseId,
      courseName,
      checkIn: time,
      status: "Checked In",
    };

    await AsyncStorage.setItem("attendance_checkin", JSON.stringify(record));
  };

  /* ---------------- CHECK OUT ---------------- */

 const handleCheckOut = async () => {
  const time = new Date().toISOString();

  const stored = await AsyncStorage.getItem("attendance_history");
  const history = stored ? JSON.parse(stored) : [];

  history.push({
    courseId,
    courseName,
    checkIn: checkInTime,
    checkOut: time,
    status: "Completed",
  });

  await AsyncStorage.setItem(
    "attendance_history",
    JSON.stringify(history)
  );

  alert("Attendance Completed ✅");
};


  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* DATE & TIME */}
      <View style={{ marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#020617",
          }}
        >
          {currentTime.toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#475569",
            marginTop: 4,
          }}
        >
          {currentTime.toLocaleTimeString()}
        </Text>
      </View>

      {/* COURSE CARD */}
      <View
        style={{
          backgroundColor: "#f8fafc",
          padding: 20,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: "#e2e8f0",
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#020617",
          }}
        >
          {courseName}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#64748b",
            marginTop: 6,
          }}
        >
          Course ID: {courseId}
        </Text>
      </View>

      {/* CHECK IN BUTTON */}
      <Pressable
        onPress={handleCheckIn}
        disabled={!!checkInTime}
        style={{
          backgroundColor: checkInTime ? "#94a3b8" : "#16a34a",
          paddingVertical: 16,
          borderRadius: 14,
          alignItems: "center",
          marginBottom: 16,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Ionicons name="log-in" size={20} color="#ffffff" />
        <Text
          style={{
            color: "#ffffff",
            fontSize: 16,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          {checkInTime ? "Checked In" : "Check In"}
        </Text>
      </Pressable>

      {/* CHECK OUT BUTTON */}
      <Pressable
        onPress={handleCheckOut}
        disabled={!checkInTime || !!checkOutTime}
        style={{
          backgroundColor:
            !checkInTime || checkOutTime ? "#94a3b8" : "#2563eb",
          paddingVertical: 16,
          borderRadius: 14,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Ionicons name="log-out" size={20} color="#ffffff" />
        <Text
          style={{
            color: "#ffffff",
            fontSize: 16,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          {checkOutTime ? "Checked Out" : "Check Out"}
        </Text>
      </Pressable>

      {/* STATUS INFO */}
      <View style={{ marginTop: 30 }}>
        {checkInTime && (
          <Text style={{ color: "#16a34a", marginBottom: 6 }}>
            ✔ Checked in at {new Date(checkInTime).toLocaleTimeString()}
          </Text>
        )}

        {checkOutTime && (
          <Text style={{ color: "#2563eb" }}>
            ✔ Checked out at {new Date(checkOutTime).toLocaleTimeString()}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
