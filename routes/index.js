const { Router, json } = require('express')
const router = Router()
const customer = require('./customer.js')
const auth = require('./auth.js')
const playground = require('./playground.js')

router.use('/auth', auth)
router.use('/customer', customer)


if (process.env.NODE_ENV != 'production') {
    router.use('/playground', playground)
}

module.exports = router