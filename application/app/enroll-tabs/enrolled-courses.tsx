import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

/* ---------------- TYPES ---------------- */

interface Course {
  enrollmentId: string;
  courseMongoId: string;
  courseId: string;
  title: string;
  duration: string;
  status: string;
  isActive: boolean;
  enrolledAt: string;
}

interface AttendanceRecord {
  checkIn?: string;
  checkOut?: string;
}

/* ---------------- SCREEN ---------------- */

export default function EnrolledCourses() {
  const router = useRouter();
  const { token } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- CALENDAR STATE ---------- */
  const [history] = useState<AttendanceRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  /* ---------------- FETCH COURSES ---------------- */

  const fetchMyCourses = async () => {
    try {
      const res = await fetch(
        "http://192.168.1.30:3000/api/v1/student/my-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load courses");

      setCourses(data.courses); // 🔥 THIS IS THE KEY FIX
    } catch (err) {
      console.error("Failed to fetch enrolled courses", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MONTH NAV ---------------- */

  const goPrev = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

  const goNext = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  /* ---------------- CALENDAR ---------------- */

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  /* ---------------- STATS ---------------- */

  const presentDays = history.length;
  const totalDays = daysInMonth;
  const absentDays = totalDays - presentDays;
  const attendancePercent = totalDays
    ? Math.round((presentDays / totalDays) * 100)
    : 0;

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Enrolled Courses
      </Text>

      {/* COURSES FROM API */}
      {courses.map((course) => (
        <Pressable
          key={course.enrollmentId}
          onPress={() =>
            router.push({
              pathname: "/mark-attendance",
              params: {
                courseMongoId: course.courseMongoId, // ✅
                courseName: course.title,
                courseCode: course.courseId, // CY-02 (optional)
              },
            })
          }
          style={{
            backgroundColor: "#f8fafc",
            padding: 18,
            borderRadius: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#e2e8f0",
            flexDirection: "row",
            alignItems: "center",
            opacity: course.isActive ? 1 : 0.5,
          }}
        >
          <View
            style={{
              backgroundColor: "#e0e7ff",
              padding: 12,
              borderRadius: 12,
              marginRight: 14,
            }}
          >
            <Ionicons name="book" size={22} color="#2563eb" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {course.title}
            </Text>

            <Text style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
              Course ID: {course.courseId}
            </Text>

            <Text style={{ fontSize: 13, color: "#475569" }}>
              Duration: {course.duration}
            </Text>

            <Text
              style={{
                fontSize: 12,
                marginTop: 4,
                color: course.status === "approved" ? "#16a34a" : "#f59e0b",
                fontWeight: "600",
              }}
            >
              {course.status.toUpperCase()}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </Pressable>
      ))}

      {/* CALENDAR (UI READY – API CAN BE PLUGGED LATER) */}
      <View
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Pressable onPress={goPrev}>
            <Ionicons name="chevron-back" size={22} color="#2563eb" />
          </Pressable>

          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            {monthName} {year}
          </Text>

          <Pressable onPress={goNext}>
            <Ionicons name="chevron-forward" size={22} color="#2563eb" />
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {calendarDays.map((day, i) => (
            <View
              key={i}
              style={{
                width: "14.28%",
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {day && <Text>{day}</Text>}
            </View>
          ))}
        </View>
      </View>

      {/* STATS */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "600" }}>
          Attendance: {attendancePercent}%
        </Text>
        <Text>Present: {presentDays}</Text>
        <Text>Absent: {absentDays}</Text>
      </View>
    </ScrollView>
  );
}
