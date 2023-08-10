const argon2 = require('argon2');
const logger = require('./logger')

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

module.exports = {
    hashPassword,
    verifyPassword
}