const express = require('express');
const router = express.Router();
const db = require('../config/config');

router.post('/add-cart', (req, res) => {
    const { id_nguoi_dung, id_san_pham, anh_san_pham, mau_sac, kich_thuoc, don_gia, so_luong } = req.body;

    if (!id_nguoi_dung || !id_san_pham || !don_gia || !so_luong) {
        return res.status(400).json({
            status: 'error',
            message: 'Thiếu thông tin bắt buộc!'
        });
    }

    const tong_tien = don_gia * so_luong;

    // Truy vấn tên sản phẩm từ bảng san_pham
    const sqlGetProduct = 'SELECT ten_san_pham FROM san_pham WHERE id_san_pham = ?';

    db.query(sqlGetProduct, [id_san_pham], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'Lỗi khi lấy thông tin sản phẩm!'
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Sản phẩm không tồn tại!'
            });
        }

        const ten_san_pham = result[0].ten_san_pham;

        const sqlInsert = `
            INSERT INTO gio_hang (id_nguoi_dung, id_san_pham, ten_san_pham, anh_san_pham, mau_sac, kich_thuoc, don_gia, so_luong, tong_tien)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(sqlInsert, [id_nguoi_dung, id_san_pham, ten_san_pham, anh_san_pham, mau_sac, kich_thuoc, don_gia, so_luong, tong_tien], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Lỗi thêm sản phẩm vào giỏ hàng!'
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Thêm sản phẩm vào giỏ hàng thành công!',
                data: result
            });
        });
    });
});



router.get('/get-cart', (req, res) => {
    const { id_nguoi_dung } = req.query;

    if (!id_nguoi_dung) {
        return res.status(400).json({ message: 'Thiếu id_nguoi_dung' });
    }

    const sql = 'SELECT * FROM gio_hang WHERE id_nguoi_dung = ?';

    db.query(sql, [id_nguoi_dung], (err, result) => {
        if (err) {
            console.error('Lỗi khi truy vấn giỏ hàng:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Lỗi khi lấy giỏ hàng!'
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Giỏ hàng không có sản phẩm nào!'
            });
        }

        res.status(200).json({
            status: 'success',
            data: result
        });
    });
});

router.delete('/delete-cart', (req, res) => {
    const { id_gio_hang } = req.body;

    if (!id_gio_hang) {
        return res.status(400).json({
            status: 'error',
            message: 'Thiếu thông tin ID giỏ hàng!'
        });
    }

    const sqlDelete = 'DELETE FROM gio_hang WHERE id_gio_hang = ?';

    db.query(sqlDelete, [id_gio_hang], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng!'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Sản phẩm không tồn tại trong giỏ hàng!'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Sản phẩm đã được xóa khỏi giỏ hàng thành công!'
        });
    });
});


module.exports = router;