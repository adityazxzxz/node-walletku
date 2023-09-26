const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { encrypt, decrypt, hashPassword, verifyPassword } = require('../helpers/encrypt')
const { generatorv2 } = require('../helpers/QRGenerator')
const { signToken } = require('../middleware/jwt_merchant')
const { Merchant, Transaction, Qrcode, Sequelize } = require('../models/index')

const register = async (req, res) => {
    try {
        let {
            phone,
            password,
            pic_name,
            id_card,
            bank_account,
            bank_account_number,
            merchant_name,
            long,
            lat
        } = req.body
        const date = new Date()
        password = decrypt(password)

        let merchant = JSON.parse(JSON.stringify(await Merchant.findOne({
            where: {
                phone
            }
        })))
        if (merchant) {
            if (merchant.id_card === id_card) {
                return res.status(409).json({
                    message: 'ID Card already registerd'
                })
            }
            return res.status(409).json({
                message: 'Phone already registered'
            })
        }



        let dataPassword = await hashPassword(password)

        await Merchant.create({
            phone,
            password: dataPassword,
            pic_name,
            id_card,
            bank_account,
            bank_account_number,
            merchant_name,
            long,
            lat,
            qrcode: `P${Math.floor(date.getTime())}`,
            status: 0
        })

        return res.status(200).json({
            message: 'Data has been saved'
        })
    } catch (error) {
        writeErrorLog('Register Merchant', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const login = async (req, res) => {
    const { phone, password } = req.body
    try {
        const merchant = JSON.parse(JSON.stringify(await Merchant.findOne({
            where: {
                phone
            }
        })))
        if (!merchant) {
            return res.status(404).json({
                message: 'phone not found'
            })
        }

        const checkPassword = await verifyPassword(merchant.password, decrypt(password))
        if (!checkPassword) {
            return res.status(401).json({
                message: 'password invalid'
            })
        }

        const { exp, accessToken, refreshToken } = await signToken(merchant)
        return res.status(200).json({
            exp,
            accessToken,
            refreshToken
        })
    } catch (error) {
        writeErrorLog('Login', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }

}

const showcode = async (req, res) => {
    try {
        const merchant = JSON.parse(JSON.stringify(await Merchant.findOne({
            where: {
                id: req.merchant.id
            }
        })))
        return res.status(200).json({
            qrcode: generatorv2({
                type: '00',
                merchant_name: merchant.merchant_name,
                id: merchant.qrcode
            }),
            code: merchant.qrcode
        })
    } catch (error) {
        writeErrorLog('Show Code', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const createQRPayment = async (req, res) => {
    try {
        let date = new Date()
        let merchant = JSON.parse(JSON.stringify(await Merchant.findOne({
            where: {
                id: req.merchant.id
            }
        })))
        let qr = await Qrcode.create({
            code: `T${Math.floor(date.getTime())}`,
            merchant_id: req.merchant.id,
            amount: req.body.amount,
            status: 'PENDING',
            exp_time: (Math.floor(date.getTime() / 1000)) + 3600
        })
        return res.status(200).json({
            data: {
                code: qr.code,
                qrcode: generatorv2({
                    type: '01',
                    amount: qr.amount,
                    merchant_name: merchant.merchant_name,
                    id: qr.code
                }),
                amount: qr.amount,
                exp_time: qr.exp_time,
                status: qr.status
            }
        })
    } catch (error) {
        writeErrorLog('Create QR Payment', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const historyTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findAll({
            where: {
                merchant_id: req.merchant.id
            }
        })

        return res.status(200).json({
            data: transaction
        })

    } catch (error) {
        writeErrorLog('History Transaction Merchant', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const profile = async (req, res) => {
    try {
        let merchant = await Merchant.findOne({
            attributes: ['phone', 'pic_name', 'merchant_name', 'qrcode', 'balance', 'long', 'lat'],
            where: {
                id: req.merchant.id
            }
        })

        return res.status(200).json({
            data: merchant
        })
    } catch (error) {
        writeErrorLog('Get profile merchant', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

module.exports = {
    register,
    login,
    showcode,
    createQRPayment,
    historyTransaction,
    profile
}