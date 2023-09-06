const { writeErrorLog } = require("../helpers/logger")
const { Customer, Merchant, sequelize, Transaction, Qrcode, Sequelize } = require("../models")

const QRScan = async (req, res) => {
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
                        model: Merchant,
                        required: true
                    }
                ],
                where: {
                    code: qrcode,
                    status: 'PENDING'
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
        let date = new Date()
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

        let qrcode = req.body.code
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


        if (cust.balance < req.body.amount) {
            return res.status(401).json({
                message: 'Your balance not enough to process transaction'
            })
        }

        if (qrtype == 'dynamic') {
            if (query.exp_time < Math.floor(date.getTime() / 1000)) {
                return res.status(401).json({
                    message: 'QR expired'
                })
            }
        }

        const t = await sequelize.transaction()
        try {
            await Customer.update({
                balance: cust.balance - (qrtype == 'static' ? req.body.amount : query.amount)
            }, {
                where: {
                    id: req.customer.id
                },
                transaction: t
            })
            console.log(req.boi)
            await Merchant.update({
                balance: qrtype == 'static' ? sequelize.literal(`balance + ${req.body.amount}`) : sequelize.literal(`balance + ${query.amount}`)
            }, {
                where: {
                    merchant_code: qrtype == 'static' ? query.merchant_code : query.Merchant.merchant_code
                },
                transaction: t
            })

            if (qrtype == 'dynamic') {
                await Qrcode.update({
                    status: 'SETTLEMENT'
                }, {
                    where: {
                        code: qrcode
                    },
                    transaction: t
                })
            }

            await Transaction.create({
                cust_id: cust.id,
                merchant_id: qrtype == 'static' ? query.id : query.Merchant.id,
                amount: req.body.amount,
                action: 'PAYMENT',
                status: 'success',
                message: `Payment success QR ${qrtype}`,
                transaction_time: Math.floor(date.getTime() / 1000)
            }, {
                transaction: t
            })

            await t.commit()
            return res.status(200).json({
                message: 'Transaction Success',
                data: {
                    id,
                    amount,
                    transaction_time,
                }
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
    QRScan
}