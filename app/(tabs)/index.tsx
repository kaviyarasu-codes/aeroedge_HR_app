import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle, Calendar, Users } from 'lucide-react-native';

export default function DashboardScreen() {
  const { profile } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}</Text>
        <Text style={styles.name}>{profile?.first_name} {profile?.last_name}</Text>
        <Text style={styles.role}>{profile?.role?.toUpperCase()}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Clock size={24} color="#2563eb" strokeWidth={2} />
          <Text style={styles.statLabel}>Today's Status</Text>
          <Text style={styles.statValue}>Not Checked In</Text>
        </View>

        <View style={styles.statCard}>
          <Calendar size={24} color="#16a34a" strokeWidth={2} />
          <Text style={styles.statLabel}>Leave Balance</Text>
          <Text style={styles.statValue}>-- days</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionCard}>
          <CheckCircle size={20} color="#2563eb" strokeWidth={2} />
          <Text style={styles.actionText}>Mark Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Calendar size={20} color="#2563eb" strokeWidth={2} />
          <Text style={styles.actionText}>Apply for Leave</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563eb', paddingTop: 60, paddingBottom: 32, paddingHorizontal: 24 },
  greeting: { fontSize: 16, color: '#dbeafe', marginBottom: 4 },
  name: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 4 },
  role: { fontSize: 14, color: '#dbeafe', fontWeight: '600' },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, marginTop: -16 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, width: '48%', marginHorizontal: '1%', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  actionText: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginLeft: 12 },
});
