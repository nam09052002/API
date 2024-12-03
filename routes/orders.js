const express = require('express');
const router = express.Router();
const db = require('../config/config');

router.post('/add-order', (req, res) => {
    const { id_nguoi_dung, ho_va_ten, so_dien_thoai, dia_chi, orderItems } = req.body;

    if (!id_nguoi_dung || !ho_va_ten || !so_dien_thoai || !dia_chi || !orderItems || orderItems.length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Thiếu thông tin bắt buộc!'
        });
    }

    // Tạo ID đơn hàng mới
    const sqlInsertOrder = `
        INSERT INTO don_hang (id_nguoi_dung, ho_va_ten, so_dien_thoai, dia_chi, ngay_mua)
        VALUES (?, ?, ?, ?, NOW())
    `;

    db.query(sqlInsertOrder, [id_nguoi_dung, ho_va_ten, so_dien_thoai, dia_chi], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'Lỗi khi thêm đơn hàng!'
            });
        }

        const id_don_hang = result.insertId; // ID đơn hàng vừa được thêm

        const orderItemsValues = orderItems.map(item => [
            id_don_hang,
            item.ten_san_pham,
            item.anh_san_pham,
            item.mau_sac,
            item.kich_thuoc,
            item.don_gia,
            item.so_luong,
            item.ma_giam_gia || null, // Nếu có mã giảm giá
            item.phan_tram_giam || 0, // Nếu có phần trăm giảm giá
            item.tong_tien
        ]);

        const sqlInsertOrderItems = `
            INSERT INTO chi_tiet_don_hang (id_don_hang, ten_san_pham,anh_san_pham, mau_sac, kich_thuoc, don_gia, so_luong, ma_giam_gia, phan_tram_giam, tong_tien)
            VALUES ?
        `;

        db.query(sqlInsertOrderItems, [orderItemsValues], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Lỗi khi thêm chi tiết đơn hàng!'
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Đơn hàng đã được thêm thành công!',
                data: { id_don_hang, orderItems }
            });
        });
    });
});

router.get('/get-order', (req, res) => {
    const sql = 'SELECT * FROM don_hang';

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'Lỗi khi lấy thông tin đơn hàng!'
            });
        }

        res.status(200).json({
            status: 'success',
            data: result
        });
    });
});

router.post('/update-order', (req, res) => {
    const { id_don_hang, trang_thai } = req.body;

    if (!id_don_hang || !trang_thai) {
        return res.status(400).json({
            status: 'error',
            message: 'Thiếu thông tin id_don_hang hoặc trang_thai'
        });
    }

    const sql = 'UPDATE don_hang SET trang_thai = ? WHERE id_don_hang = ?';
    db.query(sql, [trang_thai, id_don_hang], (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật trạng thái:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Lỗi khi cập nhật trạng thái đơn hàng'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Cập nhật trạng thái đơn hàng thành công'
        });
    });
});

router.get('/get-all-order', (req, res) => {
    const sql = 'SELECT * FROM chi_tiet_don_hang';

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'Lỗi khi lấy thông tin chi tiết đơn hàng!'
            });
        }

        res.status(200).json({
            status: 'success',
            data: result
        });
    });
});


module.exports = router;