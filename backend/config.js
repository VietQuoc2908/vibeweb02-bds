// Cấu hình chung cho backend – mọi đường dẫn tính từ gốc dự án
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

module.exports = {
  PORT: Number(process.env.PORT) || 3000,
  FRONTEND_DIR: path.join(ROOT, "frontend"),
  DATA_DIR: path.join(ROOT, "data"),
  DB_FILE: path.join(ROOT, "data", "homeland.db"),
};
