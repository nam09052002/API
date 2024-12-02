const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import module path
const userRoutes = require('./routes/users');
const catalogRoutes = require('./routes/product-catalog');
const productRoutes = require('./routes/management-products');

const app = express();
const PORT = 3000;

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());

// Cấu hình để phục vụ file tĩnh
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/product-catalog', catalogRoutes);
app.use('/api/management-products', productRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});