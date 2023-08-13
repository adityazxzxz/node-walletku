const { Router } = require('express')
const { register, otpRegister, login } = require('../controllers/auth')
const {
    register: registerValidator,
    otp: otpValidator,
    login: loginValidator,
    validate } = require('../middleware/validator')
const router = Router()

router.post('/login', loginValidator(), validate, login)
router.post('/register', registerValidator(), validate, register)
router.post('/otp/register', otpValidator(), validate, otpRegister)

module.exports = router