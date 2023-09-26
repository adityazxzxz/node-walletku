const { Router } = require('express')
const { register, login, showcode, createQRPayment, historyTransaction, profile } = require('../controllers/merchant')
const {
    ktpValidator,
    validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/jwt')
const { verifyToken: verifyTokenMerchant } = require('../middleware/jwt_merchant')
const upload = require('../middleware/upload')
const router = Router()

// router.post('/upload', verifyToken, upload.fields([{ name: 'id_card', maxCount: 1 }, { name: 'selfie', maxCount: 1 }, { name: 'bpkb', maxCount: 1 }]), uploadImage)
// router.post('/personal_data', verifyToken, personalDataValidator(), validate, updatePersonal)
router.post('/register', register)
router.post('/login', login)
router.get('/code', verifyTokenMerchant, showcode)
router.get('/profile', verifyTokenMerchant, profile)
router.post('/payment', verifyTokenMerchant, createQRPayment)
router.get('/payment/history', verifyTokenMerchant, historyTransaction)


module.exports = router