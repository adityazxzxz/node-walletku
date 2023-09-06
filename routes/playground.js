const { Router } = require('express')
const { encrypt, decrypt, generateQR } = require('../controllers/playground')
const router = Router()

router.post('/encrypt', encrypt)
router.post('/decrypt', decrypt)
router.post('/generateqr', generateQR)

module.exports = router