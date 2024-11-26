const express = require('express');
const router = express.Router();
const db = require('../config/config'); // Kết nối MySQL

// API đăng ký người dùng
router.post('/register', (req, res) => {
    const { ten_dang_nhap, mat_khau, ho_va_ten, email, so_dien_thoai, dia_chi } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ten_dang_nhap || !mat_khau || !ho_va_ten || !email || !so_dien_thoai || !dia_chi) {
        return res.status(400).json({ status: 'error', message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    const checkQuery = 'SELECT * FROM nguoi_dung WHERE email = ? OR ten_dang_nhap = ?';
    db.query(checkQuery, [email, ten_dang_nhap], (err, results) => {
        if (err) {
            console.error('Lỗi kiểm tra trùng lặp:', err);
            return res.status(500).json({ status: 'error', message: 'Lỗi kiểm tra trùng lặp dữ liệu!' });
        }

        if (results.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Email hoặc tên đăng nhập đã tồn tại!' });
        }

        const insertQuery = `
        INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau, ho_va_ten, email, so_dien_thoai, dia_chi, vai_tro, ngay_tao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const defaultRole = 'user';
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

        db.query(
            insertQuery, [ten_dang_nhap, mat_khau, ho_va_ten, email, so_dien_thoai, dia_chi, defaultRole, createdAt],
            (err) => {
                if (err) {
                    console.error('Lỗi khi lưu thông tin người dùng:', err);
                    return res.status(500).json({ status: 'error', message: 'Lỗi khi lưu thông tin người dùng!' });
                }
                return res.status(200).json({ status: 'success', message: 'Đăng ký thành công!' });
            }
        );
    });
});

// API đăng nhập
router.post('/login', (req, res) => {
    const { ten_dang_nhap, mat_khau } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ten_dang_nhap || !mat_khau) {
        return res.status(400).json({ status: 'error', message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    // Truy vấn cơ sở dữ liệu để tìm người dùng
    const query = 'SELECT * FROM nguoi_dung WHERE ten_dang_nhap = ? AND mat_khau = ?';
    db.query(query, [ten_dang_nhap, mat_khau], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            return res.status(500).json({ status: 'error', message: 'Có lỗi xảy ra, vui lòng thử lại!' });
        }

        // Kiểm tra kết quả trả về
        if (results.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
        }

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = results[0];
        const { mat_khau, ...userWithoutPassword } = user; // Loại bỏ mật khẩu khỏi phản hồi

        return res.status(200).json({
            status: 'success',
            message: 'Đăng nhập thành công!',
            user: userWithoutPassword,
        });
    });
});


module.exports = router;