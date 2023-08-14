const { body, checkSchema, param, query, validationResult, check } = require('express-validator')
const { decrypt } = require('../helpers/encrypt')

// Start Register Validator
const register = () => {
    return [
        body('email').isEmail(),
        body('pin').custom(async value => {
            if (value.length < 1 || decrypt(value).length < 6)
                throw new Error('must be 6 digits')
        }),
        body('password').custom(async value => {
            if (value.length < 1 || decrypt(value).length < 6)
                throw new Error('Password must be more than 6 digits')
        }),
        body('fullname').isLength({ min: 1 }).withMessage(' is empty'),
        body('id_card').isLength({ min: 16 }).withMessage('must min 16 digits'),
        body('phone').isLength({ min: 11 }).withMessage('must min 11 digits')
    ]
}

const otp = () => {
    return [
        body('otp').custom(async value => {
            if (decrypt(value).length < 6)
                throw new Error('OTP must be 6 digits')
        }),
    ]
}

// Start Login Validator
const login = () => {
    return [
        body('phone').isNumeric().withMessage('Must be a number'),
        body('password').custom(async value => {
            if (typeof value == 'undefined' || value.length < 1 || decrypt(value).length < 1)
                throw new Error('Password not be empty')
            if (decrypt(value).length < 8)
                throw new Error('Password must be min 8 char')
        }),
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