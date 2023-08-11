const { Router } = require('express')
const { encrypt, decrypt } = require('../controllers/playground')
const router = Router()

router.post('/encrypt', encrypt)
router.post('/decrypt', decrypt)

module.exports = router