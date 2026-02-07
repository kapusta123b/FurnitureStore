document.addEventListener('DOMContentLoaded', function() {
    const deliveryMap = document.getElementById('deliveryMap');
    const deliveryAddressInput = document.getElementById('id_delivery_address');
    const zipCodeInput = document.getElementById('id_zip_code');
    const deliveryAddressField = document.getElementById('deliveryAddressField');
    const addressSearchInput = document.getElementById('addressSearchInput');
    const searchAddressBtn = document.getElementById('searchAddressBtn');
    const mapHint = document.querySelector('.map-hint');
    const requiresDeliveryRadios = document.querySelectorAll('input[name="requires_delivery"]');
    
    if (!deliveryMap || !deliveryAddressField) return;

    let map = null;
    let selectedMarker = null;
    const defaultCenter = [39.8283, -95.5795];

    function initMap() {
        if (map) return;

        setTimeout(() => {
            map = L.map('deliveryMap').setView(defaultCenter, 4);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            map.on('click', handleMapClick);
        }, 50);
    }

    function handleMapClick(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        addMarker(lat, lng);
        reverseGeocode(lat, lng);
    }

    function addMarker(lat, lng) {
        if (selectedMarker) {
            map.removeLayer(selectedMarker);
        }

        selectedMarker = L.marker([lat, lng], {
            draggable: true
        }).addTo(map);

        selectedMarker.on('dragend', function() {
            const newLat = selectedMarker.getLatLng().lat;
            const newLng = selectedMarker.getLatLng().lng;
            reverseGeocode(newLat, newLng);
        });

        map.flyTo([lat, lng], 15);
        showSuccess();
    }

    function reverseGeocode(lat, lng) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const address = data.address || {};
                const street = address.road || '';
                const city = address.city || address.town || address.village || '';
                const state = address.state || '';
                const country = address.country || '';
                const postalCode = address.postcode || '';

                const fullAddress = [street, city, state, country].filter(Boolean).join(', ');

                if (fullAddress) {
                    deliveryAddressInput.value = fullAddress;
                } else {
                    const fallbackAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                    deliveryAddressInput.value = fallbackAddress;
                }

                if (postalCode && zipCodeInput) {
                    zipCodeInput.value = postalCode;
                }
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                const fallbackAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                deliveryAddressInput.value = fallbackAddress;
            });
    }

    function geocodeAddress(address) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lng = parseFloat(result.lon);
                    addMarker(lat, lng);
                    deliveryAddressInput.value = result.display_name;

                    if (result.address && result.address.postcode && zipCodeInput) {
                        zipCodeInput.value = result.address.postcode;
                    }
                } else {
                    showError();
                }
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                showError();
            });
    }

    function showSuccess() {
        if (mapHint) {
            const lang = localStorage.getItem('language') || 'en';
            const translations = window.translations?.[lang] || window.translations?.en || {};
            mapHint.textContent = translations['address_selected'] || 'Address selected';
            mapHint.style.color = '#4caf50';
        }
    }

    function showError() {
        if (mapHint) {
            const lang = localStorage.getItem('language') || 'en';
            const translations = window.translations?.[lang] || window.translations?.en || {};
            mapHint.textContent = translations['invalid_address'] || 'Invalid address. Please try again';
            mapHint.style.color = '#f44336';
        }
    }

    function toggleMap() {
        const requiresDelivery = document.querySelector('input[name="requires_delivery"]:checked')?.value === '1';

        if (requiresDelivery && !map) {
            initMap();
        } else if (!requiresDelivery && map) {
            map.remove();
            map = null;
            selectedMarker = null;
        }
    }

    requiresDeliveryRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            setTimeout(toggleMap, 50);
        });
    });

    if (deliveryAddressField.style.display !== 'none') {
        initMap();
    }

    searchAddressBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const address = addressSearchInput.value.trim();
        if (address) {
            geocodeAddress(address);
        }
    });

    addressSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchAddressBtn.click();
        }
    });
});
