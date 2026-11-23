-- Cấu trúc cơ sở dữ liệu HomeLand Viet (SQLite)
CREATE TABLE IF NOT EXISTS listings (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT    NOT NULL,
  price      TEXT    NOT NULL,          -- Giá hiển thị, vd. "3,2 tỷ"
  area       TEXT    NOT NULL,          -- Diện tích hiển thị, vd. "72 m²"
  location   TEXT    NOT NULL,
  photos     INTEGER NOT NULL DEFAULT 0,
  vip        INTEGER NOT NULL DEFAULT 0, -- 0/1
  posted_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
