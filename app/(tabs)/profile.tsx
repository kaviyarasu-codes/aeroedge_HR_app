import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  LogOut,
  Shield,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from('employees')
        .select(`
          *,
          designations (
            title
          ),
          departments (
            name
          ),
          locations (
            name,
            city
          )
        `)
        .eq('user_id', profile.id)
        .maybeSingle();

      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: () => {
          signOut();
        },
        style: 'destructive',
      },
    ]);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#dc2626';
      case 'hr':
        return '#2563eb';
      case 'manager':
        return '#f59e0b';
      case 'employee':
        return '#16a34a';
      default:
        return '#64748b';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profile
              ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`
              : 'NA'}
          </Text>
        </View>

        <Text style={styles.profileName}>
          {profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown'}
        </Text>

        <View
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleColor(profile?.role || '') + '20' },
          ]}
        >
          <Shield size={16} color={getRoleColor(profile?.role || '')} strokeWidth={2} />
          <Text
            style={[
              styles.roleBadgeText,
              { color: getRoleColor(profile?.role || '') },
            ]}
          >
            {profile?.role?.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <View style={styles.infoRow}>
          <Mail size={20} color="#64748b" strokeWidth={2} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile?.email}</Text>
          </View>
        </View>

        {profile?.phone && (
          <View style={styles.infoRow}>
            <Phone size={20} color="#64748b" strokeWidth={2} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile.phone}</Text>
            </View>
          </View>
        )}
      </View>

      {employee && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employee Information</Text>

            <View style={styles.infoRow}>
              <Briefcase size={20} color="#64748b" strokeWidth={2} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Designation</Text>
                <Text style={styles.infoValue}>
                  {employee.designations?.title || 'Not set'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Building2 size={20} color="#64748b" strokeWidth={2} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>
                  {employee.departments?.name || 'Not set'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <User size={20} color="#64748b" strokeWidth={2} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Employee Code</Text>
                <Text style={styles.infoValue}>{employee.employee_code}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employment Type</Text>
              <Text style={styles.infoValue}>
                {employee.employment_type.replace('_', ' ')}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Work Mode</Text>
              <Text style={styles.infoValue}>{employee.work_mode}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Joining Date</Text>
              <Text style={styles.infoValue}>
                {new Date(employee.joining_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Privacy Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Notifications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
});
