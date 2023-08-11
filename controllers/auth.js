const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const { encryptPin, decryptPin } = require('../helpers/encrypt')
const { randomNumber } = require('../helpers/utils')
const { Customer } = require('../models/index')
const login = async (req, res) => {
    return res.status(200).json({
        api: '/api/user'
    })
}


const register = async (req, res) => {
    try {
        let otpraw = randomNumber(6).toString()
        let otp = encryptPin(otpraw)
        await Customer.create({
            ...req.body,
            status: 0,
            otp
        })

        // send otp

        return res.status(200).json({
            message: 'OTP code will send to your phone number',
            ...(process.env.NODE_ENV !== 'production' ? { otp: otpraw, otpenc: otp, msg: 'Only for test and development' } : null)
        })
    } catch (error) {
        writeErrorLog('Register Error :', error)
        return res.status(500).json({
            message: 'Internal Server Error',
            errcode: '001'
        })
    }
}

const otp = async (req, res) => {
    try {
        const cust = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                otp: req.body.otp
            }
        })))
        return res.status(200).json({
            cust
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

module.exports = {
    login,
    register,
    otp
}