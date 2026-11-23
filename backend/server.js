// Máy chủ Express: phục vụ giao diện tĩnh (frontend/) và API (/api) trên cùng một cổng
const express = require("express");
const { PORT, FRONTEND_DIR } = require("./config");
const listingsRouter = require("./routes/listings");

const app = express();
app.use(express.json());

// ===== API =====
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/listings", listingsRouter);
app.use("/api", (req, res) => res.status(404).json({ error: "API không tồn tại" }));

// ===== Giao diện tĩnh =====
app.use(express.static(FRONTEND_DIR));

// ===== Xử lý lỗi chung =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Lỗi máy chủ" });
});

app.listen(PORT, () => {
  console.log(`HomeLand Viet đang chạy tại http://localhost:${PORT}`);
});
