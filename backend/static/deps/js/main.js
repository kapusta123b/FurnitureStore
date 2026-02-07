const element1 = document.getElementById('dropdownbutton'); 
const element2 = document.getElementById('dropdowncontent'); 

function updateWidth() {
  const width1 = element1.offsetWidth;
  element2.style.width = width1 + 'px';
}

updateWidth();

window.addEventListener('resize', updateWidth);

function dropDownFunction() {
  updateWidth();
  element2.classList.toggle("show");
}

function toggleMobileMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.classList.toggle("active");
}

window.onclick = function(event) {
  if (!event.target.matches('.drop-down-button-search')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (burger && mobileMenu && mobileMenu.classList.contains('active')) {
    if (!burger.contains(event.target) && !mobileMenu.contains(event.target)) {
      mobileMenu.classList.remove('active');
    }
  }
};

const banner = document.querySelector('.discount-banner');
const nav = document.querySelector('nav');
const navPlaceholder = document.getElementById('navPlaceholder');

function updateNavSticky() {
  const navTop = nav ? nav.offsetTop : 0;
  const scrollPosition = window.scrollY;
  
  if (scrollPosition >= navTop) {
    nav.classList.add('nav-sticky');
    if (navPlaceholder && nav) {
      navPlaceholder.style.height = nav.offsetHeight + 'px';
    }
  } else {
    nav.classList.remove('nav-sticky');
    if (navPlaceholder) {
      navPlaceholder.style.height = '0';
    }
  }
}

window.addEventListener('scroll', updateNavSticky);
document.addEventListener('DOMContentLoaded', updateNavSticky);
window.addEventListener('load', updateNavSticky);
window.addEventListener('resize', updateNavSticky);

function scrollToNavAnchor() {
  const navAnchor = document.getElementById('navAnchor');
  const nav = document.querySelector('nav');
  
  if (navAnchor && nav) {
    const navStyles = window.getComputedStyle(nav);
    const navPaddingTop = parseFloat(navStyles.paddingTop);
    const scrollTarget = navAnchor.offsetTop + navPaddingTop;
    
    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });

    if (window.location.pathname.includes('about-us')) {
      setTimeout(() => {
        const aboutContent = document.querySelector('.about-content');
        if (aboutContent) {
          const navHeight = nav.offsetHeight;
          const targetPos = aboutContent.offsetTop - navHeight;
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }
}

window.addEventListener('load', scrollToNavAnchor);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scrollToNavAnchor);
} else {
  setTimeout(scrollToNavAnchor, 100);
}

document.addEventListener('DOMContentLoaded', function() {
  const categoryForm = document.getElementById('categoryForm');
  if (categoryForm) {
    const categoryRadios = categoryForm.querySelectorAll('input[name="category"]');
    categoryRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        const selectedCategory = this.value;
        const searchQuery = new URLSearchParams(window.location.search).get('q');
        let url = `/catalog/${selectedCategory}/`;
        if (searchQuery) {
          url += `?q=${encodeURIComponent(searchQuery)}`;
        }
        window.location.href = url;
      });
    });
  }

  const categoryButtons = document.querySelectorAll('.category-btn');
  const selectedCategoryInput = document.getElementById('selectedCategory');
  const selectedCategoryName = document.getElementById('selectedCategoryName');

  console.log('Category buttons found:', categoryButtons.length);
  console.log('Selected input:', selectedCategoryInput);
  console.log('Selected name span:', selectedCategoryName);

  categoryButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const categorySlug = this.getAttribute('data-category-slug');
      const categoryNameSpan = this.querySelector('span');
      const categoryName = categoryNameSpan ? categoryNameSpan.textContent.trim() : this.textContent.trim();

      console.log('Clicked category:', categorySlug, categoryName);

      selectedCategoryInput.value = categorySlug;
      selectedCategoryName.textContent = categoryName;

      document.getElementById('dropdowncontent').classList.remove('show');
    });
  });

  const dropdownButton = document.getElementById('dropdownbutton');
  if (dropdownButton) {
    dropdownButton.addEventListener('click', function(e) {
      e.stopPropagation();
      dropDownFunction();
    });
  }

  const burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  document.querySelectorAll('.product-image').forEach(imageContainer => {
    const images = imageContainer.querySelectorAll('.product-img');
    let currentImageIndex = 0;

    if (images.length > 1) {
      const imageLink = imageContainer.closest('.product-image-link');
      if (imageLink) {
        imageLink.style.cursor = 'pointer';
      }
      
      imageContainer.addEventListener('mouseenter', function() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images.forEach((img, index) => {
          img.style.opacity = index === currentImageIndex ? '1' : '0';
        });
      });

      imageContainer.addEventListener('mouseleave', function() {
        currentImageIndex = 0;
        images.forEach((img, index) => {
          img.style.opacity = index === 0 ? '1' : '0';
        });
      });
    }
  });

  const newsletterForms = document.querySelectorAll('.newsletter-footer-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function() {
      if (this.getAttribute('data-authenticated') === 'true') {
        sessionStorage.setItem('scrollToFooter', 'true');
      }
    });
  });

  if (sessionStorage.getItem('scrollToFooter')) {
    sessionStorage.removeItem('scrollToFooter');
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  }

  function displayMessage(messageText, tags = 'success') {
    const container = document.querySelector('.notifications-container');
    if (!container) return;

    const notificationClass = `notification notification-${tags}`;
    const iconSvg = tags === 'success' 
      ? '<polyline points="20 6 9 17 4 12"></polyline>'
      : tags === 'error'
      ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
      : '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>';

    let dataAttr = '';
    if (messageText.startsWith('msg_')) {
      dataAttr = ` data-translate-message="${messageText}"`;
    }

    const notificationHTML = `
      <div id="notification" class="${notificationClass} show">
        <div class="notification-content"${messageText.startsWith('msg_') ? ` data-message-key="${messageText}"` : ''}>
          <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${iconSvg}
          </svg>
          <span class="notification-text"${dataAttr}>${messageText}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = notificationHTML;
    const notification = tempDiv.firstElementChild;
    container.appendChild(notification);

    const closeButton = notification.querySelector('.notification-close');
    const autoHideDelay = 5000;

    function removeNotification() {
      notification.classList.remove('show');
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 300);
    }

    if (closeButton) {
      closeButton.addEventListener('click', removeNotification);
    }
    
    setTimeout(removeNotification, autoHideDelay);
  }

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();

      const isAuthenticated = this.getAttribute('data-authenticated') === 'true';
      
      if (!isAuthenticated) {
        window.location.href = '/users/login/?next=' + encodeURIComponent(window.location.pathname);
        return;
      }

      const productId = this.getAttribute('data-product-id');
      const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
      
      const formData = new FormData();
      formData.append('product_id', productId);
      if (csrfToken) formData.append('csrfmiddlewaretoken', csrfToken);

      const button = this;
      button.disabled = true;

      fetch('/cart/cart_add/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': csrfToken,
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.messages && data.messages.length > 0) {
          data.messages.forEach(msg => {
            let messageText = msg.text;
            if (messageText.startsWith('msg_')) {
              const currentLang = localStorage.getItem('language') || 'en';
              const translations = window.translations?.[currentLang] || window.translations?.en || {};
              messageText = translations[msg.text] || msg.text;
            }
            displayMessage(messageText, msg.tags || 'success');
          });
        }
        button.disabled = false;
      })
      .catch(error => {
        console.error('Error:', error);
        displayMessage('Error adding product to cart', 'error');
        button.disabled = false;
      });
    });
  });

  document.querySelectorAll('.notification').forEach(notification => {
    const closeButton = notification.querySelector('.notification-close');
    const autoHideDelay = 5000;

    function removeNotification() {
      notification.classList.remove('show');
      notification.classList.add('hide');
      
      setTimeout(() => {
        notification.remove();
      }, 300);
    }

    if (closeButton) {
      closeButton.addEventListener('click', removeNotification);
    }

    if (notification.classList.contains('show')) {
      setTimeout(removeNotification, autoHideDelay);
    }
  });

  document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', function () {
      const toggle = this.getAttribute('data-toggle');
      const body = document.getElementById(toggle);

      document.querySelectorAll('.accordion-body').forEach(el => {
        if (el.id !== toggle) el.classList.remove('active');
      });

      body.classList.toggle('active');
    });
  });

  const imageInputElement = document.getElementById('id_image');
  if (imageInputElement) {
    imageInputElement.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const avatar = document.querySelector('.profile-avatar');
          if (avatar) {
            avatar.src = event.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const deliveryAddressInput = document.getElementById('id_delivery_address');
  const charCountDisplay = document.getElementById('charCount');
  if (deliveryAddressInput && charCountDisplay) {
    deliveryAddressInput.addEventListener('input', function() {
      charCountDisplay.textContent = this.value.length;
    });
    charCountDisplay.textContent = deliveryAddressInput.value.length;
  }

  function attachDeliveryAddressListeners() {
    const deliveryRadios = document.querySelectorAll('input[name="requires_delivery"]');
    if (deliveryRadios.length === 0) return;

    function toggleDeliveryAddress() {
      const requiresDelivery = document.querySelector('input[name="requires_delivery"]:checked');
      if (!requiresDelivery) return;

      const deliveryAddressField = document.getElementById('deliveryAddressField');
      const zipCodeField = document.getElementById('zipCodeField');
      const deliveryAddressInput = document.getElementById('id_delivery_address');
      const zipCodeInput = document.getElementById('id_zip_code');
      const houseNumberInput = document.getElementById('id_house_number');

      if (requiresDelivery.value === '1') {
        if (deliveryAddressField) deliveryAddressField.style.display = 'block';
        if (zipCodeField) zipCodeField.style.display = 'grid';
        if (deliveryAddressInput) deliveryAddressInput.required = true;
        if (zipCodeInput) zipCodeInput.required = true;
        if (houseNumberInput) houseNumberInput.required = true;
      } else {
        if (deliveryAddressField) deliveryAddressField.style.display = 'none';
        if (zipCodeField) zipCodeField.style.display = 'none';
        if (deliveryAddressInput) deliveryAddressInput.required = false;
        if (zipCodeInput) zipCodeInput.required = false;
        if (houseNumberInput) houseNumberInput.required = false;
      }
    }

    window.toggleDeliveryAddress = toggleDeliveryAddress;

    deliveryRadios.forEach(radio => {
      radio.addEventListener('change', toggleDeliveryAddress);
    });

    toggleDeliveryAddress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachDeliveryAddressListeners);
  } else {
    attachDeliveryAddressListeners();
  }

  function updateQuantityButtonState() {
    document.querySelectorAll('.quantity-control').forEach(control => {
      const quantityInput = control.querySelector('.quantity-input');
      const decrementBtn = control.querySelector('.quantity-btn.decrement');
      const quantity = parseInt(quantityInput.value) || 1;
      
      if (decrementBtn) {
        if (quantity === 1) {
          decrementBtn.disabled = true;
          decrementBtn.style.opacity = '0.5';
          decrementBtn.style.cursor = 'not-allowed';
        } else {
          decrementBtn.disabled = false;
          decrementBtn.style.opacity = '1';
          decrementBtn.style.cursor = 'pointer';
        }
      }
    });
  }

  function attachCartEventListeners() {
    updateQuantityButtonState();
    
    document.querySelectorAll('.quantity-btn.increment, .quantity-btn.decrement').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const cartId = this.getAttribute('data-cart-id');
        const changeUrl = this.getAttribute('data-cart-change-url');
        const quantityInput = this.closest('.quantity-control').querySelector('.quantity-input');
        let quantity = parseInt(quantityInput.value) || 1;
        
        if (this.classList.contains('increment')) {
          quantity += 1;
        } else if (this.classList.contains('decrement') && quantity > 1) {
          quantity -= 1;
        }
        
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
        const formData = new FormData();
        formData.append('cart_id', cartId);
        formData.append('quantity', quantity);
        formData.append('csrfmiddlewaretoken', csrfToken);
        
        fetch(changeUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRFToken': csrfToken,
          }
        })
        .then(response => response.json())
        .then(data => {
          const cartContainer = document.getElementById('cart-items-container');
          if (cartContainer) {
            cartContainer.innerHTML = data.cart_items_html;
            attachCartEventListeners();
          }
          
          if (data.messages && data.messages.length > 0) {
            data.messages.forEach(msg => {
              let messageText = msg.text;
              if (messageText.startsWith('msg_')) {
                const currentLang = localStorage.getItem('language') || 'en';
                const translations = window.translations?.[currentLang] || window.translations?.en || {};
                messageText = translations[msg.text] || msg.text;
              }
              displayMessage(messageText, msg.tags || 'success');
            });
            if (typeof translateMessages === 'function') {
              setTimeout(() => translateMessages(localStorage.getItem('language') || 'en'), 50);
            }
          }
        })
        .catch(error => {
          console.error('Error:', error);
          displayMessage('Error updating cart', 'error');
        });
      });
    });

    document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const cartId = this.getAttribute('data-cart-id');
        const removeUrl = this.closest('form').getAttribute('action');
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
        
        const formData = new FormData();
        formData.append('cart_id', cartId);
        formData.append('csrfmiddlewaretoken', csrfToken);
        
        fetch(removeUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRFToken': csrfToken,
          }
        })
        .then(response => response.json())
        .then(data => {
          const cartContainer = document.getElementById('cart-items-container');
          if (cartContainer && data.cart_items_html) {
            cartContainer.innerHTML = data.cart_items_html;
            attachCartEventListeners();
          }
          
          if (data.messages && data.messages.length > 0) {
            data.messages.forEach(msg => {
              let messageText = msg.text;
              if (messageText.startsWith('msg_')) {
                const currentLang = localStorage.getItem('language') || 'en';
                const translations = window.translations?.[currentLang] || window.translations?.en || {};
                messageText = translations[msg.text] || msg.text;
              }
              displayMessage(messageText, msg.tags || 'success');
            });
            if (typeof translateMessages === 'function') {
              setTimeout(() => translateMessages(localStorage.getItem('language') || 'en'), 50);
            }
          } else if (data.message) {
            displayMessage(data.message, 'success');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          displayMessage('Error removing item from cart', 'error');
        });
      });
    });
  }

  attachCartEventListeners();

  const reviewCarousel = document.querySelector('.reviews-carousel');
  if (reviewCarousel) {
    const reviewItems = document.querySelectorAll('.reviews-item');
    const reviewDots = document.querySelectorAll('.review-dot');
    const reviewPrevBtn = document.querySelector('.review-nav-prev');
    const reviewNextBtn = document.querySelector('.review-nav-next');
    const translateLinks = document.querySelectorAll('.review-translate-link');
    
    let currentReviewIndex = 0;
    const translatedStates = [false, false, false];

    function showReview(index) {
      reviewItems.forEach((item, i) => {
        if (i === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      reviewDots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      currentReviewIndex = index;
    }

    if (reviewItems.length > 0) {
      showReview(0);
    }

    reviewPrevBtn.addEventListener('click', () => {
      const newIndex = (currentReviewIndex - 1 + reviewItems.length) % reviewItems.length;
      showReview(newIndex);
      translatedStates[newIndex] = false;
      updateTranslateLink(newIndex);
    });

    reviewNextBtn.addEventListener('click', () => {
      const newIndex = (currentReviewIndex + 1) % reviewItems.length;
      showReview(newIndex);
      translatedStates[newIndex] = false;
      updateTranslateLink(newIndex);
    });

    reviewDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        showReview(index);
        translatedStates[index] = false;
        updateTranslateLink(index);
      });
    });

    function updateTranslateLink(index) {
      const link = translateLinks[index];
      if (link) {
        const lang = document.documentElement.lang || 'en';
        const translations = window.translations;
        const isTranslated = translatedStates[index];
        
        if (translations && translations[lang]) {
          const key = isTranslated ? 'review_show_original' : 'review_translate';
          link.textContent = translations[lang][key] || (isTranslated ? 'Show Original' : 'Translate');
        } else {
          link.textContent = isTranslated ? 'Show Original' : 'Translate';
        }
      }
    }

    window.updateReviewTranslateText = function() {
      translateLinks.forEach((_, index) => {
        updateTranslateLink(index);
      });
    };

    translateLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const textBody = reviewItems[index].querySelector('.reviews-text-body');
        if (!textBody) return;

        const isEnglish = document.documentElement.lang === 'en' || !document.documentElement.lang;
        
        if (translatedStates[index]) {
          textBody.textContent = textBody.getAttribute('data-text-en');
          link.textContent = 'Translate';
          translatedStates[index] = false;
        } else {
          textBody.textContent = textBody.getAttribute('data-text-ru');
          link.textContent = 'Show Original';
          translatedStates[index] = true;
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const imageInput = document.getElementById('id_image');
  const avatarPreview = document.getElementById('avatarPreview');
  const avatarPlaceholder = document.getElementById('avatarPlaceholder');
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          alert('Image size must not exceed 5MB');
          imageInput.value = '';
          return;
        }

        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file');
          imageInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
          if (avatarPlaceholder) {
            avatarPlaceholder.style.display = 'none';
          }
          if (avatarPreview) {
            avatarPreview.src = event.target.result;
            avatarPreview.style.display = 'block';
          } else {
            const wrapper = document.querySelector('.avatar-wrapper');
            const img = document.createElement('img');
            img.id = 'avatarPreview';
            img.src = event.target.result;
            img.alt = 'Profile Photo';
            img.className = 'profile-avatar';
            wrapper.appendChild(img);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const collageGroups = document.querySelectorAll('.photocollage-group');
  const collageDots = document.querySelectorAll('.pagination-dot');
  const collageFills = document.querySelectorAll('.pagination-fill');
  let currentGroup = 0;
  let collageInterval = null;
  const intervalTime = 3000;
  let isManual = false;

  if (collageGroups.length === 0) return;

  function showGroup(index) {
    collageGroups.forEach(g => g.classList.remove('active'));
    collageDots.forEach(d => d.classList.remove('active'));
    collageFills.forEach(f => {
      f.style.transition = 'none';
      f.style.width = '0%';
    });

    collageGroups[index].classList.add('active');
    collageDots[index].classList.add('active');
    currentGroup = index;
  }

  function startCollageTimer() {
    if (collageInterval) clearInterval(collageInterval);
    if (isManual) return;

    let startTime = Date.now();
    collageInterval = setInterval(() => {
      let elapsed = Date.now() - startTime;
      let progress = (elapsed / intervalTime) * 100;

      if (progress >= 100) {
        progress = 100;
        let next = (currentGroup + 1) % collageGroups.length;
        showGroup(next);
        startTime = Date.now();
      }

      if (currentGroup < collageFills.length) {
        collageFills[currentGroup].style.width = progress + '%';
      }
    }, 50);
  }

  collageDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      isManual = true;
      if (collageInterval) clearInterval(collageInterval);
      showGroup(index);
    });
  });

  showGroup(0);
  startCollageTimer();
});

document.addEventListener('DOMContentLoaded', function() {
  const backToFiltersBtn = document.getElementById('backToFilters');
  const sidebar = document.getElementById('catalogSidebar');

  if (backToFiltersBtn && sidebar) {
    backToFiltersBtn.addEventListener('click', function() {
      const nav = document.querySelector('nav');
      const navHeight = nav ? nav.offsetHeight : 0;
      const targetPos = sidebar.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', function() {
      const sidebarTop = sidebar.getBoundingClientRect().top;
      if (sidebarTop < -50) {
        backToFiltersBtn.classList.add('visible');
      } else {
        backToFiltersBtn.classList.remove('visible');
      }
    });
  }
});
