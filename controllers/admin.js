const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { encrypt, decrypt, hashPassword, verifyPassword } = require('../helpers/encrypt')
const { generatorv2 } = require('../helpers/QRGenerator')
const { signToken } = require('../middleware/jwt_merchant')
const { Merchant, Transaction, Qrcode, Customer, Sequelize } = require('../models/index')

const store = async (req, res) => {
    try {
        let {
            username,
            password,
            fullname,
            role
        } = req.body
        const date = new Date()
        password = decrypt(password)

        let admin = JSON.parse(JSON.stringify(await Admin.findOne({
            where: {
                username
            }
        })))
        if (admin) {
            return res.status(409).json({
                message: 'Username already exists'
            })
        }

        let dataPassword = await hashPassword(password)

        await Admin.create({
            username,
            password: dataPassword,
            fullname,
            role,
        })

        return res.status(200).json({
            message: 'Data has been saved'
        })
    } catch (error) {
        writeErrorLog('Add Admin', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const login = async (req, res) => {
    const { username, password } = req.body
    try {
        const admin = JSON.parse(JSON.stringify(await Admin.findOne({
            attributes: ['username', 'role'],
            where: {
                username
            }
        })))
        if (!admin) {
            return res.status(404).json({
                message: 'Username not found'
            })
        }

        const checkPassword = await verifyPassword(admin.password, decrypt(password))
        if (!checkPassword) {
            return res.status(401).json({
                message: 'password invalid'
            })
        }

        const { exp, accessToken, refreshToken } = await signToken(admin)
        return res.status(200).json({
            exp,
            accessToken,
            refreshToken
        })
    } catch (error) {
        writeErrorLog('Admin Login', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }

}

const customers = async (req, res) => {
    const { page = 1, limit = 10, phone, id_card, stnk_name, fullname } = req.query;
    const offset = (page - 1) * limit;
    let whereClause = {};

    if (phone) {
        whereClause.phone = { [Sequelize.Op.like]: `%${phone}%` };
    }
    if (id_card) {
        whereClause.id_card = { [Sequelize.Op.like]: `%${id_card}%` };
    }
    if (stnk_name) {
        whereClause.stnk_name = { [Sequelize.Op.like]: `%${stnk_name}%` };
    }
    if (fullname) {
        whereClause.fullname = { [Sequelize.Op.like]: `%${fullname}%` };
    }

    try {
        const customers = await Customer.findAll({
            attributes: {
                exclude: ['password', 'pin', 'otp']
            },
            where: whereClause,
            offset: offset,
            limit: parseInt(limit),
        });
        const totalCustomers = await Customer.count({ where: whereClause });
        return res.json({
            page: parseInt(page),
            total_data: totalCustomers,
            data: customers,
        });
    } catch (error) {
        writeErrorLog('Admin List Customers', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const approveCustomer = async (req, res) => {
    try {
        const { id } = req.params
        const { balance } = req.body
        const cust = await Customer.findOne({
            where: {
                id
            }
        })
        if (!cust) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }
        if (cust.status > 2) {
            return res.status(409).json({
                message: 'Customer already approved'
            })
        }
        await Customer.update({
            status: 3,
            balance
        }, {
            where: {
                id
            }
        })
    } catch (error) {
        writeErrorLog('Approve customer', error)
        return res.status(200).json({
            message: 'Internal Error'
        })
    }
}

const banOrDisbanCustomer = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const cust = await Customer.findOne({
            where: {
                id
            }
        })
        if (!cust) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }
        await Customer.update({
            status
        }, {
            where: {
                id
            }
        })
    } catch (error) {
        writeErrorLog('Approve customer', error)
        return res.status(200).json({
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
        let { id } = req.params
        new_password = decrypt(new_password)
        const adm = JSON.parse(JSON.stringify(await Admin.findOne({
            where: {
                id
            }
        })))
        if (!adm) {
            return res.status(404).json({
                message: 'Merchant not found'
            })
        }

        const checkPassword = await verifyPassword(adm.password, decrypt(old_password))
        if (!checkPassword) {
            return res.status(401).json({
                message: 'password invalid'
            })
        }
        let dataPassword = await hashPassword(new_password)

        await Admin.update({
            password: dataPassword
        }, {
            where: {
                id
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
    login,
    approveCustomer,
    banOrDisbanCustomer,
    changePassword,
    customers,
    store
}