const { Router, json } = require('express')
const router = Router()
const user = require('./user.js')

router.use('/user', user)

module.exports = router