const { encrypt: encryptFunc, decrypt: decryptFunc } = require('../helpers/encrypt')


const encrypt = async (req, res) => {
    try {
        const pin = encryptFunc(req.body.pin)
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
        const pin = await decryptFunc(req.body.pin)
        return res.status(200).json({
            encrypt: req.body.pin,
            pin: pin
        })
    } catch (error) {
        return res.status(500).json({
            msg: error
        })
    }
}

module.exports = {
    encrypt,
    decrypt
}