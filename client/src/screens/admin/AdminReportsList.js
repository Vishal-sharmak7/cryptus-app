import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import api from '../../services/api';

const AdminReportsList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await api.get('/admin/weekly-report');
            setReports(res.data.report || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderReportCard = ({ item }) => (
        <View style={styles.reportCard}>
            <View style={styles.dateHeader}>
                <Text style={styles.dateText}>{new Date(item._id).toLocaleDateString()}</Text>
                <Text style={styles.percentageText}>{item.attendancePercentage?.toFixed(1) || 0}% Approved</Text>
            </View>
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total</Text>
                    <Text style={styles.statValue}>{item.totalAttendance}</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={[styles.statLabel, { color: '#4CAF50' }]}>Approved</Text>
                    <Text style={[styles.statValue, { color: '#4CAF50' }]}>{item.approvedCount}</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={[styles.statLabel, { color: '#FF9800' }]}>Pending</Text>
                    <Text style={[styles.statValue, { color: '#FF9800' }]}>{item.pendingCount}</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#FFEBEE' }]}>
                    <Text style={[styles.statLabel, { color: '#F44336' }]}>Rejected</Text>
                    <Text style={[styles.statValue, { color: '#F44336' }]}>{item.rejectedCount}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
            ) : (
                <FlatList
                    data={reports}
                    keyExtractor={(item) => item._id}
                    renderItem={renderReportCard}
                    ListEmptyComponent={<Text style={styles.emptyText}>No attendance records for the past 7 days.</Text>}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
    loader: { flex: 1, justifyContent: 'center' },
    reportCard: {
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
    dateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 8,
    },
    dateText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    percentageText: { fontSize: 14, fontWeight: 'bold', color: '#2196F3' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statBox: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    statLabel: { fontSize: 12, color: '#777', marginBottom: 4, fontWeight: '600' },
    statValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    emptyText: { textAlign: 'center', color: '#999', marginTop: 20 }
});

export default AdminReportsList;
