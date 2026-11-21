// ===== Trang Dự án: dữ liệu mẫu, bộ lọc và chọn nhanh dự án vào form =====
(() => {
  const projects = [
    { name: "Riverside Garden Residence", region: "TP. Hồ Chí Minh", district: "Thủ Đức", type: "Căn hộ", status: "open", price: "45 – 60 triệu/m²", size: "4,2 ha", units: "1.250 căn", handover: "Quý IV/2027" },
    { name: "Sky Lake Tower", region: "Hà Nội", district: "Nam Từ Liêm", type: "Căn hộ", status: "soon", price: "55 – 75 triệu/m²", size: "2,1 ha", units: "860 căn", handover: "Quý II/2028" },
    { name: "Ocean Bay Villas", region: "Đà Nẵng", district: "Ngũ Hành Sơn", type: "Biệt thự", status: "open", price: "12 – 25 tỷ/căn", size: "8,5 ha", units: "180 căn", handover: "Quý I/2027" },
    { name: "Green Valley Thuận An", region: "Bình Dương", district: "Thuận An", type: "Căn hộ", status: "open", price: "32 – 40 triệu/m²", size: "3,6 ha", units: "1.480 căn", handover: "Quý III/2027" },
    { name: "Lotus Park Long Biên", region: "Hà Nội", district: "Long Biên", type: "Nhà phố", status: "open", price: "14 – 19 tỷ/căn", size: "5,0 ha", units: "240 căn", handover: "Quý IV/2026" },
    { name: "Mây Xanh Garden", region: "TP. Hồ Chí Minh", district: "Quận 7", type: "Căn hộ", status: "done", price: "52 – 68 triệu/m²", size: "1,8 ha", units: "720 căn", handover: "Đã bàn giao" },
    { name: "Hải Vân Riverside", region: "Đà Nẵng", district: "Sơn Trà", type: "Căn hộ", status: "soon", price: "48 – 62 triệu/m²", size: "1,5 ha", units: "540 căn", handover: "Quý I/2029" },
    { name: "Phú Lộc Land", region: "Bình Dương", district: "Bến Cát", type: "Đất nền", status: "open", price: "18 – 25 triệu/m²", size: "22 ha", units: "960 nền", handover: "Có sổ từng nền" },
    { name: "Hồ Tây Signature", region: "Hà Nội", district: "Tây Hồ", type: "Căn hộ", status: "done", price: "85 – 110 triệu/m²", size: "1,2 ha", units: "390 căn", handover: "Đã bàn giao" },
  ];
  const STATUS = { open: "Đang mở bán", soon: "Sắp mở bán", done: "Đã bàn giao" };

  const grid = document.getElementById("projectGrid");
  const count = document.getElementById("projectCount");
  const empty = document.getElementById("projectEmpty");
  const regionFilter = document.getElementById("regionFilter");
  const statusFilter = document.getElementById("statusFilter");
  const select = document.getElementById("projectSelect");
  if (!grid) return;

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let region = "all";
  let status = "all";

  function card(p, i) {
    const idx = projects.indexOf(p);
    return `
      <article class="project">
        <div class="da-media">
          <img src="https://picsum.photos/seed/du-an-${idx + 1}/640/360" alt="Phối cảnh dự án ${esc(p.name)}" loading="lazy" />
          <span class="status ${p.status === "open" ? "" : p.status}">${STATUS[p.status]}</span>
          <span class="da-type">${esc(p.type)}</span>
        </div>
        <div class="project-body">
          <h3>${esc(p.name)}</h3>
          <p class="da-loc">📍 ${esc(p.district)}, ${esc(p.region)}</p>
          <p class="da-price">${esc(p.price)}</p>
          <div class="da-meta"><span>📐 ${esc(p.size)}</span><span>🏢 ${esc(p.units)}</span><span>🔑 ${esc(p.handover)}</span></div>
          <div class="da-actions">
            <button type="button" class="btn" data-action="visit" data-name="${esc(p.name)}">Đặt lịch xem</button>
            <button type="button" class="btn btn-primary" data-action="quote" data-name="${esc(p.name)}">Nhận báo giá</button>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const list = projects.filter(p => (region === "all" || p.region === region) && (status === "all" || p.status === status));
    grid.innerHTML = list.map(card).join("");
    count.textContent = `Tìm thấy ${list.length} dự án`;
    if (empty) empty.hidden = list.length > 0;
  }

  regionFilter?.addEventListener("click", e => {
    const btn = e.target.closest("button[data-region]");
    if (!btn) return;
    region = btn.dataset.region;
    regionFilter.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", b === btn));
    render();
  });
  statusFilter?.addEventListener("change", () => { status = statusFilter.value; render(); });

  // Danh sách dự án trong form liên hệ
  if (select) {
    projects.forEach(p => select.insertAdjacentHTML("beforeend", `<option value="${esc(p.name)}">${esc(p.name)} – ${esc(p.district)}</option>`));
  }

  // Bấm "Nhận báo giá" / "Đặt lịch xem" → điền sẵn form và cuộn tới
  grid.addEventListener("click", e => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    if (select) select.value = btn.dataset.name;
    const msg = document.querySelector('#contactForm textarea[name="message"]');
    if (msg) msg.value = btn.dataset.action === "visit"
      ? `Tôi muốn đặt lịch tham quan dự án ${btn.dataset.name} vào cuối tuần này.`
      : `Vui lòng gửi tôi bảng giá và chính sách thanh toán dự án ${btn.dataset.name}.`;
    const target = document.getElementById("lien-he");
    target?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setTimeout(() => document.querySelector('#contactForm input[name="name"]')?.focus({ preventScroll: true }), 600);
    window.showToast?.(`Đã chọn dự án ${btn.dataset.name}. Vui lòng điền thông tin liên hệ.`);
  });

  render();
})();
