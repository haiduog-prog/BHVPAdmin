'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import { DailyTimesheetRecord, ScanLog } from './types'

// Hàm gốc fetch dữ liệu chấm công từ Supabase (dùng admin client, không cần cookies)
async function fetchDailyTimesheet(date: string): Promise<DailyTimesheetRecord[]> {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
      return [] 
    }

    const supabase = createAdminClient()

    const startOfDay = `${date}T00:00:00.000Z`
    const endOfDay = `${date}T23:59:59.999Z`

    const { data: logs, error } = await supabase
      .from('attendance_logs')
      .select(`
        id,
        scan_time,
        status,
        employee_id,
        employees ( id, name )
      `)
      .gte('scan_time', startOfDay)
      .lte('scan_time', endOfDay)
      .order('scan_time', { ascending: true })

    if (error) {
      console.warn('Supabase warning (Attendance):', error.message || JSON.stringify(error))
      return []
    }

    const timesheetMap = new Map<string, DailyTimesheetRecord>()

    ;(logs || []).forEach((log: any) => {
      const empId = log.employee_id
      if (!timesheetMap.has(empId)) {
        timesheetMap.set(empId, {
          employeeId: empId,
          fullName: log.employees?.name || 'Không xác định',
          date: date,
          firstCheckIn: null,
          lastCheckOut: null,
          totalMinutes: 0,
          scanLogs: []
        })
      }

      const record = timesheetMap.get(empId)!
      const logTime = new Date(log.scan_time)

      // Lưu chi tiết từng lần quét
      record.scanLogs.push({
        id: log.id,
        scanTime: log.scan_time,
        status: log.status as 'IN' | 'OUT'
      })

      // Xác định lần quét sớm nhất (Giờ vào)
      if (!record.firstCheckIn || logTime < new Date(record.firstCheckIn)) {
        record.firstCheckIn = log.scan_time
      }

      // Xác định lần quét muộn nhất (Giờ ra)
      if (!record.lastCheckOut || logTime > new Date(record.lastCheckOut)) {
        record.lastCheckOut = log.scan_time
      }
    })

    // Tính tổng số phút làm việc theo từng cặp IN-OUT
    Array.from(timesheetMap.values()).forEach(record => {
      // Sắp xếp lại danh sách quét theo thời gian tăng dần
      record.scanLogs.sort((a, b) => new Date(a.scanTime).getTime() - new Date(b.scanTime).getTime())

      let totalMinutes = 0
      let lastInTime: Date | null = null

      record.scanLogs.forEach(log => {
        if (log.status === 'IN') {
          lastInTime = new Date(log.scanTime)
        } else if (log.status === 'OUT' && lastInTime) {
          const outTime = new Date(log.scanTime)
          const diffMs = outTime.getTime() - lastInTime.getTime()
          if (diffMs > 0) {
            totalMinutes += diffMs / 60000
          }
          lastInTime = null // Reset để đợi lượt IN tiếp theo
        }
      })

      record.totalMinutes = Math.round(totalMinutes)

      // Nếu không có lastCheckOut thì set null (trường hợp quên chấm công ra cuối ngày)
      if (record.scanLogs.length > 0 && record.scanLogs[record.scanLogs.length - 1].status === 'IN') {
         // Đang làm việc, chưa check out
      }
    })

    return Array.from(timesheetMap.values())
  } catch (err: any) {
    console.warn('Supabase client error (Attendance):', err?.message || 'Unknown error')
    return []
  }
}

// Cache thông minh: ngày cũ cache 1 giờ, hôm nay cache 30 giây
export async function calculateDailyTimesheet(date: string): Promise<DailyTimesheetRecord[]> {
  const today = new Date().toISOString().split('T')[0]
  const isToday = date === today

  const cachedFetch = unstable_cache(
    () => fetchDailyTimesheet(date),
    [`attendance-${date}`],
    {
      tags: ['attendance', `attendance-${date}`],
      revalidate: isToday ? 30 : 3600,
    }
  )

  return cachedFetch()
}
