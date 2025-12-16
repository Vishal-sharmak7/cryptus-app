import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";

const coursesData = [
  { id: "1", title: "Ethical Hacking", duration: "3 Months", image: require("../assets/images/ethical-hacking.png") },
  { id: "2", title: "SOC Analyst", duration: "4 Months", image: require("../assets/images/ethical-hacking.png") },
  { id: "3", title: "Web Application Security", duration: "2 Months", image: require("../assets/images/ethical-hacking.png") },
  { id: "4", title: "Network Penetration Testing", duration: "3 Months", image: require("../assets/images/ethical-hacking.png") },
  { id: "5", title: "Cloud Security", duration: "2 Months", image: require("../assets/images/ethical-hacking.png") },
  { id: "6", title: "Cyber Forensics", duration: "3 Months", image: require("../assets/images/ethical-hacking.png") },
  { id: "7", title: "Bug Bounty", duration: "2 Months", image: require("../assets/images/ethical-hacking.png") },
  { id: "8", title: "Malware Analysis", duration: "3 Months", image: require("../assets/images/ethical-hacking.png") },
];

const Courses = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={coursesData}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}   // ✅ remove scroll line
        ListHeaderComponent={() => (
          <Text style={styles.heading}>Cyber Security Courses</Text>
        )}                                     // ✅ heading scrolls too
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.duration}>{item.duration}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Courses;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: "#F5F7FB",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  duration: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
