const { Router } = require('express')
const { uploadImage, updatePersonal } = require('../controllers/customer')
const {
    personalData: personalDataValidator,
    validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/jwt')
const upload = require('../middleware/upload')
const router = Router()

router.post('/upload', verifyToken, upload.fields([{ name: 'id_card', maxCount: 1 }, { name: 'selfie', maxCount: 1 }]), uploadImage)
router.post('/personal_data', verifyToken, personalDataValidator(), validate, updatePersonal)

module.exports = router