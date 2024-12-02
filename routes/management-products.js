const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/config'); // Kết nối MySQL

// Kiểm tra và tạo thư mục 'uploads' nếu chưa tồn tại
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để lưu trữ tệp ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Đảm bảo đường dẫn 'uploads/' là chính xác
        cb(null, uploadDir); // Thư mục 'uploads'
    },
    filename: (req, file, cb) => {
        // Đặt tên tệp theo thời gian hiện tại + phần mở rộng
        cb(null, Date.now() + path.extname(file.originalname)); // Tên tệp là thời gian hiện tại + phần mở rộng
    }
});

const upload = multer({ storage: storage });

// Đảm bảo đường dẫn 'uploads/' đã tồn tại và có quyền ghi
router.post('/add-product', upload.single('anh_san_pham'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'Không có ảnh được tải lên!' });
    }

    const {
        ten_san_pham,
        mo_ta,
        ten_gioi_tinh,
        ten_danh_muc,
        ten_nhan_hieu,
        ten_nha_cung_cap,
        gia_nhap,
        gia_ban,
        ton_kho,
        mau_sac,
        kich_thuoc
    } = req.body;

    const anh_san_pham = `/uploads/${req.file.filename}`; // Nếu có ảnh thì lưu đường dẫn, nếu không có thì là null

    // Kiểm tra dữ liệu đầu vào
    if (!ten_san_pham || !mo_ta || !ten_gioi_tinh || !ten_danh_muc || !ten_nhan_hieu || !ten_nha_cung_cap || !gia_nhap || !gia_ban || !ton_kho || !mau_sac || !kich_thuoc) {
        return res.status(400).json({ status: 'error', message: 'Vui lòng điền đầy đủ thông tin sản phẩm!' });
    }

    // Query để thêm sản phẩm vào cơ sở dữ liệu
    const query = `
      INSERT INTO san_pham (ten_san_pham, mo_ta, ten_gioi_tinh, ten_danh_muc, ten_nhan_hieu, ten_nha_cung_cap, gia_nhap, gia_ban, anh_san_pham, ton_kho, mau_sac, kich_thuoc)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [ten_san_pham, mo_ta, ten_gioi_tinh, ten_danh_muc, ten_nhan_hieu, ten_nha_cung_cap, gia_nhap, gia_ban, anh_san_pham, ton_kho, mau_sac, kich_thuoc], (err, results) => {
        if (err) {
            console.error('Lỗi khi thêm sản phẩm:', err);
            return res.status(500).json({ status: 'error', message: 'Lỗi khi thêm sản phẩm!' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Sản phẩm đã được thêm thành công!',
            data: { id: results.insertId, ...req.body }
        });
    });
});

// Route GET để lấy danh sách tất cả sản phẩm
router.get('/get-products', (req, res) => {
    // Truy vấn cơ sở dữ liệu để lấy tất cả sản phẩm
    const query = 'SELECT * FROM san_pham';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', err);
            return res.status(500).json({ status: 'error', message: 'Lỗi khi lấy danh sách sản phẩm!' });
        }

        // Trả về danh sách sản phẩm dưới dạng JSON
        return res.status(200).json({
            status: 'success',
            message: 'Danh sách sản phẩm đã được lấy thành công!',
            data: results
        });
    });
});


module.exports = router;