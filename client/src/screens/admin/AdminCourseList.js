import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const AdminCourseList = () => {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [teacherModalVisible, setTeacherModalVisible] = useState(false);
    const [studentModalVisible, setStudentModalVisible] = useState(false);
    const [createCourseModalVisible, setCreateCourseModalVisible] = useState(false);

    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');

    // New course state
    const [newCourse, setNewCourse] = useState({ title: '', description: '', teacherID: '' });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [coursesRes, teachersRes, studentsRes] = await Promise.all([
                api.get('/admin/courses'),
                api.get('/admin/users?role=Teacher'),
                api.get('/admin/users?role=Student')
            ]);
            setCourses(coursesRes.data);
            setTeachers(teachersRes.data);
            setStudents(studentsRes.data);

            if (teachersRes.data.length > 0) setSelectedTeacherId(teachersRes.data[0]._id);
            if (studentsRes.data.length > 0) setSelectedStudentId(studentsRes.data[0]._id);

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch course data');
        } finally {
            setLoading(false);
        }
    };

    const openTeacherModal = (courseId) => {
        setSelectedCourseId(courseId);
        setTeacherModalVisible(true);
    };

    const openStudentModal = (courseId) => {
        setSelectedCourseId(courseId);
        setStudentModalVisible(true);
    };

    const handleAssignTeacher = async () => {
        try {
            await api.post('/admin/assign-teacher', {
                courseId: selectedCourseId,
                teacherId: selectedTeacherId
            });
            Alert.alert("Success", "Teacher assigned successfully");
            setTeacherModalVisible(false);
            fetchDashboardData(); // Refresh UI
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to assign teacher');
        }
    };

    const handleEnrollStudent = async () => {
        try {
            await api.post('/admin/enroll', {
                courseId: selectedCourseId,
                studentId: selectedStudentId
            });
            Alert.alert("Success", "Student enrolled successfully");
            setStudentModalVisible(false);
            fetchDashboardData(); // Refresh UI
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to enroll student');
        }
    };

    const handleCreateCourse = async () => {
        if (!newCourse.title || !newCourse.description || !newCourse.teacherID) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        try {
            await api.post('/admin/courses', newCourse);
            Alert.alert("Success", "Course created successfully");
            setCreateCourseModalVisible(false);
            setNewCourse({ title: '', description: '', teacherID: '' });
            fetchDashboardData();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create course. Ensure a teacher is assigned.');
        }
    };

    const handleDeleteCourse = (id, title) => {
        Alert.alert(
            "Delete Course",
            `Are you sure you want to delete ${title}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/admin/courses/${id}`);
                            setCourses(courses.filter(course => course._id !== id));
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'Failed to delete course');
                        }
                    }
                }
            ]
        );
    };

    const handleEditCoursePress = (course) => {
        // Edit functionality logic here - keeping it as placeholder per assignment scope (only UI asked)
        Alert.alert("Coming Soon", "Edit course functionality is under development");
    };

    const renderCourseCard = ({ item }) => (
        <View style={styles.courseCard}>
            <View style={styles.courseHeader}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <View style={styles.courseHeaderActions}>
                    <TouchableOpacity onPress={() => handleEditCoursePress(item)} style={styles.iconBtn}>
                        <Ionicons name="pencil" size={18} color="#2196F3" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteCourse(item._id, item.title)} style={styles.iconBtn}>
                        <Ionicons name="trash" size={18} color="#F44336" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.courseInfo}>
                <Text style={styles.courseDesc}>{item.description}</Text>
                <Text style={styles.courseDetails}>
                    Teacher: {item.teacher ? item.teacher.name : <Text style={styles.unassigned}>Unassigned</Text>}
                </Text>
                <Text style={styles.courseDetails}>Students Enrolled: {item.studentCount}</Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionBtn, styles.assignBtn]} onPress={() => openTeacherModal(item._id)}>
                    <Text style={styles.assignBtnText}>Assign Teacher</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.enrollBtn]} onPress={() => openStudentModal(item._id)}>
                    <Text style={styles.enrollBtnText}>Manage Students</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.createBtn} onPress={() => {
                setNewCourse({ ...newCourse, teacherID: teachers.length > 0 ? teachers[0]._id : '' });
                setCreateCourseModalVisible(true)
            }}>
                <Text style={styles.createBtnText}>+ Add Course</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
            ) : (
                <>
                    <FlatList
                        data={courses}
                        keyExtractor={(item) => item._id}
                        renderItem={renderCourseCard}
                        ListEmptyComponent={<Text style={styles.emptyText}>No courses found.</Text>}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />

                    {/* Create Course Modal */}
                    <Modal visible={createCourseModalVisible} transparent={true} animationType="fade">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Create New Course</Text>

                                <Text style={styles.label}>Course Title</Text>
                                <TextInput
                                    style={styles.inputField}
                                    placeholder="e.g. Intro to React"
                                    value={newCourse.title}
                                    onChangeText={(text) => setNewCourse({ ...newCourse, title: text })}
                                />

                                <Text style={styles.label}>Course Description</Text>
                                <TextInput
                                    style={styles.inputField}
                                    placeholder="e.g. Learn the basics..."
                                    value={newCourse.description}
                                    onChangeText={(text) => setNewCourse({ ...newCourse, description: text })}
                                />

                                <Text style={styles.label}>Assign Teacher</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={newCourse.teacherID}
                                        onValueChange={(itemValue) => setNewCourse({ ...newCourse, teacherID: itemValue })}
                                    >
                                        {teachers.map(t => (
                                            <Picker.Item key={t._id} label={t.name} value={t._id} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setCreateCourseModalVisible(false)}>
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleCreateCourse}>
                                        <Text style={styles.saveBtnText}>Create Course</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Teacher Assignment Modal */}
                    <Modal visible={teacherModalVisible} transparent={true} animationType="slide">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Assign Teacher</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedTeacherId}
                                        onValueChange={(itemValue) => setSelectedTeacherId(itemValue)}
                                    >
                                        {teachers.map(t => (
                                            <Picker.Item key={t._id} label={t.name} value={t._id} />
                                        ))}
                                    </Picker>
                                </View>
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setTeacherModalVisible(false)}>
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleAssignTeacher}>
                                        <Text style={styles.saveBtnText}>Assign</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Student Enrollment Modal */}
                    <Modal visible={studentModalVisible} transparent={true} animationType="slide">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Enroll Student</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedStudentId}
                                        onValueChange={(itemValue) => setSelectedStudentId(itemValue)}
                                    >
                                        {students.map(s => (
                                            <Picker.Item key={s._id} label={`${s.name} (${s.email})`} value={s._id} />
                                        ))}
                                    </Picker>
                                </View>
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setStudentModalVisible(false)}>
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleEnrollStudent}>
                                        <Text style={styles.saveBtnText}>Enroll</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    createBtn: {
        backgroundColor: '#E3F2FD',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2196F3',
    },
    createBtnText: {
        color: '#2196F3',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseCard: {
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
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    courseHeaderActions: {
        flexDirection: 'row',
    },
    iconBtn: {
        padding: 4,
        marginLeft: 10,
    },
    courseInfo: {
        marginBottom: 12,
    },
    courseTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 4,
    },
    courseDesc: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    courseDetails: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    unassigned: {
        color: '#F44336',
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        paddingTop: 12,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    assignBtn: {
        backgroundColor: '#E3F2FD',
    },
    assignBtnText: {
        color: '#2196F3',
        fontWeight: '600',
    },
    enrollBtn: {
        backgroundColor: '#2196F3',
    },
    enrollBtnText: {
        color: '#FFF',
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        fontWeight: '600',
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 16,
        backgroundColor: '#F9F9F9',
        fontSize: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#F9F9F9',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelBtn: {
        backgroundColor: '#F5F5F5',
    },
    cancelBtnText: {
        color: '#555',
        fontWeight: '600',
    },
    saveBtn: {
        backgroundColor: '#2196F3',
    },
    saveBtnText: {
        color: '#FFF',
        fontWeight: '600',
    }
});

export default AdminCourseList;
