import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Clock, MapPin, Home, CheckCircle } from 'lucide-react-native';
import {
  AttendanceRecord,
  WorkMode,
  checkIn,
  checkOut,
  formatClock,
  formatDuration,
  getTodayAttendance,
} from '@/lib/attendance';

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState<WorkMode | 'out' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = useCallback(async () => {
    if (!user) return;
    setError('');
    try {
      setRecord(await getTodayAttendance(user.id));
    } catch (err: any) {
      setError(err?.message || 'Could not load today\'s attendance');
    }
  }, [user]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleCheckIn = async (mode: WorkMode) => {
    setError('');
    setBusy(mode);
    try {
      setRecord(await checkIn(mode));
    } catch (err: any) {
      setError(err?.message || 'Check-in failed');
      await load();
    } finally {
      setBusy(null);
    }
  };

  const handleCheckOut = async () => {
    setError('');
    setBusy('out');
    try {
      setRecord(await checkOut());
    } catch (err: any) {
      setError(err?.message || 'Check-out failed');
      await load();
    } finally {
      setBusy(null);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const modeLabel = record?.mode === 'remote' ? 'Remote' : 'Office';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Attendance</Text>
      </View>

      <View style={styles.timeCard}>
        <Clock size={48} color="#2563eb" strokeWidth={2} />
        <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
      </View>

      <View style={styles.checkInCard}>
        {loading ? (
          <ActivityIndicator color="#2563eb" />
        ) : !record ? (
          <>
            <Text style={styles.checkInTitle}>Ready to start your day?</Text>
            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => handleCheckIn('office')}
              disabled={busy !== null}
              accessibilityRole="button"
              accessibilityLabel="Check in from the office"
            >
              <MapPin size={24} color="#2563eb" strokeWidth={2} />
              <View style={styles.modeButtonContent}>
                <Text style={styles.modeButtonTitle}>Office In</Text>
              </View>
              {busy === 'office' && <ActivityIndicator color="#2563eb" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => handleCheckIn('remote')}
              disabled={busy !== null}
              accessibilityRole="button"
              accessibilityLabel="Check in remotely"
            >
              <Home size={24} color="#16a34a" strokeWidth={2} />
              <View style={styles.modeButtonContent}>
                <Text style={styles.modeButtonTitle}>Remote In</Text>
              </View>
              {busy === 'remote' && <ActivityIndicator color="#16a34a" />}
            </TouchableOpacity>
          </>
        ) : !record.check_out_at ? (
          <>
            <Text style={styles.checkInTitle}>You're checked in</Text>
            <Text style={styles.detail}>
              {modeLabel} · since {formatClock(record.check_in_at)}
            </Text>
            <Text style={styles.hours}>{formatDuration(record.check_in_at)}</Text>
            <Button
              title="Check Out"
              onPress={handleCheckOut}
              loading={busy === 'out'}
              style={styles.checkOutButton}
            />
          </>
        ) : (
          <>
            <View style={styles.doneRow}>
              <CheckCircle size={24} color="#16a34a" strokeWidth={2} />
              <Text style={[styles.checkInTitle, styles.doneTitle]}>Day complete</Text>
            </View>
            <Text style={styles.detail}>
              {modeLabel} · {formatClock(record.check_in_at)} – {formatClock(record.check_out_at)}
            </Text>
            <Text style={styles.hours}>
              {formatDuration(record.check_in_at, record.check_out_at)}
            </Text>
          </>
        )}

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </ScrollView>
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
  detail: { fontSize: 15, color: '#475569', marginTop: -12 },
  hours: { fontSize: 32, fontWeight: '700', color: '#1e293b', marginTop: 12 },
  checkOutButton: { marginTop: 20 },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  doneTitle: { marginBottom: 20, marginLeft: 4 },
  errorText: { color: '#ef4444', fontSize: 14, marginTop: 12, textAlign: 'center' },
});
