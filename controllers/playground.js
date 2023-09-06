const { encrypt: encryptFunc, decrypt: decryptFunc } = require('../helpers/encrypt')
const { writeErrorLog } = require("../helpers/logger")
const { Customer, Merchant, sequelize, Transaction, Qrcode, Sequelize } = require("../models")

const encrypt = async (req, res) => {
    try {
        const pin = encryptFunc(req.body.pin)
        return res.status(200).json({
            pin: req.body.pin,
            ecnryptPin: pin
        })
    } catch (error) {
        return res.status(500).json({
            msg: error
        })
    }
}

const decrypt = async (req, res) => {
    try {
        const pin = await decryptFunc(req.body.pin)
        return res.status(200).json({
            encrypt: req.body.pin,
            pin: pin
        })
    } catch (error) {
        return res.status(500).json({
            msg: error
        })
    }
}

const generateQR = async (req, res) => {
    try {
        let date = new Date()
        let qr = await Qrcode.create({
            code: `T000000${Math.floor(date.getTime() / 1000)}`,
            merchant_id: 1,
            amount: 10000,
            status: 'PENDING',
            exp_time: (Math.floor(date.getTime() / 1000)) + 3600
        })
        return res.status(200).json({
            qr
        })
    } catch (error) {
        writeErrorLog('QR generator', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

module.exports = {
    encrypt,
    decrypt,
    generateQR
}