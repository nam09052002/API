const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import thư viện CORS
const userRoutes = require('./routes/users'); // Các API của người dùng
const catalogRuotes = require('./routes/product-catalog');

const app = express();
const PORT = 3000;

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:4200', // Cho phép Angular frontend truy cập
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'] // Các header được phép
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/product-catalog', catalogRuotes)

// Start server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});