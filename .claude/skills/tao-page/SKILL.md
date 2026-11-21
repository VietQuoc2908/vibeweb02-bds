---
name: tao-page
description: Tạo một trang web (landing page) hoàn chỉnh, responsive cho dự án NhàĐất Việt – gồm banner giới thiệu, thông tin nổi bật, tiện ích/giá trị, khu vực kêu gọi hành động/liên hệ và JavaScript tương tác. Dùng khi người dùng gõ /tao-page hoặc yêu cầu "tạo trang", "tạo page", "làm landing page" mới trong dự án này.
argument-hint: "[mô tả trang, ví dụ: trang giới thiệu dự án Sky Lake Tower]"
---

# /tao-page – Tạo trang mới

Yêu cầu của người dùng: **$ARGUMENTS**

## 0. Nếu không có mô tả

Nếu `$ARGUMENTS` trống, hỏi đúng **một** câu (dùng AskUserQuestion) về chủ đề trang, gợi ý vài lựa chọn hợp với dự án bất động sản: *Giới thiệu dự án căn hộ*, *Dịch vụ ký gửi nhà đất*, *Tuyển dụng môi giới*, *Về chúng tôi*. Có câu trả lời rồi mới làm tiếp.

## 1. Đọc bối cảnh (bắt buộc, trước khi viết code)

- `.claude/CLAUDE.md` – quy tắc màu, logo, responsive, code. **Mọi quy tắc trong đó đều áp dụng.**
- `index.html` – lấy nguyên khối `<svg>` sprite chứa `<symbol id="logoMark">`, markup `header` và `footer` để trang mới thống nhất.
- `assets/css/style.css` – biến màu (`--primary`, `--text`, …), class dùng chung (`.container`, `.btn`, `.btn-primary`, `.logo…`, header, footer).

## 2. Cấu trúc file

```text
pages/<slug>.html            # Trang mới (bắt buộc)
assets/css/page.css          # Thư viện section landing dùng chung (tạo một lần)
assets/js/page.js            # Tương tác dùng chung cho mọi trang con (tạo một lần)
assets/css/pages/<slug>.css  # Chỉ tạo khi trang cần style riêng
assets/js/pages/<slug>.js    # Chỉ tạo khi trang cần logic riêng
```

- `<slug>`: kebab-case, tiếng Việt **không dấu**, ngắn (vd. `du-an-sky-lake`, `ky-gui-nha-dat`). Nếu file đã tồn tại → hỏi người dùng ghi đè hay đặt tên khác.
- Nếu `assets/css/page.css` hoặc `assets/js/page.js` **chưa có**, sao chép từ `templates/page.css`, `templates/page.js` trong thư mục skill này. Nếu đã có thì dùng lại, chỉ bổ sung (không viết lại) khi thật sự cần component mới.
- Trang con link: `../assets/css/style.css`, `../assets/css/page.css`, `../assets/js/page.js`, favicon `../assets/images/logo.svg`. **Không** nhúng `assets/js/main.js` (chỉ dành cho trang chủ).
- Logo trên header/footer trỏ về `../index.html`.

## 3. Bố cục trang (theo `templates/page.html`)

Bắt đầu từ `templates/page.html`, thay mọi `{{…}}` bằng nội dung thật. Thứ tự section:

| # | Section | Bắt buộc | Nội dung |
|---|---------|----------|----------|
| 1 | Header | ✔ | Như trang chủ; menu là anchor tới các section của trang này + "Trang chủ" |
| 2 | Hero `#gioi-thieu` | ✔ | Eyebrow, tiêu đề H1 ≤ 12 từ, mô tả 1–2 câu, 2 nút (chính → `#lien-he`, phụ → `#tien-ich`), 3 điểm tin cậy |
| 3 | Nổi bật `#noi-bat` | ✔ | 4 chỉ số có `data-count` (đếm tăng dần) |
| 4 | Tiện ích/giá trị `#tien-ich` | ✔ | 6 thẻ (icon emoji + tiêu đề + 1–2 câu) |
| 5 | Section phụ | tùy | Chọn 1–2 cái hợp chủ đề: `split` (ảnh + danh sách), `steps` (quy trình), `testimonials`, `gallery` có tab, `pricing` |
| 6 | FAQ `#hoi-dap` | nên có | 4–5 câu hỏi, accordion |
| 7 | CTA + Liên hệ `#lien-he` | ✔ | Dải CTA + form (họ tên, SĐT, email, nhu cầu `<select>` theo chủ đề, lời nhắn) và khối thông tin liên hệ |
| 8 | Footer | ✔ | Như trang chủ |

Nội dung: **tiếng Việt tự nhiên, cụ thể theo chủ đề** (không lorem ipsum, không chung chung), số liệu và tên đều giả lập, không dùng thương hiệu/người thật. Ảnh: `https://picsum.photos/seed/<slug>-<n>/W/H`, luôn có `alt`.

## 4. CSS & JS

- Ưu tiên class có sẵn trong `page.css` (`.lp-hero`, `.lp-stats`, `.lp-features`, `.lp-split`, `.lp-steps`, `.lp-quotes`, `.lp-faq`, `.lp-cta`, `.lp-contact`, `.reveal`…). Style riêng → `assets/css/pages/<slug>.css`, chỉ dùng biến màu, có dark mode, không style inline.
- `page.js` đã xử lý: menu mobile, cuộn mượt + đánh dấu menu theo section, header đổ bóng khi cuộn, hiệu ứng hiện dần (`.reveal`), đếm số (`data-count`, `data-suffix`), accordion FAQ, tab (`data-tabs`), kiểm tra form liên hệ + toast, nút lên đầu trang. Chỉ gắn đúng thuộc tính/class là chạy.
- Logic riêng → `assets/js/pages/<slug>.js`, thuần JS, kiểm tra phần tử tồn tại trước khi dùng.
- Mọi animation phải tôn trọng `prefers-reduced-motion`.

## 5. Kiểm tra trước khi báo xong

1. `node --check` cho mọi file JS đã tạo/sửa.
2. Chụp màn hình bằng Chrome headless (lưu vào scratchpad):
   - Desktop: `--window-size=1280,2400` mở trực tiếp file.
   - Mobile 390px: tạo file HTML tạm chứa `<iframe src="file://…/pages/<slug>.html" width="390" height="2000">` rồi chụp với `--allow-file-access-from-files`.
   Xem ảnh: không vỡ bố cục, không cuộn ngang, chữ không tràn, nút không xuống dòng xấu. Sửa rồi chụp lại nếu có lỗi.
3. `grep -nE ' on[a-z]+="| style="' pages/<slug>.html` – không được có handler/style inline (ngoại lệ: thẻ `<svg>` sprite).

## 6. Hoàn tất

- Nếu đây là trang đầu tiên trong `pages/`, cập nhật mục "Cấu trúc thư mục" trong `.claude/CLAUDE.md` (thêm `pages/`, `page.css`, `page.js`).
- Báo lại ngắn gọn bằng tiếng Việt: file đã tạo (link markdown), các section đã có, kết quả kiểm tra, và cách mở trang. Hỏi người dùng có muốn thêm link tới trang mới vào menu trang chủ không (không tự sửa `index.html`).
