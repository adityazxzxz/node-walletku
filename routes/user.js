const { Router } = require('express')
const { getProfile, encrypt, decrypt } = require('../controllers/user')
const router = Router()

router.get('/', getProfile)
router.post('/enc', encrypt)
router.post('/dec', decrypt)

module.exports = router