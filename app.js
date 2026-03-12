// NovaStore front-end logic
// Products, catalog rendering, cart, product details, and login.

// --- Product catalog data ---

const products = [
  {
    id: "p1",
    name: "Aurora Wireless Headphones",
    category: "Audio",
    price: 149.99,
    tag: "Best seller",
    image:
      "https://images.pexels.com/photos/3394664/pexels-photo-3394664.jpeg?auto=compress&cs=tinysrgb&w=1200",
    shortDescription: "Noise‑cancelling over‑ear headphones with 30h battery.",
    description:
      "Immerse yourself in rich, detailed sound with active noise cancellation, soft memory‑foam ear cups and multi‑device pairing for seamless switching between your phone and laptop.",
    badges: ["Wireless", "Noise cancelling", "30h battery", "USB‑C charging"]
  },
  {
    id: "p2",
    name: "Lumen Smart Lamp",
    category: "Home",
    price: 89.0,
    tag: "Smart home",
    image:
      "https://images.pexels.com/photos/132340/pexels-photo-132340.jpeg?auto=compress&cs=tinysrgb&w=1200",
    shortDescription: "Warm and cool tones with app and voice control.",
    description:
      "Create the perfect ambience with millions of colors, adjustable warmth and deep dimming. Works with major smart home platforms and includes gentle sunrise mode.",
    badges: ["App control", "Voice assistant", "RGB", "Energy efficient"]
  },
  {
    id: "p3",
    name: "Nimbus Mechanical Keyboard",
    category: "Accessories",
    price: 129.5,
    tag: "Creator pick",
    image:
      "https://images.pexels.com/photos/196659/pexels-photo-196659.jpeg?auto=compress&cs=tinysrgb&w=1200",
    shortDescription: "Compact 75% layout with hot‑swappable switches.",
    description:
      "A premium typing experience in a compact footprint. Featuring hot‑swappable switches, per‑key RGB, PBT keycaps and a solid aluminum frame that stays planted on your desk.",
    badges: ["Hot‑swappable", "75% layout", "RGB", "USB‑C"]
  },
  {
    id: "p4",
    name: "Voyager Everyday Backpack",
    category: "Lifestyle",
    price: 109.99,
    tag: "New arrival",
    image:
      "https://images.pexels.com/photos/7698824/pexels-photo-7698824.jpeg?auto=compress&cs=tinysrgb&w=1200",
    shortDescription: "Weather‑resistant backpack for work and travel.",
    description:
      "Thoughtful organization for tech and essentials, with a suspended laptop sleeve, hidden passport pocket and water‑resistant fabric that keeps everything protected.",
    badges: ["Weather‑resistant", "16\" laptop", "Hidden pockets", "Carry‑on"]
  },
  {
    id: "p5",
    name: "Pulse Fitness Watch",
    category: "Wearables",
    price: 179.0,
    tag: "Health",
    image:
      "https://images.pexels.com/photos/4370388/pexels-photo-4370388.jpeg?auto=compress&cs=tinysrgb&w=1200",
    shortDescription: "Track workouts, sleep and heart rate all day.",
    description:
      "Stay on top of your health with advanced tracking for workouts, heart rate, sleep stages and stress levels, plus guided breathing sessions and long‑lasting battery.",
    badges: ["Heart rate", "GPS", "Sleep tracking", "Water resistant"]
  },
  {
    id: "p6",
    name: "Zen Brew Coffee Maker",
    category: "Kitchen",
    price: 99.99,
    tag: "Home barista",
    image:
      "https://images.pexels.com/photos/3028963/pexels-photo-3028963.jpeg?auto=compress&cs=tinysrgb&w=1200",
    shortDescription: "Programmable pour‑over style coffee at home.",
    description:
      "Brew café‑quality coffee with precise temperature control, bloom timing and programmable recipes. Includes a reusable stainless filter and insulated carafe.",
    badges: ["Programmable", "Pour‑over style", "Thermal carafe", "Reusable filter"]
  }
];

// --- Storage keys ---

const AUTH_KEY = "novastore_auth";
const CART_KEY = "novastore_cart";

// --- DOM helpers ---

const $ = selector => document.querySelector(selector);

const sections = document.querySelectorAll(".section");
const navPills = document.querySelectorAll(".nav-pill[data-section-target]");

const productGrid = $("#productGrid");
const productsEmpty = $("#productsEmpty");
const searchInput = $("#searchInput");

