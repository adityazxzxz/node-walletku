const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // Ganti dengan lokasi penyimpanan yang Anda inginkan
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
    size: 20
});

const fileFilter = (req, file, cb) => {
    // Filter file berdasarkan tipe MIME atau ekstensinya
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 1MB dalam bytes
    },
    fileFilter: fileFilter
});

const uploadImage = (req, res) => {
    // 'file' adalah nama field di form yang digunakan untuk meng-upload file
    upload.fields([{ name: 'id_card', maxCount: 1 }, { name: 'selfie', maxCount: 1 }])(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(200).json({ message: 'File uploaded successfully' });
    });
};

module.exports = {
    uploadImage
}