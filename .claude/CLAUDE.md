# HomeLand Viet – Quy tắc & kiến trúc dự án

Trang demo học tập: trang chủ một kênh mua bán/cho thuê nhà đất. Toàn bộ dữ liệu là giả lập, không có backend.

## Công nghệ

- HTML + CSS + JavaScript thuần. **Không** framework, **không** build tool, **không** npm.
- Font: Roboto (Google Fonts). Ảnh minh họa: `picsum.photos` (seed cố định).
- Chạy: mở thẳng `index.html` trong trình duyệt, hoặc `python3 -m http.server` rồi vào `http://localhost:8000`.

## Cấu trúc thư mục

```text
DemoBuoi1/
├── .claude/
│   ├── CLAUDE.md          # File này: quy tắc & kiến trúc
│   └── skills/tao-page/   # Skill /tao-page: tạo trang con mới (SKILL.md + templates/)
├── assets/
│   ├── css/
│   │   ├── style.css      # Style chung (biến màu, header, footer, trang chủ)
│   │   ├── page.css       # Thư viện section landing cho trang con
│   │   └── pages/         # Style riêng từng trang con (vd. du-an.css)
│   ├── js/
│   │   ├── main.js        # Chỉ dành cho trang chủ
│   │   ├── page.js        # Tương tác chung cho trang con
│   │   └── pages/         # Logic riêng từng trang con (vd. du-an.js)
│   └── images/logo.svg    # Logo mark độc lập (dùng làm favicon)
├── pages/
│   └── du-an.html         # Trang Dự án (danh sách + lọc + form tư vấn)
├── index.html             # Trang chủ
└── README.md
```

## Kiến trúc trang (`index.html`, theo thứ tự)

1. SVG sprite ẩn chứa `<symbol id="logoMark">` – dùng lại qua `<use href="#logoMark"/>`.
2. `header` – logo, menu chính `#mainNav`, nút hành động, nút `#menuToggle` (mobile).
3. `.hero` – ô tìm kiếm với tab `#searchTabs`, bộ lọc.
4. `#news` – tab `#newsTabs`, tin nổi bật + danh sách.
5. Tin đăng – lưới `#listings` do JS render, nút `#loadMore`.
6. Theo địa điểm, `#projects` (dự án), tiện ích, doanh nghiệp, banner app.
7. `footer` – logo, liên kết, form đăng ký nhận tin.

`main.js`: mảng `listings` → `render()` hiển thị theo trang (`PAGE = 8`); lưu tin yêu thích (`.fav`, delegate trên `#listings`); `setupTabs(id)` cho mọi nhóm tab; bật/tắt menu mobile.

## Quy tắc

### Màu & giao diện

- Tone chủ đạo **xanh lá**. Chỉ dùng biến trong `:root`: `--primary #16a34a`, `--primary-dark #15803d`, `--primary-light #4ade80`, `--primary-deep #065f46`. Không hard-code mã màu chủ đạo trong rule.
- Màu nền/chữ dùng `--text`, `--muted`, `--border`, `--bg`, `--bg-soft`, `--card`, `--shadow`.
- Hỗ trợ dark mode: khi thêm biến màu mới phải khai báo lại ở cả `@media (prefers-color-scheme: dark)` (với `:root:not([data-theme="light"])`) và `:root[data-theme="dark"]`.
- Bo góc 8px (thẻ, nút), 12px (banner). Đổ bóng dùng `--shadow`.

### Logo

- Logo = SVG mark (nhà + lá, nền gradient xanh) + chữ "HomeLand**Viet**" + tagline "Bất động sản xanh".
- Logo mark có trong `<symbol id="logoMark">` của `index.html`, mọi file `pages/*.html` và `assets/images/logo.svg`. Sửa logo phải sửa tất cả các nơi này.
- Giữ sprite inline (không trỏ `<use>` sang file ngoài) để trang vẫn chạy khi mở bằng `file://`.

### Responsive

- Breakpoint: `1180px` (menu thu gọn, thẻ tin 2 cột), `720px` (một cột, ẩn `.hide-sm`), `480px` (thẻ 1 cột, logo nhỏ, ẩn tagline trên header).
- Không được để trang cuộn ngang; lề hai bên 16px (`.container`).
- Kiểm tra ở ít nhất 1440px, 1280px và 390px sau mỗi thay đổi layout.

### Code

- Toàn bộ nội dung hiển thị bằng **tiếng Việt**; comment trong code viết tiếng Việt.
- CSS nhóm theo section với tiêu đề `/* ===== Tên ===== */`; class đặt tên kebab-case, ngắn gọn (`.card-title`, `.loc-grid`).
- Không viết style inline hay `<script>` inline trong HTML (trừ sprite SVG); style vào `style.css`, logic vào `main.js`.
- JS: `const`/`let`, không dùng thư viện ngoài; dữ liệu mẫu đặt ở đầu `main.js`.
- Ảnh luôn có `alt`; nút chỉ có icon phải có `aria-label` hoặc `title`.
- Dữ liệu (tên công ty, số điện thoại, email `*.example`) luôn là giả lập; không dùng tên/thương hiệu thật.

## Tạo trang mới

Dùng lệnh `/tao-page <mô tả>`. Trang con nằm trong `pages/`, dùng chung `assets/css/page.css` và `assets/js/page.js` (được sao chép từ `.claude/skills/tao-page/templates/` ở lần chạy đầu). Muốn đổi bố cục mặc định của mọi trang mới thì sửa các file trong `templates/`.
