const { Router } = require('express')
const { uploadImage } = require('../controllers/customer')
const router = Router()

router.post('/upload', uploadImage)

module.exports = router