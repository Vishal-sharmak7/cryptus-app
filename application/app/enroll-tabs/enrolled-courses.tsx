import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ---------------- DATA ---------------- */

const enrolledCourses = [
  { id: "c1", name: "1 Year Ethical Hacking Diploma" },
];

/* ---------------- TYPES ---------------- */

interface AttendanceRecord {
  courseId?: string;
  courseName?: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
}

/* ---------------- SCREEN ---------------- */

export default function EnrolledCourses() {
  const router = useRouter();

  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  /* ---------------- LOAD ATTENDANCE ---------------- */

  const loadAttendance = async () => {
    const stored = await AsyncStorage.getItem("attendance_history");
    if (stored) {
      setHistory(JSON.parse(stored));
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

  /* ---------------- CALENDAR CALC ---------------- */

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  /* ---------------- HELPERS ---------------- */

  const getRecordForDate = (dateKey: string) =>
    history.find((r) => r.checkIn?.startsWith(dateKey));

  const isFutureDate = (dateKey: string) => {
    const d = new Date(dateKey);
    return d > today;
  };

  /* ---------------- STATS ---------------- */

  const presentDays = history.filter((r) => {
    if (!r.checkIn) return false;
    const d = new Date(r.checkIn);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  const totalDays = daysInMonth;
  const absentDays = totalDays - presentDays;
  const attendancePercent = Math.round((presentDays / totalDays) * 100);

  /* ---------------- RENDER ---------------- */

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Pressable
          onPress={() => router.replace("/(tabs)/courses")}
          style={{ padding: 6, marginRight: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#020617" />
        </Pressable>

        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#020617" }}>
          Enrolled Courses
        </Text>
      </View>

      {/* COURSE CARD */}
      {enrolledCourses.map((course) => (
        <Pressable
          key={course.id}
          onPress={() =>
            router.push({
              pathname: "/mark-attendance",
              params: {
                courseId: course.id,
                courseName: course.name,
              },
            })
          }
          style={{
            backgroundColor: "#f8fafc",
            padding: 18,
            borderRadius: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "#e2e8f0",
            flexDirection: "row",
            alignItems: "center",
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
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#020617" }}>
              {course.name}
            </Text>
            <Text style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
              Tap to mark attendance
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </Pressable>
      ))}

      {/* CALENDAR */}
      <View
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      >
        {/* MONTH NAV */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Pressable onPress={goPrev}>
            <Ionicons name="chevron-back" size={22} color="#2563eb" />
          </Pressable>

          <Text style={{ fontSize: 18, fontWeight: "600", color: "#020617" }}>
            {monthName} {year}
          </Text>

          <Pressable onPress={goNext}>
            <Ionicons name="chevron-forward" size={22} color="#2563eb" />
          </Pressable>
        </View>

        {/* WEEK DAYS */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <Text
              key={`${d}-${i}`}
              style={{
                width: "14.28%",
                textAlign: "center",
                color: "#64748b",
                marginBottom: 8,
                fontWeight: "600",
              }}
            >
              {d}
            </Text>
          ))}
        </View>

        {/* DAYS */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {calendarDays.map((day, index) => {
            if (!day) {
              return <View key={index} style={{ width: "14.28%", height: 40 }} />;
            }

            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
              day
            ).padStart(2, "0")}`;

            const record = getRecordForDate(dateKey);
            const marked = !!record;
            const future = isFutureDate(dateKey);
            const selected = selectedDate === dateKey;

            return (
              <Pressable
                key={index}
                disabled={future}
                onPress={() => setSelectedDate(dateKey)}
                style={{
                  width: "14.28%",
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 6,
                  opacity: future ? 0.3 : 1,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: marked ? "#16a34a" : "transparent",
                    borderWidth: selected ? 2 : 0,
                    borderColor: "#2563eb",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: marked ? "#ffffff" : "#020617",
                      fontWeight: marked ? "bold" : "normal",
                    }}
                  >
                    {day}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* DATE DETAILS */}
      {selectedDate && (
        <View
          style={{
            backgroundColor: "#f8fafc",
            padding: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#e2e8f0",
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
            {new Date(selectedDate).toDateString()}
          </Text>

          {getRecordForDate(selectedDate) ? (
            <>
              <DetailRow
                label="Check In"
                value={new Date(
                  getRecordForDate(selectedDate)!.checkIn!
                ).toLocaleTimeString()}
              />
              <DetailRow
                label="Check Out"
                value={
                  getRecordForDate(selectedDate)!.checkOut
                    ? new Date(
                        getRecordForDate(selectedDate)!.checkOut!
                      ).toLocaleTimeString()
                    : "—"
                }
              />
            </>
          ) : (
            <Text style={{ color: "#64748b" }}>
              No attendance marked on this date
            </Text>
          )}
        </View>
      )}

      {/* STATS */}
      <View
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: "#e2e8f0",
          marginTop: 20,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 14 }}>
          Monthly Attendance Stats
        </Text>

        <StatRow label="Total Days" value={totalDays} />
        <StatRow label="Present Days" value={presentDays} color="#16a34a" />
        <StatRow label="Absent Days" value={absentDays} color="#dc2626" />

        <View style={{ marginTop: 16 }}>
          <View
            style={{
              height: 10,
              backgroundColor: "#e5e7eb",
              borderRadius: 6,
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${attendancePercent}%`,
                backgroundColor:
                  attendancePercent >= 75 ? "#16a34a" : "#f59e0b",
                borderRadius: 6,
              }}
            />
          </View>

          <Text
            style={{
              marginTop: 8,
              textAlign: "right",
              fontWeight: "600",
              color:
                attendancePercent >= 75 ? "#16a34a" : "#f59e0b",
            }}
          >
            {attendancePercent}% Attendance
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------------- HELPERS ---------------- */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <Text>{label}</Text>
      <Text style={{ fontWeight: "600", color: "#2563eb" }}>{value}</Text>
    </View>
  );
}

function StatRow({
  label,
  value,
  color = "#020617",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <Text>{label}</Text>
      <Text style={{ color, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}
