import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const TeacherDashboard = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadDashboardData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const authHeader = { headers: { Authorization: `Bearer ${token}` } };

            const [pendingRes, coursesRes] = await Promise.all([
                api.get('/attendance/pending', authHeader),
                api.get('/teacher/my-courses', authHeader) // Fetch strictly instructor courses natively
            ]);

            console.log("Pending Data:", pendingRes.data);
            console.log("Instructor Course Data:", coursesRes.data);

            setPendingRequests(pendingRes.data);
            setCourses(coursesRes.data); // Set natively retrieved data directly
        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboardData();
    };

    const handleApproval = async (id, status) => {
        try {
            await api.patch(`/attendance/${id}/approve`, { status });

            // Update UI optimistically
            setPendingRequests(prev => prev.filter(req => req._id !== id));
        } catch (err) {
            console.error(err);
            alert("Error updating status");
        }
    };

    // Render a clean card for each pending request
    const renderItem = ({ item }) => {
        if (!item.studentID) return null; // Safe rendering if data missing

        return (
            <View style={styles.requestCard}>
                <View style={styles.requestInfo}>
                    <Text style={styles.studentName}>{item.studentID?.name || "Unknown Student"}</Text>
                    <Text style={styles.courseTitle}>{item.courseID?.title || "Unknown Course"}</Text>
                    <Text style={styles.dateText}>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.btn, styles.approveBtn]}
                        onPress={() => handleApproval(item._id, 'approved')}
                    >
                        <Text style={styles.approveBtnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, styles.rejectBtn]}
                        onPress={() => handleApproval(item._id, 'rejected')}
                    >
                        <Text style={styles.rejectBtnText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Pending Approvals</Text>

            {pendingRequests.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>You're all caught up!</Text>
                </View>
            ) : (
                <FlatList
                    data={pendingRequests}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}

            {courses.length > 0 && (
                <View style={styles.coursesSection}>
                    <Text style={styles.sectionHeader}>My Courses Overview</Text>
                    {courses.map(course => (
                        <View key={course._id} style={styles.myCourseCard}>
                            <Text style={styles.myCourseTitle}>{course.title}</Text>
                            <Text style={styles.myCourseCount}>{course.studentCount} Students Enrolled</Text>
                        </View>
                    ))}
                </View>
            )}

            {courses.length === 0 && !loading && (
                <TouchableOpacity style={styles.myCoursesButton}>
                    <Text style={styles.myCoursesText}>No courses assigned to you yet</Text>
                </TouchableOpacity>
            )}
        </View>
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
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 20,
    },
    requestCard: {
        backgroundColor: '#E3F2FD', // Light Blue Theme
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    requestInfo: {
        flex: 1,
        marginRight: 10,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    courseTitle: {
        fontSize: 14,
        color: '#555555',
        marginTop: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#888888',
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: 'column',
        gap: 8,
    },
    btn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    approveBtn: {
        backgroundColor: '#2196F3',
    },
    approveBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    rejectBtn: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    rejectBtnText: {
        color: '#555555',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateText: {
        color: '#999999',
        fontSize: 16,
    },
    myCoursesButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#2196F3',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    myCoursesText: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: '600',
    },
    coursesSection: {
        marginTop: 10,
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 10,
    },
    myCourseCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    myCourseTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2196F3',
    },
    myCourseCount: {
        fontSize: 14,
        color: '#777777',
        marginTop: 4,
    }
});

export default TeacherDashboard;
