// =====================================================================
// page.js – Tương tác dùng chung cho các trang con trong pages/
// Mỗi tính năng tự kiểm tra phần tử tồn tại, nên trang thiếu section vẫn chạy bình thường.
// =====================================================================
(() => {
  document.documentElement.classList.add("js");
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ----- Toast thông báo -----
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return alert(msg);
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
  }
  window.showToast = toast; // cho các script riêng của từng trang dùng lại

  // ----- Menu mobile -----
  const nav = $("#mainNav");
  const toggle = $("#menuToggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? "✕" : "☰";
    });
    nav.addEventListener("click", e => {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      }
    });
  }

  // ----- Header đổ bóng + nút lên đầu trang -----
  const header = $("header");
  const topBtn = $("#backToTop");
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("scrolled", y > 8);
    topBtn?.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  // ----- Đánh dấu menu theo section đang xem -----
  const navLinks = nav ? $$('a[href^="#"]', nav) : [];
  const sections = navLinks.map(a => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => spy.observe(s));
  }

  // ----- Đếm số tăng dần: <strong data-count="1200" data-suffix="+"> -----
  function countUp(el) {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const fmt = n => n.toLocaleString("vi-VN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (reduceMotion) return (el.textContent = fmt(target));
    const start = performance.now(), dur = 1400;
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ----- Hiện dần khi cuộn (.reveal) + kích hoạt đếm số -----
  const reveals = $$(".reveal");
  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        if (el.classList.contains("reveal")) {
          const siblings = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
          el.style.transitionDelay = Math.min(siblings.indexOf(el), 5) * 80 + "ms";
          el.classList.add("visible");
        }
        if (el.dataset.count !== undefined) countUp(el);
        obs.unobserve(el);
      });
    }, { threshold: 0.15 });
    [...reveals, ...counters].forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("visible"));
    counters.forEach(countUp);
  }

  // ----- FAQ: chỉ mở một câu tại một thời điểm -----
  $$(".lp-faq").forEach(faq => {
    faq.addEventListener("toggle", e => {
      if (!e.target.open) return;
      $$("details", faq).forEach(d => { if (d !== e.target) d.open = false; });
    }, true);
  });

  // ----- Tab: <div data-tabs> … button[data-tab] … [data-panel] -----
  $$("[data-tabs]").forEach(wrap => {
    const tabs = $$("[data-tab]", wrap);
    const panels = $$("[data-panel]", wrap);
    const select = name => {
      tabs.forEach(t => t.setAttribute("aria-selected", t.dataset.tab === name));
      panels.forEach(p => (p.hidden = p.dataset.panel !== name));
    };
    tabs.forEach(t => t.addEventListener("click", () => select(t.dataset.tab)));
    if (tabs[0]) select((tabs.find(t => t.getAttribute("aria-selected") === "true") || tabs[0]).dataset.tab);
  });

  // ----- Form liên hệ: kiểm tra dữ liệu & báo lỗi tại chỗ -----
  const form = $("#contactForm");
  if (form) {
    const messages = {
      name: "Vui lòng nhập họ và tên.",
      phone: "Số điện thoại chưa đúng (vd. 0912345678).",
      email: "Email chưa đúng định dạng.",
      need: "Vui lòng chọn nhu cầu.",
    };
    const setError = (input, msg) => {
      const field = input.closest(".lp-field");
      if (!field) return;
      field.classList.toggle("invalid", !!msg);
      let err = $(".lp-error", field);
      if (msg && !err) {
        err = document.createElement("small");
        err.className = "lp-error";
        field.appendChild(err);
      }
      if (err) err.textContent = msg || "";
    };
    const check = input => {
      const value = input.value.trim();
      const bad = !input.checkValidity() || (input.required && !value);
      setError(input, bad ? messages[input.name] || "Trường này chưa hợp lệ." : "");
      return !bad;
    };
    $$("input, select, textarea", form).forEach(input => {
      input.addEventListener("blur", () => check(input));
      input.addEventListener("input", () => input.closest(".invalid") && check(input));
    });
    form.addEventListener("submit", e => {
      e.preventDefault();
      const inputs = $$("input, select, textarea", form);
      const ok = inputs.map(check).every(Boolean);
      if (!ok) {
        inputs.find(i => i.closest(".invalid"))?.focus();
        return toast("Vui lòng kiểm tra lại thông tin.");
      }
      const btn = $('button[type="submit"]', form);
      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Đang gửi…";
      const nameInput = form.elements.namedItem("name");
      const firstName = nameInput ? nameInput.value.trim().split(/\s+/).pop() : "";
      setTimeout(() => { // giả lập gửi lên máy chủ
        btn.disabled = false;
        btn.textContent = label;
        form.reset();
        toast(`Cảm ơn ${firstName || "bạn"}! Chúng tôi sẽ liên hệ trong 15 phút.`);
      }, 900);
    });
  }

  // ----- Form đăng ký nhận tin ở footer -----
  $("#newsletterForm")?.addEventListener("submit", e => {
    e.preventDefault();
    toast("Đăng ký nhận tin thành công!");
    e.target.reset();
  });
})();
