import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase client đơn giản KHÔNG phụ thuộc vào cookies/request context.
 * Dùng cho các hàm được cache bằng unstable_cache (không thể truy cập cookies).
 * Chỉ dùng cho các truy vấn READ-ONLY công khai (không cần auth người dùng).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
