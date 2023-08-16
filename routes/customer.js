const { Router } = require('express')
const { uploadImage } = require('../controllers/customer')
const { verifyToken } = require('../middleware/jwt')
const router = Router()

router.post('/upload', verifyToken, uploadImage)

module.exports = router