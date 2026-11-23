# CLAUDE.md

## Dự án

**HomeLand Viet** – trang demo học tập cho một kênh mua bán, cho thuê nhà đất (tagline "Bất động sản xanh"). Toàn bộ dữ liệu là giả lập. Mọi thứ chạy trên một máy: Express vừa phục vụ giao diện vừa cung cấp API.

### Trang hiện có

- `frontend/index.html` – trang chủ, theo thứ tự:
  1. SVG sprite ẩn chứa `<symbol id="logoMark">`, dùng lại qua `<use href="#logoMark"/>`.
  2. `header` – logo, menu chính `#mainNav`, nút hành động, nút `#menuToggle` (mobile).
  3. `.hero` – ô tìm kiếm với tab `#searchTabs`, bộ lọc.
  4. `#news` – tab `#newsTabs`, tin nổi bật + danh sách.
  5. Tin đăng – lưới `#listings` do JS render, nút `#loadMore`.
  6. Theo địa điểm, `#projects` (dự án), tiện ích, doanh nghiệp, banner app.
  7. `footer` – logo, liên kết, form đăng ký nhận tin.
- `main.js`: mảng `listings` → `render()` hiển thị theo trang (`PAGE = 8`); lưu tin yêu thích (`.fav`, delegate trên `#listings`); `setupTabs(id)` cho mọi nhóm tab; bật/tắt menu mobile.
- `frontend/pages/du-an.html` – trang Dự án (danh sách + lọc + form tư vấn).
- Trang con mới tạo bằng `/tao-page <mô tả>`: dùng chung `assets/css/page.css` và `assets/js/page.js` (sao chép từ `.claude/skills/tao-page/templates/` ở lần chạy đầu). Muốn đổi bố cục mặc định của mọi trang mới thì sửa `templates/`.

### Giao diện

- Tone chủ đạo **xanh lá**, chỉ dùng biến trong `:root`: `--primary #16a34a`, `--primary-dark #15803d`, `--primary-light #4ade80`, `--primary-deep #065f46`. Màu nền/chữ: `--text`, `--muted`, `--border`, `--bg`, `--bg-soft`, `--card`, `--shadow`.
- Dark mode: biến màu mới phải khai báo lại ở cả `@media (prefers-color-scheme: dark)` (với `:root:not([data-theme="light"])`) và `:root[data-theme="dark"]`.
- Bo góc 8px (thẻ, nút), 12px (banner). Đổ bóng dùng `--shadow`. Font Roboto (Google Fonts).
- Logo = SVG mark (nhà + lá, nền gradient xanh) + chữ "HomeLand**Viet**" + tagline. Mark nằm trong `<symbol id="logoMark">` của `index.html`, mọi `pages/*.html` và `assets/images/logo.svg` – sửa logo phải sửa tất cả.
- Responsive: breakpoint `1180px` (menu thu gọn, thẻ tin 2 cột), `720px` (một cột, ẩn `.hide-sm`), `480px` (thẻ 1 cột, logo nhỏ, ẩn tagline). Lề hai bên 16px (`.container`). Kiểm tra ở 1440px, 1280px và 390px sau mỗi thay đổi layout.
- Ảnh luôn có `alt`; nút chỉ có icon phải có `aria-label` hoặc `title`.

## Công nghệ

| Phần | Lựa chọn |
|------|----------|
| Nơi chạy | Tất cả trên một máy (một cổng, mặc định `3000`) |
| Backend | Node 20 + Express 4 (`backend/`), CommonJS |
| Cơ sở dữ liệu | SQLite – một tệp `data/homeland.db` (thư viện `better-sqlite3`) |
| Giao diện | HTML + CSS + JavaScript thuần (`frontend/`) |
| Chạy lên | `npm run dev` → `http://localhost:3000` |

- Dependencies chỉ gồm `express` và `better-sqlite3`; `npm run dev` dùng `node --watch` thay cho nodemon.
- Giao diện vẫn mở được bằng `file://` (dữ liệu mẫu còn nằm ở đầu `main.js`); API chỉ có khi chạy server.
- Truy vấn SQL dùng prepared statement với tham số `?`. API trả JSON, thông báo lỗi tiếng Việt.

## Cấu trúc thư mục

```text
DemoBuoi1/
├── backend/
│   ├── server.js            # Express: phục vụ frontend/ + mount /api
│   ├── config.js            # PORT, đường dẫn frontend/, data/, tệp .db
│   ├── db/
│   │   ├── index.js         # Mở SQLite, chạy schema.sql, nạp seed.sql nếu bảng trống
│   │   └── reset.js         # npm run db:reset
│   └── routes/
│       └── listings.js      # GET /api/listings, GET /api/listings/:id
├── frontend/                # Toàn bộ mã giao diện tĩnh
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css    # Style chung (biến màu, header, footer, trang chủ)
│   │   │   ├── page.css     # Thư viện section landing cho trang con
│   │   │   └── pages/       # Style riêng từng trang con (vd. du-an.css)
│   │   ├── js/
│   │   │   ├── main.js      # Chỉ dành cho trang chủ
│   │   │   ├── page.js      # Tương tác chung cho trang con
│   │   │   └── pages/       # Logic riêng từng trang con (vd. du-an.js)
│   │   └── images/logo.svg  # Logo mark độc lập (dùng làm favicon)
│   ├── pages/               # Trang con (vd. du-an.html)
│   └── index.html           # Trang chủ
├── data/
│   ├── schema.sql           # Cấu trúc bảng
│   ├── seed.sql             # Dữ liệu mẫu giả lập
│   └── homeland.db          # Tự sinh khi chạy, bị .gitignore
├── docs/diagrams/           # Sơ đồ PlantUML (*.puml)
├── .claude/skills/tao-page/ # Skill /tao-page (SKILL.md + templates/)
├── CLAUDE.md
├── package.json             # Script dev/start/db:reset
├── .nvmrc                   # Node 20
├── README.md
└── .gitignore
```

