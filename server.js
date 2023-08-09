require('dotenv').config()
const http = require('http')
const path = require('path')
const rfs = require('rotating-file-stream')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const router = require('./routes/index.js')
const port = process.env.APP_PORT || 8000
const app = express()

var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
})


morgan.token('date', (req, res, tz) => {
    return new Date().toLocaleString()
})

morgan.format('myformat', '[:date] ":method :url" :status :remote-addr - :remote-user :user-agent :res[content-length] - :response-time ms');

app.use(morgan('myformat', { stream: accessLogStream }))
app.use(cors())
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', router)

var httpServer = http.createServer(app);
httpServer.listen(port, () => {
    console.log(`HTTP Server running port ${port}`)
});

module.exports = app