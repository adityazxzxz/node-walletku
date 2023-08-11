const { body, checkSchema, param, query, validationResult, check } = require('express-validator')
const { decryptPin } = require('../helpers/encrypt')

// Start Register Validator
const register = () => {
    return [
        body('email').isEmail(),
        body('pin').custom(async value => {
            if (decryptPin(value).length < 6)
                throw new Error('Pin must be 6 digits')
        }),
        body('fullname').isLength({ min: 1 }).withMessage(' is empty'),
        body('id_card').isLength({ min: 16 }).withMessage('must min 16 digits'),
        body('phone').isLength({ min: 11 }).withMessage('must min 11 digits')
    ]
}

const otp = () => {
    return [
        body('otp').custom(async value => {
            if (decryptPin(value).length < 6)
                throw new Error('OTP must be 6 digits')
        }),
    ]
}

// Start Login Validator
const login = () => {
    return [
        body('phone').isNumeric(),
    ]
}

const pin = () => {
    return [
        body('pin')
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }

    const extractedError = []
    errors.array().map(err => {
        extractedError.push(`${err.path} ${err.msg.toLowerCase()}`)
    })

    return res.status(400).json({
        message: extractedError
    })
}

module.exports = {
    validate,
    register,
    login,
    otp
}