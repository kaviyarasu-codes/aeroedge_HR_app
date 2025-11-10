import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Search } from 'lucide-react-native';

export default function EmployeesScreen() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const canViewEmployees = profile?.role === 'admin' || profile?.role === 'hr' || profile?.role === 'manager';

  if (!canViewEmployees) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Employees</Text>
        </View>
        <View style={styles.noAccessContainer}>
          <Users size={48} color="#94a3b8" strokeWidth={2} />
          <Text style={styles.noAccessText}>You don't have permission to view employee list</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employees</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#64748b" strokeWidth={2} />
          <TextInput style={styles.searchInput} placeholder="Search employees..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor="#94a3b8" />
        </View>
      </View>

      <ScrollView style={styles.listContainer}>
        <View style={styles.emptyContainer}>
          <Users size={48} color="#94a3b8" strokeWidth={2} />
          <Text style={styles.emptyText}>No employees yet</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#fff', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 28, fontWeight: '700', color: '#1e293b' },
  searchContainer: { padding: 16, backgroundColor: '#fff' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#1e293b' },
  listContainer: { flex: 1, padding: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64 },
  emptyText: { fontSize: 16, color: '#64748b', marginTop: 16 },
  noAccessContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  noAccessText: { fontSize: 16, color: '#64748b', marginTop: 16, textAlign: 'center' },
});
