const { body, checkSchema, param, query, validationResult, check } = require('express-validator')
const { decrypt } = require('../helpers/encrypt')

// Start Register Validator
const phoneRegister = () => {
    return [
        body('password').custom(async value => {
            if (typeof value == 'undefined' || value.length < 1 || decrypt(value).length < 1)
                throw new Error('not be empty')
            if (decrypt(value).length < 8)
                throw new Error('must be min 8 char')
        }),
        body('phone').isLength({ min: 11 }).withMessage('must min 11 digits').isMobilePhone('id-ID')
            .withMessage('invalid number format')
            .custom(value => {
                // Cek apakah nomor HP dimulai dengan '08'
                if (!value.startsWith('08')) {
                    throw new Error('invalid number format');
                }
                return true;
            })
    ]
}

const personalData = () => {
    return [
        body('fullname').notEmpty().withMessage('not be empty'),
        body('id_card').notEmpty().withMessage('not be empty').isNumeric().withMessage('must be numeric'),
        body('email').notEmpty().withMessage('not be empty'),
        body('plat_no').notEmpty().withMessage('not be empty'),
        body('stnk_name').notEmpty().withMessage('not be empty'),
        body('province').notEmpty().withMessage('not be empty'),
        body('city').notEmpty().withMessage('not be empty'),
        body('zipcode').notEmpty().withMessage('not be empty'),
        body('address').notEmpty().withMessage('not be empty'),
        body('emergency_name').notEmpty().withMessage('not be empty'),
        body('emergency_phone').notEmpty().withMessage('not be empty').isNumeric().withMessage('must be numeric')
    ]
}

const ktpValidator = () => {
    return [
        body('id_card').notEmpty().withMessage('not be empty').isNumeric().withMessage('must be numeric'),
    ]
}

const stnkNameValidator = () => {
    return [
        body('stnk_name').notEmpty().withMessage('not be empty'),
    ]
}

const register = () => {
    return [
        body('email').isEmail(),
        body('pin').custom(async value => {
            if (value.length < 1 || decrypt(value).length < 6)
                throw new Error('must be 6 digits')
        }),
        body('password').custom(async value => {
            if (typeof value == 'undefined' || value.length < 1 || decrypt(value).length < 6)
                throw new Error('must be more than 6 digits')
        }),
        body('fullname').isLength({ min: 1 }).withMessage(' is empty'),
        body('stnk_name').isLength({ min: 1 }).withMessage(' is empty'),
        body('id_card').isLength({ min: 16 }).withMessage('must min 16 digits'),
        body('phone').isLength({ min: 11 }).withMessage('must min 11 digits').isMobilePhone('id-ID')
            .withMessage('invalid number format')
            .custom(value => {
                // Cek apakah nomor HP dimulai dengan '08'
                if (!value.startsWith('08')) {
                    throw new Error('invalid number format');
                }
                return true;
            })
    ]
}

const otp = () => {
    return [
        body('otp').custom(async value => {
            if (typeof value == 'undefined' || decrypt(value).length < 6)
                throw new Error('must be 6 digits')
        }),
        body('phone').isLength({ min: 11 }).withMessage('must min 11 digits').isMobilePhone('id-ID')
            .withMessage('invalid number format')
            .custom(value => {
                // Cek apakah nomor HP dimulai dengan '08'
                if (!value.startsWith('08')) {
                    throw new Error('invalid number format');
                }
                return true;
            })
    ]
}

// Start Login Validator
const login = () => {
    return [
        body('phone').isNumeric().withMessage('Must be a number'),
        body('password').custom(async value => {
            if (typeof value == 'undefined' || value.length < 1 || decrypt(value).length < 1)
                throw new Error('not be empty')
            if (decrypt(value).length < 8)
                throw new Error('must be min 8 char')
        }),
    ]
}

const changePassword = () => {
    return [
        body('new_password').custom(async value => {
            if (typeof value == 'undefined' || value.length < 1 || decrypt(value).length < 1)
                throw new Error('not be empty')
            if (decrypt(value).length < 8)
                throw new Error('must be min 8 char')
        }),
        body('old_password').custom(async value => {
            if (typeof value == 'undefined' || value.length < 1 || decrypt(value).length < 1)
                throw new Error('not be empty')
            if (decrypt(value).length < 8)
                throw new Error('must be min 8 char')
        })
    ]
}

const checkqr = () => {
    return [
        body('code').notEmpty().withMessage('not be empty')
    ]
}

const payment = () => {
    const allowedType = ['00', '01']
    return [
        body('code').notEmpty().withMessage('not be empty'),
        body('amount').notEmpty().withMessage('not be empty').isNumeric().withMessage('must be numeric'),
        body('type').notEmpty().custom((value) => {
            if (!allowedType.includes(value)) {
                throw new Error('must be 00 for static or 01 for dynamic');
            }
            return true;
        }),
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
    phoneRegister,
    changePassword,
    login,
    otp,
    personalData,
    ktpValidator,
    stnkNameValidator,
    checkqr,
    payment
}