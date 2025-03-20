const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost', // Replace with your MySQL server host
    user: 'root',      // Replace with your MySQL username
    password: '',      // Replace with your MySQL password
    database: 'vivek_store' // Replace with your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Endpoint to save an order
app.post('/save-order', (req, res) => {
    const { name, address, phone, email, cartItems, total } = req.body;

    const orderQuery = 'INSERT INTO orders (name, address, phone, email, total) VALUES (?, ?, ?, ?, ?)';
    db.query(orderQuery, [name, address, phone, email, total], (err, result) => {
        if (err) {
            console.error('Error saving order:', err);
            return res.status(500).send('Error saving order');
        }

        const orderId = result.insertId;
        const orderItemsQuery = 'INSERT INTO order_items (order_id, product_name, product_price, product_image) VALUES ?';
        const orderItems = cartItems.map(item => [orderId, item.name, item.price, item.image]);

        db.query(orderItemsQuery, [orderItems], (err) => {
            if (err) {
                console.error('Error saving order items:', err);
                return res.status(500).send('Error saving order items');
            }
            res.status(200).send('Order saved successfully');
        });
    });
});

// Endpoint to fetch all orders
app.get('/orders', (req, res) => {
    const ordersQuery = `
        SELECT o.id, o.name, o.address, o.phone, o.email, o.total, 
               JSON_ARRAYAGG(JSON_OBJECT('name', oi.product_name, 'price', oi.product_price, 'image', oi.product_image)) AS cartItems
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
    `;

    db.query(ordersQuery, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).send('Error fetching orders');
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
