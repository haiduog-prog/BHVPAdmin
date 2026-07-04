// ─── Repository Interface: Attendance ──────────────────────────────

import { RawAttendanceLog } from './entity'

export interface IAttendanceRepository {
  /**
   * Lấy danh sách raw attendance logs trong khoảng thời gian.
   * Repository CHỈ chịu trách nhiệm fetch raw data — logic tính toán thuộc Use Case.
   */
  findLogsByDateRange(startISO: string, endISO: string): Promise<RawAttendanceLog[]>
}
