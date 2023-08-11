const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// Fungsi untuk menulis log informasi
function writeInfoLog(description, message) {
    const logMessage = `[INFO][${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] ${description} - ${message}\n`;
    writeLog('info.log', logMessage);
}

// Fungsi untuk menulis log kesalahan
function writeErrorLog(description, error) {
    const logMessage = `[ERROR][${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] ${description} - ${error} ${error.stack}\n`;
    writeLog('error.log', logMessage);
}

// Fungsi utama untuk menulis log ke file
function writeLog(fileName, logMessage) {
    const logFilePath = path.join(__basedir + '/logs/', fileName);

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error(`Error writing ${fileName}:`, err);
        }
    });
}

module.exports = {
    writeInfoLog,
    writeErrorLog,
};