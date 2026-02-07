let currentLanguage = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-language', lang);
  
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const translations = window.translations;
    
    if (translations && translations[lang] && translations[lang][key]) {
      let translation = translations[lang][key];
      
      // Handle dynamic order number
      if (key === 'order_number' && element.hasAttribute('data-order-id')) {
        translation = translation.replace('#', '#' + element.getAttribute('data-order-id'));
      }

      if (element.tagName === 'INPUT') {
        if (element.type === 'email' || element.type === 'text' || element.type === 'password' || element.type === 'search') {
          element.placeholder = translation;
        }
      } else {
        element.innerHTML = translation;
      }
    }
  });

  document.querySelectorAll('[data-name-ru]').forEach(element => {
    element.textContent = lang === 'ru' ? element.dataset.nameRu : element.dataset.nameEn;
  });

  document.querySelectorAll('.category-name[data-name-ru]').forEach(element => {
    element.textContent = lang === 'ru' ? element.dataset.nameRu : element.dataset.nameEn;
  });

  document.querySelectorAll('.product-description-text').forEach(element => {
    element.textContent = lang === 'ru' ? element.dataset.descRu : element.dataset.descEn;
  });

  document.querySelectorAll('.product-description[data-desc-ru]').forEach(element => {
    element.textContent = lang === 'ru' ? element.dataset.descRu : element.dataset.descEn;
  });

  document.querySelectorAll('[data-color-ru]').forEach(element => {
    element.textContent = lang === 'ru' ? element.dataset.colorRu : element.dataset.colorEn;
  });

  document.querySelectorAll('[data-details-ru]').forEach(element => {
    const detailsText = element.querySelector('.details-text');
    if (detailsText) {
      detailsText.textContent = lang === 'ru' ? element.dataset.detailsRu : element.dataset.detailsEn;
    }
  });

  document.querySelectorAll('[data-details-title-ru]').forEach(element => {
    const toggleText = element.querySelector('.toggle-text');
    if (toggleText) {
      toggleText.textContent = lang === 'ru' ? element.dataset.detailsTitleRu : element.dataset.detailsTitleEn;
    }
  });

  document.querySelectorAll('.product-title').forEach(element => {
    element.textContent = lang === 'ru' ? element.dataset.nameRu : element.dataset.nameEn;
  });
  
  const languageBtn = document.getElementById('language-switcher-btn');
  if (languageBtn) {
    languageBtn.textContent = lang === 'en' ? 'EN' : 'РУ';
  }
  
  const mobileLangBtn = document.getElementById('language-switcher-btn-mobile');
  if (mobileLangBtn) {
    mobileLangBtn.textContent = lang === 'en' ? 'EN' : 'РУ';
  }
  
  translateMessages(lang);
  
  if (window.updateReviewTranslateText) {
    window.updateReviewTranslateText();
  }
  
  closeLanguageDropdown();
}

function attachLanguageSwitcherListeners() {
  const langBtn = document.getElementById('language-switcher-btn');
  const mobileLangBtn = document.getElementById('language-switcher-btn-mobile');
  
  if (langBtn) {
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleLanguageDropdown();
    });
  }
  
  if (mobileLangBtn) {
    mobileLangBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleLanguageDropdown();
    });
  }
  
  document.querySelectorAll('.lang-select-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const lang = this.getAttribute('data-lang');
      if (lang) {
        setLanguage(lang);
      }
    });
  });
}

function toggleLanguageDropdown() {
  const dropdown = document.getElementById('language-dropdown');
  const mobileDropdown = document.getElementById('language-dropdown-mobile');
  
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  }
  
  if (mobileDropdown) {
    mobileDropdown.style.display = mobileDropdown.style.display === 'none' ? 'block' : 'none';
  }
}

function closeLanguageDropdown() {
  const dropdown = document.getElementById('language-dropdown');
  const mobileDropdown = document.getElementById('language-dropdown-mobile');
  
  if (dropdown) {
    dropdown.style.display = 'none';
  }
  
  if (mobileDropdown) {
    mobileDropdown.style.display = 'none';
  }
}

function setLanguageFromDropdown(lang) {
  setLanguage(lang);
}

document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('language-dropdown');
  const mobileDropdown = document.getElementById('language-dropdown-mobile');
  const btn = document.getElementById('language-switcher-btn');
  const mobileBtnWrapper = document.getElementById('language-switcher-btn-mobile');
  
  const isDesktopButtonClicked = btn && btn.contains(event.target);
  const isMobileButtonClicked = mobileBtnWrapper && mobileBtnWrapper.contains(event.target);
  
  if (!isDesktopButtonClicked && !isMobileButtonClicked) {
    if (dropdown && !dropdown.contains(event.target)) {
      dropdown.style.display = 'none';
    }
    if (mobileDropdown && !mobileDropdown.contains(event.target)) {
      mobileDropdown.style.display = 'none';
    }
  }
});

function translateMessages(lang) {
  const notifications = document.querySelectorAll('.notification-text[data-translate-message]');
  notifications.forEach(notification => {
    const messageKey = notification.getAttribute('data-translate-message');
    if (messageKey && messageKey !== 'default' && window.translations && window.translations[lang] && window.translations[lang][messageKey]) {
      notification.textContent = window.translations[lang][messageKey];
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('/static/deps/js/translations.json')
    .then(response => response.json())
    .then(data => {
      window.translations = data;
      setLanguage(currentLanguage);
      translateMessages(currentLanguage);
      attachLanguageSwitcherListeners();
    })
    .catch(error => console.error('Error loading translations:', error));
});
