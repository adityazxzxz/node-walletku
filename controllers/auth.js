require('dotenv').config()
const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const { encrypt, decrypt, hashPassword, verifyPassword } = require('../helpers/encrypt')
const { randomNumber } = require('../helpers/utils')
const { signToken } = require('../middleware/jwt')
const { Customer, Sequelize } = require('../models/index')
let periodExpOTP = process.env.OTP_EXP || 1800 // sec

const phoneRegister = async (req, res) => {
    try {
        let otp_generate = randomNumber(6).toString()
        let { phone, password } = req.body
        password = decrypt(password)
        let cust = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                phone,
            }
        })))
        if (cust) {
            if (cust.status == 0) {
                await Customer.update({
                    otp: await hashPassword(otp_generate),
                    otp_exp: Math.floor(Date.now() / 1000) + parseInt(periodExpOTP)
                }, {
                    where: {
                        id: cust.id
                    }
                })
                writeInfoLog('Sent OTP', `Sent to ${phone} ${process.env.NODE_ENV !== 'production' ? otp_generate + ' ' + encrypt(otp_generate) : ''}`)
                return res.status(200).json({
                    message: 'Otp Sent'
                })
            } else if (cust.status >= 1) {
                return res.status(200).json({
                    message: 'User already exist'
                })
            }
        }

        let dataOTP = await hashPassword(otp_generate)
        let dataPassword = await hashPassword(password)

        await Customer.create({
            phone,
            password: dataPassword,
            status: 0,
            otp: dataOTP,
            otp_exp: Math.floor(Date.now() / 1000) + parseInt(periodExpOTP)
        })
        writeInfoLog(`Register new customer`, req.body.phone)
        writeInfoLog('Sent OTP', `Sent to ${req.body.phone} ${process.env.NODE_ENV !== 'production' ? otp_generate + ' ' + encrypt(otp_generate) : ''}`)
        return res.status(200).json({
            message: 'OTP code will send to your phone number',
        })
    } catch (error) {
        writeErrorLog('Phone Register Error :', error)
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
                status: 0,
                otp: {
                    [Sequelize.Op.not]: null
                }
            }
        })))
        if (!cust) {
            return res.status(404).json({
                message: 'Customer not registered'
            })
        }


        if (cust.otp_exp < Math.floor(Date.now() / 1000)) {
            let otp_generate = randomNumber(6).toString()
            await Customer.update({
                otp: await hashPassword(otp_generate),
                otp_exp: Math.floor(Date.now() / 1000) + parseInt(periodExpOTP)
            }, {
                where: {
                    id: cust.id
                }
            })

            // resend otp

            return res.status(400).json({
                message: 'OTP expired',
            })
        }

        const verifyotp = await verifyPassword(cust.otp, decrypt(req.body.otp))

        if (!verifyotp) {
            return res.status(401).json({
                message: 'OTP invalid'
            })
        }

        const payload = JSON.stringify({
            id: cust.id,
            phone: cust.phone,
            status: cust.status
        })

        await Customer.update({
            otp: null,
            otp_exp: null
        }, {
            where: {
                id: cust.id
            }
        })

        const { exp, accessToken, refreshToken } = await signToken(encrypt(payload))
        return res.status(200).json({
            exp,
            accessToken,
            refreshToken
        })
    } catch (error) {
        writeErrorLog('Otp verify', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const login = async (req, res) => {
    const { phone, password } = req.body
    try {
        const cust = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                phone
            }
        })))
        if (!cust) {
            return res.status(404).json({
                message: 'phone or password invalid'
            })
        }

        const checkPassword = await verifyPassword(cust.password, decrypt(password))
        if (!checkPassword) {
            return res.status(401).json({
                message: 'phone or password invalid'
            })
        }
        const payload = JSON.stringify({
            id: cust.id,
            phone: cust.phone,
            fullname: cust.fullname,
            status: cust.status
        })

        const { exp, accessToken, refreshToken } = await signToken(encrypt(payload))
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




const register = async (req, res) => {
    try {
        let otp_generate = randomNumber(6).toString()
        let password = decrypt(req.body.password)
        let pin = decrypt(req.body.pin)

        let cust = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                phone: req.body.phone
            }
        })))
        if (cust) {
            if (cust.status < 1) {
                return res.status(401).json({
                    message: 'Phone already registered, please try another phone number'
                })
            } else {
                // send otp because user not active. status = 0
                let { otp_generate, otp_encrypted } = await sendOtp(cust)
                writeInfoLog('Sent OTP', `Sent to ${cust.phone} ${process.env.NODE_ENV !== 'production' ? otp_generate + ' ' + otp_encrypted : ''}`)
                return res.status(200).json({
                    message: 'Otp Sent'
                })
            }

        }

        let dataPin = await hashPassword(pin)
        let dataOTP = await hashPassword(otp_generate)
        let dataPassword = await hashPassword(password)

        await Customer.create({
            ...req.body,
            password: dataPassword,
            pin: dataPin,
            status: 0,
            otp: dataOTP,
            otp_exp: Math.floor(Date.now() / 1000) + parseInt(periodExpOTP)
        })

        // send otp
        writeInfoLog(`Register new customer`, req.body.phone)
        writeInfoLog('Sent OTP', `Sent to ${req.body.phone} ${process.env.NODE_ENV !== 'production' ? otp_generate + ' ' + encrypt(otp_generate) : ''}`)
        return res.status(200).json({
            message: 'OTP code will send to your phone number',
        })
    } catch (error) {
        writeErrorLog('Register Error :', error)
        return res.status(500).json({
            message: 'Internal Server Error',
            errcode: '001'
        })
    }
}



const sendOtp = (customer) => {
    return new Promise(async (resolve, reject) => {
        try {
            let otp_generate = randomNumber(6).toString()
            let otp_encrypted = encrypt(otp_generate)
            let otp_expired = Math.floor(Date.now() / 1000) + parseInt(periodExpOTP)
            let result = await Customer.update({
                otp: await hashPassword(otp_generate),
                otp_exp: otp_expired
            }, {
                where: {
                    id: customer.id
                }
            })
            resolve({ otp_generate, otp_encrypted, otp_expired, result })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    login,
    phoneRegister,
    register,
    otpRegister
}