const { Router } = require('express')
const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const router = Router()

router.get('/', (req, res) => {
    writeInfoLog("Info from get user", "This info message")
    writeErrorLog("Error from get user", new Error("This error message"))
    return res.status(200).json({
        api: "/user"
    })
})

module.exports = router