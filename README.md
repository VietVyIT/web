# Web ban hang thiet bi (Next.js + PostgreSQL + Prisma)

Du an khoi tao theo yeu cau web ban thiet bi cong nghe, co:

- API xac thuc JWT + bcrypt
- Tim kiem/loc/sap xep san pham
- Gio hang, dat hang, voucher
- Phan quyen Admin/Staff/Customer
- Quan ly danh muc, thuong hieu, san pham, serial/IMEI
- Tra cuu bao hanh
- Dockerfile + docker-compose

## 1) Cong nghe

- Next.js 15 (App Router, TypeScript)
- Prisma ORM
- PostgreSQL
- Docker / Docker Compose

## 2) Chay nhanh bang Docker

### B1. Clone repo

```bash
git clone https://github.com/vietvy/web.git
cd web
```

### B2. Tao file env

```bash
cp .env.example .env
```

Neu dung PowerShell:

```powershell
Copy-Item .env.example .env
```

### B3. Build va chay

```bash
docker compose up --build
```

Sau khi chay:

- Web: `http://localhost:3000`
- Postgres: `localhost:5432`

## 3) Cau truc thu muc

```text
.
|-- prisma/
|   `-- schema.prisma
|-- src/
|   |-- app/
|   |   |-- api/
|   |   |   |-- auth/
|   |   |   |-- admin/
|   |   |   |-- cart/
|   |   |   |-- checkout/
|   |   |   |-- orders/
|   |   |   |-- products/
|   |   |   |-- reviews/
|   |   |   `-- warranty/
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   `-- lib/
|       |-- auth.ts
|       |-- prisma.ts
|       |-- request-auth.ts
|       |-- request-body.ts
|       `-- ...
|-- Dockerfile
|-- docker-compose.yml
|-- package.json
`-- README.md
```

## 4) API chinh

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### User

- `GET /api/me`
- `GET /api/me/addresses`
- `POST /api/me/addresses`

### Product

- `GET /api/products?q=&brand=&category=&minPrice=&maxPrice=&sort=`
- `GET /api/products?mode=autocomplete&q=`
- `GET /api/products/compare?id=<id1>&id=<id2>[&id=<id3>]`

### Cart/Order

- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/:itemId`
- `DELETE /api/cart/:itemId`
- `POST /api/checkout`
- `GET /api/orders`
- `POST /api/reviews`

### Warranty

- `GET /api/warranty/lookup?serialOrImei=...`
- `GET /api/warranty/lookup?phone=...`

### Admin/Staff

- `GET,POST /api/admin/categories`
- `GET,POST /api/admin/brands`
- `GET,POST,PATCH /api/admin/products`
- `GET,POST /api/admin/vouchers`
- `GET,POST /api/admin/inventory/serials`
- `GET,PATCH /api/admin/orders`

> Cac API can dang nhap dung `Authorization: Bearer <token>`.

## 5) Luu y bao mat va van hanh

- Password duoc hash bang bcrypt.
- Co kiem tra quyen de tranh truy cap sai role.
- Co kiem tra so huu gio hang/don hang tranh IDOR co ban.
- Ban can dat `JWT_SECRET` manh o moi truong that.
- Ban can tich hop dich vu email de gui OTP that (hien tai co `devOtp` trong moi truong non-production).

## 6) Cấu trúc Cơ sở Dữ liệu (Database Schema)

Cơ sở dữ liệu được thiết kế bám sát vào 7 yêu cầu chính:

1. **Quản lý Người dùng (Auth & Access)**: `User` có Role (CUSTOMER, ADMIN...), liên kết với nhiều `Address` (có cờ `isDefault`).
2. **Danh mục & Biến thể (Catalog & SKU)**: Hỗ trợ phân cấp cha-con (`Category.parentId`), tách biệt Model (`Product`) và SKU (`ProductVariant`). Có bảng `ProductImage` quản lý ảnh, đánh dấu cờ Thumbnail.
3. **Thông số kỹ thuật động**: `Category` và `Product` lưu cấu hình linh hoạt qua cột `specs` (kiểu JSON).
4. **Quản lý Kho & Thiết bị (Serial/IMEI)**: `InventorySerial` lưu từng con máy, gán trạng thái (Trong kho, Đã bán, Bảo hành). `WarrantyRecord` theo dõi lịch sử và kỳ hạn bảo hành.
5. **Đơn hàng & Snapshot**: Khi đặt hàng, `OrderItem` chụp lại cứng (Snapshot) các trường `productName`, `variantName` và `unitPrice`. Mỗi máy xuất kho sẽ gán cụ thể `InventorySerial.orderItemId`.
6. **Đánh giá (Reviews)**: Giới hạn quan hệ duy nhất (`@@unique([userId, productId])`), hỗ trợ lưu trữ mảng danh sách hình ảnh đánh giá (`imageUrls`).
7. **Ràng buộc Toàn vẹn (Constraints)**: 
   - ON DELETE CASCADE: Giỏ hàng, hình ảnh, mã OTP.
   - ON DELETE RESTRICT: Tránh xóa sản phẩm, biến thể, địa chỉ nếu đã có đơn hàng dính dáng.
   - Đánh chỉ mục Index cho các truy vấn nặng như SKU, Mã Order, Trạng thái, Số Serial/IMEI.

*(Lưu ý: Để có các ràng buộc Check Constraints (như giá > 0, tồn kho >= 0) ở mức database engine thay vì chỉ ở code, bạn có thể tạo một raw migration file của Prisma bằng `npx prisma migrate dev --create-only` rồi thêm các lệnh `ALTER TABLE "..." ADD CONSTRAINT "..." CHECK (...);`)*

## 7) Tài khoản Đăng nhập Demo

Hệ thống đã được thiết kế phân quyền cứng với các Role chuẩn. Dưới đây là tài khoản và mật khẩu (đã hash bcrypt) gợi ý để bạn tạo qua Seed:

### Khách hàng (Customer)
- **Email**: khachhang@techstore.vn
- **Password**: Khach@123

### Quản trị viên (Admin)
- **Email**: admin@techstore.vn
- **Password**: Admin@123

