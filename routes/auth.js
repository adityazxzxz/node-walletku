const { Router } = require('express')
const { register, otp } = require('../controllers/auth')
const {
    register: registerValidator,
    otp: otpValidator,
    login,
    validate } = require('../middleware/validator')
const router = Router()

router.post('/register', registerValidator(), validate, register)
router.post('/otp', otpValidator(), validate, otp)

module.exports = router