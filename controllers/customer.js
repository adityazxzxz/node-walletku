const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const multer = require('multer')
const path = require('path')
const { Customer } = require('../models/index')

const updatePersonal = async (req, res) => {
    try {
        let { fullname, email, no_plat, province, city, zipcode, address, emergency_name, emergency_phone } = req.body
        let cust = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                id: req.customer.id,
                status: 0
            }
        })))
        await Customer.update({
            fullname,
            email,
            no_plat,
            province,
            city,
            zipcode,
            address,
            emergency_name,
            emergency_phone,
            status: 1
        }, {
            where: {
                id: req.customer.id
            }
        })

        return res.status(200).json({
            message: 'Personal data has been updated'
        })
    } catch (error) {
        writeErrorLog('Personal Data', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

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

const uploadImage = async (req, res) => {
    // 'file' adalah nama field di form yang digunakan untuk meng-upload file
    let customer = JSON.parse(JSON.stringify(await Customer.findOne({
        where: {
            id: req.customer.id,
            status: 0
        }
    })))
    if (!customer) {
        return res.status(401).json({
            message: 'Customer already request'
        })
    }
    try {
        upload.fields([{ name: 'id_card', maxCount: 1 }, { name: 'selfie', maxCount: 1 }])(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            try {
                await Customer.update({
                    id_card_image: req.files['id_card'][0].filename,
                    selfie_image: req.files['selfie'][0].filename,
                    status: 1
                }, {
                    where: {
                        id: req.customer.id
                    }
                })
                return res.status(200).json({ message: 'File uploaded successfully' });
            } catch (error) {
                writeErrorLog('Upload Error', error)
                return res.status(500).json({ message: 'Internal Error' });
            }
        });
    } catch (error) {
        writeErrorLog('Upload Error', error)
        return res.status(500).json({ message: 'Internal Error' });
    }
};

module.exports = {
    uploadImage,
    updatePersonal
}