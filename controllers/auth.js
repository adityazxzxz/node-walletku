require('dotenv').config()
const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const { encryptPin, decryptPin } = require('../helpers/encrypt')
const { randomNumber } = require('../helpers/utils')
const { Customer } = require('../models/index')

let periodExpOTP = process.env.OTP_EXP || 1800 // sec

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
            otp,
            otp_exp: Math.floor(Date.now() / 1000) + parseInt(periodExpOTP)
        })

        // send otp

        return res.status(200).json({
            message: 'OTP code will send to your phone number',
            ...(process.env.NODE_ENV !== 'production' ? {
                devMode: {
                    msg: 'Only for test and development',
                    otp: otpraw,
                    otp_encrypted: otp
                }
            } : null)
        })
    } catch (error) {
        writeErrorLog('Register Error :', error)
        return res.status(500).json({
            message: 'Internal Server Error',
            errcode: '001'
        })
    }
}

const otpRegister = async (req, res) => {
    try {
        const cust = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                phone: req.body.phone,
                otp: req.body.otp,
                status: 0
            }
        })))
        if (!cust) {
            return res.status(404).json({
                message: 'Customer not registered'
            })
        }



        if (cust.otp_exp < Math.floor(Date.now() / 1000)) {

            // resend otp

            let otpraw = randomNumber(6).toString()
            let otp = encryptPin(otpraw)
            await Customer.update({
                otp,
                otp_exp: Math.floor(Date.now() / 1000) + parseInt(periodExpOTP)
            }, {
                where: {
                    id: cust.id
                }
            })

            return res.status(400).json({
                message: 'OTP expired',
                ...(process.env.NODE_ENV !== 'production' ? {
                    devMode: {
                        msg: 'New OTP Only for test and development',
                        otp: otpraw,
                        otp_encrypted: otp,
                    }
                } : null)
            })
        }

        await Customer.update({
            status: 1,
            otp: null,
            otp_exp: null
        }, {
            where: {
                id: cust.id
            }
        })

        return res.status(200).json({
            cust
        })
    } catch (error) {
        writeErrorLog('Otp verify', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

module.exports = {
    login,
    register,
    otpRegister
}