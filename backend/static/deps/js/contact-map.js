document.addEventListener('DOMContentLoaded', function() {
    const mapElement = document.getElementById('contact-map');
    if (!mapElement) return;

    const mainOfficeLocation = {
        lat: 41.3909,
        lng: -72.7646,
        title: 'Hamden, Connecticut',
        address: '60 Fremont Ave. Hamden, CT 06514',
        phone: '(928) 630-9272',
        hours: 'Mon - Fri: 9AM - 6PM'
    };

    const map = L.map('contact-map').setView([mainOfficeLocation.lat, mainOfficeLocation.lng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    const markerHtml = '<div class="location-marker">1</div>';
    const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });

    const marker = L.marker([mainOfficeLocation.lat, mainOfficeLocation.lng], {
        icon: customIcon
    }).bindPopup(`
        <strong>${mainOfficeLocation.title}</strong><br>
        ${mainOfficeLocation.address}<br>
        <strong>Phone:</strong> ${mainOfficeLocation.phone}<br>
        <strong>Hours:</strong> ${mainOfficeLocation.hours}
    `).addTo(map);

    marker.openPopup();

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';

            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            fetch('/contact/send/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    contactForm.reset();
                    const currentLang = localStorage.getItem('language') || 'en';
                    const successMsg = currentLang === 'ru' ? 'Сообщение успешно отправлено!' : 'Message sent successfully!';
                    displayNotification(successMsg, 'success');
                } else {
                    const currentLang = localStorage.getItem('language') || 'en';
                    const errorMsg = currentLang === 'ru' ? 'Ошибка при отправке сообщения' : 'Error sending message';
                    displayNotification(errorMsg, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                const currentLang = localStorage.getItem('language') || 'en';
                const errorMsg = currentLang === 'ru' ? 'Ошибка при отправке сообщения' : 'Error sending message';
                displayNotification(errorMsg, 'error');
            });
        });
    }

    function displayNotification(messageText, tags = 'success') {
        const container = document.querySelector('.notifications-container');
        if (!container) return;

        const notificationClass = `notification notification-${tags}`;
        const iconSvg = tags === 'success' 
            ? '<polyline points="20 6 9 17 4 12"></polyline>'
            : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';

        const notificationHTML = `
            <div id="notification" class="${notificationClass} show">
                <div class="notification-content">
                    <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${iconSvg}
                    </svg>
                    <span class="notification-text">${messageText}</span>
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
});
