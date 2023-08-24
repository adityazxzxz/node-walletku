const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { encrypt, decrypt, hashPassword, verifyPassword } = require('../helpers/encrypt')
const { Customer } = require('../models/index')
const upload = require('../middleware/upload')

const updatePersonal = async (req, res) => {
    try {
        let { fullname, email, plat_no, province, city, zipcode, address, emergency_name, emergency_phone, pin } = req.body
        pin = await hashPassword(decrypt(pin))
        let cust = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                id: req.customer.id,
                status: 0
            }
        })))
        if (!cust) {
            return res.status(404).json({
                message: 'User not found or already save personal data'
            })
        }
        await Customer.update({
            fullname,
            email,
            plat_no,
            province,
            city,
            pin,
            zipcode,
            address,
            emergency_name,
            emergency_phone,
            status: 1,
            is_complete_profile: 1
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
        if (fileCount != 3) {
            if (req.files) {
                Object.values(req.files).forEach(files => {
                    files.forEach(file => {
                        fs.unlinkSync(file.path);
                    });
                });
            }
            return res.status(400).json({ message: 'Id card, selfie or bpkb image not found' })
        }

        let customer = await Customer.findOne({
            where: {
                id: req.customer.id,
                status: 1
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

        customer.selfie_image = req.files.selfie[0].filename
        customer.id_card_image = req.files.id_card[0].filename
        customer.bpkb_image = req.files.bpkb[0].filename
        customer.status = 1
        customer.is_complete_document = 1

        await customer.save()

        return res.status(200).json({ message: 'Upload succeed' });
    } catch (error) {
        writeErrorLog('Upload Error', error)
        return res.status(500).json({ message: 'Internal Error' });
    }
};

const uploadKtp = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'image not provide' })
        }
        let customer = await Customer.findOne({
            where: {
                id: req.customer.id,
                status: 1
            }
        })
        if (!customer) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(401).json({
                message: 'Customer already request'
            })
        }

        customer.id_card_image = req.file.filename

        await customer.save()

        return res.status(200).json({ message: 'Upload KTP succeed' });
    } catch (error) {
        writeErrorLog('Upload Error', error)
        return res.status(500).json({ message: 'Internal Error' });
    }
};

const uploadBpkb = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'image not provide' })
        }
        let customer = await Customer.findOne({
            where: {
                id: req.customer.id,
                status: 1
            }
        })
        if (!customer) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(401).json({
                message: 'Customer already request'
            })
        }

        customer.id_card_image = req.file.filename

        await customer.save()

        return res.status(200).json({ message: 'Upload KTP succeed' });
    } catch (error) {
        writeErrorLog('Upload Error', error)
        return res.status(500).json({ message: 'Internal Error' });
    }
};

const uploadSelfie = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'image not provide' })
        }
        let customer = await Customer.findOne({
            where: {
                id: req.customer.id,
                status: 1
            }
        })
        if (!customer) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(401).json({
                message: 'Customer already request'
            })
        }

        customer.id_card_image = req.file.filename

        await customer.save()

        return res.status(200).json({ message: 'Upload KTP succeed' });
    } catch (error) {
        writeErrorLog('Upload Error', error)
        return res.status(500).json({ message: 'Internal Error' });
    }
};

module.exports = {
    uploadImage,
    updatePersonal,
    uploadKtp,
    uploadBpkb,
    uploadSelfie
}