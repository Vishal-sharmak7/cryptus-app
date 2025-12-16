import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      {/* HERO / INTRO */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Cryptus Cyber Security</Text>
        <Text style={styles.heroSubtitle}>
          Learn Cyber Security from Industry Experts
        </Text>
      </View>

      {/* ABOUT SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Cryptus</Text>
        <Text style={styles.sectionText}>
          Cryptus is a professional cyber security training institute focused on
          practical skills like Ethical Hacking, SOC Analysis, Cloud Security,
          and Penetration Testing. Our goal is to make students job-ready with
          real-world labs and expert mentorship.
        </Text>
      </View>

      {/* COURSES OVERVIEW */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Courses</Text>

        <View style={styles.courseCard}>
          <Text style={styles.courseTitle}>🛡 Ethical Hacking</Text>
          <Text style={styles.courseDesc}>
            Learn real hacking techniques & security fundamentals.
          </Text>
        </View>

        <View style={styles.courseCard}>
          <Text style={styles.courseTitle}>🧠 SOC Analyst</Text>
          <Text style={styles.courseDesc}>
            Monitor, detect & respond to cyber threats in real SOC environments.
          </Text>
        </View>

        <View style={styles.courseCard}>
          <Text style={styles.courseTitle}>☁ Cloud Security</Text>
          <Text style={styles.courseDesc}>
            Secure AWS, Azure & cloud infrastructures.
          </Text>
        </View>

        <View style={styles.courseCard}>
          <Text style={styles.courseTitle}>🐞 Bug Bounty</Text>
          <Text style={styles.courseDesc}>
            Find vulnerabilities & earn rewards legally.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  hero: {
    backgroundColor: "#0082fcff",
    padding: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#E0E0E0",
    marginTop: 6,
    textAlign: "center",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  courseCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  courseDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
});
