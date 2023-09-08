const { writeErrorLog } = require("../helpers/logger")
const { Customer, Merchant, sequelize, Transaction, Qrcode, Sequelize } = require("../models")
let fee = 3000

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
            fee,
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
        let amount = parseInt(req.body.amount)
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


        if (cust.balance < (amount + fee)) {
            return res.status(409).json({
                message: 'Your balance not enough to process transaction'
            })
        }

        if (qrtype == 'dynamic') {
            if (query.exp_time < Math.floor(date.getTime() / 1000)) {
                return res.status(409).json({
                    message: 'QR expired'
                })
            }
        }

        const t = await sequelize.transaction()
        try {
            await Customer.update({
                balance: cust.balance - fee - (qrtype == 'static' ? req.body.amount : query.amount)
            }, {
                where: {
                    id: req.customer.id
                },
                transaction: t
            })
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

            let tx = await Transaction.create({
                cust_id: cust.id,
                merchant_id: qrtype == 'static' ? query.id : query.Merchant.id,
                amount: qrtype == 'static' ? req.body.amount : query.amount,
                action: 'PAYMENT',
                fee,
                transaction_status: 'settlement',
                message: `Payment QR Success on ${qrtype == 'static' ? query.merchant_name : query.Merchant.merchant_name}`,
                transaction_time: Math.floor(date.getTime() / 1000)
            }, {
                transaction: t
            })

            await t.commit()
            return res.status(200).json({
                message: 'Transaction Success',
                data: {
                    amount: tx.amount,
                    fee,
                    id: tx.id,
                    transaction_time: tx.transaction_time
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

const history = async (req, res) => {
    try {
        let history = JSON.parse(JSON.stringify(await Transaction.findAll({
            attributes: [
                [
                    sequelize.fn(
                        'FROM_UNIXTIME',
                        sequelize.col('transaction_time'),
                        '%Y-%m-%d'
                    ),
                    'transaction_date',
                ],
                [
                    sequelize.fn('date', sequelize.col('createdAt')), 'createdAt'
                ]
            ],
            where: {
                cust_id: req.customer.id
            },
            group: ['createdAt'],
        })))

        let transactionHistory = history.map((t) => ({
            Date: t.transaction_date,

            Transactions: []
        }))

        for (const entry of transactionHistory) {
            const date = entry.Date
            const transactionsOnDate = await Transaction.findAll({
                attributes: [
                    'id',
                    'amount',
                    'fee',
                    'action',
                    'transaction_time'
                ],
                where: {
                    [Sequelize.Op.and]: [
                        sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m-%d') = '${date}'`),
                        { cust_id: req.customer.id },
                    ],
                }
            })
            entry.Transactions = transactionsOnDate;
        }

        return res.status(200).json({
            data: transactionHistory
        })
    } catch (error) {
        writeErrorLog('Transaction history', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

module.exports = {
    payment,
    QRScan,
    history
}