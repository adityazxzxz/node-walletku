const { Router, json } = require('express')
const router = Router()
const user = require('./user.js')
const auth = require('./auth.js')
const playground = require('./playground.js')

router.use('/auth', auth)
router.use('/user', user)


if (process.env.NODE_ENV != 'production') {
    router.use('/playground', playground)
}

module.exports = router