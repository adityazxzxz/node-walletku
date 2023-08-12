const jwt = require('jsonwebtoken');
const { writeErrorLog } = require('../helpers/logger')

const verifyToken = async (req, res) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    try {
        const decoded = jwt.verify(token, 'secretKey'); // Ganti 'secretKey' dengan kunci rahasia yang sama
        req.user = decoded;
        next();
    } catch (error) {
        writeErrorLog('Jwt Verification', error)
        return res.status(403).json({ message: 'Invalid token' });
    }
}

module.exports = { verifyToken }