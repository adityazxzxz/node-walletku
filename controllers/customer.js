const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { Customer } = require('../models/index')

const updatePersonal = async (req, res) => {
    try {
        let { fullname, email, plat_no, province, city, zipcode, address, emergency_name, emergency_phone } = req.body
        let cust = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                id: req.customer.id,
                status: 0
            }
        })))
        await Customer.update({
            fullname,
            email,
            plat_no,
            province,
            city,
            zipcode,
            address,
            emergency_name,
            emergency_phone,
            status: 1
        }, {
            where: {
                id: req.customer.id
            }
        })

        return res.status(200).json({
            message: 'Personal data has been updated'
        })
    } catch (error) {
        writeErrorLog('Personal Data', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}


const uploadImage = async (req, res) => {
    try {
        const fileCount = Object.keys(req.files).length;
        if (fileCount != 2) {
            if (req.files) {
                Object.values(req.files).forEach(files => {
                    files.forEach(file => {
                        fs.unlinkSync(file.path);
                    });
                });
            }
            return res.status(400).json({ message: 'Id card or selfie image not found' })
        }

        let customer = await Customer.findOne({
            where: {
                id: req.customer.id,
                status: 0
            }
        })
        if (!customer) {
            if (req.files) {
                Object.values(req.files).forEach(files => {
                    files.forEach(file => {
                        fs.unlinkSync(file.path);
                    });
                });
            }
            return res.status(401).json({
                message: 'Customer already request'
            })
        }

        console.log(req.files.selfie)

        customer.selfie_image = req.files.selfie[0].filename
        customer.id_card_image = req.files.id_card[0].filename
        customer.status = 1

        await customer.save()

        return res.status(200).json({ message: 'Upload succeed' });
    } catch (error) {
        writeErrorLog('Upload Error', error)
        return res.status(500).json({ message: 'Internal Error' });
    }
};

module.exports = {
    uploadImage,
    updatePersonal
}