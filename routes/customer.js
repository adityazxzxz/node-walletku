const { Router } = require('express')
const { uploadImage, updatePersonal, uploadKtp, uploadBpkb, uploadSelfie, checkKTP, checkSTNK, getProfile, changePassword, changePin, updateProfile, getLimit } = require('../controllers/customer')
const {
    personalData: personalDataValidator,
    ktpValidator,
    stnkNameValidator,
    changePassword: changePasswordValidator,
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
router.post('/check_stnk', verifyToken, stnkNameValidator(), validate, checkSTNK)
router.get('/profile', verifyToken, getProfile)
router.get('/limit', verifyToken, getLimit)
router.put('/profile', verifyToken, updateProfile)
router.put('/password', verifyToken, changePasswordValidator(), validate, changePassword)
router.put('/pin', verifyToken, changePin)


module.exports = router