import { supabase } from '@/lib/supabase';

export type WorkMode = 'office' | 'remote';

export interface AttendanceRecord {
  id: string;
  user_id: string;
  work_date: string; // YYYY-MM-DD
  mode: WorkMode;
  check_in_at: string;
  check_out_at: string | null;
}

/** The device's IANA time zone, e.g. "Asia/Kolkata". */
export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
}

/** Today's record for the signed-in user, or null if not checked in yet. */
export async function getTodayAttendance(userId: string): Promise<AttendanceRecord | null> {
  const { data: today, error: dateError } = await supabase.rpc('attendance_today', {
    p_timezone: deviceTimeZone(),
  });
  if (dateError) throw dateError;

  const { data, error } = await supabase
    .from('attendance_records')
    .select('id, user_id, work_date, mode, check_in_at, check_out_at')
    .eq('user_id', userId)
    .eq('work_date', today as string)
    .maybeSingle();
  if (error) throw error;
  return (data as AttendanceRecord | null) ?? null;
}

export async function checkIn(mode: WorkMode): Promise<AttendanceRecord> {
  const { data, error } = await supabase.rpc('check_in', {
    p_mode: mode,
    p_timezone: deviceTimeZone(),
  });
  if (error) throw error;
  return data as AttendanceRecord;
}

export async function checkOut(): Promise<AttendanceRecord> {
  const { data, error } = await supabase.rpc('check_out', {
    p_timezone: deviceTimeZone(),
  });
  if (error) throw error;
  return data as AttendanceRecord;
}

/** "8h 05m" between two instants (end defaults to now). */
export function formatDuration(startIso: string, endIso?: string | null): string {
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  const mins = Math.max(0, Math.floor((end - new Date(startIso).getTime()) / 60000));
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