const cartItemsEl = $("#cartItems");
const cartCountEl = $("#cartCount");
const cartTotalEl = $("#cartTotal");
const checkoutBtn = $("#checkoutBtn");

const detailBackdrop = $("#detailBackdrop");
const detailImage = $("#detailImage");
const detailCategory = $("#detailCategory");
const detailTitle = $("#detailTitle");
const detailMeta = $("#detailMeta");
const detailPrice = $("#detailPrice");
const detailDescription = $("#detailDescription");
const detailTags = $("#detailTags");
const detailAddBtn = $("#detailAddBtn");
const detailCloseBtn = $("#detailCloseBtn");
const detailCloseSecondary = $("#detailCloseSecondary");

const authStatusEl = $("#authStatus");
const authToggleBtn = $("#authToggleBtn");
const loginForm = $("#loginForm");
const loginEmail = $("#loginEmail"); // username or email input
const loginPassword = $("#loginPassword");
const passwordToggle = $("#passwordToggle");
const forgotPasswordBtn = $("#forgotPasswordBtn");

const toastEl = $("#toast");
const toastMessageEl = $("#toastMessage");

// --- State ---

let cart = loadCart();
let currentDetailProduct = null;
let authState = loadAuth();

// --- Utility functions ---

function showToast(message) {
  if (!toastEl || !toastMessageEl) return;
  toastMessageEl.textContent = message;
  toastEl.classList.add("is-visible");
  setTimeout(() => {
    toastEl.classList.remove("is-visible");
  }, 2600);
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // ignore storage issues in demo
  }
}

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAuth() {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
  } catch {
    // ignore
  }
}

function loadAuth() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : { isLoggedIn: false, email: null };
  } catch {
    return { isLoggedIn: false, email: null };
  }
}

// --- Section navigation ---

function showSection(sectionId) {
  sections.forEach(section => {
    section.classList.toggle("is-visible", section.id === sectionId);
  });
  navPills.forEach(pill => {
    pill.classList.toggle(
      "is-active",
      pill.dataset.sectionTarget === sectionId
    );
  });
}

navPills.forEach(pill => {
  pill.addEventListener("click", () => {
    const target = pill.dataset.sectionTarget;
    if (target) showSection(target);
  });
});

// --- Product rendering ---

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.productId = product.id;

  card.innerHTML = `
    <div class="product-media">
      <div class="product-glow"></div>
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="product-pill">${product.category}</div>
    </div>
    <div class="product-body">
      <div class="product-main-row">
        <div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-meta">${product.shortDescription}</p>
        </div>
        <span class="product-price">${formatPrice(product.price)}</span>
      </div>
      <div class="product-footer-row">
        <span class="product-tag">${product.tag}</span>
        <button class="primary-btn product-add-btn" type="button">
          Add to cart
        </button>
      </div>
    </div>
  `;

  const addBtn = card.querySelector(".product-add-btn");
  addBtn.addEventListener("click", event => {
    event.stopPropagation();
    addToCart(product.id);
  });

  card.addEventListener("click", () => {
    openDetail(product);
  });

  return card;
}

function renderProducts(filterText = "") {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  const query = filterText.trim().toLowerCase();
  const filtered = query
    ? products.filter(p => {
        const haystack = `${p.name} ${p.category} ${p.tag} ${p.shortDescription} ${p.badges.join(
          " "
        )}`.toLowerCase();
        return haystack.includes(query);
      })
    : products;

  if (!filtered.length) {
    productsEmpty.classList.remove("is-hidden");
    return;
  }

  productsEmpty.classList.add("is-hidden");
  filtered.forEach(p => {
    productGrid.appendChild(createProductCard(p));
  });
}

if (searchInput) {
  searchInput.addEventListener("input", e => {
    renderProducts(e.target.value);
  });
}

// --- Cart logic ---

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  renderCart();

  const product = products.find(p => p.id === productId);
  if (product) showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function updateCartQuantity(productId, delta) {
  const entry = cart.find(item => item.id === productId);
  if (!entry) return;
  entry.quantity += delta;
  if (entry.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    renderCart();
  }
}

