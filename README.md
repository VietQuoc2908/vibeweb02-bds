# HomeLand Viet (demo)

Trang chủ mẫu cho một kênh mua bán, cho thuê nhà đất – bài thực hành. Node 20 + Express, SQLite (một tệp .db), giao diện HTML/CSS/JS thuần, dữ liệu giả lập.

## Chạy thử

Cần Node 20 trở lên.

```bash
npm install
npm run dev
# rồi mở http://localhost:3000  (API: /api/health, /api/listings)
```

`npm run db:reset` để tạo lại cơ sở dữ liệu từ `data/schema.sql` + `data/seed.sql`.

## Cấu trúc

```text
backend/server.js               Máy chủ Express (giao diện + API)
backend/routes/                 Các route /api
frontend/index.html             Trang chủ
frontend/pages/                 Trang con (vd. du-an.html)
frontend/assets/css/            Giao diện
frontend/assets/js/main.js      Dữ liệu mẫu + tương tác trang chủ
frontend/assets/images/logo.svg Logo / favicon
data/schema.sql, seed.sql       Cấu trúc & dữ liệu mẫu SQLite
package.json                    npm run dev / start / db:reset
docs/diagrams/                  Sơ đồ PlantUML
CLAUDE.md                       Quy tắc & kiến trúc dự án
```
