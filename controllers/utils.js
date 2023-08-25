const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const path = require('path')
const fs = require('fs');
const { encrypt, decrypt, hashPassword, verifyPassword } = require('../helpers/encrypt')
const { Province, City, District, Postal, sequelize } = require('../models/index');

const getProvince = async (req, res) => {
    try {
        let province = await Province.findAll({
            attributes: [['province_code', 'key'], ['province_name', 'value']]
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

const getPostal = async (req, res) => {
    try {
        const { province_code } = req.params
        let postal = await Postal.findAll({
            // attributes: [['id', 'key'], [sequelize.literal(`CONCAT(city, '-', urban, '-', sub_district ,'-',postal_code)`), 'value']],
            where: {
                province_code
            }
        })
        return res.status(200).json({
            data: postal
        })
    } catch (error) {
        writeErrorLog('Postal', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const getCity = async (req, res) => {
    try {
        let { prov_id } = req.params
        let city = await City.findAll({
            attributes: [['id', 'key'], ['city_name', 'value']],
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
            attributes: [['id', 'key'], ['dis_name', 'value']],
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
    getDistrict,
    getPostal
}