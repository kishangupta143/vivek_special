document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');
    const userInfoModal = document.getElementById('user-info-modal');
    const closeButton = document.getElementById('close-button');
    const userForm = document.getElementById('user-form');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let total = 0;

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        total = 0;
        cartItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="product-details">
                    <h2>${item.name}</h2>
                    <p>Price: ₹${item.price}</p>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price;
        });
        cartTotal.textContent = `Total: ₹${total}`;
    }

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const index = event.target.getAttribute('data-index');
            cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCart();
        }
    });

    checkoutButton.addEventListener('click', () => {
        userInfoModal.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        userInfoModal.style.display = 'none';
    });

    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const userInfo = {
            name: userForm.name.value,
            address: userForm.address.value,
            phone: userForm.phone.value,
            email: userForm.email.value,
            cartItems: cartItems,
            total: total
        };
        fetch('/save-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            alert(`Order placed successfully!\n\nName: ${userInfo.name}\nAddress: ${userInfo.address}\nPhone: ${userInfo.phone}\nEmail: ${userInfo.email}\nTotal: ₹${userInfo.total}`);
            localStorage.removeItem('cartItems');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    updateCart();
});