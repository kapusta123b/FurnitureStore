document.addEventListener('DOMContentLoaded', function() {
    const locations = [];
    const cards = document.querySelectorAll('.location-card');
    const markers = {};
    let currentFilter = null;
    
    cards.forEach((card, index) => {
        const lat = parseFloat(card.getAttribute('data-lat'));
        const lng = parseFloat(card.getAttribute('data-lng'));
        const title = card.querySelector('h3').textContent;
        const address = card.querySelector('.address').textContent;
        const locationType = card.getAttribute('data-location-type');
        
        locations.push({
            id: index,
            lat: lat,
            lng: lng,
            title: title,
            address: address,
            element: card,
            locationType: locationType
        });
    });
    
    const showAllBtn = document.getElementById('show-all-btn');
    const titleH1 = document.getElementById('addresses-title-h1');
    let map = null;
    
    function toggleShowAllBtn() {
        if (showAllBtn) {
            if (currentFilter === null) {
                showAllBtn.style.display = 'none';
            } else {
                showAllBtn.style.display = 'block';
            }
        }
    }
    
    function updateTitle() {
        if (titleH1) {
            let titleKey = 'addresses_title_all';
            if (currentFilter === 'showroom') {
                titleKey = 'addresses_title_showrooms';
            } else if (currentFilter === 'warehouse') {
                titleKey = 'addresses_title_warehouses';
            }
            
            const translations = window.translations;
            const lang = localStorage.getItem('language') || 'en';
            if (translations && translations[lang] && translations[lang][titleKey]) {
                titleH1.textContent = translations[lang][titleKey];
            }
        }
    }
    
    function updateMapMarkers() {
        if (!map) return;
        
        Object.values(markers).forEach(markerObj => {
            if (markerObj.marker) {
                map.removeLayer(markerObj.marker);
            }
        });
        
        Object.keys(markers).forEach(key => delete markers[key]);
        
        locations.forEach((location) => {
            if (currentFilter === null || location.locationType === currentFilter) {
                const markerHtml = `<div class="location-marker">${location.id + 1}</div>`;
                const customIcon = L.divIcon({
                    html: markerHtml,
                    className: 'custom-marker',
                    iconSize: [40, 40],
                    iconAnchor: [20, 20],
                    popupAnchor: [0, -20]
                });
                
                const marker = L.marker([location.lat, location.lng], {
                    icon: customIcon
                }).bindPopup(`
                    <strong>${location.title}</strong><br>
                    ${location.address}
                `).addTo(map);
                
                markers[location.id] = {
                    marker: marker,
                    element: customIcon.options.iconAnchor
                };
                
                marker.on('click', function() {
                    selectLocation(location.id);
                });
            }
        });
    }
    
    function filterLocations(type) {
        currentFilter = type;
        cards.forEach(card => {
            if (type === null) {
                card.style.display = 'block';
            } else {
                card.style.display = card.getAttribute('data-location-type') === type ? 'block' : 'none';
            }
        });
        toggleShowAllBtn();
        updateTitle();
        updateMapMarkers();
    }
    
    if (showAllBtn) {
        showAllBtn.addEventListener('click', function() {
            filterLocations(null);
            window.location.hash = '';
        });
    }
    
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash === 'warehouses') {
            filterLocations('warehouse');
        } else if (hash === 'showrooms') {
            filterLocations('showroom');
        } else {
            filterLocations(null);
        }
    }
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    map = L.map('map').setView([39.8283, -95.5795], 4);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    updateTitle();
    updateMapMarkers();
    
    function selectLocation(id) {
        cards.forEach((card, index) => {
            card.classList.remove('active');
        });
        
        locations[id].element.classList.add('active');
        locations[id].element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        const location = locations[id];
        map.flyTo([location.lat, location.lng], 12, {
            duration: 1.5
        });
        
        updateMarkers(id);
    }
    
    function updateMarkers(activeId) {
        const markerElements = document.querySelectorAll('.location-marker');
        markerElements.forEach((marker, index) => {
            if (index === activeId) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    }
    
    cards.forEach((card, index) => {
        card.addEventListener('click', function() {
            selectLocation(index);
        });
    });
    
    const visibleCard = cards[0];
    if (visibleCard && visibleCard.style.display !== 'none') {
        selectLocation(0);
    }
});
