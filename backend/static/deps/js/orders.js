document.addEventListener('DOMContentLoaded', function() {
  const deliveryRadios = document.querySelectorAll('input[name="requires_delivery"]');
  const deliveryAddressField = document.getElementById('deliveryAddressField');
  const zipCodeField = document.getElementById('zipCodeField');
  const deliveryAddressInput = document.getElementById('id_delivery_address');
  const zipCodeInput = document.getElementById('id_zip_code');
  const houseNumberInput = document.getElementById('id_house_number');

  function toggleDeliveryFields() {
    const requiresDelivery = document.querySelector('input[name="requires_delivery"]:checked')?.value === '1';
    
    if (deliveryAddressField) {
      deliveryAddressField.style.display = requiresDelivery ? 'block' : 'none';
    }
    if (zipCodeField) {
      zipCodeField.style.display = requiresDelivery ? 'grid' : 'none';
    }
    
    if (!requiresDelivery) {
      if (deliveryAddressInput) deliveryAddressInput.value = '';
      if (zipCodeInput) zipCodeInput.value = '';
      if (houseNumberInput) houseNumberInput.value = '';
    }
  }

  if (deliveryRadios.length > 0) {
    deliveryRadios.forEach(radio => {
      radio.addEventListener('change', toggleDeliveryFields);
    });
    toggleDeliveryFields();
  }
});