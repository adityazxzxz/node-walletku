const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const getProfile = async (req, res) => {
    return res.status(200).json({
        api: '/api/user'
    })
}


module.exports = {
    getProfile
}