// scripts.js - Bếp Vàng Của Lâm
// Features:
// - Sticky header
// - Mobile menu toggle
// - Specialities slider
// - Fake Login (store username -> show in header and persist)
// - Scroll reveal animations
// - Toast notifications
// - Injected CSS for hover zoom + keyframes

(function () {
  // --- Helpers ---
  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => Array.from((root || document).querySelectorAll(s));

  // Local storage keys
  const LS_USER = 'bepvang_user';
  const LS_CART = 'bepvang_cartCount';

  // --- Inject animation CSS and hover zoom (restores hover effects) ---
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes fadeIn { from { opacity:0; transform:translateY(20px);} to {opacity:1; transform:none;} }
    @keyframes fadeOut { to { opacity:0; transform:translateY(20px);} }
    .reveal-show { opacity:1!important; transform:none!important; transition:0.6s; }
    section, .card, .instagram-img { opacity:0; transform:translateY(25px); }

    /* Hover zoom for images/cards */
    .card-img-top { transition: transform 0.35s ease, box-shadow 0.25s ease; will-change: transform; }
    .card-img-top:hover { transform: scale(1.06); }

    /* Add button overlay on cards */
    .card { position: relative; overflow: visible; }
    .card .add-to-cart-btn {
      position: absolute;
      right: 12px;
      bottom: 12px;
      z-index: 5;
      padding: 6px 10px;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 6px 12px rgba(0,0,0,0.12);
    }

    /* Toast animation helpers (optional) */
    .bepvang-toast { animation: fadeIn .25s ease; }
  `;
  document.head.appendChild(styleEl);

  // --- Sticky Header ---
  window.addEventListener('scroll', () => {
    const header = qs('.site-header');
    if (!header) return;
    if (window.scrollY > 50) header.classList.add('sticky');
    else header.classList.remove('sticky');
  });

  // --- Mobile Menu Toggle ---
  const menuBtn = qs('.btn-black-circle');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  }

  // --- Specialities Slider ---
  const list = qs('.specialities-list');
  const left = qs('#arrow-left');
  const right = qs('#arrow-right');
  if (right && list) right.addEventListener('click', () => list.scrollBy({ left: 220, behavior: 'smooth' }));
  if (left && list) left.addEventListener('click', () => list.scrollBy({ left: -220, behavior: 'smooth' }));

  // --- Persistent Cart ---
  let cartCount = Number(localStorage.getItem(LS_CART) || 0);
  const cartDisplay = qs('#cart-count');
  function updateCartDisplay() {
    if (cartDisplay) cartDisplay.textContent = cartCount;
    localStorage.setItem(LS_CART, String(cartCount));
  }
  updateCartDisplay();

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'bepvang-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      background: '#ffc107',
      color: '#000',
      padding: '12px 18px',
      borderRadius: '8px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
      zIndex: 99999,
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }

  // --- Fake Login (persistent) ---
  const loginLink = qs('#login-link');
  function setLoggedIn(username) {
    if (!username) return;
    localStorage.setItem(LS_USER, username);
    // update header display (replace link text with username + dropdown)
    if (loginLink) {
      loginLink.innerHTML = `
        <img src="images/person.png" alt="user" class="icon-sm"> <span>${escapeHtml(username)}</span>
      `;
      loginLink.classList.add('text-warning');

      // add small logout action on click
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        // show simple menu to logout
        const existing = qs('#bepvang-user-menu');
        if (existing) { existing.remove(); return; }

        const menu = document.createElement('div');
        menu.id = 'bepvang-user-menu';
        Object.assign(menu.style, {
          position: 'absolute',
          right: '12px',
          top: '60px',
          background: '#fff',
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          zIndex: 9999,
        });
        menu.innerHTML = `
          <div class="small px-2 py-1">Signed in as <strong>${escapeHtml(username)}</strong></div>
          <hr style="margin:6px 0">
          <button id="bepvang-logout" class="btn btn-sm btn-outline-secondary w-100">Logout</button>
        `;
        document.body.appendChild(menu);
        document.getElementById('bepvang-logout').addEventListener('click', () => {
          localStorage.removeItem(LS_USER);
          // reload header to default
          location.reload();
        });

        // click outside to close
        setTimeout(() => {
          const onDoc = (ev) => { if (!menu.contains(ev.target) && ev.target !== loginLink) { menu.remove(); document.removeEventListener('click', onDoc); } };
          document.addEventListener('click', onDoc);
        }, 10);
      });
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  function createLoginPopup() {
    const existing = qs('#bepvang-login-overlay');
    if (existing) { existing.remove(); }

    const overlay = document.createElement('div');
    overlay.id = 'bepvang-login-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
    });

    overlay.innerHTML = `
      <div style="background:#fff;padding:22px;border-radius:12px;min-width:300px;max-width:90%;position:relative;">
        <h5 class="mb-3">Login</h5>
        <input id="bepvang-user-input" class="form-control mb-2" placeholder="Username">
        <input id="bepvang-pass-input" type="password" class="form-control mb-3" placeholder="Password">
        <button id="bepvang-login-submit" class="btn btn-warning w-100 mb-2">Login</button>
        <button id="bepvang-login-close" class="btn btn-link w-100">Close</button>
      </div>
    `;

    document.body.appendChild(overlay);

    qs('#bepvang-login-close').addEventListener('click', () => overlay.remove());
    qs('#bepvang-login-submit').addEventListener('click', () => {
      const user = qs('#bepvang-user-input').value.trim();
      if (!user) { showToast('Vui lòng nhập tên người dùng'); return; }
      setLoggedIn(user);
      showToast('Đăng nhập thành công: ' + user);
      overlay.remove();
    });
  }

  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      // if already logged in, handled in setLoggedIn (shows menu). If not, open popup
      const stored = localStorage.getItem(LS_USER);
      if (!stored) {
        e.preventDefault();
        createLoginPopup();
      }
    });
  }

  // On load: restore logged in user
  const storedUser = localStorage.getItem(LS_USER);
  if (storedUser) setLoggedIn(storedUser);

  // --- Scroll reveal ---
  const revealElements = qsa('section, .card, .instagram-img');
  function revealOnScroll() {
    const trigger = window.innerHeight * 0.85;
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect().top;
      if (rect < trigger) el.classList.add('reveal-show');
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);

  // --- Smooth anchor scroll for hash links ---
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // allow default
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Expose addToCart globally in case you want to call from inline handlers
  window.bepvang = window.bepvang || {};
  window.bepvang.addToCart = function(itemId) {
    cartCount++;
    updateCartDisplay();
    showToast('Đã thêm vào giỏ hàng! (' + cartCount + ')');
  };

  // Ensure cart display is clickable to show small summary
  const cartAnchor = qsa('a').find ? qsa('a').find(a => a.querySelector('#cart-count')) : null;
  // If find not available on NodeList in some environments, do fallback:
  let foundCartAnchor = null;
  qsa('a').forEach(a => { if (a.querySelector && a.querySelector('#cart-count')) foundCartAnchor = a; });
  if (foundCartAnchor) {
    foundCartAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Bạn có ' + cartCount + ' món trong giỏ hàng');
    });
  }
// =============================
// SPECIALITIES → MENU ITEMS (MockAPI.io)
// =============================

// URL API của bạn
const API_URL = "https://691bbbf93aaeed735c8e1a6e.mockapi.io/menu";

// Load toàn bộ menu từ MockAPI
async function fetchMenuItems() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderMenuItems(data);
  } catch (err) {
    console.error("Lỗi tải menu:", err);
    showToast("Không tải được menu từ API!");
  }
}

// Render món từ API
function renderMenuItems(menuItems) {
  const container = document.getElementById("specialities-menu");
  if (!container) return;

  container.innerHTML = menuItems.map(item => `
    <div class="menu-item">
      <img src="${item.image}" alt="${item.name}">
      <p class="menu-item-title">${item.name}</p>
      <p class="menu-item-price">${Number(item.price).toLocaleString()}₫</p>
      <button 
        class="btn btn-warning w-100" 
        onclick="bepvang.addMenuToCart('${item.id}', '${item.name}', '${item.image}', '${item.price}')"
      >
        Add to Cart
      </button>
    </div>
  `).join("");
}

// Khởi động load API
fetchMenuItems();


// =============================
// HIỆU ỨNG BAY VÀO GIỎ HÀNG
// =============================
function flyToCart(imgSrc, startX, startY) {
  const cart = document.querySelector('#cart-count');
  if (!cart) return;

  const cartRect = cart.getBoundingClientRect();

  const flyingImg = document.createElement('img');
  flyingImg.src = imgSrc;
  flyingImg.style.position = 'fixed';
  flyingImg.style.left = startX + "px";
  flyingImg.style.top = startY + "px";
  flyingImg.style.width = "60px";
  flyingImg.style.height = "60px";
  flyingImg.style.borderRadius = "50%";
  flyingImg.style.zIndex = 99999;
  flyingImg.style.transition = "all 0.9s cubic-bezier(.42,.0,.58,1.0)";

  document.body.appendChild(flyingImg);

  setTimeout(() => {
    flyingImg.style.left = cartRect.left + "px";
    flyingImg.style.top = cartRect.top + "px";
    flyingImg.style.width = "10px";
    flyingImg.style.height = "10px";
    flyingImg.style.opacity = "0.2";
  }, 20);

  setTimeout(() => flyingImg.remove(), 1000);
}


// =============================
// ADD TO CART FROM API MENU
// =============================
window.bepvang.addMenuToCart = function (id, name, img, price) {

  // Lấy nút để tìm vị trí bay
  const btn = document.querySelector(`button[onclick*="${id}"]`);
  if (btn) {
    const rect = btn.getBoundingClientRect();
    flyToCart(img, rect.left, rect.top);
  }

  // Tăng giỏ hàng
  cartCount++;
  updateCartDisplay();
  showToast(`Đã thêm ${name}`);
};
})();
