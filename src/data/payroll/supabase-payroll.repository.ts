// ─── Supabase Repository: Payroll ──────────────────────────────────

import { createAdminClient } from '@/lib/supabase/admin'
import { IPayrollRepository } from '@/domain/payroll/repository'
import { RawPayrollLog } from '@/domain/payroll/entity'
import { toRawPayrollLog } from '@/data/mappers/payroll.mapper'
import { unstable_cache } from 'next/cache'

export class SupabasePayrollRepository implements IPayrollRepository {
  async findEmployeeName(employeeId: string): Promise<string> {
    const supabase = createAdminClient()

    const { data } = await supabase
      .from('employees')
      .select('name')
      .eq('id', employeeId)
      .single()

    return data?.name || 'Không xác định'
  }

  async findLogsByEmployee(
    employeeId: string,
    startISO: string,
    endISO: string
  ): Promise<RawPayrollLog[]> {
    // Cache 5 phút
    const monthKey = startISO.substring(0, 7) // '2026-05'
    const cachedFetch = unstable_cache(
      async () => this.fetchFromSupabase(employeeId, startISO, endISO),
      [`payroll-${employeeId}-${monthKey}`],
      {
        tags: ['payroll', `payroll-${employeeId}`],
        revalidate: 300,
      }
    )

    return cachedFetch()
  }

  // ─── Private: raw Supabase query ──────────────────────────────────

  private async fetchFromSupabase(
    employeeId: string,
    startISO: string,
    endISO: string
  ): Promise<RawPayrollLog[]> {
    const supabase = createAdminClient()

    const { data: logs, error } = await supabase
      .from('attendance_logs')
      .select('id, scan_time, status')
      .eq('employee_id', employeeId)
      .gte('scan_time', startISO)
      .lte('scan_time', endISO)
      .order('scan_time', { ascending: true })

    if (error) {
      console.warn('Supabase warning (Payroll):', error.message)
      return []
    }

    return (logs || []).map(toRawPayrollLog)
  }
}
