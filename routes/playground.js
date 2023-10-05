const { Router } = require('express')
const { encrypt, decrypt, generateQR, activateCustomer } = require('../controllers/playground')
const router = Router()

router.post('/encrypt', encrypt)
router.post('/decrypt', decrypt)
router.post('/generateqr', generateQR)
router.post('/activate_customer', activateCustomer)

module.exports = router