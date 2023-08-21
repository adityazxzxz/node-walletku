const { Router } = require('express')
const { register, otpRegister, login, phoneRegister } = require('../controllers/auth')
const {
    phoneRegister: phoneRegisterValidator,
    register: registerValidator,
    otp: otpValidator,
    login: loginValidator,
    validate } = require('../middleware/validator')
const router = Router()

router.post('/login', loginValidator(), validate, login)
router.post('/register', registerValidator(), validate, register)
router.post('/phone_register', phoneRegisterValidator(), validate, phoneRegister)
router.post('/otp/register', otpValidator(), validate, otpRegister)

module.exports = router