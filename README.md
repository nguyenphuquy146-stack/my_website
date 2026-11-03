# Portfolio Mini — Bài thi thực hành giữa kỳ

**Học phần:** Lập trình Web (14113015)  
**Sinh viên:** Nguyễn Văn A — MSSV: 14113015

## Cấu trúc dự án

- `index.html` — Trang chính (HTML5 semantic)
- `css/style.scss` — Source SCSS (có biến, nesting, mixin)
- `css/style.css` — File CSS đã biên dịch
- `js/script.js` — Toàn bộ logic JS (Phần 3 + 4)
- `js/data.json` — Dữ liệu mẫu cho danh sách dự án
- `assets/avatar.svg` — Ảnh đại diện

## Cách chạy

1. Mở thư mục bằng VS Code
2. Chuột phải `index.html` → **Open with Live Server**
3. Truy cập `http://localhost:5500` (fetch data.json cần chạy qua http, KHÔNG mở file://)

## Biên dịch SCSS (nếu sửa style.scss)

```bash
sass css/style.scss css/style.css --style=expanded