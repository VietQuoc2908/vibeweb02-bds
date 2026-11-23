// Dữ liệu tin đăng mẫu
const listings = [
  { title: "Bán căn hộ 2PN view sông, full nội thất, sổ hồng lâu dài", price: "3,2 tỷ", area: "72 m²", loc: "Quận 7, Hồ Chí Minh", photos: 12, vip: true, time: "Đăng hôm nay" },
  { title: "Nhà phố 4 tầng mặt tiền kinh doanh, gần chợ, đường ô tô tránh nhau", price: "8,5 tỷ", area: "60 m²", loc: "Cầu Giấy, Hà Nội", photos: 9, vip: true, time: "Đăng hôm nay" },
  { title: "Đất nền khu đô thị mới, hạ tầng hoàn thiện, pháp lý rõ ràng", price: "1,8 tỷ", area: "100 m²", loc: "Thuận An, Bình Dương", photos: 6, vip: false, time: "Đăng hôm qua" },
  { title: "Cho thuê căn hộ studio mới 100%, gần trung tâm, có ban công", price: "7 triệu/tháng", area: "35 m²", loc: "Hải Châu, Đà Nẵng", photos: 8, vip: false, time: "Đăng 2 ngày trước" },
  { title: "Biệt thự song lập sân vườn rộng, khu compound an ninh 24/7", price: "18 tỷ", area: "220 m²", loc: "Thủ Đức, Hồ Chí Minh", photos: 15, vip: true, time: "Đăng hôm nay" },
  { title: "Nhà riêng 3 tầng ngõ rộng, cách phố 30m, tiện ích đầy đủ", price: "5,1 tỷ", area: "42 m²", loc: "Đống Đa, Hà Nội", photos: 7, vip: false, time: "Đăng 3 ngày trước" },
  { title: "Shophouse chân đế chung cư cao cấp, đang có hợp đồng thuê", price: "12 tỷ", area: "120 m²", loc: "Nam Từ Liêm, Hà Nội", photos: 10, vip: true, time: "Đăng hôm qua" },
  { title: "Cho thuê nhà nguyên căn 1 trệt 2 lầu, phù hợp văn phòng", price: "25 triệu/tháng", area: "90 m²", loc: "Bình Thạnh, Hồ Chí Minh", photos: 5, vip: false, time: "Đăng 4 ngày trước" },
  { title: "Bán lô đất view biển, thích hợp xây homestay nghỉ dưỡng", price: "4,6 tỷ", area: "150 m²", loc: "Sơn Trà, Đà Nẵng", photos: 11, vip: false, time: "Đăng 5 ngày trước" },
  { title: "Căn hộ 3PN góc, 2 mặt thoáng, tầng trung đẹp, nhận nhà ngay", price: "4,9 tỷ", area: "98 m²", loc: "Long Biên, Hà Nội", photos: 13, vip: true, time: "Đăng hôm nay" },
  { title: "Nhà cấp 4 có gác lửng, sổ riêng, khu dân cư hiện hữu", price: "1,35 tỷ", area: "80 m²", loc: "Biên Hòa, Đồng Nai", photos: 4, vip: false, time: "Đăng 1 tuần trước" },
  { title: "Penthouse thông tầng, sân vườn riêng trên cao, view toàn thành phố", price: "25 tỷ", area: "310 m²", loc: "Quận 2, Hồ Chí Minh", photos: 20, vip: true, time: "Đăng hôm qua" },
];

const PAGE = 8;
let shown = 0;
const grid = document.getElementById("listings");
const loadMoreBtn = document.getElementById("loadMore");

function render() {
  const next = listings.slice(shown, shown + PAGE);
  next.forEach((it, i) => {
    const idx = shown + i;
    const el = document.createElement("a");
    el.href = "#";
    el.className = "card";
    el.innerHTML = `
      <div class="card-img">
        <img src="https://picsum.photos/seed/house${idx}/400/300" alt="" loading="lazy" />
        ${it.vip ? '<span class="badge">VIP</span>' : ""}
        <span class="photo-count">📷 ${it.photos}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${it.title}</div>
        <div class="card-meta">${it.price}<span>·</span>${it.area}</div>
        <div class="card-loc">📍 ${it.loc}</div>
        <div class="card-foot"><span>${it.time}</span><button class="fav" title="Lưu tin">♡</button></div>
      </div>`;
    grid.appendChild(el);
  });
  shown += next.length;
  if (shown >= listings.length) loadMoreBtn.style.display = "none";
}
render();
loadMoreBtn.addEventListener("click", render);

// Lưu tin yêu thích
grid.addEventListener("click", e => {
  const btn = e.target.closest(".fav");
  if (!btn) return;
  e.preventDefault();
  btn.classList.toggle("on");
  btn.textContent = btn.classList.contains("on") ? "♥" : "♡";
});

// Tabs chuyển đổi
function setupTabs(id) {
  const wrap = document.getElementById(id);
  wrap.addEventListener("click", e => {
    if (e.target.tagName !== "BUTTON") return;
    wrap.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
  });
}
setupTabs("searchTabs");
setupTabs("newsTabs");

// Menu mobile
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});

// Form tìm kiếm & đăng ký nhận tin (demo)
document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Đang tìm: " + e.target.q.value);
});
document.getElementById("newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Đăng ký thành công!");
  e.target.reset();
});
