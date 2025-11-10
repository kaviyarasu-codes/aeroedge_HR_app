import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart3, Users, Calendar, Clock, FileText } from 'lucide-react-native';

export default function ReportsScreen() {
  const reports = [
    { id: '1', title: 'Employee Information', icon: Users, color: '#2563eb' },
    { id: '2', title: 'Attendance Reports', icon: Calendar, color: '#16a34a' },
    { id: '3', title: 'Leave Tracker', icon: FileText, color: '#f59e0b' },
    { id: '4', title: 'Time Tracker', icon: Clock, color: '#8b5cf6' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports & Analytics</Text>
        <Text style={styles.subtitle}>View insights and metrics</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <BarChart3 size={24} color="#2563eb" strokeWidth={2} />
            <Text style={styles.summaryTitle}>Quick Stats</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Categories</Text>
          {reports.map((report) => {
            const IconComponent = report.icon;
            return (
              <TouchableOpacity key={report.id} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: report.color + '20' }]}>
                  <IconComponent size={24} color={report.color} strokeWidth={2} />
                </View>
                <Text style={styles.categoryTitle}>{report.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#fff', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 28, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748b' },
  content: { flex: 1 },
  section: { padding: 16 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginLeft: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  categoryCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  categoryIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  categoryTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', flex: 1 },
});
