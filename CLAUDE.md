# Project Context: Signage Company Management Dashboard

## 1. Project Overview
* **Goal:** Xây dựng hệ thống quản lý nội bộ toàn diện cho công ty biển hiệu (Signage Company).
* **Current Phase:** Xây dựng Module Nhân sự & Chấm công (HR & Attendance). Đã hỗ trợ tính năng Offline-first Face Recognition trên thiết bị Kiosk Android.
* **Future Phases:** Quản lý Đơn hàng (Orders), Thống kê Thu chi (Expenses), Quản lý Kho vật tư (Inventory).

## 2. Tech Stack Core
* **Frontend:** Next.js 14+ (App Router), React, TypeScript.
* **Styling:** Tailwind CSS, shadcn/ui (nếu có dùng thư viện component).
* **Backend/Database:** Supabase (PostgreSQL), `@supabase/ssr` cho việc gọi API từ server/client.
* **Biometric Sync (Android Kiosk):** Đồng bộ dữ liệu chấm công định dạng `FloatArray` (từ TFLite MobileFaceNet/FaceNet) lên PostgreSQL.

## 3. Architecture Strict Rules: Feature-Based (Domain-Driven)
Dự án BẮT BUỘC tuân thủ cấu trúc thư mục Feature-Based để đảm bảo khả năng mở rộng. Không viết logic kinh doanh (business logic) trực tiếp vào thư mục `app/`.

### Directory Structure:
```text
src/
├── app/                  # Chỉ chứa Routing (page.tsx, layout.tsx, loading.tsx). Giao diện tĩnh và gọi Server Components.
├── components/           # Chỉ chứa Global/Shared UI Components (Button, Navbar, Sidebar, Modal).
├── lib/                  # Global utilities, Supabase client init, Formatters (date, currency).
└── features/             # CHỨA TOÀN BỘ DOMAIN LOGIC
    ├── employees/        # Module Nhân viên
    │   ├── actions.ts    # Next.js Server Actions (Mutations: Insert, Update, Delete)
    │   ├── services.ts   # Data Fetching (Queries từ Supabase)
    │   ├── components/   # UI Component đặc thù của module này (EmployeeTable, EmployeeForm)
    │   └── types.ts      # TypeScript Interfaces (Employee, EmployeeFormData)
    ├── attendance/       # Module Chấm công
    ├── orders/           # Module Đơn hàng (Future)
    └── expenses/         # Module Thu chi (Future)
    
## 4. Coding Conventions & Best Practices
Ngôn ngữ UI chính: Toàn bộ giao diện hiển thị cho người dùng (UI text, placeholder, table headers) BẮT BUỘC phải dùng Tiếng Việt.

Next.js & React
Server Components First: Mặc định sử dụng Server Components (RSC) cho việc fetch data. Chỉ dùng "use client" khi component cần quản lý state (useState, useEffect) hoặc cần tương tác người dùng (onClick, onChange).

Data Mutations: Luôn sử dụng Server Actions ("use server") đặt trong file actions.ts của từng feature để thêm/sửa/xóa dữ liệu. Không dùng API Routes (app/api/...) trừ khi tích hợp với Webhook bên thứ 3.

Props: Luôn định nghĩa rõ ràng TypeScript interface cho Props của component.

Supabase & Data Fetching
Client Setup: Sử dụng @supabase/ssr để khởi tạo client. Dùng hàm createServerClient cho Server Components/Actions và createBrowserClient cho Client Components.

Type Safety: Sử dụng Supabase Type Generation (lệnh supabase gen types typescript). Tránh dùng kiểu any.

Styling
Sử dụng Tailwind CSS tiện ích.

Thiết kế giao diện theo hướng Dashboard: Clean, chuyên nghiệp, tối ưu hóa hiển thị bảng biểu (Tables) và Form nhập liệu.

Đảm bảo UI Responsive tốt trên màn hình Desktop và Tablet (iPad).

## 5. Current Database Schema (Draft)
employees: id (UUID), name (text), face_vector (text/pgvector), is_active (boolean), created_at (timestamptz).

attendance_logs: id (UUID), employee_id (UUID, FK), scan_time (timestamptz), device_id (text), status (text - 'IN', 'OUT').

## 6. How AI Should Assist
When asked to create a new feature: Luôn bắt đầu bằng việc tạo thư mục mới trong src/features/. Sinh ra các file types.ts, services.ts, actions.ts và components/ tương ứng.

When writing code: Ưu tiên code ngắn gọn, rõ ràng, tuân thủ TypeScript. Kèm theo comment tiếng Việt giải thích logic phức tạp.

Refactoring: Nếu thấy code vi phạm cấu trúc Feature-Based, chủ động đề xuất cấu trúc lại mã nguồn.