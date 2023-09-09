const { Router } = require('express')
const { payment, QRScan, history } = require('../controllers/transaction')
const {
    checkqr,
    payment: paymentValidator,
    validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/jwt')
const router = Router()

router.get('/history', verifyToken, history)
router.post('/payment', paymentValidator(), validate, verifyToken, payment)
router.post('/qrscan', checkqr(), validate, verifyToken, QRScan)



module.exports = router