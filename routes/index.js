const { Router, json } = require('express')
const router = Router()
const customer = require('./customer.js')
const merchant = require('./merchant.js')
const admin = require('./admin.js')
const util = require('./util.js')
const auth = require('./auth.js')
const transaction = require('./transaction.js')
const playground = require('./playground.js')

router.use('/auth', auth)
router.use('/customer', customer)
router.use('/merchant', merchant)
router.use('/admin', admin)
router.use('/utils', util)
router.use('/transaction', transaction)


if (process.env.NODE_ENV != 'production') {
    router.use('/playground', playground)
}

module.exports = router