const { Router } = require('express')
const { getProfile } = require('../controllers/user')
const router = Router()

router.get('/', getProfile)

module.exports = router