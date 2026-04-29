import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All'); // 'All', 'Student', 'Teacher'

    const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Student' });

    const [editUserModalVisible, setEditUserModalVisible] = useState(false);
    const [editUser, setEditUser] = useState({ _id: '', name: '', email: '', role: 'Student' });

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'All' ? '/admin/users' : `/admin/users?role=${activeTab}`;
            const res = await api.get(endpoint);
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id, name) => {
        Alert.alert(
            "Delete User",
            `Are you sure you want to delete ${name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/admin/users/${id}`);
                            setUsers(users.filter(user => user._id !== id));
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'Failed to delete user');
                        }
                    }
                }
            ]
        );
    };

    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        try {
            await api.post('/admin/users', {
                ...newUser,
                password: 'password123' // Default password
            });
            Alert.alert("Success", "User created successfully. Default password is 'password123'");
            setCreateUserModalVisible(false);
            setNewUser({ name: '', email: '', role: 'Student' });
            fetchUsers();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleEditPress = (user) => {
        setEditUser(user);
        setEditUserModalVisible(true);
    };

    const submitEditUser = async () => {
        if (!editUser.name || !editUser.email) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        try {
            await api.patch(`/admin/users/${editUser._id}`, {
                name: editUser.name,
                email: editUser.email,
                role: editUser.role
            });
            Alert.alert("Success", "User updated successfully");
            setEditUserModalVisible(false);
            fetchUsers();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to update user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderUserCard = ({ item }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={styles.roleBadgeContainer}>
                    <Text style={[styles.roleBadge, item.role === 'Teacher' ? styles.teacherBadge : styles.studentBadge]}>
                        {item.role}
                    </Text>
                </View>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => handleEditPress(item)}>
                    <Ionicons name="pencil" size={18} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item._id, item.name)}>
                    <Ionicons name="trash" size={18} color="#F44336" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.createBtn} onPress={() => {
                setNewUser({ name: '', email: '', role: activeTab === 'Teacher' ? 'Teacher' : 'Student' });
                setCreateUserModalVisible(true);
            }}>
                <Text style={styles.createBtnText}>+ Add {activeTab === 'Teacher' ? 'Teacher' : 'Student'}</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.searchInput}
                placeholder="Search by name or email..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
            />

            <View style={styles.tabsContainer}>
                {['All', 'Student', 'Teacher'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item._id}
                    renderItem={renderUserCard}
                    ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

            {/* Create User Modal */}
            <Modal visible={createUserModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Create New {newUser.role}</Text>

                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder="e.g. John Doe"
                            value={newUser.name}
                            onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                        />

                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder="e.g. john@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newUser.email}
                            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                        />

                        <View style={styles.roleSelection}>
                            <TouchableOpacity
                                style={[styles.roleOption, newUser.role === 'Student' && styles.roleSelected]}
                                onPress={() => setNewUser({ ...newUser, role: 'Student' })}
                            >
                                <Text style={[styles.roleOptionText, newUser.role === 'Student' && styles.roleSelectedText]}>Student</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleOption, newUser.role === 'Teacher' && styles.roleSelected]}
                                onPress={() => setNewUser({ ...newUser, role: 'Teacher' })}
                            >
                                <Text style={[styles.roleOptionText, newUser.role === 'Teacher' && styles.roleSelectedText]}>Teacher</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.helperText}>Default password will be set to: password123</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setCreateUserModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleCreateUser}>
                                <Text style={styles.saveBtnText}>Create User</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Edit User Modal */}
            <Modal visible={editUserModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit User</Text>

                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder="e.g. John Doe"
                            value={editUser.name}
                            onChangeText={(text) => setEditUser({ ...editUser, name: text })}
                        />

                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder="e.g. john@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={editUser.email}
                            onChangeText={(text) => setEditUser({ ...editUser, email: text })}
                        />

                        <View style={styles.roleSelection}>
                            <TouchableOpacity
                                style={[styles.roleOption, editUser.role === 'Student' && styles.roleSelected]}
                                onPress={() => setEditUser({ ...editUser, role: 'Student' })}
                            >
                                <Text style={[styles.roleOptionText, editUser.role === 'Student' && styles.roleSelectedText]}>Student</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleOption, editUser.role === 'Teacher' && styles.roleSelected]}
                                onPress={() => setEditUser({ ...editUser, role: 'Teacher' })}
                            >
                                <Text style={[styles.roleOptionText, editUser.role === 'Teacher' && styles.roleSelectedText]}>Teacher</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setEditUserModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={submitEditUser}>
                                <Text style={styles.saveBtnText}>Update User</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    searchInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: 'transparent',
    },
    activeTab: {
        borderColor: '#2196F3',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#777',
    },
    activeTabText: {
        color: '#2196F3',
    },
    userCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E3F2FD',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    roleBadgeContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: '600',
        color: '#FFF',
        overflow: 'hidden', // for iOS border radius
    },
    studentBadge: {
        backgroundColor: '#4CAF50',
    },
    teacherBadge: {
        backgroundColor: '#FF9800',
    },
    actionButtons: {
        justifyContent: 'center',
        marginLeft: 10,
    },
    actionBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginBottom: 8,
        alignItems: 'center',
    },
    editBtn: {
        backgroundColor: '#E3F2FD',
    },
    editBtnText: {
        color: '#2196F3',
        fontSize: 12,
        fontWeight: '600',
    },
    deleteBtn: {
        backgroundColor: '#FFF2F2',
    },
    deleteBtnText: {
        color: '#F44336',
        fontSize: 12,
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
    roleSelection: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    roleOption: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
        backgroundColor: '#F9F9F9',
    },
    roleSelected: {
        borderColor: '#2196F3',
        backgroundColor: '#E3F2FD',
    },
    roleOptionText: {
        color: '#777',
        fontWeight: '600',
    },
    roleSelectedText: {
        color: '#2196F3',
    },
    helperText: {
        fontSize: 12,
        color: '#999',
        marginBottom: 20,
        textAlign: 'center',
        fontStyle: 'italic',
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

export default AdminUserList;
