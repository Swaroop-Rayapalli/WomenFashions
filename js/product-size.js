function getSelectedSize(button) {
    const productCard = button.closest('.product-card');
    if (!productCard) return null;

    const selectedSizeElement = productCard.querySelector('.size-option.selected');
    return selectedSizeElement ? selectedSizeElement.textContent.trim() : null;
}

function addProductToCart(button, productData) {
    const selectedSize = getSelectedSize(button);

    if (!selectedSize) {
        showNotification('Please select a size first!', 'error');
        return;
    }

    productData.size = selectedSize;

    addToCart(productData);
}

document.addEventListener('DOMContentLoaded', function () {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const sizeOptions = card.querySelectorAll('.size-option');

        sizeOptions.forEach(option => {
            option.addEventListener('click', function () {
                sizeOptions.forEach(opt => opt.classList.remove('selected'));

                this.classList.add('selected');
            });
        });
    });
});
