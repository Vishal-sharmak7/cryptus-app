import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import api from '../../services/api';

const AdminStudentTeacherMapping = () => {
    const [mappings, setMappings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMappings();
    }, []);

    const fetchMappings = async () => {
        try {
            const res = await api.get('/admin/student-teacher');
            setMappings(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderMappingCard = ({ item }) => (
        <View style={styles.mappingCard}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentEmail}>{item.email}</Text>

            <View style={styles.coursesContainer}>
                {item.enrolledCourses.length > 0 ? (
                    item.enrolledCourses.map(course => (
                        <View key={course._id} style={styles.courseRow}>
                            <Text style={styles.courseTitle}>{course.title}</Text>
                            <Text style={styles.teacherName}>
                                Taught by: {course.teacherID ? course.teacherID.name : 'Unknown'}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noCourses}>Not enrolled in any courses</Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
            ) : (
                <FlatList
                    data={mappings}
                    keyExtractor={(item) => item._id}
                    renderItem={renderMappingCard}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
    loader: { flex: 1, justifyContent: 'center' },
    mappingCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E3F2FD',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    studentName: { fontSize: 18, fontWeight: 'bold', color: '#2196F3' },
    studentEmail: { fontSize: 14, color: '#777', marginBottom: 12 },
    coursesContainer: { borderTopWidth: 1, borderColor: '#EFEFEF', paddingTop: 12 },
    courseRow: {
        backgroundColor: '#F9F9F9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    courseTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    teacherName: { fontSize: 14, color: '#555', marginTop: 4 },
    noCourses: { fontStyle: 'italic', color: '#999' }
});

export default AdminStudentTeacherMapping;
