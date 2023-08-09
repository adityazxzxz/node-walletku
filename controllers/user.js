const { writeInfoLog, writeErrorLog } = require('../helpers/logger')

const getProfile = async (req, res) => {
    writeInfoLog("Info from get user", "This info message")
    writeErrorLog("Error from get user", new Error("This error message"))
    return res.status(200).json({
        api: '/api/user'
    })
}

module.exports = {
    getProfile
}