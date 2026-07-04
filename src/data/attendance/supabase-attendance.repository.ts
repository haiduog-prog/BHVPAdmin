// ─── Supabase Repository: Attendance ───────────────────────────────

import { createAdminClient } from '@/lib/supabase/admin'
import { IAttendanceRepository } from '@/domain/attendance/repository'
import { RawAttendanceLog } from '@/domain/attendance/entity'
import { toRawAttendanceLog } from '@/data/mappers/attendance.mapper'
import { unstable_cache } from 'next/cache'

export class SupabaseAttendanceRepository implements IAttendanceRepository {
  async findLogsByDateRange(
    startISO: string,
    endISO: string
  ): Promise<RawAttendanceLog[]> {
    // Cache thông minh: ngày cũ cache 1 giờ, hôm nay cache 30 giây
    const dateKey = startISO.split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    const isToday = dateKey === today

    const cachedFetch = unstable_cache(
      async () => this.fetchFromSupabase(startISO, endISO),
      [`attendance-${dateKey}`],
      {
        tags: ['attendance', `attendance-${dateKey}`],
        revalidate: isToday ? 30 : 3600,
      }
    )

    return cachedFetch()
  }

  // ─── Private: raw Supabase query ──────────────────────────────────

  private async fetchFromSupabase(
    startISO: string,
    endISO: string
  ): Promise<RawAttendanceLog[]> {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
        return []
      }

      const supabase = createAdminClient()

      const { data: logs, error } = await supabase
        .from('attendance_logs')
        .select(`
          id,
          scan_time,
          status,
          employee_id,
          employees ( id, name )
        `)
        .gte('scan_time', startISO)
        .lte('scan_time', endISO)
        .order('scan_time', { ascending: true })

      if (error) {
        console.warn('Supabase warning (Attendance):', error.message || JSON.stringify(error))
        return []
      }

      return (logs || []).map(toRawAttendanceLog)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.warn('Supabase client error (Attendance):', message)
      return []
    }
  }
}
