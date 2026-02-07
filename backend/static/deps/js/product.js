document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('mainImage');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-nav.prev');
    const modalNext = document.querySelector('.modal-nav.next');
    const imageWrapper = document.getElementById('imageWrapper');
    let currentImageIndex = 0;
    let allImages = [];

    if (galleryItems.length > 0) {
      allImages = Array.from(galleryItems).map(item => ({
        url: item.dataset.imageUrl,
        id: item.dataset.imageId,
        element: item
      }));

      galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
          const newImageUrl = this.dataset.imageUrl;
          const imageId = this.dataset.imageId;

          mainImage.style.opacity = '0';
          
          setTimeout(() => {
            mainImage.src = newImageUrl;
            mainImage.dataset.imageId = imageId;
            mainImage.style.opacity = '1';
          }, 250);

          galleryItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          currentImageIndex = index;
        });
      });

      if (imageWrapper) {
        imageWrapper.addEventListener('click', function(e) {
          if (e.target === mainImage) {
            modalImage.src = mainImage.src;
            currentImageIndex = allImages.findIndex(img => img.url === mainImage.src);
            modal.classList.add('active');
          }
        });
      }
    }

    if (modalClose) {
        modalClose.addEventListener('click', function() {
          modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            modal.classList.remove('active');
          }
        });
    }

    function updateModalImage(index) {
      if (index >= 0 && index < allImages.length) {
        currentImageIndex = index;
        modalImage.src = allImages[index].url;
      }
    }

    if (modalPrev) {
        modalPrev.addEventListener('click', function(e) {
          e.stopPropagation();
          updateModalImage(currentImageIndex - 1);
        });
    }

    if (modalNext) {
        modalNext.addEventListener('click', function(e) {
          e.stopPropagation();
          updateModalImage(currentImageIndex + 1);
        });
    }

    document.addEventListener('keydown', function(e) {
      if (modal && modal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') updateModalImage(currentImageIndex - 1);
        if (e.key === 'ArrowRight') updateModalImage(currentImageIndex + 1);
        if (e.key === 'Escape') modal.classList.remove('active');
      }
    });

    const detailsToggle = document.querySelector('.details-toggle');
    const detailsContent = document.querySelector('.details-content');

    if (detailsToggle && detailsContent) {
      detailsToggle.addEventListener('click', function() {
        detailsToggle.classList.toggle('expanded');
        detailsContent.classList.toggle('expanded');
      });
    }

    const imageSection = document.querySelector('.product-image-section');
    const navBar = document.querySelector('nav');

    if (imageSection && navBar) {
      function updateImageStickyState() {
        const navRect = navBar.getBoundingClientRect();
        const imageSectionRect = imageSection.getBoundingClientRect();
        
        if (navRect.bottom >= imageSectionRect.top) {
          imageSection.classList.add('is-sticky');
        } else {
          imageSection.classList.remove('is-sticky');
        }
      }

      window.addEventListener('scroll', updateImageStickyState);
      window.addEventListener('resize', updateImageStickyState);
      setTimeout(updateImageStickyState, 100);
    }
});