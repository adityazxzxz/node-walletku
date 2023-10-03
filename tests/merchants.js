const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const util = require('util')
const jwt_decode = require('jwt-decode')
const { decrypt } = require('../helpers/encrypt')

chai.use(chaiHttp)
chai.should()
let response, otp1, otp2, otp3, merchant1, user2, user3

describe("Merchant", () => {
    it("Register merchant", (done) => {
        chai.request(app)
            .post('/api/v1/merchant/register')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398494",
                "password": "U2FsdGVkX1/CzVPjqA0CI+8iHTdzJgcF5Kgc5IsHE6U=",
                "pic_name": "Mr Baby",
                "id_card": "123456789",
                "bank_account": "BCA",
                "bank_account_nmumber": "1234567890",
                "merchant_name": "Ramen Kakek Jepang Gading Serpong",
                "long": "12345",
                "lat": "12345"
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

    it("Login merchant", (done) => {
        chai.request(app)
            .post('/api/v1/merchant/login')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398494",
                "password": "U2FsdGVkX1/CzVPjqA0CI+8iHTdzJgcF5Kgc5IsHE6U="
            })
            .end((err, res) => {
                merchant1 = res.body
                let decoded = JSON.parse(decrypt(jwt_decode(res.body.accessToken).data))
                response = decoded
                decoded.should.have.property('phone').that.equal('081283398494')
                done()
            })
    })

    it("Change password merchant", (done) => {
        chai.request(app)
            .put('/api/v1/merchant/password')
            .set({
                Authorization: 'Bearer ' + merchant1.accessToken
            })
            .send({
                "new_password": "U2FsdGVkX1/ET3Nnx8u16AtNdYhdz+NQS0+HE6Os6V0=",
                "old_password": "U2FsdGVkX1/CzVPjqA0CI+8iHTdzJgcF5Kgc5IsHE6U="
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

    it("Login merchant new password", (done) => {
        chai.request(app)
            .post('/api/v1/merchant/login')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398494",
                "password": "U2FsdGVkX1/ET3Nnx8u16AtNdYhdz+NQS0+HE6Os6V0="
            })
            .end((err, res) => {
                merchant1 = res.body
                let decoded = JSON.parse(decrypt(jwt_decode(res.body.accessToken).data))
                response = decoded
                decoded.should.have.property('phone').that.equal('081283398494')
                done()
            })
    })

    it("Show code QR", (done) => {
        chai.request(app)
            .get('/api/v1/merchant/code')
            .set({
                Authorization: 'Bearer ' + merchant1.accessToken
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('qrcode')
                done()
            })
    })

    it("Get profile", (done) => {
        chai.request(app)
            .get('/api/v1/merchant/profile')
            .set({
                Authorization: 'Bearer ' + merchant1.accessToken
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

    it("Get payment history", (done) => {
        chai.request(app)
            .get('/api/v1/merchant/payment/history')
            .set({
                Authorization: 'Bearer ' + merchant1.accessToken
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

    it("Create QR Payment", (done) => {
        chai.request(app)
            .post('/api/v1/merchant/payment')
            .set({
                Authorization: 'Bearer ' + merchant1.accessToken
            })
            .send({
                "amount": 20000
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('amount').that.equal(20000)
                done()
            })
    })

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            console.log("    Response body: " + util.inspect(response.body, { depth: null, colors: true }) + "\n");
        }
    })
})