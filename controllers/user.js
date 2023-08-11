const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const { encryptPin, decryptPin } = require('../helpers/encrypt')

const getProfile = async (req, res) => {
    return res.status(200).json({
        api: '/api/user'
    })
}

const encrypt = async (req, res) => {
    try {
        const pin = encryptPin(req.body.pin)
        console.log(req.body)
        return res.status(200).json({
            pin: req.body.pin,
            ecnryptPin: pin
        })
    } catch (error) {
        return res.status(500).json({
            msg: error
        })
    }
}

const decrypt = async (req, res) => {
    try {
        const pin = await decryptPin(req.body.pin, 'susuultra')
        return res.status(200).json({
            encryptPin: req.body.pin,
            pin: pin
        })
    } catch (error) {
        return res.status(500).json({
            msg: error
        })
    }
}

module.exports = {
    getProfile,
    encrypt,
    decrypt
}