// Xóa tệp .db để lần chạy sau tạo lại từ schema.sql + seed.sql
const fs = require("fs");
const { DB_FILE } = require("../config");

for (const f of [DB_FILE, `${DB_FILE}-wal`, `${DB_FILE}-shm`]) {
  if (fs.existsSync(f)) fs.unlinkSync(f);
}
require("./index");
console.log("Đã tạo lại cơ sở dữ liệu.");
