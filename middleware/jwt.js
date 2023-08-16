const jwt = require('jsonwebtoken');
const { writeErrorLog } = require('../helpers/logger')
const { decrypt } = require('../helpers/encrypt')
const jwtKey = process.env.JWT_KEY || 'secretKey'

const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    try {
        const tokenString = token.split(' ')
        const decoded = jwt.verify(tokenString[1], jwtKey); // Ganti 'secretKey' dengan kunci rahasia yang sama
        req.customer = JSON.parse(decrypt(decoded.data));
        next();
    } catch (error) {
        writeErrorLog('Jwt Verification', error)
        return res.status(403).json({ message: 'Invalid token' });
    }
}

const signToken = async (payload) => {
    try {
        const minutes = 5 // in minutes
        const expiresIn = Math.floor(Date.now() / 1000) + (60 * minutes)
        const accessToken = jwt.sign({ data: payload }, jwtKey, { expiresIn });
        const refreshToken = jwt.sign({ data: payload }, jwtKey);
        return { exp: expiresIn, accessToken, refreshToken }
    } catch (error) {
        return error
    }
}

module.exports = { verifyToken, signToken }