Đường dẫn giao diện (`index.html`, `assets/…`, `pages/…`) tính từ `frontend/`. Route mới đặt trong `backend/routes/`, mount dưới `/api` trong `server.js`.

## Lệnh hay dùng

```bash
npm install                 # Lần đầu (hoặc khi đổi dependencies)
npm run dev                 # Chạy server, tự khởi động lại khi sửa backend
npm start                   # Chạy server không watch
npm run db:reset            # Xóa và tạo lại data/homeland.db từ schema.sql + seed.sql
curl localhost:3000/api/health            # Kiểm tra server
curl "localhost:3000/api/listings?limit=3" # Thử API tin đăng
node --check <file.js>      # Kiểm tra cú pháp JS sau khi sửa
open frontend/index.html    # Xem giao diện không cần server
```

Trong Claude Code: `/tao-page <mô tả>` để tạo trang con mới.

## Quy ước đặt tên

- **File/thư mục**: kebab-case, tiếng Việt không dấu (`du-an.html`, `ky-gui-nha-dat.css`). CSS/JS riêng của trang trùng tên với trang (`pages/du-an.html` ↔ `assets/css/pages/du-an.css`, `assets/js/pages/du-an.js`).
- **CSS class**: kebab-case, ngắn gọn (`.card-title`, `.loc-grid`); class của trang con dùng tiền tố `lp-` (`.lp-hero`). CSS nhóm theo section với tiêu đề `/* ===== Tên ===== */`.
- **HTML id**: camelCase cho phần tử JS dùng tới (`#mainNav`, `#loadMore`); anchor section dùng kebab-case tiếng Việt (`#lien-he`, `#tien-ich`).
- **JavaScript**: biến/hàm camelCase (`setupTabs`), hằng số UPPER_SNAKE_CASE (`PAGE`, `DB_FILE`); chỉ dùng `const`/`let`.
- **SQL**: bảng số nhiều, snake_case (`listings`); cột snake_case (`posted_at`).
- **API**: `/api/<tài-nguyên-số-nhiều>` (`/api/listings`, `/api/listings/:id`); mỗi tài nguyên một file trong `backend/routes/`.
- **Ngôn ngữ**: nội dung hiển thị, comment code, thông báo lỗi API và commit message viết **tiếng Việt**.

## Dữ liệu mẫu

- Mọi dữ liệu là **giả lập**: tên công ty, người, số điện thoại, địa chỉ chi tiết đều bịa; email dùng đuôi `*.example` (vd. `hotro@homelandviet.example`).
- Tin đăng mẫu có ở hai nơi, cần giữ đồng bộ khi sửa: mảng `listings` đầu `frontend/assets/js/main.js` (cho chế độ `file://`) và `data/seed.sql` (cho SQLite).
- `seed.sql` chỉ được nạp khi bảng `listings` trống; sửa seed xong chạy `npm run db:reset`. Đổi cấu trúc bảng thì sửa `data/schema.sql` rồi reset.
- Giá và diện tích lưu dạng chuỗi hiển thị (`"3,2 tỷ"`, `"72 m²"`), địa điểm dạng `"Quận, Tỉnh/Thành"`.
- Ảnh minh họa: `https://picsum.photos/seed/<slug>-<n>/W/H` (seed cố định để ảnh không đổi giữa các lần tải).

## Điều cấm

- **Không** thêm framework, build tool hay thư viện ngoài (React, Tailwind, jQuery, nodemon, ORM…); backend chỉ `express` + `better-sqlite3`.
- **Không** viết style inline hay `<script>` inline/handler `on…=""` trong HTML (ngoại lệ: sprite SVG).
- **Không** hard-code mã màu chủ đạo trong rule CSS – luôn dùng biến `var(--primary…)`.
- **Không** nối chuỗi để tạo câu SQL; luôn dùng prepared statement với tham số `?`.
- **Không** chèn dữ liệu từ API/người dùng vào `innerHTML` khi chưa escape – dùng `textContent` hoặc escape trước.
- **Không** dùng tên, thương hiệu, logo hay dữ liệu cá nhân thật.
- **Không** commit `node_modules/`, `data/*.db`, `.env*`, `.vercel`.
- **Không** để trang cuộn ngang ở bất kỳ độ rộng nào; không trỏ `<use>` sang file SVG ngoài (phải chạy được bằng `file://`).
