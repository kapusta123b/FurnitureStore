document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.querySelector("#id_phone_number");
    if (phoneInput) {
        const iti = window.intlTelInput(phoneInput, {
            initialCountry: "auto",
            geoIpLookup: callback => {
                fetch("https://ipapi.co/json")
                    .then(res => res.json())
                    .then(data => callback(data.country_code))
                    .catch(() => callback("us"));
            },
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
            separateDialCode: true,
            preferredCountries: ["ua", "us", "gb", "de", "pl"],
        });

        // Update phone number to include full international format before submission
        const form = phoneInput.closest("form");
        if (form) {
            form.addEventListener("submit", function() {
                if (iti.isValidNumber()) {
                    phoneInput.value = iti.getNumber();
                }
            });
        }
    }
});