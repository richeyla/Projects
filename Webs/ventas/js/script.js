 /* ── CART STATE ── */
  const cart = [];

  function addToCart(name, price, img, btn) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, img, qty: 1 });
    }
    updateCartUI();
    showToast(`"${name}" agregado al carrito`);

    // Button feedback
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>¡Agregado!';
    btn.style.background = '#2e7d32';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
    }, 1500);
  }

  function removeFromCart(name) {
    const idx = cart.findIndex(i => i.name === name);
    if (idx > -1) cart.splice(idx, 1);
    updateCartUI();
  }

  function updateCartUI() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartCount').textContent = count;

    const container = document.getElementById('cartItems');
    const footer    = document.getElementById('cartFooter');

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-cart text-center py-5">
          <i class="bi bi-bag-x" style="font-size:3rem;color:#d1d1d6;"></i>
          <p class="mt-3">Tu carrito está vacío</p>
        </div>`;
      footer.classList.add('d-none');
      return;
    }

    footer.classList.remove('d-none');
    container.innerHTML = cart.map(item => `
      <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
        <div class="flex-grow-1">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price}</div>
          <small class="text-muted">Cantidad: ${item.qty}</small>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.name.replace(/'/g,"\\'")}')" title="Eliminar">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    `).join('');

    document.getElementById('cartTotal').textContent =
      'RD$' + cart.reduce((s, i) => {
        const n = parseFloat(i.price.replace('RD$','').replace(/,/g,''));
        return s + n * i.qty;
      }, 0).toLocaleString();
  }

  /* ── TOAST ── */
  function showToast(msg) {
    document.getElementById('toastMsg').textContent = msg;
    const toast = new bootstrap.Toast(document.getElementById('cartToast'), { delay: 2500 });
    toast.show();
  }

  /* ── WISHLIST ── */
  function toggleWishlist(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('bi-heart')) {
      icon.classList.replace('bi-heart','bi-heart-fill');
      btn.style.color = '#e0245e';
    } else {
      icon.classList.replace('bi-heart-fill','bi-heart');
      btn.style.color = '';
    }
  }

  /* ── PRODUCT DETAIL MODAL ── */
  let _modalName, _modalPrice, _modalImg;
  function openDetail(name, cat, price, img, desc) {
    _modalName = name; _modalPrice = price; _modalImg = img;
    document.getElementById('modalName').textContent  = name;
    document.getElementById('modalCat').textContent   = cat;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('modalImg').src           = img;
    document.getElementById('modalDesc').textContent  = desc;
    document.getElementById('modalAddBtn').onclick = function() {
      addToCart(_modalName, _modalPrice, _modalImg, this);
      bootstrap.Modal.getInstance(document.getElementById('detailModal')).hide();
    };
  }

  /* ── CATEGORY FILTER ── */
  document.getElementById('filterBtns').addEventListener('click', e => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterProducts(btn.dataset.filter);
  });

  // Dropdown filter links
  document.querySelectorAll('[data-filter]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const f = e.currentTarget.dataset.filter;
      document.querySelectorAll('.filter-pill').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === f);
      });
      filterProducts(f);
    });
  });

  function filterProducts(cat) {
    document.querySelectorAll('#productGrid .product-col').forEach(col => {
      const show = cat === 'all' || col.dataset.cat === cat;
      col.style.display = show ? '' : 'none';
      // re-trigger animation
      if (show) {
        const card = col.querySelector('.product-card');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      }
    });
  }

  /* ── SEARCH ── */
  function handleSearch(e) {
    e.preventDefault();
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!q) { filterProducts('all'); return; }
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#productGrid .product-col').forEach(col => {
      const title = col.querySelector('.card-title').textContent.toLowerCase();
      col.style.display = title.includes(q) ? '' : 'none';
    });
  }

  /* ── SCROLL ANIMATIONS (IntersectionObserver) ── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animationPlayState = 'running';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });