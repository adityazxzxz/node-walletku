const { writeInfoLog, writeErrorLog } = require('../helpers/logger')
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { encrypt, decrypt, hashPassword, verifyPassword } = require('../helpers/encrypt')
const { Customer, Transaction, Sequelize } = require('../models/index')
const upload = require('../middleware/upload')

const changePin = async (req, res) => {
    try {
        let { old_pin, new_pin } = req.body

        let cust = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                id: req.customer.id
            }
        })))

        if (!cust) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const checkPin = await verifyPassword(cust.pin, decrypt(old_pin))
        if (!checkPin) {
            return res.status(401).json({
                message: 'old PIN invalid'
            })
        }

        let data_pin = await hashPassword(new_pin)

        await Customer.update({
            pin: data_pin
        })

        return res.status(200).json({
            message: 'PIN has been updated'
        })

    } catch (error) {
        writeErrorLog('Change PIN', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const changePassword = async (req, res) => {
    try {
        let { old_password, new_password } = req.body

        let cust = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                id: req.customer.id
            }
        })))

        if (!cust) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const checkPassword = await verifyPassword(cust.password, decrypt(old_password))
        if (!checkPassword) {
            return res.status(401).json({
                message: 'old password invalid'
            })
        }

        let data_password = await hashPassword(decrypt(new_password))

        await Customer.update({
            password: data_password
        }, {
            where: {
                id: req.customer.id
            }
        })

        return res.status(200).json({
            message: 'Password has been updated'
        })

    } catch (error) {
        writeErrorLog('Change password', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}


const getProfile = async (req, res) => {
    try {
        let cust = JSON.parse(JSON.stringify(await Customer.findOne({
            attributes: [
                'fullname',
                'email',
                'birthdate',
                'avatar',
                'address',
                'province',
                'city',
                'district',
                'address',
                'zipcode',
                'plat_no',
                'balance'
            ],
            where: {
                id: req.customer.id
            }
        })))

        if (!cust) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        return res.status(200).json({
            data: cust
        })
    } catch (error) {
        writeErrorLog('Get profile', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const getLimit = async (req, res) => {
    try {
        let cust = JSON.parse(JSON.stringify(
            await Customer.findOne({
                where: {
                    id: req.customer.id
                }
            })
        ))

        if (!cust) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        let date = new Date()
        let firstDayofMonth = new Date(date.getFullYear(), date.getMonth(), 1).getTime() / 1000
        let lastDayofMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime() / 1000


        let tx = JSON.parse(JSON.stringify(
            await Transaction.findAll({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount'],
                    [Sequelize.fn('SUM', Sequelize.col('fee')), 'total_fee'],
                ],
                where: {
                    cust_id: req.customer.id,
                    transaction_time: {
                        [Sequelize.Op.between]: [firstDayofMonth, lastDayofMonth]
                    }
                }
            })
        ))
        return res.status(200).json({
            balance: cust.balance,
            limit: cust.limit,
            used_amount: parseInt(tx[0].total_amount) + parseInt(tx[0].total_fee)
        })
    } catch (error) {
        writeErrorLog('Get customer limit', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const checkKTP = async (req, res) => {
    try {
        let cust = await Customer.findOne({
            where: {
                id_card: req.body.id_card
            }
        })
        if (cust) {
            return res.status(409).json({
                message: 'KTP already exist'
            })
        } else {
            return res.status(200).json({
                message: 'KTP available'
            })
        }
    } catch (error) {
        writeErrorLog('Check KTP', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const checkSTNK = async (req, res) => {
    try {
        let cust = await Customer.findOne({
            where: {
                stnk_name: req.body.stnk_name.toUpperCase().trim()
            }
        })
        if (cust) {
            return res.status(409).json({
                message: 'STNK name already exist'
            })
        } else {
            return res.status(200).json({
                message: 'STNK name available'
            })
        }
    } catch (error) {
        writeErrorLog('Check STNK', error)
        return res.status(500).json({
            message: 'Internal Error'
        })
    }
}

const updatePersonal = async (req, res) => {
    try {
        let {
            fullname,
            email,
            plat_no,
            province,
            city,
            zipcode,
            address,
            emergency_name,
            emergency_phone,
            pin,
            district,
            sub_district,
            id_card,
            stnk_name
        } = req.body

        if (stnk_name.toUpperCase().trim() !== fullname.toUpperCase().trim()) {
            return res.status(409).json({
                message: 'Fullname and STNK name not match'
            })
        }

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

        let checkCustomer = JSON.parse(JSON.stringify(await Customer.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { id_card },
                    { stnk_name }
                ]
            }
        })))

        if (checkCustomer) {
            if (checkCustomer.id_card === id_card) {
                return res.status(409).json({
                    message: 'KTP already registered'
                })
            } else if (checkCustomer.stnk_name === stnk_name) {
                return res.status(409).json({
                    message: 'STNK name already registered'
                })
            }
        }

        await Customer.update({
            fullname: fullname.toUpperCase().trim(),
            id_card,
            email,
            plat_no,
            stnk_name: stnk_name.toUpperCase().trim(),
            province,
            city,
            district,
            sub_district,
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

const updateProfile = async (req, res) => {
    try {
        const { avatar, fullname, emergency_name, emergency_phone } = req.body
        const cust = await Customer.update({
            fullname,
            emergency_name,
            emergency_phone
        }, {
            where: {
                id: req.customer.id
            }
        })

        return res.status(200).json({
            message: 'Data has been updated'
        })
    } catch (error) {
        writeErrorLog('Update profile', error)
        return res.status(200).json({
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
            return res.status(409).json({
                message: 'Customer already request'
            })
        }

        customer.selfie_image = req.files.selfie[0].filename
        customer.id_card_image = req.files.id_card[0].filename
        customer.bpkb_image = req.files.bpkb[0].filename
        customer.status = 2
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
            return res.status(409).json({
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
            return res.status(409).json({
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
            return res.status(409).json({
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
    uploadSelfie,
    checkKTP,
    checkSTNK,
    changePin,
    changePassword,
    getProfile,
    updateProfile,
    getLimit
}