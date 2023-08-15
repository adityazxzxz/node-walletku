const multer = require('multer')
const logger = require('../helpers/logger')

const image = (req, res, next) => {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './images')
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
            }
        })
        try {
            multer({
                storage: storage,
                fileFilter: function (req, file, cb) {
                    let ext = path.extname(file.originalname)
                    if (ext !== '.png' && ext !== '.jpg' && ext !== 'jpeg') {
                        return cb(new Error('Only png, jpg, jpeg'))
                    }
                    cb(null, true)
                }
            }).single('avatar')
            next()
        } catch (error) {
            return res.status(200).json({
                code: 500,
                message: error
            })
        }
    } catch (error) {
        logger.error('Upload avatar', error)
        return res.status(200).json({ code: 500, message: 'Internal Error' })
    }
}

module.exports = {
    image
}