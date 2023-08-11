const { Router } = require('express')
const { register, otpRegister } = require('../controllers/auth')
const {
    register: registerValidator,
    otp: otpValidator,
    login,
    validate } = require('../middleware/validator')
const router = Router()

router.post('/register', registerValidator(), validate, register)
router.post('/otp/register', otpValidator(), validate, otpRegister)

module.exports = router