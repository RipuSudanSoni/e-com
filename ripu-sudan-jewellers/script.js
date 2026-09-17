/* ============================================================
   RIPU SUDAN JEWELLERS — script.js
   All interactions, state management, and page logic
============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. PRODUCT DATA (Mock catalog)
  ============================================================ */
  const PRODUCTS = [
    { id: 'p1', name: 'Kundan Pearl Drop Earrings', category: 'earrings', material: 'gold-plated', price: 899, oldPrice: 1299, rating: 4.7, reviews: 124, stock: 15, badge: 'bestseller', image: 'Earrings', desc: 'Handcrafted Kundan earrings with freshwater pearl drops. Gold-plated with anti-tarnish coating.', colors: ['Gold', 'Rose Gold'], sizes: ['One Size'] },
    { id: 'p2', name: 'Royal Temple Necklace Set', category: 'bridal', material: 'gold-plated', price: 2499, oldPrice: 3499, rating: 4.9, reviews: 89, stock: 8, badge: 'bestseller', image: 'Bridal', desc: 'Complete bridal necklace set with matching earrings and maang tikka. Perfect for weddings.', colors: ['Gold'], sizes: ['One Size'] },
    { id: 'p3', name: 'Minimal Solitaire Ring', category: 'rings', material: 'silver-plated', price: 499, oldPrice: 799, rating: 4.5, reviews: 210, stock: 25, badge: 'new', image: 'Rings', desc: 'Elegant solitaire ring with cubic zirconia. Adjustable size, perfect for daily wear.', colors: ['Silver', 'Gold'], sizes: ['Adjustable'] },
    { id: 'p4', name: 'Oxidised Silver Bangle Set', category: 'bracelets', material: 'oxidised', price: 749, oldPrice: 1099, rating: 4.6, reviews: 156, stock: 20, badge: '', image: 'Bracelets', desc: 'Set of 4 oxidised silver bangles with intricate tribal design. Traditional and trendy.', colors: ['Silver'], sizes: ['2.4', '2.6', '2.8'] },
    { id: 'p5', name: 'Rose Gold Chain Necklace', category: 'necklace', material: 'rose-gold', price: 1199, oldPrice: 1699, rating: 4.8, reviews: 178, stock: 12, badge: 'bestseller', image: 'Necklace', desc: 'Delicate rose gold chain with pendant. Perfect for layering or wearing solo.', colors: ['Rose Gold'], sizes: ['16 inch', '18 inch'] },
    { id: 'p6', name: 'Jhumka Chandbali Earrings', category: 'earrings', material: 'gold-plated', price: 1099, oldPrice: 1499, rating: 4.7, reviews: 145, stock: 18, badge: '', image: 'Earrings', desc: 'Traditional jhumka earrings with chandbali design. Lightweight for all-day comfort.', colors: ['Gold', 'Silver'], sizes: ['One Size'] },
    { id: 'p7', name: 'Bridal Choker Necklace', category: 'bridal', material: 'gold-plated', price: 1899, oldPrice: 2699, rating: 4.9, reviews: 67, stock: 6, badge: 'new', image: 'Bridal', desc: 'Statement bridal choker with Kundan work and pearl drops. A wedding essential.', colors: ['Gold'], sizes: ['One Size'] },
    { id: 'p8', name: 'Adjustable Toe Rings (Pair)', category: 'anklets', material: 'silver-plated', price: 299, oldPrice: 499, rating: 4.4, reviews: 320, stock: 40, badge: '', image: 'Anklets', desc: 'Classic silver-plated toe rings with floral design. Adjustable for comfortable fit.', colors: ['Silver'], sizes: ['Adjustable'] },
    { id: 'p9', name: 'Pearl Chain Anklet', category: 'anklets', material: 'gold-plated', price: 449, oldPrice: 699, rating: 4.6, reviews: 98, stock: 22, badge: 'new', image: 'Anklets', desc: 'Elegant pearl chain anklet with gold plating. Perfect for festive occasions.', colors: ['Gold'], sizes: ['One Size'] },
    { id: 'p10', name: 'American Diamond Ring Set', category: 'rings', material: 'silver-plated', price: 799, oldPrice: 1199, rating: 4.7, reviews: 134, stock: 16, badge: '', image: 'Rings', desc: 'Set of 3 stacking rings with American diamonds. Modern and versatile.', colors: ['Silver', 'Rose Gold'], sizes: ['Adjustable'] },
    { id: 'p11', name: 'Antique Gold Kada', category: 'bracelets', material: 'gold-plated', price: 1349, oldPrice: 1899, rating: 4.8, reviews: 76, stock: 10, badge: 'bestseller', image: 'Bracelets', desc: 'Broad antique gold kada with intricate carving. Statement piece for special occasions.', colors: ['Gold'], sizes: ['2.6', '2.8'] },
    { id: 'p12', name: 'Layered Chain Necklace', category: 'necklace', material: 'gold-plated', price: 999, oldPrice: 1399, rating: 4.5, reviews: 112, stock: 14, badge: '', image: 'Necklace', desc: 'Trendy layered chain necklace with minimal pendant. Effortlessly stylish.', colors: ['Gold'], sizes: ['One Size'] }
  ];

  const CATEGORIES = {
    earrings: 'Earrings',
    necklace: 'Necklace',
    rings: 'Rings',
    bracelets: 'Bracelets',
    bridal: 'Bridal Sets',
    anklets: 'Anklets'
  };

  const COUPONS = {
    'RIPU20': { type: 'percent', value: 20, label: '20% OFF' },
    'FESTIVE500': { type: 'flat', value: 500, min: 2999, label: '₹500 OFF' },
    'FREESHIP': { type: 'shipping', value: 0, label: 'Free Shipping' }
  };

  const SHIPPING_FREE_ABOVE = 999;
  const SHIPPING_CHARGE = 79;

  /* ============================================================
     2. STATE
  ============================================================ */
  const state = {
    cart: [],
    wishlist: [],
    orders: [],
    coupon: null,
    currentPage: 'home',
    shopFilters: {
      categories: [],
      materials: [],
      maxPrice: 5000,
      inStock: false,
      search: '',
      sort: 'featured'
    },
    currentProduct: null
  };

  /* ============================================================
     3. UTILITIES
  ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const formatPrice = (n) => '₹' + Number(n).toLocaleString('en-IN');

  const starsHTML = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let s = '';
    for (let i = 0; i < full; i++) s += '★';
    if (half) s += '☆';
    return `<span class="stars">${s}</span>`;
  };

  const discountPct = (oldP, newP) => Math.round(((oldP - newP) / oldP) * 100);

  function toast(message, type = 'info', duration = 3000) {
    const area = $('#toastArea');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    area.appendChild(el);
    setTimeout(() => {
      el.classList.add('removing');
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  function showInfoModal(title, message) {
    $('#infoModalTitle').textContent = title;
    $('#infoModalMessage').textContent = message;
    openModal('#infoModal');
  }

  function openModal(sel) { $(sel).classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal(sel) { $(sel).classList.remove('open'); document.body.style.overflow = ''; }

  function closeAllModals() {
    $$('.modal').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }

  function showLoader(show = true) { $('#loader').hidden = !show; }

  /* ============================================================
     4. STORAGE (persist cart, wishlist, orders)
  ============================================================ */
  function saveState() {
    try {
      localStorage.setItem('rsj_cart', JSON.stringify(state.cart));
      localStorage.setItem('rsj_wishlist', JSON.stringify(state.wishlist));
      localStorage.setItem('rsj_orders', JSON.stringify(state.orders));
    } catch (e) { /* localStorage may be blocked */ }
  }

  function loadState() {
    try {
      state.cart = JSON.parse(localStorage.getItem('rsj_cart') || '[]');
      state.wishlist = JSON.parse(localStorage.getItem('rsj_wishlist') || '[]');
      state.orders = JSON.parse(localStorage.getItem('rsj_orders') || '[]');
    } catch (e) { /* ignore */ }
  }

  /* ============================================================
     5. PRODUCT RENDERING
  ============================================================ */
  function productCardHTML(p) {
    const off = p.oldPrice ? discountPct(p.oldPrice, p.price) : 0;
    const inWishlist = state.wishlist.includes(p.id);
    const badgeHTML = [];
    if (p.badge === 'bestseller') badgeHTML.push('<span class="product-badge">Bestseller</span>');
    if (p.badge === 'new') badgeHTML.push('<span class="product-badge new">New</span>');
    if (off > 0) badgeHTML.push(`<span class="product-badge sale">-${off}%</span>`);

    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-image" data-action="view">
          <div class="product-badges">${badgeHTML.join('')}</div>
          <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-action="wishlist" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 21s-7-4.35-9.5-8.5C.7 9.6 2.3 5.5 6 5.5c2 0 3.4 1.1 4 2 .6-.9 2-2 4-2 3.7 0 5.3 4.1 3.5 7C19 16.65 12 21 12 21z" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
          </button>
          ${p.image}
          <button class="quick-view-btn" data-action="quickview">Quick View</button>
        </div>
        <div class="product-info">
          <p class="product-category">${CATEGORIES[p.category]}</p>
          <h3 class="product-name" data-action="view">${p.name}</h3>
          <div class="product-rating">${starsHTML(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
          <div class="product-price-row">
            <span class="price">${formatPrice(p.price)}</span>
            ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span><span class="price-off">${off}% off</span>` : ''}
          </div>
        </div>
        <div class="product-actions">
          <button class="add-to-cart-btn" data-action="add">Add to Cart</button>
        </div>
      </article>
    `;
  }

  function renderFeatured() {
    const grid = $('#featuredGrid');
    if (!grid) return;
    const featured = PRODUCTS.filter(p => p.badge === 'bestseller' || p.badge === 'new').slice(0, 8);
    grid.innerHTML = featured.map(productCardHTML).join('');
  }

  function getFilteredProducts() {
    let list = [...PRODUCTS];
    const f = state.shopFilters;

    if (f.categories.length) list = list.filter(p => f.categories.includes(p.category));
    if (f.materials.length) list = list.filter(p => f.materials.includes(p.material));
    list = list.filter(p => p.price <= f.maxPrice);
    if (f.inStock) list = list.filter(p => p.stock > 0);

    if (f.search) {
      const q = f.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.desc && p.desc.toLowerCase().includes(q))
      );
    }

    switch (f.sort) {
      case 'price-low': list.sort((a, b) => a.price - b.price); break;
      case 'price-high': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'newest': list.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0)); break;
      default: list.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }
    return list;
  }

  function renderShop() {
    const grid = $('#shopGrid');
    const empty = $('#shopEmpty');
    const list = getFilteredProducts();
    $('#resultCount').textContent = list.length;

    if (!list.length) {
      grid.innerHTML = '';
      empty.hidden = false;
    } else {
      empty.hidden = true;
      grid.innerHTML = list.map(productCardHTML).join('');
    }
  }

  function updateShopTitle() {
    const f = state.shopFilters;
    const title = $('#shopTitle');
    const sub = $('#shopSubtitle');
    if (f.search) { title.textContent = `Search: "${f.search}"`; sub.textContent = `${getFilteredProducts().length} results`; }
    else if (f.categories.length === 1) { title.textContent = CATEGORIES[f.categories[0]]; sub.textContent = `Explore our ${CATEGORIES[f.categories[0]].toLowerCase()} collection`; }
    else { title.textContent = 'All Products'; sub.textContent = 'Discover our complete collection'; }
  }

  function renderWishlist() {
    const grid = $('#wishlistGrid');
    const empty = $('#wishlistEmpty');
    const items = PRODUCTS.filter(p => state.wishlist.includes(p.id));
    if (!items.length) { grid.innerHTML = ''; empty.hidden = false; }
    else { empty.hidden = true; grid.innerHTML = items.map(productCardHTML).join(''); }
    updateWishlistBadge();
  }

  function updateWishlistBadge() {
    $('#wishlistBadge').textContent = state.wishlist.length;
  }

  function updateCartBadge() {
    const count = state.cart.reduce((s, i) => s + i.qty, 0);
    $('#cartBadge').textContent = count;
  }

  /* ============================================================
     6. PRODUCT DETAIL
  ============================================================ */
  function renderProductDetail(productId) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    state.currentProduct = p;
    const off = p.oldPrice ? discountPct(p.oldPrice, p.price) : 0;
    const inWishlist = state.wishlist.includes(p.id);

    const html = `
      <div class="pd-gallery">
        <div class="pd-main-image">${p.image}</div>
        <div class="pd-thumbs">
          <div class="pd-thumb active">${p.image}</div>
          <div class="pd-thumb">View 2</div>
          <div class="pd-thumb">View 3</div>
          <div class="pd-thumb">View 4</div>
        </div>
      </div>
      <div class="pd-info">
        <p class="pd-category">${CATEGORIES[p.category]}</p>
        <h1>${p.name}</h1>
        <div class="pd-rating">${starsHTML(p.rating)} <span>${p.rating} · ${p.reviews} reviews</span></div>
        <div class="pd-price-row">
          <span class="pd-price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="pd-price-old">${formatPrice(p.oldPrice)}</span><span class="pd-off">${off}% OFF</span>` : ''}
        </div>
        <p class="pd-desc">${p.desc}</p>

        <div class="pd-options">
          <h4>Color</h4>
          <div class="pd-option-list">
            ${p.colors.map((c, i) => `<button class="pd-option ${i === 0 ? 'active' : ''}" data-option="color">${c}</button>`).join('')}
          </div>
        </div>

        <div class="pd-options">
          <h4>Size</h4>
          <div class="pd-option-list">
            ${p.sizes.map((s, i) => `<button class="pd-option ${i === 0 ? 'active' : ''}" data-option="size">${s}</button>`).join('')}
          </div>
        </div>

        <div class="pd-qty">
          <button class="qty-btn" data-qty="-1">−</button>
          <input type="number" value="1" min="1" id="pdQty" />
          <button class="qty-btn" data-qty="1">+</button>
        </div>

        <div class="pd-actions">
          <button class="btn btn-dark" id="pdAddToCart">Add to Cart</button>
          <button class="btn btn-outline" id="pdWishlist">${inWishlist ? '♥ In Wishlist' : '♡ Add to Wishlist'}</button>
        </div>

        <div class="pd-meta">
          <p><strong>In Stock:</strong> ${p.stock} units available</p>
          <p><strong>Material:</strong> ${p.material.replace('-', ' ')}</p>
          <p><strong>Delivery:</strong> 3–5 business days</p>
          <p><strong>Returns:</strong> 7-day easy return</p>
        </div>
      </div>
    `;
    $('#productDetail').innerHTML = html;
  }

  /* ============================================================
     7. CART LOGIC
  ============================================================ */
  function addToCart(productId, qty = 1) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    const existing = state.cart.find(i => i.id === productId);
    if (existing) existing.qty += qty;
    else state.cart.push({ id: productId, qty });
    saveState();
    updateCartBadge();
    toast(`${p.name} added to cart`, 'success');
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    saveState();
    updateCartBadge();
    renderCart();
  }

  function updateCartQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty < 1) item.qty = 1;
    saveState();
    updateCartBadge();
    renderCart();
  }

  function cartTotals() {
    let subtotal = 0;
    state.cart.forEach(item => {
      const p = PRODUCTS.find(x => x.id === item.id);
      if (p) subtotal += p.price * item.qty;
    });

    let discount = 0;
    let freeShipping = subtotal >= SHIPPING_FREE_ABOVE;
    let shipping = freeShipping ? 0 : SHIPPING_CHARGE;

    if (state.coupon) {
      const c = COUPONS[state.coupon];
      if (c) {
        if (c.type === 'percent') discount = Math.round(subtotal * c.value / 100);
        else if (c.type === 'flat' && subtotal >= (c.min || 0)) discount = c.value;
        else if (c.type === 'shipping') shipping = 0;
      }
    }

    const total = Math.max(0, subtotal - discount) + shipping;
    return { subtotal, discount, shipping, total };
  }

  function renderCart() {
    const wrap = $('#cartItems');
    const empty = $('#cartEmpty');
    const summary = $('#cartSummary');

    if (!state.cart.length) {
      wrap.innerHTML = '';
      empty.hidden = false;
      summary.hidden = true;
      return;
    }
    empty.hidden = true;
    summary.hidden = false;

    wrap.innerHTML = state.cart.map(item => {
      const p = PRODUCTS.find(x => x.id === item.id);
      if (!p) return '';
      return `
        <div class="cart-item" data-id="${p.id}">
          <div class="cart-item-image">${p.image}</div>
          <div class="cart-item-info">
            <p class="cart-item-cat">${CATEGORIES[p.category]}</p>
            <h4 data-action="view">${p.name}</h4>
            <p class="cart-item-price">${formatPrice(p.price)}</p>
          </div>
          <div class="cart-item-controls">
            <div class="pd-qty">
              <button class="qty-btn" data-cart-qty="-1">−</button>
              <input type="number" value="${item.qty}" readonly />
              <button class="qty-btn" data-cart-qty="1">+</button>
            </div>
            <button class="remove-item" data-action="remove">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    const t = cartTotals();
    $('#cartSubtotal').textContent = formatPrice(t.subtotal);
    $('#cartShipping').textContent = t.shipping === 0 ? 'FREE' : formatPrice(t.shipping);
    $('#cartTotal').textContent = formatPrice(t.total);

    if (t.discount > 0) {
      $('#discountRow').hidden = false;
      $('#cartDiscount').textContent = '-' + formatPrice(t.discount);
    } else {
      $('#discountRow').hidden = true;
    }
  }

  function applyCoupon() {
    const code = $('#couponInput').value.trim().toUpperCase();
    if (!code) { toast('Please enter a coupon code', 'error'); return; }
    const c = COUPONS[code];
    if (!c) { toast('Invalid coupon code', 'error'); return; }

    const t = cartTotals();
    if (c.type === 'flat' && t.subtotal < (c.min || 0)) {
      toast(`Minimum order ${formatPrice(c.min)} required for this coupon`, 'error');
      return;
    }
    state.coupon = code;
    renderCart();
    toast(`Coupon ${code} applied — ${c.label}`, 'success');
    $('#couponHint').innerHTML = `Applied: <strong>${code}</strong> · <button class="btn-link" id="removeCoupon">Remove</button>`;
    const removeBtn = $('#removeCoupon');
    if (removeBtn) removeBtn.addEventListener('click', () => {
      state.coupon = null;
      $('#couponInput').value = '';
      $('#couponHint').innerHTML = 'Try <strong>RIPU20</strong> for 20% off';
      renderCart();
      toast('Coupon removed', 'info');
    });
  }

  /* ============================================================
     8. WISHLIST LOGIC
  ============================================================ */
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    const p = PRODUCTS.find(x => x.id === productId);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      toast(`${p.name} removed from wishlist`, 'info');
    } else {
      state.wishlist.push(productId);
      toast(`${p.name} added to wishlist`, 'success');
    }
    saveState();
    updateWishlistBadge();
    // Re-render current view if needed
    if (state.currentPage === 'wishlist') renderWishlist();
    else {
      renderFeatured();
      if (state.currentPage === 'shop') renderShop();
    }
  }

  /* ============================================================
     9. CHECKOUT & ORDERS
  ============================================================ */
  function renderCheckout() {
    const wrap = $('#checkoutItems');
    if (!state.cart.length) {
      wrap.innerHTML = '<p style="color:var(--muted);font-size:0.9rem;">Your cart is empty.</p>';
    } else {
      wrap.innerHTML = state.cart.map(item => {
        const p = PRODUCTS.find(x => x.id === item.id);
        if (!p) return '';
        return `
          <div class="co-item">
            <div class="co-item-img">${p.image.slice(0, 3)}</div>
            <div class="co-item-info">
              <p>${p.name}</p>
              <p>Qty: ${item.qty} × ${formatPrice(p.price)}</p>
            </div>
          </div>
        `;
      }).join('');
    }
    const t = cartTotals();
    $('#checkoutSubtotal').textContent = formatPrice(t.subtotal);
    $('#checkoutShipping').textContent = t.shipping === 0 ? 'FREE' : formatPrice(t.shipping);
    $('#checkoutTotal').textContent = formatPrice(t.total);
  }

  function placeOrder(e) {
    e.preventDefault();
    if (!state.cart.length) { toast('Your cart is empty', 'error'); return; }

    const form = e.target;
    const inputs = form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]');
    let valid = true;
    inputs.forEach(inp => { if (inp.required && !inp.value.trim()) valid = false; });
    if (!valid) { toast('Please fill all required fields', 'error'); return; }

    const payMethod = form.querySelector('input[name="payment"]:checked').value;
    if (payMethod !== 'cod') {
      showInfoModal(
        'Payment Gateway Not Connected',
        `You selected ${payMethod.toUpperCase()}. In production, this would connect to Razorpay/Stripe/PayU. For now, the order will be placed as a demo.`
      );
    }

    const orderId = 'RSJ' + Date.now().toString().slice(-8);
    const t = cartTotals();

    const order = {
      id: orderId,
      date: new Date().toISOString(),
      items: [...state.cart],
      total: t.total,
      status: 'placed',
      payment: payMethod
    };
    state.orders.unshift(order);
    state.cart = [];
    state.coupon = null;
    saveState();
    updateCartBadge();

    $('#successOrderId').textContent = '#' + orderId;
    navigate('order-success');
    toast('Order placed successfully!', 'success', 4000);
  }

  function renderOrders() {
    const wrap = $('#ordersList');
    const empty = $('#ordersEmpty');
    if (!state.orders.length) { wrap.innerHTML = ''; empty.hidden = false; return; }
    empty.hidden = true;

    wrap.innerHTML = state.orders.map(o => {
      const statusClass = o.status === 'shipped' ? 'status-shipped' : o.status === 'delivered' ? 'status-delivered' : 'status-placed';
      const itemCount = o.items.reduce((s, i) => s + i.qty, 0);
      return `
        <div class="order-card">
          <div class="order-card-info">
            <h4>Order #${o.id}</h4>
            <p>${new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · ${itemCount} item(s) · ${formatPrice(o.total)}</p>
          </div>
          <span class="order-status ${statusClass}">${o.status}</span>
          <button class="btn btn-outline" data-track="${o.id}">Track Order</button>
        </div>
      `;
    }).join('');
  }

  /* ============================================================
     10. NAVIGATION
  ============================================================ */
  function navigate(page, options = {}) {
    const pageEl = $(`#page-${page}`);
    if (!pageEl) {
      showInfoModal('Page Not Available', `The "${page}" page is not part of this prototype.`);
      return;
    }

    $$('.page').forEach(p => p.classList.remove('active'));
    pageEl.classList.add('active');
    state.currentPage = page;

    // Update nav active states
    $$('.nav-link').forEach(l => l.classList.remove('active'));
    $$(`.nav-link[data-nav="${page}"]`).forEach(l => l.classList.add('active'));
    $$('.mobile-bottom-nav button').forEach(b => {
      b.classList.toggle('active', b.dataset.nav === page);
    });

    // Page-specific rendering
    if (page === 'shop') { updateShopTitle(); renderShop(); }
    if (page === 'cart') renderCart();
    if (page === 'wishlist') renderWishlist();
    if (page === 'checkout') renderCheckout();
    if (page === 'orders') renderOrders();
    if (page === 'admin') renderAdmin();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeDrawer();
    closeSearch();
  }

  /* ============================================================
     11. DRAWER / SEARCH
  ============================================================ */
  function openDrawer() { $('#mobileDrawer').classList.add('open'); $('#drawerOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { $('#mobileDrawer').classList.remove('open'); $('#drawerOverlay').classList.remove('open'); document.body.style.overflow = ''; }
  function openSearch() { $('#searchBar').classList.add('open'); setTimeout(() => $('#searchInput').focus(), 100); }
  function closeSearch() { $('#searchBar').classList.remove('open'); }

  function performSearch() {
    const q = $('#searchInput').value.trim();
    state.shopFilters.search = q;
    navigate('shop');
    updateShopTitle();
    renderShop();
  }

  /* ============================================================
     12. ADMIN DASHBOARD
  ============================================================ */
  function renderAdmin() {
    $('#statProducts').textContent = PRODUCTS.length;
    $('#statOrders').textContent = state.orders.length;
    $('#statCustomers').textContent = 1;
    const revenue = state.orders.reduce((s, o) => s + o.total, 0);
    $('#statRevenue').textContent = formatPrice(revenue);

    $('#adminProductsBody').innerHTML = PRODUCTS.slice(0, 8).map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${CATEGORIES[p.category]}</td>
        <td>${formatPrice(p.price)}</td>
        <td>${p.stock}</td>
        <td><button class="btn-link" data-admin-action="edit">Edit</button></td>
      </tr>
    `).join('');

    $('#adminOrdersBody').innerHTML = state.orders.length
      ? state.orders.map(o => `
          <tr>
            <td>#${o.id}</td>
            <td>Guest User</td>
            <td>${formatPrice(o.total)}</td>
            <td><span class="order-status status-${o.status === 'placed' ? 'placed' : 'shipped'}">${o.status}</span></td>
          </tr>
        `).join('')
      : '<tr><td colspan="4" style="text-align:center;color:var(--muted);">No orders yet</td></tr>';

    $('#adminCustomersBody').innerHTML = `
      <tr><td>Guest User</td><td>guest@example.com</td><td>${state.orders.length}</td></tr>
    `;

    $('#adminCouponsBody').innerHTML = Object.entries(COUPONS).map(([code, c]) => `
      <tr>
        <td><strong>${code}</strong></td>
        <td>${c.label}</td>
        <td><span class="order-status status-delivered">Active</span></td>
      </tr>
    `).join('');
  }

  /* ============================================================
     13. EVENT DELEGATION (global click handler)
  ============================================================ */
  document.addEventListener('click', (e) => {
    const t = e.target;

    // --- Navigation (data-nav) ---
    const navEl = t.closest('[data-nav]');
    if (navEl) {
      const page = navEl.dataset.nav;
      if (page === 'account') {
        // If not "logged in", go to auth. Simple demo: always auth.
        navigate('auth');
      } else {
        navigate(page);
      }
      e.preventDefault();
      return;
    }

    // --- Category shortcuts ---
    const catEl = t.closest('[data-category]');
    if (catEl) {
      const cat = catEl.dataset.category;
      state.shopFilters.categories = [cat];
      state.shopFilters.materials = [];
      state.shopFilters.search = '';
      state.shopFilters.maxPrice = 5000;
      $$('.filter-category').forEach(cb => cb.checked = cb.value === cat);
      navigate('shop');
      e.preventDefault();
      return;
    }

    // --- Product card actions ---
    const card = t.closest('.product-card');
    if (card) {
      const id = card.dataset.id;
      const actionEl = t.closest('[data-action]');
      const action = actionEl ? actionEl.dataset.action : null;

      if (action === 'add') { addToCart(id, 1); return; }
      if (action === 'wishlist') { toggleWishlist(id); return; }
      if (action === 'quickview') { openQuickView(id); return; }
      if (action === 'view' || t.closest('.product-name')) { openProduct(id); return; }
      return;
    }

    // --- Cart item actions ---
    const cartItem = t.closest('.cart-item');
    if (cartItem) {
      const id = cartItem.dataset.id;
      const qtyBtn = t.closest('[data-cart-qty]');
      if (qtyBtn) { updateCartQty(id, parseInt(qtyBtn.dataset.cartQty, 10)); return; }
      if (t.closest('[data-action="remove"]')) { removeFromCart(id); return; }
      if (t.closest('[data-action="view"]')) { openProduct(id); return; }
    }

    // --- Modal close ---
    if (t.closest('[data-close-modal]')) { closeAllModals(); return; }

    // --- Auth tabs ---
    if (t.classList.contains('auth-tab')) {
      $$('.auth-tab').forEach(b => b.classList.remove('active'));
      t.classList.add('active');
      $$('.auth-form').forEach(f => f.classList.remove('active'));
      $(`#${t.dataset.auth}Form`).classList.add('active');
      return;
    }

    // --- Account tabs ---
    if (t.classList.contains('account-tab') && t.dataset.account) {
      $$('.account-tab').forEach(b => b.classList.remove('active'));
      t.classList.add('active');
      $$('.account-panel').forEach(p => p.classList.remove('active'));
      const panel = $(`#panel-${t.dataset.account}`);
      if (panel) panel.classList.add('active');
      return;
    }

    // --- Policy tabs ---
    if (t.classList.contains('policy-tab')) {
      $$('.policy-tab').forEach(b => b.classList.remove('active'));
      t.classList.add('active');
      $$('.policy-panel').forEach(p => p.classList.remove('active'));
      const panel = $(`#policy-${t.dataset.policy}`);
      if (panel) panel.classList.add('active');
      return;
    }

    // --- Admin tabs ---
    if (t.classList.contains('admin-tab')) {
      $$('.admin-tab').forEach(b => b.classList.remove('active'));
      t.classList.add('active');
      $$('.admin-panel').forEach(p => p.classList.remove('active'));
      const panel = $(`#admin-${t.dataset.admin}`);
      if (panel) panel.classList.add('active');
      return;
    }

    // --- Quick view / product detail actions ---
    if (t.closest('#pdAddToCart')) {
      const p = state.currentProduct;
      if (p) addToCart(p.id, parseInt($('#pdQty').value, 10) || 1);
      return;
    }
    if (t.closest('#pdWishlist')) {
      const p = state.currentProduct;
      if (p) { toggleWishlist(p.id); openProduct(p.id); }
      return;
    }
    if (t.closest('[data-option]')) {
      const siblings = t.parentElement.querySelectorAll('.pd-option');
      siblings.forEach(s => s.classList.remove('active'));
      t.classList.add('active');
      return;
    }
    if (t.closest('.qty-btn') && t.closest('.pd-qty') && !t.closest('.cart-item')) {
      const input = t.parentElement.querySelector('input');
      const delta = parseInt(t.dataset.qty, 10);
      let val = parseInt(input.value, 10) + delta;
      if (val < 1) val = 1;
      input.value = val;
      return;
    }
    if (t.closest('.pd-thumb')) {
      t.parentElement.querySelectorAll('.pd-thumb').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      return;
    }

    // --- Order tracking ---
    const trackBtn = t.closest('[data-track]');
    if (trackBtn) {
      $('#trackingOrderId').textContent = '#' + trackBtn.dataset.track;
      navigate('tracking');
      return;
    }

    // --- Track order button on success page ---
    if (t.closest('#successOrderId')) return;

    // --- Copy coupon ---
    if (t.classList.contains('copy-coupon')) {
      const code = t.dataset.code;
      navigator.clipboard?.writeText(code).then(
        () => toast(`Coupon "${code}" copied!`, 'success'),
        () => toast(`Coupon: ${code}`, 'info')
      );
      return;
    }

    // --- WhatsApp button ---
    if (t.closest('#whatsappBtn')) {
      window.open('https://wa.me/919000000000?text=Hi%20Ripu%20Sudan%20Jewellers', '_blank');
      return;
    }

    // --- Footer nav anchors (fallback) ---
    const anchor = t.closest('a[href^="#"]');
    if (anchor && !anchor.dataset.nav && !anchor.dataset.category) {
      const href = anchor.getAttribute('href').slice(1);
      if (href && $(`#page-${href}`)) { navigate(href); e.preventDefault(); }
    }
  });

  /* ============================================================
     14. PRODUCT NAVIGATION
  ============================================================ */
  function openProduct(id) {
    renderProductDetail(id);
    navigate('product');
  }

  function openQuickView(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const off = p.oldPrice ? discountPct(p.oldPrice, p.price) : 0;
    $('#quickViewBody').innerHTML = `
      <div class="qv-image">${p.image}</div>
      <div class="qv-info">
        <p class="product-category">${CATEGORIES[p.category]}</p>
        <h2>${p.name}</h2>
        <div class="product-rating">${starsHTML(p.rating)} <span>${p.rating}</span></div>
        <div class="pd-price-row">
          <span class="price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span><span class="price-off">${off}% off</span>` : ''}
        </div>
        <p class="pd-desc">${p.desc}</p>
        <div class="qv-actions">
          <button class="btn btn-dark" id="qvAdd">Add to Cart</button>
          <button class="btn btn-outline" id="qvView">View Details</button>
        </div>
      </div>
    `;
    openModal('#quickViewModal');
    $('#qvAdd').onclick = () => { addToCart(id, 1); closeAllModals(); };
    $('#qvView').onclick = () => { closeAllModals(); openProduct(id); };
  }

  /* ============================================================
     15. FILTER HANDLERS
  ============================================================ */
  function initFilters() {
    $$('.filter-category').forEach(cb => {
      cb.addEventListener('change', () => {
        state.shopFilters.categories = $$('.filter-category:checked').map(c => c.value);
        renderShop();
      });
    });
    $$('.filter-material').forEach(cb => {
      cb.addEventListener('change', () => {
        state.shopFilters.materials = $$('.filter-material:checked').map(c => c.value);
        renderShop();
      });
    });
    const price = $('#priceRange');
    if (price) {
      price.addEventListener('input', () => {
        state.shopFilters.maxPrice = parseInt(price.value, 10);
        $('#priceValue').textContent = price.value;
        renderShop();
      });
    }
    const stock = $('#filterInStock');
    if (stock) {
      stock.addEventListener('change', () => {
        state.shopFilters.inStock = stock.checked;
        renderShop();
      });
    }
    const sort = $('#sortSelect');
    if (sort) {
      sort.addEventListener('change', () => {
        state.shopFilters.sort = sort.value;
        renderShop();
      });
    }
    const clear = $('#clearFilters');
    if (clear) {
      clear.addEventListener('click', () => {
        state.shopFilters = { categories: [], materials: [], maxPrice: 5000, inStock: false, search: '', sort: 'featured' };
        $$('.filter-category, .filter-material').forEach(cb => cb.checked = false);
        if ($('#filterInStock')) $('#filterInStock').checked = false;
        if ($('#priceRange')) { $('#priceRange').value = 5000; $('#priceValue').textContent = '5000'; }
        if ($('#sortSelect')) $('#sortSelect').value = 'featured';
        renderShop();
        updateShopTitle();
      });
    }
    const resetEmpty = $('#resetFromEmpty');
    if (resetEmpty) {
      resetEmpty.addEventListener('click', () => {
        $('#clearFilters').click();
      });
    }
        const filterMobile = $('#filterToggleMobile');
    if (filterMobile) {
      filterMobile.addEventListener('click', () => {
        const panel = $('#filtersPanel');
        panel.classList.toggle('open');
      });
    }
    const filtersClose = $('#filtersCloseMobile');
    if (filtersClose) {
      filtersClose.addEventListener('click', () => {
        $('#filtersPanel').classList.remove('open');
      });
    }
  }

  /* ============================================================
     16. INIT
  ============================================================ */
  function init() {
    loadState();
    updateCartBadge();
    updateWishlistBadge();
    renderFeatured();

    // Header scroll shadow
    window.addEventListener('scroll', () => {
      $('#siteHeader').classList.toggle('scrolled', window.scrollY > 10);
    });

    // Mobile drawer
    $('#mobileMenuToggle').addEventListener('click', openDrawer);
    $('#mobileDrawerClose').addEventListener('click', closeDrawer);
    $('#drawerOverlay').addEventListener('click', closeDrawer);

    // Search
    $('#searchToggle').addEventListener('click', openSearch);
    $('#searchClose').addEventListener('click', closeSearch);
    $('#searchSubmit').addEventListener('click', performSearch);
    $('#searchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') performSearch(); });

    // Header icons
    $('#cartToggle').addEventListener('click', () => navigate('cart'));
    $('#wishlistToggle').addEventListener('click', () => navigate('wishlist'));
    $('#accountToggle').addEventListener('click', () => navigate('auth'));

    // Cart actions
    $('#checkoutBtn').addEventListener('click', () => {
      if (!state.cart.length) { toast('Your cart is empty', 'error'); return; }
      navigate('checkout');
    });
    $('#applyCoupon').addEventListener('click', applyCoupon);
    $('#couponInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') applyCoupon(); });

    // Checkout
    $('#checkoutForm').addEventListener('submit', placeOrder);

    // Auth forms
    $('#loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      toast('Logged in successfully (demo)', 'success');
      navigate('account');
    });
    $('#registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      toast('Account created (demo)', 'success');
      navigate('account');
    });

    // Account actions
    $('#logoutBtn').addEventListener('click', () => {
      toast('Logged out (demo)', 'info');
      navigate('home');
    });
    $('#saveProfile').addEventListener('click', () => toast('Profile saved (demo)', 'success'));
    $('#addAddressBtn').addEventListener('click', () => showInfoModal('Add Address', 'In production, this opens a form to add a new address. Backend integration required.'));

    // Contact form
    $('#contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      toast('Message sent! We will get back to you soon.', 'success');
      e.target.reset();
    });

    // Newsletter
    $('#newsletterForm').addEventListener('submit', (e) => {
      e.preventDefault();
      toast('Subscribed! Welcome to the family.', 'success');
      e.target.reset();
    });

    // Admin
    $('#addProductBtn').addEventListener('click', () => showInfoModal('Add Product', 'In production, this opens a product creation form connected to the backend.'));
    $('#addCouponBtn').addEventListener('click', () => showInfoModal('Add Coupon', 'In production, this opens a coupon creation form connected to the backend.'));

    // Back to shop
    $('#backToShop').addEventListener('click', () => navigate('shop'));

    // Filters
    initFilters();

    // Modal backdrop close (also handled by delegation)
    $$('.modal').forEach(m => {
      m.addEventListener('click', (e) => { if (e.target.classList.contains('modal-backdrop')) closeAllModals(); });
    });

    // Escape key closes modals/drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeAllModals(); closeDrawer(); closeSearch(); }
    });

    // Initial page
    navigate('home');

    // Welcome toast (only once)
    if (!sessionStorage.getItem('rsj_welcomed')) {
      setTimeout(() => toast('Welcome to Ripu Sudan Jewellers ✦', 'info', 4000), 800);
      sessionStorage.setItem('rsj_welcomed', '1');
    }

        // ============ SECRET ADMIN ACCESS (demo only) ============
    // Press Ctrl + Shift + A to open Admin Panel
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('admin');
        toast('🔓 Admin Panel accessed (demo only)', 'info', 3000);
      }
    });
  }

  // Boot
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();