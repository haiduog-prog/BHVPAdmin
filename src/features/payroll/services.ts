import { createAdminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import { MonthlyAttendance, WorkDay } from './types'

// Hàm gốc fetch dữ liệu chấm công cả tháng cho 1 nhân viên
async function fetchMonthlyAttendance(
  employeeId: string,
  year: number,
  month: number
): Promise<MonthlyAttendance> {
  const supabase = createAdminClient()

  // Tính khoảng thời gian đầu tháng → cuối tháng
  const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`
  const lastDay = new Date(year, month, 0).getDate() // Ngày cuối tháng
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}T23:59:59.999Z`

  // Lấy tên nhân viên
  const { data: empData } = await supabase
    .from('employees')
    .select('name')
    .eq('id', employeeId)
    .single()

  // Lấy toàn bộ log chấm công trong tháng
  const { data: logs, error } = await supabase
    .from('attendance_logs')
    .select('id, scan_time, status')
    .eq('employee_id', employeeId)
    .gte('scan_time', startDate)
    .lte('scan_time', endDate)
    .order('scan_time', { ascending: true })

  if (error) {
    console.warn('Supabase warning (Payroll):', error.message)
  }

  // Nhóm log theo ngày
  const dayMap = new Map<string, { scans: Date[], statuses: string[] }>()
  ;(logs || []).forEach((log: any) => {
    const logDate = new Date(log.scan_time)
    const dateKey = logDate.toISOString().split('T')[0]

    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, { scans: [], statuses: [] })
    }
    dayMap.get(dateKey)!.scans.push(logDate)
    dayMap.get(dateKey)!.statuses.push(log.status)
  })

  // Tạo danh sách WorkDay
  const workDays: WorkDay[] = []
  let totalMinutes = 0

  dayMap.forEach((dayData, dateKey) => {
    const sortedScans = dayData.scans.sort((a, b) => a.getTime() - b.getTime())
    const firstScan = sortedScans[0]
    const lastScan = sortedScans[sortedScans.length - 1]

    let dayMinutes = 0
    if (sortedScans.length > 1) {
      dayMinutes = Math.round((lastScan.getTime() - firstScan.getTime()) / 60000)
    }

    workDays.push({
      date: dateKey,
      firstCheckIn: firstScan.toISOString(),
      lastCheckOut: sortedScans.length > 1 ? lastScan.toISOString() : null,
      totalMinutes: dayMinutes,
      scanCount: sortedScans.length,
    })

    totalMinutes += dayMinutes
  })

  // Sắp xếp theo ngày
  workDays.sort((a, b) => a.date.localeCompare(b.date))

  return {
    employeeId,
    employeeName: empData?.name || 'Không xác định',
    year,
    month,
    workDays,
    totalWorkDays: workDays.length,
    totalMinutes,
  }
}

// Cache wrapper: TTL 5 phút
export async function getMonthlyAttendance(
  employeeId: string,
  year: number,
  month: number
): Promise<MonthlyAttendance> {
  const cachedFetch = unstable_cache(
    () => fetchMonthlyAttendance(employeeId, year, month),
    [`payroll-${employeeId}-${year}-${month}`],
    {
      tags: ['payroll', `payroll-${employeeId}`],
      revalidate: 300, // 5 phút
    }
  )
  return cachedFetch()
}
