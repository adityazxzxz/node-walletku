const { writeErrorLog } = require("../helpers/logger")
const { Customer, Merchant, sequelize, Transaction, Qrcode, Sequelize } = require("../models")

const checkQR = async (req, res) => {
    try {
        let cust = JSON.parse(JSON.stringify(
            await Customer.findOne({
                where: {
                    id: req.customer.id
                }
            })))
        if (!cust) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        let qrcode = req.body.code // 'T00000012324'
        let query
        let qrtype

        if (qrcode.substring(0, 1) === 'T') {
            qrtype = 'dynamic'
            query = await Qrcode.findOne({
                include: [
                    {
                        model: Merchant
                    }
                ],
                where: {
                    code: qrcode
                }
            })
        } else if (qrcode.substring(0, 1) === 'P') {
            qrtype = 'static'
            query = await Merchant.findOne({
                where: {
                    qrcode
                }
            })
        } else {
            return res.status(400).json({
                message: 'Invalid Format Transaction'
            })
        }

        query = JSON.parse(JSON.stringify(query))
        if (!query) {
            return res.status(404).json({
                message: 'Data not found'
            })
        }

        return res.status(200).json({
            message: 'QRinformation',
            ...(qrtype == 'dynamic' ? {
                code: query.code,
                merchant_name: query.Merchant.merchant_name,
                qrtype,
                amount: query.amount,
            } : {
                code: query.qrcode,
                merchant_name: query.merchant_name,
                qrtype,
            })
        })

    } catch (error) {
        writeErrorLog('CheckQR', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const payment = async (req, res) => {
    try {
        let cust = JSON.parse(JSON.stringify(
            await Customer.findOne({
                where: {
                    id: req.customer.id
                }
            })))
        if (!cust) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        let qrcode = 'T00000012324'

        // jika prefix T = dinamis jika P maka cek ke merchant

        let merchant = JSON.parse(JSON.stringify(await Merchant.findOne({
            where: {
                merchant_code: req.body.merchant_code,
                status: 1
            }
        })))
        if (!merchant) {
            return res.status(404).json({
                message: 'Merchant not found or not active'
            })
        }

        if (cust.balance < req.body.amount) {
            return res.status(401).json({
                message: 'Your balance not enough to process transaction'
            })
        }

        const t = await sequelize.transaction()
        try {
            await Customer.update({
                balance: cust.balance - req.body.amount
            }, {
                where: {
                    id: req.customer.id
                },
                transaction: t
            })

            await Merchant.update({
                balance: merchant.balance + req.body.amount
            }, {
                where: {
                    merchant_code: req.body.merchant_code
                },
                transaction: t
            })

            await Transaction.create({
                cust_id: cust.id,
                merchant_id: merchant.id,
                amount: req.body.amount,
                action: 'PAYMENT',
                status: 'success',
                message: 'Payment success',
            }, {
                transaction: t
            })

            await t.commit()
            return res.status(200).json({
                message: 'Transaction Success'
            })
        } catch (error) {
            await t.rollback()
            writeErrorLog('Payment', error)
            return res.status(500).json({
                message: 'Internal Error'
            })
        }


    } catch (error) {
        writeErrorLog('Payment', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

module.exports = {
    payment,
    checkQR
}