function renderCart() {
  if (!cartItemsEl) return;

  cartItemsEl.innerHTML = "";

  if (!cart.length) {
    cartItemsEl.classList.add("cart-items-empty");
    cartItemsEl.innerHTML = `
      <div class="cart-empty-state">
        <p>Your cart is empty</p>
        <span>Add something from the shop to get started.</span>
      </div>
    `;
    cartCountEl.textContent = "0 items";
    cartTotalEl.textContent = formatPrice(0);
    checkoutBtn.disabled = true;
    return;
  }

  cartItemsEl.classList.remove("cart-items-empty");

  let total = 0;
  let count = 0;

  cart.forEach(entry => {
    const product = products.find(p => p.id === entry.id);
    if (!product) return;

    const lineTotal = product.price * entry.quantity;
    total += lineTotal;
    count += entry.quantity;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div class="cart-item-main">
        <div class="cart-item-text">
          <span class="cart-item-name">${product.name}</span>
          <span class="cart-item-meta">
            ${product.category} • ${formatPrice(product.price)} each
          </span>
        </div>
        <button class="cart-remove-btn" type="button" aria-label="Remove item">✕</button>
      </div>
      <div class="cart-item-footer">
        <span class="cart-item-price">${formatPrice(lineTotal)}</span>
        <div class="cart-qty">
          <button class="cart-qty-btn" type="button" aria-label="Decrease quantity">−</button>
          <span class="cart-qty-value">${entry.quantity}</span>
          <button class="cart-qty-btn" type="button" aria-label="Increase quantity">+</button>
        </div>
      </div>
    `;

    const [decreaseBtn, increaseBtn] = itemEl.querySelectorAll(".cart-qty-btn");
    const removeBtn = itemEl.querySelector(".cart-remove-btn");

    decreaseBtn.addEventListener("click", () =>
      updateCartQuantity(entry.id, -1)
    );
    increaseBtn.addEventListener("click", () =>
      updateCartQuantity(entry.id, 1)
    );
    removeBtn.addEventListener("click", () => removeFromCart(entry.id));

    cartItemsEl.appendChild(itemEl);
  });

  cartCountEl.textContent = `${count} item${count === 1 ? "" : "s"}`;
  cartTotalEl.textContent = formatPrice(total);
  checkoutBtn.disabled = !cart.length;
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (!authState.isLoggedIn) {
      showToast("Please sign in before checking out.");
      showSection("login-section");
      return;
    }
    showToast("Checkout demo – hook this up to your backend.");
  });
}

// --- Product detail overlay ---

function openDetail(product) {
  currentDetailProduct = product;
  if (!detailBackdrop) return;

  detailImage.src = product.image;
  detailImage.alt = product.name;
  detailCategory.textContent = product.category;
  detailTitle.textContent = product.name;
  detailMeta.textContent = product.shortDescription;
  detailPrice.textContent = formatPrice(product.price);
  detailDescription.textContent = product.description;

  detailTags.innerHTML = "";
  product.badges.forEach(badge => {
    const pill = document.createElement("span");
    pill.className = "detail-tag-pill";
    pill.textContent = badge;
    detailTags.appendChild(pill);
  });

  detailBackdrop.classList.add("is-visible");
}

function closeDetail() {
  if (!detailBackdrop) return;
  detailBackdrop.classList.remove("is-visible");
  currentDetailProduct = null;
}

if (detailAddBtn) {
  detailAddBtn.addEventListener("click", () => {
    if (currentDetailProduct) {
      addToCart(currentDetailProduct.id);
    }
  });
}

if (detailCloseBtn) {
  detailCloseBtn.addEventListener("click", closeDetail);
}

if (detailCloseSecondary) {
  detailCloseSecondary.addEventListener("click", closeDetail);
}

if (detailBackdrop) {
  detailBackdrop.addEventListener("click", event => {
    if (event.target === detailBackdrop) closeDetail();
  });
}

// --- Auth / Login (accept any username) ---

function updateAuthUI() {
  if (!authState.isLoggedIn) {
    authStatusEl.textContent = "Not signed in";
    authToggleBtn.textContent = "Sign in";
    authToggleBtn.dataset.action = "signin";
  } else {
    authStatusEl.textContent = `Signed in as ${authState.email}`;
    authToggleBtn.textContent = "Sign out";
    authToggleBtn.dataset.action = "signout";
  }
}

if (authToggleBtn) {
  authToggleBtn.addEventListener("click", () => {
    if (authToggleBtn.dataset.action === "signout") {
      authState = { isLoggedIn: false, email: null };
      saveAuth();
      updateAuthUI();
      showToast("Signed out successfully.");
    } else {
      showSection("login-section");
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
      showToast("Please fill in both username and password.");
      return;
    }

    if (password.length < 3) {
      showToast("Password must be at least 3 characters for this demo.");
      return;
    }

    // Accept any non‑empty username + password for this demo
    authState = { isLoggedIn: true, email };
    saveAuth();
    updateAuthUI();
    showToast(`Signed in as ${email}.`);
    showSection("shop-section");
  });
}

// Show / hide password on login form
if (passwordToggle && loginPassword) {
  passwordToggle.addEventListener("click", () => {
    const isHidden = loginPassword.type === "password";
    loginPassword.type = isHidden ? "text" : "password";
    passwordToggle.textContent = isHidden ? "Hide" : "Show";
    passwordToggle.setAttribute(
      "aria-label",
      isHidden ? "Hide password" : "Show password"
    );
  });
}

// Demo forgot‑password interaction
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener("click", () => {
    showToast("Password reset flow is demo‑only in this UI.");
  });
}

// --- Initialisation ---

function init() {
  renderProducts();
  renderCart();
  updateAuthUI();
}

document.addEventListener("DOMContentLoaded", init);

:root {
  --bg: #050816;
  --bg-elevated: #0b1020;
  --bg-soft: #11182a;
  --accent: #4f46e5;
  --accent-soft: rgba(79, 70, 229, 0.16);
  --accent-strong: #6366f1;
  --accent-danger: #f97373;
  --border-subtle: rgba(148, 163, 184, 0.25);
  --text: #e5e7eb;
  --text-muted: #9ca3af;
  --text-soft: #6b7280;
  --shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.9);
  --radius-lg: 18px;
  --radius-pill: 999px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background: radial-gradient(circle at top, #111827 0, #020617 55%, #000 100%);
  color: var(--text);
  min-height: 100%;
}

body {
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 24px;
}

.app-shell {
  width: 100%;
  max-width: 1120px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.86));
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.app-shell::before {
  content: "";
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.15), transparent 55%),
    radial-gradient(circle at 100% 0%, rgba(129, 140, 248, 0.16), transparent 55%),
    radial-gradient(circle at 50% 100%, rgba(74, 222, 128, 0.08), transparent 55%);
  opacity: 0.9;
  pointer-events: none;
  z-index: -1;
  animation: gradientDrift 18s ease-in-out infinite alternate;
}

.app-header {
  padding: 18px 24px 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  backdrop-filter: blur(18px);
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.96),
    rgba(15, 23, 42, 0.92),
    rgba(15, 23, 42, 0.9)
  );
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  background: radial-gradient(circle at 20% 20%, #f9fafb, #e5e7eb 35%, #4f46e5 100%);
  color: #020617;
  font-weight: 800;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 18px 35px rgba(15, 23, 42, 0.7),
    0 0 0 1px rgba(148, 163, 184, 0.8);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-weight: 700;
  letter-spacing: 0.02em;
  font-size: 18px;
}

.brand-tagline {
  font-size: 12px;
  color: var(--text-muted);
}

.main-nav {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  padding: 4px;
  display: inline-flex;
  gap: 4px;
}

.auth-inline {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-size: 12px;
}

.auth-status {
  color: var(--text-muted);
}

.ghost-btn {
  border-radius: var(--radius-pill);
  border: 1px solid rgba(148, 163, 184, 0.6);
  padding: 5px 12px;
  font-size: 12px;
  background: rgba(15, 23, 42, 0.9);
  color: var(--text);
  cursor: pointer;
}

.ghost-btn:hover {
  background: rgba(30, 64, 175, 0.9);
  color: #e5e7eb;
}

.nav-pill {
  border-radius: var(--radius-pill);
  border: none;
  padding: 8px 14px;
  font-size: 13px;
  color: var(--text-soft);
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.08s ease;
}

.nav-pill:hover {
  background: rgba(15, 23, 42, 0.7);
  color: var(--text);
}

.nav-pill.is-active {
  background: radial-gradient(circle at 0 0, rgba(248, 250, 252, 0.35), rgba(79, 70, 229, 0.4));
  color: #0b1020;
  box-shadow: 0 12px 22px rgba(15, 23, 42, 0.8);
  transform: translateY(-1px);
}

.app-main {
  padding: 20px 22px 18px;
  overflow: hidden;
}

.section {
  display: none;
  animation: fadeIn 0.2s ease-out;
}

.section.is-visible {
  display: block;
}

.is-hidden {
  display: none !important;
}

.section-header {
  margin-bottom: 18px;
}

.section-header h1 {
  margin: 0 0 4px;
  font-size: 22px;
}

.section-header p {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 16px;
}

.login-layout {
  align-items: stretch;
}

.card {
  background: radial-gradient(circle at top left, rgba(148, 163, 184, 0.12), transparent 55%),
    radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.16), transparent 50%),
    rgba(15, 23, 42, 0.95);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(148, 163, 184, 0.38);
  box-shadow:
    0 16px 40px rgba(15, 23, 42, 0.9),
    inset 0 0 0 0.5px rgba(148, 163, 184, 0.6);
  padding: 18px 18px 16px;
}

.login-hero h2 {
  margin: 0 0 6px;
  font-size: 18px;
}

.login-hero p {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--text-muted);
}

.login-highlights {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.login-card h2 {
  margin: 0 0 4px;
  font-size: 17px;
}

.login-subtitle {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--text-muted);
}

.login-note {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.form h2 {
  margin: 0 0 14px;
  font-size: 17px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 14px;
  margin-bottom: 14px;
}

.field-full {
  grid-column: 1 / -1;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 13px;
}

.field span {
  color: var(--text-muted);
}

input,
select,
textarea {
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.55);
  background: rgba(15, 23, 42, 0.95);
  color: var(--text);
  padding: 9px 10px;
  font-size: 13px;
  outline: none;
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    background 0.16s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--accent-strong);
  box-shadow:
    0 0 0 1px rgba(129, 140, 248, 0.85),
    0 0 0 10px rgba(79, 70, 229, 0.12);
  background: rgba(15, 23, 42, 0.98);
}

textarea {
  resize: vertical;
  min-height: 70px;
}

.primary-btn {
  border-radius: 999px;
  border: none;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #4f46e5, #6366f1, #22c55e);
  color: #f9fafb;
  cursor: pointer;
  box-shadow:
    0 18px 35px rgba(15, 23, 42, 0.9),
    0 0 0 1px rgba(191, 219, 254, 0.4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition:
    transform 0.08s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.03);
  box-shadow:
    0 22px 45px rgba(15, 23, 42, 0.92),
    0 0 0 1px rgba(219, 234, 254, 0.6);
}

.primary-btn:active {
  transform: translateY(0);
  box-shadow:
    0 12px 30px rgba(15, 23, 42, 0.9),
    0 0 0 1px rgba(219, 234, 254, 0.5);
}

.tips h3 {
  margin: 0 0 10px;
  font-size: 14px;
}

.tips ul {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.app-footer {
  padding: 10px 20px 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.32);
  text-align: right;
  font-size: 12px;
  color: var(--text-soft);
  background: radial-gradient(circle at bottom, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.95));
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%) translateY(20px);
  min-width: 260px;
  max-width: 360px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.97);
  border: 1px solid rgba(129, 140, 248, 0.85);
  color: var(--text);
  font-size: 13px;
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.95),
    0 0 0 1px rgba(15, 23, 42, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  gap: 8px;
  backdrop-filter: blur(16px);
  z-index: 20;
}

.toast.is-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
  transition:
    opacity 0.16s ease-out,
    transform 0.16s ease-out;
}

.toast::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.25);
}

/* Product detail overlay */

.detail-backdrop {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.98));
  backdrop-filter: blur(16px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 40;
}

.detail-backdrop.is-visible {
  display: flex;
  animation: fadeIn 0.18s ease-out;
}

.detail-dialog {
  width: 100%;
  max-width: 720px;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: radial-gradient(circle at 0 0, rgba(148, 163, 184, 0.18), transparent 55%),
    rgba(15, 23, 42, 0.98);
  box-shadow:
    0 26px 70px rgba(15, 23, 42, 0.98),
    inset 0 0 0 0.5px rgba(15, 23, 42, 0.9);
  padding: 16px 16px 14px;
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(0, 2.4fr);
  gap: 14px;
  position: relative;
  transform: translateY(8px) scale(0.98);
  opacity: 0;
  animation: detailIn 0.18s ease-out forwards;
}

.detail-media {
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background:
    radial-gradient(circle at top left, rgba(248, 250, 252, 0.4), transparent 60%),
    rgba(15, 23, 42, 0.98);
}

.detail-media img {
  width: 100%;
  height: 100%;
  max-height: 260px;
  object-fit: cover;
}

.detail-media-pill {
  position: absolute;
  left: 10px;
  top: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(191, 219, 254, 0.8);
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-header-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
}

.detail-price {
  font-size: 18px;
  font-weight: 600;
  color: #bbf7d0;
}

.detail-meta {
  font-size: 13px;
  color: var(--text-muted);
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
}

.detail-tag-pill {
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
}

.detail-actions {
  margin-top: 6px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-secondary {
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  background: transparent;
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
}

.detail-subcopy {
  font-size: 11px;
  color: var(--text-muted);
}

.detail-close {
  position: absolute;
  top: 12px;
  right: 16px;
  border: none;
  background: rgba(15, 23, 42, 0.95);
  color: var(--text-soft);
  width: 26px;
  height: 26px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.detail-close:hover {
  background: rgba(30, 64, 175, 0.9);
  color: #e5e7eb;
}

/* Add hover + motion to product cards */
.product-card {
  transform: translateY(0) scale(1);
  transition:
    transform 0.18s ease-out,
    box-shadow 0.2s ease-out,
    border-color 0.2s ease-out,
    background 0.2s ease-out;
}

.product-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow:
    0 22px 55px rgba(15, 23, 42, 0.98),
    inset 0 0 0 0.5px rgba(59, 130, 246, 0.9);
  border-color: rgba(191, 219, 254, 0.9);
  background: radial-gradient(circle at top left, rgba(96, 165, 250, 0.3), transparent 55%),
    radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.28), transparent 55%),
    rgba(15, 23, 42, 0.99);
}

@keyframes gradientDrift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(-4%, 2%, 0) scale(1.02);
  }
  100% {
    transform: translate3d(3%, -3%, 0) scale(1.03);
  }
}

@keyframes detailIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* E‑commerce specific layout */

.layout-shop {
  align-items: flex-start;
}

.products {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.products-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.products-header-main h2 {
  margin: 0 0 4px;
  font-size: 17px;
}

.products-header-main p {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}

.products-header-actions {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.search-field {
  min-width: 220px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
}

.products-empty {
  border-radius: var(--radius-lg);
  border: 1px dashed rgba(148, 163, 184, 0.6);
  padding: 18px 16px;
  background: radial-gradient(circle at top left, rgba(148, 163, 184, 0.12), transparent 55%),
    rgba(15, 23, 42, 0.95);
  text-align: left;
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.products-empty p {
  margin: 0;
  color: var(--text);
}

.products-empty span {
  margin: 0;
}

.product-card {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.25), transparent 55%),
    radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.2), transparent 50%),
    rgba(15, 23, 42, 0.98);
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.95),
    inset 0 0 0 0.5px rgba(30, 64, 175, 0.7);
  display: flex;
  flex-direction: column;
}

.product-media {
  position: relative;
  height: 90px;
  overflow: hidden;
  background: radial-gradient(circle at 0% 0%, rgba(248, 250, 252, 0.35), transparent 55%),
    radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.4), transparent 60%);
}

.product-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: multiply;
  filter: saturate(1.15) contrast(1.05);
  transform: scale(1.03);
}

.product-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 10%, rgba(248, 250, 252, 0.9), transparent 55%),
    radial-gradient(circle at 80% 90%, rgba(37, 99, 235, 0.8), transparent 60%);
  opacity: 0.65;
  mix-blend-mode: screen;
}

.product-pill {
  position: absolute;
  left: 12px;
  bottom: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(15, 23, 42, 0.88);
  color: #e5e7eb;
  border: 1px solid rgba(191, 219, 254, 0.8);
}

.product-body {
  padding: 12px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-main-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.product-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.product-price {
  font-weight: 600;
  font-size: 14px;
  color: #bbf7d0;
}

.product-meta {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}

.product-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.product-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid rgba(252, 211, 77, 0.7);
  background: radial-gradient(circle at 0 0, rgba(253, 224, 71, 0.18), transparent 55%);
  color: #fbbf24;
}

.product-add-btn {
  padding-inline: 12px;
  font-size: 12px;
  white-space: nowrap;
}

.product-add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Cart panel */

.cart-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.cart-header h2 {
  margin: 0 0 4px;
  font-size: 16px;
}

.cart-subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}

.cart-count {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  font-size: 11px;
  color: var(--text-muted);
  background: rgba(15, 23, 42, 0.9);
}

.cart-items {
  border-radius: 14px;
  border: 1px dashed rgba(148, 163, 184, 0.75);
  padding: 10px 10px 8px;
  max-height: 260px;
  overflow: auto;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cart-items-empty {
  justify-content: center;
}

.cart-empty-state {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-empty-state p {
  margin: 0;
  color: var(--text);
}

.cart-empty-state span {
  margin: 0;
}

.cart-item {
  padding: 8px 8px 6px;
  border-radius: 10px;
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.96)),
    rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.8);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item-main {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: flex-start;
}

.cart-item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cart-item-name {
  font-size: 13px;
}

.cart-item-meta {
  font-size: 11px;
  color: var(--text-muted);
}

.cart-remove-btn {
  border-radius: 999px;
  border: none;
  background: rgba(15, 23, 42, 0.9);
  color: var(--text-soft);
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
}

.cart-remove-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #fecaca;
}

.cart-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.cart-item-price {
  font-size: 13px;
  color: #bbf7d0;
}

.cart-qty {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.95);
  overflow: hidden;
}

.cart-qty-btn {
  border: none;
  background: transparent;
  color: var(--text-soft);
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
}

.cart-qty-btn:hover {
  background: rgba(79, 70, 229, 0.18);
  color: #e5e7eb;
}

.cart-qty-value {
  padding: 0 8px;
  font-size: 12px;
}

.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 4px;
}

.cart-total {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 12px;
}

.cart-total span:first-child {
  color: var(--text-muted);
}

.cart-total span:last-child {
  font-size: 15px;
  font-weight: 600;
}

.cart-footer .primary-btn {
  padding-inline: 18px;
  font-size: 12px;
}

.cart-footer .primary-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  body {
    padding: 14px;
  }

  .app-shell {
    border-radius: 20px;
  }

  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .tips {
    order: -1;
  }
}

@media (max-width: 720px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-nav {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 520px) {
  .app-main {
    padding-inline: 14px;
  }

  .field-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* --- Extra polish for even better UI --- */

/* Smooth page feel */
html {
  scroll-behavior: smooth;
}

body {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Custom scrollbar for dark theme */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.6) rgba(15, 23, 42, 0.9);
}

*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.9);
}

*::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #4f46e5, #22c55e);
  border-radius: 999px;
}

*::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #6366f1, #16a34a);
}

/* Slight hover on header brand for more life */
.brand {
  transition: transform 0.18s ease, filter 0.18s ease;
}

.brand:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

/* Soft glow on active nav pill */
.nav-pill.is-active {
  box-shadow:
    0 14px 30px rgba(15, 23, 42, 0.9),
    0 0 0 1px rgba(191, 219, 254, 0.75);
}

/* Slight hover lift for cards globally */
.card {
  transition:
    transform 0.16s ease-out,
    box-shadow 0.2s ease-out,
    border-color 0.18s ease-out;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 22px 55px rgba(15, 23, 42, 0.96),
    inset 0 0 0 0.5px rgba(148, 163, 184, 0.7);
  border-color: rgba(191, 219, 254, 0.7);
}

/* Login form focus + error hint style (for future validation) */
.field span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.field span::after {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.5);
}

input:invalid,
input:user-invalid {
  border-color: var(--accent-danger);
}

input:invalid:focus,
input:user-invalid:focus {
  box-shadow:
    0 0 0 1px rgba(248, 113, 113, 0.8),
    0 0 0 10px rgba(248, 113, 113, 0.16);
}

/* --- Extra responsive tweaks for all devices --- */

@media (max-width: 900px) {
  .detail-dialog {
    max-width: 100%;
    max-height: 90vh;
    grid-template-columns: minmax(0, 1fr);
  }

  .detail-media img {
    max-height: 220px;
  }
}

@media (max-width: 720px) {
  .layout-shop {
    grid-template-columns: minmax(0, 1fr);
  }

  .cart-panel {
    margin-top: 12px;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
}

@media (max-width: 480px) {
  .app-shell {
    border-radius: 0;
  }

  .app-header {
    padding-inline: 16px;
  }

  .product-card {
    border-radius: 16px;
  }

  .detail-dialog {
    border-radius: 18px;
    padding-inline: 12px;
  }

  .cart-header h2 {
    font-size: 15px;
  }

  .cart-total span:last-child {
    font-size: 14px;
  }
}

