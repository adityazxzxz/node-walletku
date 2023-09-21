const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { encrypt, decrypt, hashPassword, verifyPassword } = require('../helpers/encrypt')
const { generatorv2 } = require('../helpers/QRGenerator')
const { signTokenMerchant } = require('../middleware/jwt')
const { Merchant, Transaction, Sequelize } = require('../models/index')

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

        const { exp, accessToken, refreshToken } = await signTokenMerchant(merchant)
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
            code: generatorv2({
                type: '00',
                merchant_name: merchant.merchant_name,
                id: merchant.qrcode
            })
        })
    } catch (error) {
        writeErrorLog('Show Code', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

module.exports = {
    register,
    login,
    showcode
}