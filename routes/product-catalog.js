const express = require('express');
const router = express.Router();
const db = require('../config/config'); // Kết nối MySQL

// API lấy danh sách danh mục sản phẩm
router.get('/get-catalog', (req, res) => {
    const query = 'SELECT id, ten_danh_muc, phan_loai, ngay_tao FROM danh_muc_san_pham';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            return res.status(500).json({ status: 'error', message: 'Lỗi truy vấn cơ sở dữ liệu!' });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Không có danh mục sản phẩm nào!' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Lấy danh sách danh mục sản phẩm thành công!',
            data: results
        });
    });
});

// API thêm danh mục sản phẩm
router.post('/add-catalog', (req, res) => {
    const { ten_danh_muc, phan_loai } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ten_danh_muc || !phan_loai) {
        return res.status(400).json({ status: 'error', message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    const insertQuery = 'INSERT INTO danh_muc_san_pham (ten_danh_muc, phan_loai) VALUES (?, ?)';

    db.query(insertQuery, [ten_danh_muc, phan_loai], (err, results) => {
        if (err) {
            console.error('Lỗi khi thêm danh mục:', err);
            return res.status(500).json({ status: 'error', message: 'Lỗi khi thêm danh mục sản phẩm!' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Thêm danh mục sản phẩm thành công!',
        });
    });
});

// API cập nhật danh mục sản phẩm
router.put('/update-catalog', (req, res) => {
    const { id, ten_danh_muc, phan_loai } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!id || !ten_danh_muc || !phan_loai) {
        return res.status(400).json({ status: 'error', message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    const updateQuery = 'UPDATE danh_muc_san_pham SET ten_danh_muc = ?, phan_loai = ? WHERE id = ?';

    db.query(updateQuery, [ten_danh_muc, phan_loai, id], (err, results) => {
        if (err) {
            console.error('Lỗi khi cập nhật danh mục:', err);
            return res.status(500).json({ status: 'error', message: 'Lỗi khi cập nhật danh mục sản phẩm!' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Không tìm thấy danh mục sản phẩm!' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Cập nhật danh mục sản phẩm thành công!',
        });
    });
});

// API xóa danh mục sản phẩm
router.delete('/delete-catalog', (req, res) => {
    const { id } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!id) {
        return res.status(400).json({ status: 'error', message: 'ID danh mục sản phẩm là bắt buộc!' });
    }

    const deleteQuery = 'DELETE FROM danh_muc_san_pham WHERE id = ?';

    db.query(deleteQuery, [id], (err, results) => {
        if (err) {
            console.error('Lỗi khi xóa danh mục:', err);
            return res.status(500).json({ status: 'error', message: 'Lỗi khi xóa danh mục sản phẩm!' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Không tìm thấy danh mục sản phẩm để xóa!' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Xóa danh mục sản phẩm thành công!',
        });
    });
});

module.exports = router;