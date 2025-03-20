document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders-container');

    fetch('/orders')
        .then(response => response.json())
        .then(orders => {
            orders.forEach(order => {
                const orderElement = document.createElement('div');
                orderElement.classList.add('order');
                orderElement.innerHTML = `
                    <h2>Order for ${order.name}</h2>
                    <p>Address: ${order.address}</p>
                    <p>Phone: ${order.phone}</p>
                    <p>Email: ${order.email}</p>
                    <p>Total: ₹${order.total}</p>
                    <div class="order-items">
                        ${order.cartItems.map(item => `
                            <div class="order-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div>${item.name} - ₹${item.price}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
                ordersContainer.appendChild(orderElement);
            });
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });
});
