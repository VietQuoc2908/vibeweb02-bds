// API tin đăng: GET /api/listings?limit=8&offset=0
const express = require("express");
const db = require("../db");

const router = express.Router();

const listStmt = db.prepare(
  "SELECT id, title, price, area, location, photos, vip, posted_at FROM listings ORDER BY vip DESC, id LIMIT ? OFFSET ?"
);
const countStmt = db.prepare("SELECT COUNT(*) AS total FROM listings");
const oneStmt = db.prepare("SELECT * FROM listings WHERE id = ?");

router.get("/", (req, res) => {
  // Giới hạn tham số để tránh truy vấn quá lớn
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 50);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
  const items = listStmt.all(limit, offset).map((r) => ({ ...r, vip: Boolean(r.vip) }));
  res.json({ total: countStmt.get().total, items });
});

router.get("/:id", (req, res) => {
  const row = oneStmt.get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: "Không tìm thấy tin đăng" });
  res.json({ ...row, vip: Boolean(row.vip) });
});

module.exports = router;
