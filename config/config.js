const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: '2hand_official',
    port: 3307
});

connection.connect((err) => {
    if (err) {
        console.error('Kết nối thất bại: ' + err.stack);
        return;
    }
    console.log('Kết nối thành công');
});
module.exports = connection;