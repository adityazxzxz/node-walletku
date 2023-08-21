const { Router } = require('express')
const { uploadImage, updatePersonal } = require('../controllers/customer')
const {
    personalData: personalDataValidator,
    validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/jwt')
const router = Router()

router.post('/upload', verifyToken, uploadImage)
router.post('/personal_data', verifyToken, personalDataValidator(), validate, updatePersonal)

module.exports = router