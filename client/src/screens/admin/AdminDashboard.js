import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../services/api';

const AdminDashboard = ({ navigation }) => {
    const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0 });
    const [loading, setLoading] = useState(true);

    // In a real app, you would fetch these from the backend using the token
    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Error connecting to server");
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>

            {/* Stats Cards Row */}
            <View style={styles.statsRow}>
                <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('AdminUserList')}>
                    <Text style={styles.statNumber}>{stats.students}</Text>
                    <Text style={styles.statLabel}>Total Students</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('AdminUserList')}>
                    <Text style={styles.statNumber}>{stats.teachers}</Text>
                    <Text style={styles.statLabel}>Total Teachers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('AdminCourseList')}>
                    <Text style={styles.statNumber}>{stats.courses}</Text>
                    <Text style={styles.statLabel}>Enrolled Courses</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>Quick Actions</Text>

            {/* Action Cards */}
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('AdminUserList')}>
                <Text style={styles.actionCardTitle}>Manage Users</Text>
                <Text style={styles.actionCardDesc}>Add, Edit, or Remove Students & Teachers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('AdminStudentTeacherMapping')}>
                <Text style={styles.actionCardTitle}>Student-Teacher Relationships</Text>
                <Text style={styles.actionCardDesc}>View which students are assigned to which teachers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#2196F3' }]} onPress={() => navigation.navigate('AdminReportsList')}>
                <Text style={[styles.actionCardTitle, { color: '#FFFFFF' }]}>Weekly Attendance Report</Text>
                <Text style={[styles.actionCardDesc, { color: '#E3F2FD' }]}>Generate and view weekly summaries</Text>
            </TouchableOpacity>
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
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#E3F2FD', // Light Blue Theme
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Minimalist elevation
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3', // Primary Blue
    },
    statLabel: {
        fontSize: 12,
        color: '#555555',
        marginTop: 8,
        textAlign: 'center',
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
    actionCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E3F2FD',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    actionCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 4,
    },
    actionCardDesc: {
        fontSize: 14,
        color: '#777777',
    }
});

export default AdminDashboard;
