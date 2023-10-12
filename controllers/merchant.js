const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { encrypt, decrypt, hashPassword, verifyPassword } = require('../helpers/encrypt')
const { generatorv2 } = require('../helpers/QRGenerator')
const { signToken } = require('../middleware/jwt_merchant')
const { Merchant, Transaction, Qrcode, Sequelize } = require('../models/index');
const { randomNumber } = require('../helpers/utils');
const { set, get, is_exists, del } = require('../helpers/redis')
const API = require('../helpers/otp')

const register = async (req, res) => {
    try {
        let {
            phone,
            password
        } = req.body
        const date = new Date()
        password = decrypt(password)

        let merchant = JSON.parse(JSON.stringify(await Merchant.findOne({
            where: {
                phone
            }
        })))
        if (merchant) {
            return res.status(409).json({
                message: 'Phone already registered'
            })
        }

        let otp = randomNumber(6).toString()
        let dataPassword = await hashPassword(password)
        await set('REG' + phone, 60, encrypt(JSON.stringify({
            otp,
            attempt: 0,
            type: 'register',
            data: {
                phone,
                password: dataPassword,
                pic_name: 'user' + date.getTime(),
                qrcode: `P${Math.floor(date.getTime())}`,
                status: 0,
                balance: 0
            },
            createdtime: Math.floor(date.getTime())
        })))

        const { data, status } = await API.whatsapp({
            msisdn: phone,
            otp
        })

        return res.status(200).json({
            message: 'Check otp on your phone',
            ...(process.env.NODE_ENV !== 'production' ? { otp: encrypt(otp) } : null)
        })
    } catch (error) {
        writeErrorLog('Register Merchant', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const submit_otp_register = async (req, res) => {
    try {
        let { phone, otp } = req.body
        otp = decrypt(otp)
        let redisKey = 'REG' + phone
        let check = await is_exists(redisKey)
        if (!check) {
            return res.status(404).json({
                message: 'Request otp not found, please try again.'
            })
        }
        let merchant_otp = JSON.parse(decrypt(await get(redisKey)))
        if (merchant_otp.attempt >= 3) {
            return res.status(409).json({
                message: 'You already invalid otp for 3 times, please wait for 30 minutes'
            })
        }
        if (otp != merchant_otp.otp) {
            let newvalue = {
                ...merchant_otp,
                attempt: merchant_otp.attempt + 1
            }
            await set(redisKey, (newvalue.attempt >= 3 ? 1800 : 60), encrypt(JSON.stringify(newvalue)))
            return res.status(400).json({
                message: 'OTP invalid'
            })
        }
        let merchant = await Merchant.create(merchant_otp.data)
        const { exp, accessToken, refreshToken } = await signToken(merchant)
        await del(redisKey)
        return res.status(200).json({
            exp,
            accessToken,
            refreshToken
        })
    } catch (error) {
        writeErrorLog('Submit otp merchant register', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const save_personal_data = async (req, res) => {
    try {
        let {
            pic_name,
            id_card,
            bank_account,
            bank_account_number,
            merchant_name,
            long,
            lat
        } = req.body
        const date = new Date()

        let merchant = JSON.parse(JSON.stringify(await Merchant.findOne({
            where: {
                id: req.merchant.id,
            }
        })))
        if (merchant) {
            if (merchant.status > 0) {
                return res.status(409).json({
                    message: 'Merchant already put data'
                })
            }
            if (merchant.id_card === id_card) {
                return res.status(409).json({
                    message: 'ID Card already registerd'
                })
            }
        }

        await Merchant.update({
            pic_name,
            id_card,
            bank_account,
            bank_account_number,
            merchant_name,
            long,
            lat,
            status: 1
        }, {
            where: {
                id: req.merchant.id
            }
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
        if (!merchant) {
            return res.status(404).json({
                message: 'Merchant not found'
            })
        }
        let qr = await Qrcode.create({
            code: `T${Math.floor(date.getTime())}`,
            merchant_id: req.merchant.id,
            amount: req.body.amount,
            status: 'PENDING',
            exp_time: (Math.floor(date.getTime() / 1000)) + 3600
        })
        return res.status(200).json({
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

const changePassword = async (req, res) => {
    try {
        let { new_password, old_password } = req.body
        new_password = decrypt(new_password)
        const merchant = JSON.parse(JSON.stringify(await Merchant.findOne({
            where: {
                id: req.merchant.id
            }
        })))
        if (!merchant) {
            return res.status(404).json({
                message: 'Merchant not found'
            })
        }

        const checkPassword = await verifyPassword(merchant.password, decrypt(old_password))
        if (!checkPassword) {
            return res.status(401).json({
                message: 'password invalid'
            })
        }
        let dataPassword = await hashPassword(new_password)

        await Merchant.update({
            password: dataPassword
        }, {
            where: {
                id: req.merchant.id
            }
        })

        return res.status(200).json({
            message: 'Password has been updated'
        })
    } catch (error) {
        writeErrorLog('Change password merchant', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

module.exports = {
    register,
    submit_otp_register,
    save_personal_data,
    login,
    showcode,
    createQRPayment,
    historyTransaction,
    profile,
    changePassword
}