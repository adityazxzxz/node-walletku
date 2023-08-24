const { Router } = require('express')
const { uploadImage, updatePersonal, uploadKtp, uploadBpkb, uploadSelfie, checkKTP } = require('../controllers/customer')
const {
    personalData: personalDataValidator,
    ktpValidator,
    validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/jwt')
const upload = require('../middleware/upload')
const router = Router()

router.post('/upload', verifyToken, upload.fields([{ name: 'id_card', maxCount: 1 }, { name: 'selfie', maxCount: 1 }, { name: 'bpkb', maxCount: 1 }]), uploadImage)
router.post('/upload/ktp', verifyToken, upload.single('ktp'), uploadKtp)
router.post('/upload/bpkb', verifyToken, upload.single('bpkb'), uploadBpkb)
router.post('/upload/selfie', verifyToken, upload.single('selfie'), uploadSelfie)
router.post('/personal_data', verifyToken, personalDataValidator(), validate, updatePersonal)
router.post('/check_ktp', verifyToken, ktpValidator(), validate, checkKTP)

module.exports = router