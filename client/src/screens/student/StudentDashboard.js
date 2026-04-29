import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../services/api';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const res = await api.get('/student/courses');
            setCourses(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
            setLoading(false);
        }
    };

    const markAttendance = async (courseId) => {
        try {
            setLoading(true);
            await api.post('/attendance/mark', { courseID: courseId });

            // Update UI optimistically
            setCourses(prev =>
                prev.map(course =>
                    course._id === courseId
                        ? { ...course, attendanceStatus: 'pending' }
                        : course
                )
            );
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Text style={[styles.badge, styles.badgePending]}>Pending Approval</Text>;
            case 'approved':
                return <Text style={[styles.badge, styles.badgeApproved]}>Approved</Text>;
            case 'rejected':
                return <Text style={[styles.badge, styles.badgeRejected]}>Rejected</Text>;
            default:
                return null; // Hasn't marked today
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Welcome Back!</Text>
                <Text style={styles.headerSubtitle}>Ready for today's classes?</Text>
            </View>

            <Text style={styles.sectionHeader}>My Enrolled Courses</Text>

            {courses.map(course => (
                <View key={course._id} style={styles.courseCard}>
                    <View style={styles.courseHeader}>
                        <Text style={styles.courseTitle}>{course.title}</Text>
                        {getStatusBadge(course.attendanceStatus)}
                    </View>
                    <Text style={styles.teacherText}>Instructor: {course.teacher}</Text>

                    {/* If the student hasn't marked attendance today, show the button */}
                    {course.attendanceStatus === 'none' || !course.attendanceStatus ? (
                        <TouchableOpacity
                            style={styles.markBtn}
                            onPress={() => markAttendance(course._id)}
                        >
                            <Text style={styles.markBtnText}>Mark Attendance (Check-in)</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.disabledBtn}>
                            <Text style={styles.disabledBtnText}>Attendance Submitted</Text>
                        </View>
                    )}
                </View>
            ))}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Clean White
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2196F3', // Primary Blue
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#777777',
        marginTop: 4,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
    courseCard: {
        backgroundColor: '#E3F2FD', // Light Blue Theme
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    courseTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginRight: 10,
    },
    teacherText: {
        fontSize: 14,
        color: '#555555',
        marginBottom: 20,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: '600',
        overflow: 'hidden',
    },
    badgePending: {
        backgroundColor: '#FFEB3B', // Yellow for pending
        color: '#555555',
    },
    badgeApproved: {
        backgroundColor: '#4CAF50', // Green
        color: '#FFFFFF',
    },
    badgeRejected: {
        backgroundColor: '#F44336', // Red
        color: '#FFFFFF',
    },
    markBtn: {
        backgroundColor: '#2196F3',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    markBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabledBtn: {
        backgroundColor: '#B0BEC5',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    disabledBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default StudentDashboard;
