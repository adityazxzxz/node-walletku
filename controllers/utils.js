const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const path = require('path')
const fs = require('fs');
const { encrypt, decrypt, hashPassword, verifyPassword } = require('../helpers/encrypt')
const { Province, City, District } = require('../models/index')

const getProvince = async (req, res) => {
    try {
        let province = await Province.findAll({
            attributes: [['id', 'key'], ['prov_name', 'value']]
        })
        return res.status(200).json({
            data: province
        })
    } catch (error) {
        writeErrorLog('Province', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const getCity = async (req, res) => {
    try {
        let { prov_id } = req.params
        let city = await City.findAll({
            where: {
                prov_id
            }
        })
        return res.status(200).json({
            data: city
        })
    } catch (error) {
        writeErrorLog('City', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const getDistrict = async (req, res) => {
    try {
        let { city_id } = req.params
        let district = await District.findAll({
            where: {
                city_id
            }
        })
        return res.status(200).json({
            data: district
        })
    } catch (error) {
        writeErrorLog('District', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

module.exports = {
    getProvince,
    getCity,
    getDistrict
}