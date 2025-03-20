document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sideNav = document.getElementById('side-nav');
    const overlay = document.getElementById('overlay');

    hamburgerMenu.addEventListener('click', function() {
        if (sideNav.style.width === '250px') {
            sideNav.style.width = '0';
            overlay.style.width = '0';
            hamburgerMenu.classList.remove('change');
        } else {
            sideNav.style.width = '250px';
            overlay.style.width = '100%';
            hamburgerMenu.classList.add('change');
        }
    });

    overlay.addEventListener('click', function() {
        sideNav.style.width = '0';
        overlay.style.width = '0';
        hamburgerMenu.classList.remove('change');
    });

    document.getElementById('search-bar').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const products = document.querySelectorAll('.product');
        
        products.forEach(function(product) {
            const productName = product.getAttribute('data-name').toLowerCase();
            if (productName.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });

    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartCount.textContent = cartItems.length;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product');
            const productName = productElement.getAttribute('data-name');
            const productPrice = parseFloat(productElement.getAttribute('data-price'));
            const productImage = productElement.querySelector('img').src;
            const product = { name: productName, price: productPrice, image: productImage };

            cartItems.push(product);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            cartCount.textContent = cartItems.length;
        });
    });

    cartIcon.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    const viewDetailsButtons = document.querySelectorAll('.view-details');
    const productDetailsModal = document.getElementById('product-details-modal');
    const closeDetailsButton = document.getElementById('close-details-button');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductDetails = document.getElementById('modal-product-details');
    const reviewsList = document.getElementById('reviews-list');
    const reviewForm = document.getElementById('review-form');

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product');
            const productName = productElement.getAttribute('data-name');
            const productDescription = productElement.getAttribute('data-description');
            const productPrice = productElement.getAttribute('data-price');
            const productDetails = "Additional details about " + productName;

            modalProductName.textContent = productName;
            modalProductDescription.textContent = productDescription;
            modalProductPrice.textContent = `₹${productPrice}`;
            modalProductDetails.textContent = productDetails;

            // Load reviews from localStorage
            const reviews = JSON.parse(localStorage.getItem(productName + '-reviews')) || [];
            reviewsList.innerHTML = '';
            reviews.forEach((review, index) => {
                const reviewItem = document.createElement('li');
                reviewItem.innerHTML = `
                    <span>${review.text}</span>
                    <button class="delete-review" data-index="${index}" data-product="${productName}">Delete</button>
                `;
                reviewsList.appendChild(reviewItem);
            });

            productDetailsModal.style.display = 'flex';
        });
    });

    closeDetailsButton.addEventListener('click', () => {
        productDetailsModal.style.display = 'none';
    });

    productDetailsModal.addEventListener('click', (event) => {
        if (event.target === productDetailsModal) {
            productDetailsModal.style.display = 'none';
        }
    });

    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const reviewText = reviewForm.review.value;
        const productName = modalProductName.textContent;

        // Save review to localStorage
        let reviews = JSON.parse(localStorage.getItem(productName + '-reviews')) || [];
        reviews.push({ text: reviewText });
        localStorage.setItem(productName + '-reviews', JSON.stringify(reviews));

        // Add review to the list
        const reviewItem = document.createElement('li');
        reviewItem.innerHTML = `
            <span>${reviewText}</span>
            <button class="delete-review" data-index="${reviews.length - 1}" data-product="${productName}">Delete</button>
        `;
        reviewsList.appendChild(reviewItem);

        reviewForm.reset();
    });

    reviewsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-review')) {
            const index = event.target.getAttribute('data-index');
            const productName = event.target.getAttribute('data-product');

            // Remove review from localStorage
            let reviews = JSON.parse(localStorage.getItem(productName + '-reviews')) || [];
            reviews.splice(index, 1);
            localStorage.setItem(productName + '-reviews', JSON.stringify(reviews));

            // Remove review from the list
            event.target.parentElement.remove();
        }
    });
});