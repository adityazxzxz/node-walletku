const { Router } = require('express')
const { payment } = require('../controllers/transaction')
const {
    personalData: personalDataValidator,
    ktpValidator,
    changePassword: changePasswordValidator,
    validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/jwt')
const router = Router()

router.post('/payment', verifyToken, payment)



module.exports = router