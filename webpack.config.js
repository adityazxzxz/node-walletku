const path = require('path');

module.exports = {
    mode: 'production',
    entry: './server.js',
    externals: { 'sqlite3': 'commonjs sqlite3' },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'final.js',
        libraryTarget: 'commonjs2'
    },
    target: 'node',
};