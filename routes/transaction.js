const { Router } = require('express')
const { payment, QRScan } = require('../controllers/transaction')
const {
    checkqr,
    personalData: personalDataValidator,
    ktpValidator,
    changePassword: changePasswordValidator,
    validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/jwt')
const router = Router()

router.post('/payment', verifyToken, payment)
router.post('/qrscan', checkqr(), validate, verifyToken, QRScan)



module.exports = router