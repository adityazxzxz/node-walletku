const { Router } = require('express')
const { payment, checkQR } = require('../controllers/transaction')
const {
    checkqr,
    personalData: personalDataValidator,
    ktpValidator,
    changePassword: changePasswordValidator,
    validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/jwt')
const router = Router()

router.post('/payment', verifyToken, payment)
router.post('/checkqr', checkqr(), validate, verifyToken, checkQR)



module.exports = router