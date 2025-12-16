import { View, Text, FlatList, StyleSheet } from "react-native";

const courses = [
  { id: "1", title: "Ethical Hacking" },
  { id: "2", title: "SOC Analyst" },
  { id: "3", title: "Web Application Security" },
  { id: "4", title: "Network Penetration Testing" },
];

export default function Attendance() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Cyber Security Courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.course}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F7FB",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  course: {
    fontSize: 16,
    fontWeight: "600",
  },
});
