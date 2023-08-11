const { Router, json } = require('express')
const router = Router()
const user = require('./user.js')
const auth = require('./auth.js')

router.use('/auth', auth)
router.use('/user', user)

module.exports = router