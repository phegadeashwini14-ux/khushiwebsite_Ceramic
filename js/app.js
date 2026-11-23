/**
 * Ceramic Bliss - Core Application Logic
 * Modern Vanilla JS with Performance, Accessibility & WhatsApp Direct Commerce
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentCategory = 'All';
  let currentSort = 'featured';
  let searchQuery = '';
  let inquiryList = [];

  // DOM Elements
  const productGrid = document.getElementById('product-grid');
  const categoryTabs = document.querySelectorAll('.category-tab-btn');
  const sortSelect = document.getElementById('sort-select');
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const productCountEl = document.getElementById('product-count');
  
  // Quick View Modal
  const quickViewModal = document.getElementById('quick-view-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalPrice = document.getElementById('modal-price');
  const modalOriginalPrice = document.getElementById('modal-original-price');
  const modalDiscountTag = document.getElementById('modal-discount-tag');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecsBody = document.getElementById('modal-specs-body');
  const modalOrderBtn = document.getElementById('modal-order-btn');
  const modalAddInquiryBtn = document.getElementById('modal-add-inquiry-btn');
  const modalThumbnailsStrip = document.getElementById('modal-thumbnails-strip');
  const modalPrevImg = document.getElementById('modal-prev-img');
  const modalNextImg = document.getElementById('modal-next-img');
  const modalImageCounter = document.getElementById('modal-image-counter');

  let activeModalImages = [];
  let currentModalImgIdx = 0;
  
  // Inquiry Drawer
  const inquiryDrawer = document.getElementById('inquiry-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const openDrawerBtns = document.querySelectorAll('.open-drawer-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerItemsContainer = document.getElementById('drawer-items-container');
  const drawerTotalVal = document.getElementById('drawer-total-val');
  const drawerCountBadges = document.querySelectorAll('.inquiry-badge-count');
  const floatingInquiryCount = document.getElementById('floating-inquiry-count');
  const sendWhatsAppOrderBtn = document.getElementById('send-whatsapp-order-btn');
  
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const siteHeader = document.getElementById('site-header');

  // Toast
  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');

  // Load Saved Inquiry Wishlist from LocalStorage
  try {
    const saved = localStorage.getItem('ceramic_bliss_inquiry');
    if (saved) {
      inquiryList = JSON.parse(saved);
      updateDrawerUI();
    }
  } catch (e) {
    console.error('Storage access error', e);
  }

  // Header Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !expanded);
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Category Filtering
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category || 'All';
      renderCatalog();
    });
  });

  // Sorting
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderCatalog();
    });
  }

  // Search Filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('visible', searchQuery.length > 0);
      }
      renderCatalog();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClearBtn.classList.remove('visible');
      searchInput.focus();
      renderCatalog();
    });
  }

  // Helper: Filter & Sort Products
  function getFilteredProducts() {
    let list = [...window.CERAMIC_CATALOG_DATA];

    // Filter by Category
    if (currentCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery) ||
        (p.tagline && p.tagline.toLowerCase().includes(searchQuery))
      );
    }

    // Sort
    if (currentSort === 'price-low') {
      list.sort((a, b) => (a.sellingPrice || 9999) - (b.sellingPrice || 9999));
    } else if (currentSort === 'price-high') {
      list.sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0));
    } else if (currentSort === 'discount') {
      list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    } else {
      // Featured: items marked featured first
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }

  // Render Product Catalog
  function renderCatalog() {
    const products = getFilteredProducts();

    if (productCountEl) {
      productCountEl.textContent = `Showing ${products.length} handcrafted ${products.length === 1 ? 'item' : 'items'}`;
    }

    if (products.length === 0) {
      productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--color-surface); border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
          <div style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-terracotta);">🏺</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-clay-deep); margin-bottom: 0.5rem;">No ceramic items found</h3>
          <p style="color: var(--color-text-secondary); max-width: 400px; margin: 0 auto 1.5rem;">We couldn't find any products matching "${escapeHtml(searchQuery)}". Try another category or search term.</p>
          <button class="btn-primary" onclick="window.resetCatalogFilters()">View All Collections</button>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = products.map(product => {
      const isAdded = inquiryList.some(item => item.id === product.id);
      const discountTagHtml = product.discountPercent ? `<span class="discount-tag">${product.discountPercent}% OFF</span>` : '';
      const originalPriceHtml = product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : '';
      const savingsHtml = product.discount ? `<span class="savings-label">Save ₹${product.discount}</span>` : '';
      
      const whatsappText = encodeURIComponent(
        `Hello Ceramic Bliss! 🏺✨\nI am interested in ordering:\n*Product:* ${product.name}\n*Price:* ₹${product.sellingPrice}\n\nPlease share delivery options and availability!`
      );
      const whatsappUrl = `https://wa.me/${window.CERAMIC_CONFIG.phoneClean}?text=${whatsappText}`;

      const prodImages = product.images && product.images.length ? product.images : [product.image];
      const dotsHtml = prodImages.length > 1 ? `
        <div class="card-img-dots" aria-label="Product photos">
          ${prodImages.map((img, idx) => `
            <button type="button" class="card-dot ${idx === 0 ? 'active' : ''}" data-img="${img}" data-idx="${idx}" aria-label="Photo ${idx + 1}"></button>
          `).join('')}
        </div>
      ` : '';

      return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-card-media">
            <span class="product-badge">${product.badge || 'Artisanal'}</span>
            ${discountTagHtml}
            <img class="product-card-img" src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">
            ${dotsHtml}
            <div class="card-quick-actions">
              <button type="button" class="btn-quick-view" data-product-id="${product.id}" aria-label="Quick preview ${escapeHtml(product.name)}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Quick View
              </button>
            </div>
          </div>
          
          <div class="product-card-body">
            <span class="product-category">${escapeHtml(product.category)}</span>
            <h3 class="product-title">${escapeHtml(product.name)}</h3>
            <p class="product-tagline">${escapeHtml(product.tagline || product.description)}</p>
            
            <div class="product-price-row">
              <span class="current-price">₹${product.sellingPrice || 'Inquire'}</span>
              ${originalPriceHtml}
              ${savingsHtml}
            </div>
          </div>
          
          <footer class="product-card-footer">
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-order-whatsapp" title="Order directly on WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.184 0 5.77-2.587 5.77-5.768 0-3.182-2.586-5.77-5.77-5.77zm0 10.428c-.887 0-1.593-.243-2.316-.677l-.165-.098-1.58.414.422-1.54-.108-.172c-.477-.757-.729-1.517-.728-2.589.001-2.457 2.001-4.457 4.475-4.457 2.47 0 4.47 2 4.47 4.469 0 2.47-2 4.47-4.468 4.47z"/></svg>
              Order on WhatsApp
            </a>
            
            <button type="button" class="btn-add-inquiry ${isAdded ? 'added' : ''}" data-product-id="${product.id}" title="${isAdded ? 'In Inquiry List' : 'Add to WhatsApp Inquiry List'}" aria-label="Add to inquiry list">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isAdded ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </footer>
        </article>
      `;
    }).join('');

    // Attach Event Listeners to Rendered Cards
    attachCardListeners();
  }

  // Attach Card Events
  function attachCardListeners() {
    // Quick View Buttons
    document.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.productId);
        openQuickView(id);
      });
    });

    // Clicking image on mobile/desktop also opens Quick View
    document.querySelectorAll('.product-card-media').forEach(media => {
      media.style.cursor = 'pointer';
      media.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          const card = media.closest('.product-card');
          if (card) {
            const id = parseInt(card.dataset.productId);
            openQuickView(id);
          }
        }
      });
    });

    // Add to Inquiry Buttons
    document.querySelectorAll('.btn-add-inquiry').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.productId);
        toggleInquiryItem(id, btn);
      });
    });

    // Card Thumbnail Dots (Switch Card Preview Image)
    document.querySelectorAll('.card-dot').forEach(dot => {
      const switchImg = (e) => {
        e.stopPropagation();
        const card = dot.closest('.product-card');
        if (!card) return;
        const imgEl = card.querySelector('.product-card-img');
        const targetSrc = dot.dataset.img;
        if (imgEl && targetSrc) {
          imgEl.src = targetSrc;
          card.querySelectorAll('.card-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
        }
      };
      dot.addEventListener('click', switchImg);
      dot.addEventListener('mouseenter', switchImg);
    });
  }

  // Update Modal Image Helper
  function updateModalImage(idx) {
    if (!activeModalImages.length || !modalImg) return;
    currentModalImgIdx = (idx + activeModalImages.length) % activeModalImages.length;
    modalImg.style.opacity = '0.4';
    modalImg.src = activeModalImages[currentModalImgIdx];
    setTimeout(() => { modalImg.style.opacity = '1'; }, 80);

    if (modalImageCounter) {
      modalImageCounter.textContent = `${currentModalImgIdx + 1} / ${activeModalImages.length}`;
    }
    if (modalThumbnailsStrip) {
      modalThumbnailsStrip.querySelectorAll('.modal-thumb-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === currentModalImgIdx);
      });
    }
  }

  // Modal Gallery Navigation Controls
  if (modalPrevImg) {
    modalPrevImg.addEventListener('click', (e) => {
      e.stopPropagation();
      updateModalImage(currentModalImgIdx - 1);
    });
  }

  if (modalNextImg) {
    modalNextImg.addEventListener('click', (e) => {
      e.stopPropagation();
      updateModalImage(currentModalImgIdx + 1);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (quickViewModal && quickViewModal.open && activeModalImages.length > 1) {
      if (e.key === 'ArrowLeft') {
        updateModalImage(currentModalImgIdx - 1);
      } else if (e.key === 'ArrowRight') {
        updateModalImage(currentModalImgIdx + 1);
      }
    }
  });

  // Quick View Modal Open
  function openQuickView(productId) {
    const product = window.CERAMIC_CATALOG_DATA.find(p => p.id === productId);
    if (!product || !quickViewModal) return;

    // Gallery Setup for 3+ Images
    activeModalImages = product.images && product.images.length ? product.images : [product.image];
    currentModalImgIdx = 0;
    updateModalImage(0);

    // Populate Thumbnail Buttons
    if (modalThumbnailsStrip) {
      modalThumbnailsStrip.innerHTML = activeModalImages.map((img, idx) => `
        <button type="button" class="modal-thumb-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}" aria-label="View photo ${idx + 1}">
          <img src="${img}" alt="${escapeHtml(product.name)} photo ${idx + 1}">
        </button>
      `).join('');

      modalThumbnailsStrip.querySelectorAll('.modal-thumb-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx);
          updateModalImage(idx);
        });
      });
    }

    modalTitle.textContent = product.name;
    modalCategory.textContent = product.category;
    modalPrice.textContent = `₹${product.sellingPrice || 'Inquire'}`;
    
    if (product.originalPrice) {
      modalOriginalPrice.textContent = `₹${product.originalPrice}`;
      modalOriginalPrice.style.display = 'inline';
    } else {
      modalOriginalPrice.style.display = 'none';
    }

    if (product.discountPercent) {
      modalDiscountTag.textContent = `${product.discountPercent}% OFF (Save ₹${product.discount})`;
      modalDiscountTag.style.display = 'inline-block';
    } else {
      modalDiscountTag.style.display = 'none';
    }

    modalDesc.textContent = product.description;

    // Specs
    if (product.specs) {
      modalSpecsBody.innerHTML = Object.entries(product.specs).map(([k, v]) => `
        <tr>
          <td>${k.charAt(0).toUpperCase() + k.slice(1)}</td>
          <td>${escapeHtml(v)}</td>
        </tr>
      `).join('');
    } else {
      modalSpecsBody.innerHTML = '';
    }

    // Direct WhatsApp Button inside modal
    const whatsappText = encodeURIComponent(
      `Hello Ceramic Bliss! 🏺✨\nI am viewing your website and would like to order:\n*Product:* ${product.name}\n*Price:* ₹${product.sellingPrice}\n\nPlease share delivery options and availability!`
    );
    modalOrderBtn.href = `https://wa.me/${window.CERAMIC_CONFIG.phoneClean}?text=${whatsappText}`;

    // Modal Inquiry Button
    const isAdded = inquiryList.some(item => item.id === product.id);
    modalAddInquiryBtn.textContent = isAdded ? 'In WhatsApp Inquiry List ✓' : '+ Add to WhatsApp Inquiry List';
    modalAddInquiryBtn.onclick = () => {
      toggleInquiryItem(product.id);
      const nowAdded = inquiryList.some(item => item.id === product.id);
      modalAddInquiryBtn.textContent = nowAdded ? 'In WhatsApp Inquiry List ✓' : '+ Add to WhatsApp Inquiry List';
    };

    // Open Modal
    quickViewModal.showModal();
  }

  // Close Quick View
  if (modalCloseBtn && quickViewModal) {
    modalCloseBtn.addEventListener('click', () => {
      quickViewModal.close();
    });
  }

  // Modern Web Guidance: Light Dismiss Fallback for <dialog>
  if (quickViewModal) {
    let pressedOutside = false;
    const isOutside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    quickViewModal.addEventListener('pointerdown', (e) => {
      pressedOutside = isOutside(e, quickViewModal);
    });
    quickViewModal.addEventListener('pointerup', (e) => {
      if (pressedOutside && isOutside(e, quickViewModal)) {
        quickViewModal.close();
      }
    });
  }

  // Toggle Inquiry List Item
  function toggleInquiryItem(productId, btnEl) {
    const product = window.CERAMIC_CATALOG_DATA.find(p => p.id === productId);
    if (!product) return;

    const existingIdx = inquiryList.findIndex(item => item.id === productId);

    if (existingIdx > -1) {
      inquiryList.splice(existingIdx, 1);
      showToast(`Removed "${product.name}" from inquiry list.`);
    } else {
      inquiryList.push(product);
      showToast(`Added "${product.name}" to WhatsApp inquiry list! ✨`);
    }

    // Save to LocalStorage
    try {
      localStorage.setItem('ceramic_bliss_inquiry', JSON.stringify(inquiryList));
    } catch (e) {
      console.error('Storage write error', e);
    }

    updateDrawerUI();
    renderCatalog();
  }

  // Update Drawer UI
  function updateDrawerUI() {
    const count = inquiryList.length;
    
    // Update Badge Counters
    drawerCountBadges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
      b.style.transform = 'scale(1.3)';
      setTimeout(() => { b.style.transform = 'scale(1)'; }, 200);
    });

    if (floatingInquiryCount) {
      floatingInquiryCount.textContent = count;
    }

    if (count === 0) {
      drawerItemsContainer.innerHTML = `
        <div class="drawer-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          <h4>Your inquiry list is empty</h4>
          <p style="font-size: 0.85rem;">Browse products and click "+ Inquire" on any items you like to send a single WhatsApp inquiry message!</p>
        </div>
      `;
      drawerTotalVal.textContent = '₹0';
      sendWhatsAppOrderBtn.style.opacity = '0.5';
      sendWhatsAppOrderBtn.style.pointerEvents = 'none';
      return;
    }

    sendWhatsAppOrderBtn.style.opacity = '1';
    sendWhatsAppOrderBtn.style.pointerEvents = 'auto';

    let total = 0;
    drawerItemsContainer.innerHTML = inquiryList.map(item => {
      const price = item.sellingPrice || 0;
      total += price;
      return `
        <div class="inquiry-item">
          <img src="${item.image}" alt="${escapeHtml(item.name)}" class="inquiry-item-img">
          <div class="inquiry-item-details">
            <h4 class="inquiry-item-title">${escapeHtml(item.name)}</h4>
            <div class="inquiry-item-price">₹${price || 'Inquire'}</div>
          </div>
          <button type="button" class="inquiry-item-remove" data-product-id="${item.id}" aria-label="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      `;
    }).join('');

    drawerTotalVal.textContent = `₹${total}`;

    // Attach Remove Button Listeners
    drawerItemsContainer.querySelectorAll('.inquiry-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.productId);
        toggleInquiryItem(id);
      });
    });

    // Format Consolidated WhatsApp Inquiry Message
    let msg = `Hello Ceramic Bliss! 🏺✨\nI would like to inquire / place an order for the following items:\n\n`;
    inquiryList.forEach((it, i) => {
      msg += `${i + 1}. *${it.name}* - ₹${it.sellingPrice || 'N/A'}\n`;
    });
    msg += `\n📦 *Total Items:* ${count}\n💰 *Estimated Total:* ₹${total}\n\nPlease let me know availability and delivery details. Thank you!`;
    
    sendWhatsAppOrderBtn.href = `https://wa.me/${window.CERAMIC_CONFIG.phoneClean}?text=${encodeURIComponent(msg)}`;
  }

  // Drawer Toggle Handlers
  openDrawerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      inquiryDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeDrawer = () => {
    inquiryDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  // Toast Helper
  let toastTimer = null;
  function showToast(text) {
    if (!toastNotice || !toastMessage) return;
    toastMessage.textContent = text;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      // Close other items
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      item.classList.toggle('active', !isActive);
    });
  });

  // Global Reset Filters helper
  window.resetCatalogFilters = () => {
    currentCategory = 'All';
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.classList.remove('visible');
    categoryTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.category === 'All');
    });
    renderCatalog();
  };

  // Safe HTML Escaper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Interactive Pottery Canvas Wheel Animation
  initPotteryCanvas();

  // Brandyfy-Style UI/UX Effects & Animations
  initBrandyfyScrollAnimations();
  initNumberCounters();
  initCardTiltEffects();

  // Interactive Craftsmanship Stepper
  document.querySelectorAll('.craft-step-item').forEach(step => {
    step.addEventListener('click', () => {
      document.querySelectorAll('.craft-step-item').forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });

  // Initial Catalog Render
  renderCatalog();
});

// Brandyfy-Style Scroll-Driven Reveal Animations
function initBrandyfyScrollAnimations() {
  const revealElements = document.querySelectorAll(
    '.features-banner, .video-showcase-section, .catalog-section, .custom-orders-section, .instagram-section, .faq-section'
  );
  revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in-view'));
  }
}

// Brandyfy-Style Interactive Number Counters
function initNumberCounters() {
  const statsContainer = document.getElementById('hero-trust-stats');
  if (!statsContainer) return;

  let hasAnimated = false;
  const counters = statsContainer.querySelectorAll('.trust-number[data-target]');

  function runCounters() {
    if (hasAnimated) return;
    hasAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const suffix = counter.dataset.suffix || '';
      const duration = 1600;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        counter.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateCount);
    });
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runCounters();
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(statsContainer);
  } else {
    runCounters();
  }
}

// Brandyfy-Style Card 3D Interactive Tilt on Desktop
function initCardTiltEffects() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(800px) translateY(-8px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.product-card');
    if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
      card.style.transform = '';
    }
  });
}

// Interactive Pottery Wheel Canvas Simulation
function initPotteryCanvas() {
  const canvas = document.getElementById('pottery-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width, height;
  let rotation = 0;
  let speed = 0.02;
  let isHovered = false;

  function resize() {
    width = canvas.parentElement.clientWidth || 500;
    height = canvas.parentElement.clientHeight || 340;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  canvas.addEventListener('mouseenter', () => { isHovered = true; });
  canvas.addEventListener('mouseleave', () => { isHovered = false; });
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    speed = 0.01 + (x / rect.width) * 0.04;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Warm artisanal background
    const bgGrad = ctx.createRadialGradient(width/2, height/2, 20, width/2, height/2, width/2);
    bgGrad.addColorStop(0, '#533C33');
    bgGrad.addColorStop(1, '#251B17');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Pottery Wheel Plate
    const centerX = width / 2;
    const centerY = height / 2 + 30;

    // Wheel Head
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Rotating Ceramic Vessel Outline
    rotation += speed;
    
    // Base turntable
    ctx.beginPath();
    ctx.ellipse(0, 70, 140, 24, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1D1512';
    ctx.fill();
    ctx.strokeStyle = '#8E674F';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Subtle Glaze Wave rings
    for (let r = 1; r <= 5; r++) {
      ctx.beginPath();
      ctx.ellipse(0, 70, 140 - r * 22, 24 - r * 3, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(194, 99, 68, ${0.15 + r * 0.06})`;
      ctx.stroke();
    }

    // Clay Vessel Body with Handcrafted Waves
    ctx.beginPath();
    const vaseHeight = 130;
    ctx.moveTo(-45, 60);

    // Left profile
    ctx.bezierCurveTo(-90, 20, -75, -50, -35, -70);
    // Rim
    ctx.bezierCurveTo(-15, -78, 15, -78, 35, -70);
    // Right profile
    ctx.bezierCurveTo(75, -50, 90, 20, 45, 60);
    ctx.closePath();

    const clayGrad = ctx.createLinearGradient(-80, 0, 80, 0);
    clayGrad.addColorStop(0, '#985139');
    clayGrad.addColorStop(0.35, '#C26344');
    clayGrad.addColorStop(0.7, '#D47D60');
    clayGrad.addColorStop(1, '#7C3B26');

    ctx.fillStyle = clayGrad;
    ctx.fill();
    ctx.strokeStyle = '#5E2C1D';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wet Pottery Glaze Highlight Swirl
    ctx.beginPath();
    const swirlOffset = Math.sin(rotation) * 15;
    ctx.ellipse(swirlOffset, -15, 45, 75, rotation * 0.3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 235, 220, 0.28)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Wheel Spinning Particle Sparkles
    for (let i = 0; i < 6; i++) {
      const angle = rotation * 2 + (i * Math.PI / 3);
      const px = Math.cos(angle) * (65 + i * 5);
      const py = Math.sin(angle) * (18 + i * 2) + 60;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 220, 190, 0.7)';
      ctx.fill();
    }

    ctx.restore();

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}
