document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('cancelOrderModal');
    const cancelBtns = document.querySelectorAll('.open-cancel-modal');
    const closeBtns = document.querySelectorAll('.modal-close');
    const confirmBtn = document.getElementById('confirmCancelBtn');
    let orderIdToCancel = null;

    if (cancelBtns.length > 0 && modal) {
        cancelBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                orderIdToCancel = this.getAttribute('data-order-id');
                modal.classList.add('active');
            });
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                modal.classList.remove('active');
                orderIdToCancel = null;
            });
        });

        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                orderIdToCancel = null;
            }
        });

        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                if (orderIdToCancel) {
                    window.location.href = `/orders/cancel-order/${orderIdToCancel}/`;
                }
            });
        }
    }
});