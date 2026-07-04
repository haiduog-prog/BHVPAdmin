# Customers
 
> Tổng hợp kiến thức về xây dựng module quản lý khách hàng (Customers) trong dự án.
> Cập nhật lần cuối: 2026-07-04
 
---
 
## Architecture
 
### Clean Architecture cho Module Khách hàng
- **Ngày**: 2026-07-04
- **Chi tiết**: Phân tách rõ ràng module Customers thành các tầng Domain (Entity, Repository Contract, Use Cases), Data (Supabase Repository, Mappers), DI (wiring in container.ts), Presentation (Server Actions), và UI Pages. Điều này giúp logic nghiệp vụ độc lập hoàn toàn với database và dễ dàng tái sử dụng khi liên kết vào module Đơn hàng sau này.
- **Files liên quan**: `src/domain/customers/`, `src/data/customers/`, `src/di/container.ts`, `src/features/customers/`, `src/app/(dashboard)/customers/`
 
---
 
## Bugs & Solutions
 
### Sửa lỗi ESLint react-hooks/set-state-in-effect
- **Ngày**: 2026-07-04
- **Vấn đề**: Trình biên dịch báo lỗi `Avoid calling setState() directly within an effect` khi dùng `setIsOpen(false)` khi `pathname` thay đổi hoặc `setError(null)` khi `customer` thay đổi.
- **Root cause**: Gọi setState đồng bộ trong `useEffect` gây ra render lặp (cascading renders) ảnh hưởng hiệu năng.
- **Fix**: Loại bỏ `useEffect` và chuyển sang pattern điều chỉnh state trực tiếp trong render body bằng cách so sánh prop hiện tại với prop cũ được lưu trữ.
- **Files liên quan**: `src/components/MobileSidebar.tsx`, `src/features/customers/components/EditCustomerModal.tsx`
 
---
 
## How-To
 
### Khởi tạo dữ liệu mock dự phòng tại Repository
- **Ngày**: 2026-07-04
- **Bước thực hiện**:
  1. Kiểm tra môi trường local qua URL Supabase (nếu là `'your_supabase_project_url'`).
  2. Định nghĩa một mảng in-memory mock để lưu trữ tạm thời trên RAM.
  3. Điều hướng các hàm CRUD (`findAll`, `create`, `update`, `delete`) sang mảng in-memory khi ở chế độ fallback.
  4. Giúp chạy thử đầy đủ luồng Xem/Thêm/Sửa/Xoá offline trực tiếp trên browser mà không lỗi.
- **Files liên quan**: `src/data/customers/supabase-customer.repository.ts`
 
---
 
## Patterns
 
### Reset state khi thay đổi Prop (Render-time adjustment)
- **Ngày**: 2026-07-04
- **Chi tiết**: Sử dụng pattern so sánh giá trị cũ của prop ngay trong render body để cập nhật state đồng bộ mà không cần useEffect.
- **Ví dụ code**:
  ```typescript
  const [prevCustomer, setPrevCustomer] = useState<Customer>(customer)
  if (customer.id !== prevCustomer.id) {
    setPrevCustomer(customer)
    setError(null)
  }
  ```
- **Files liên quan**: `src/features/customers/components/EditCustomerModal.tsx`, `src/components/MobileSidebar.tsx`
