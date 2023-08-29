const { writeErrorLog } = require("../helpers/logger")
const { Customer, Merchant, sequelize, Transaction, Sequelize } = require("../models")

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
    payment
}