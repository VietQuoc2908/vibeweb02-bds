// Kết nối SQLite (một tệp .db) – tự tạo bảng và nạp dữ liệu mẫu ở lần chạy đầu
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { DATA_DIR, DB_FILE } = require("../config");

const db = new Database(DB_FILE);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Tạo bảng (an toàn khi chạy lại nhờ IF NOT EXISTS)
db.exec(fs.readFileSync(path.join(DATA_DIR, "schema.sql"), "utf8"));

// Chỉ nạp dữ liệu mẫu khi bảng còn trống
const { n } = db.prepare("SELECT COUNT(*) AS n FROM listings").get();
if (n === 0) {
  db.exec(fs.readFileSync(path.join(DATA_DIR, "seed.sql"), "utf8"));
  console.log("Đã nạp dữ liệu mẫu vào", path.basename(DB_FILE));
}

module.exports = db;
