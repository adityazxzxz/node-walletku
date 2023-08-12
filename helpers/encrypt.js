const argon2 = require('argon2');
const { writeErrorLog } = require('./logger');
const CryptoJS = require('crypto-js');

const key = process.env.ENCRYPT_KEY

// Contoh fungsi untuk meng-hash password
const hashPassword = async (password) => {
    try {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    } catch (error) {
        writeErrorLog("Error hashing :", error)
        throw error;
    }
}

// Contoh fungsi untuk memeriksa password
const verifyPassword = async (hashedPassword, password) => {
    try {
        const isPasswordValid = await argon2.verify(hashedPassword, password);
        return isPasswordValid;
    } catch (error) {
        writeErrorLog("Error verify hash :", error)
        throw error;
    }
}

const encryptPin = (pin) => {
    const encryptedPin = CryptoJS.AES.encrypt(pin, key).toString();
    return encryptedPin;
};

const decryptPin = (encryptedPin) => {
    const decryptedPin = CryptoJS.AES.decrypt(encryptedPin, key).toString(CryptoJS.enc.Utf8);
    return decryptedPin
}

module.exports = {
    hashPassword,
    verifyPassword,
    encryptPin,
    decryptPin
}