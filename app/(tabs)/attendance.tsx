import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Clock, MapPin, Home } from 'lucide-react-native';

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance</Text>
      </View>

      <View style={styles.timeCard}>
        <Clock size={48} color="#2563eb" strokeWidth={2} />
        <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
      </View>

      <View style={styles.checkInCard}>
        <Text style={styles.checkInTitle}>Ready to start your day?</Text>
        <TouchableOpacity style={styles.modeButton}>
          <MapPin size={24} color="#2563eb" strokeWidth={2} />
          <View style={styles.modeButtonContent}>
            <Text style={styles.modeButtonTitle}>Office In</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeButton}>
          <Home size={24} color="#16a34a" strokeWidth={2} />
          <View style={styles.modeButtonContent}>
            <Text style={styles.modeButtonTitle}>Remote In</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#fff', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1e293b' },
  timeCard: { backgroundColor: '#fff', margin: 16, padding: 32, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  currentTime: { fontSize: 36, fontWeight: '700', color: '#1e293b', marginTop: 16 },
  checkInCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  checkInTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 20 },
  modeButton: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 12 },
  modeButtonContent: { marginLeft: 16, flex: 1 },
  modeButtonTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
});
