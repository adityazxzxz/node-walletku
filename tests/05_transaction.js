const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const util = require('util')
const jwt_decode = require('jwt-decode')
const { decrypt } = require('../helpers/encrypt')

chai.use(chaiHttp)
chai.should()
let response, customer1, merchant1, transaction

describe("Transaction", () => {
    it("Login merchant first", (done) => {
        chai.request(app)
            .post('/api/v1/merchant/login')
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

    it("Login customer first", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .send({
                "phone": "081283398495",
                "password": "U2FsdGVkX1/kh2edrQ2YiTH/l/w3biz+362yKxQkEdY="
            })
            .end((err, res) => {
                customer1 = res.body
                let decoded = JSON.parse(decrypt(jwt_decode(res.body.accessToken).data))
                response = decoded
                decoded.should.have.property('is_complete_profile').that.equal(true)
                done()
            })
    })

    it("Merchant Create QR Payment", (done) => {
        chai.request(app)
            .post('/api/v1/merchant/payment')
            .set({
                Authorization: 'Bearer ' + merchant1.accessToken
            })
            .send({
                "amount": 20000
            })
            .end((err, res) => {
                transaction = res.body
                res.should.have.status(200)
                res.body.should.have.property('amount').that.equal(20000)
                done()
            })
    })

    it("Submit payment with nonactive customer", (done) => {
        chai.request(app)
            .post('/api/v1/transaction/payment')
            .set({
                Authorization: 'Bearer ' + customer1.accessToken
            })
            .send({
                "code": transaction.code,
                "amount": 20000,
                "type": "01"
            })
            .end((err, res) => {
                res.should.have.status(409)
                done()
            })
    })

    it("Set enable customer with api playground (not recommen for production)", (done) => {
        chai.request(app)
            .post('/api/v1/playground/activate_customer')
            .send({
                "phone": "081283398495",
                "balance": 1000000,
                "limit": 1000000
            })
            .end((err, res) => {
                response = res
                res.should.have.status(200)
                done()
            })
    })

    it("Submit payment with active customer", (done) => {
        chai.request(app)
            .post('/api/v1/transaction/payment')
            .set({
                Authorization: 'Bearer ' + customer1.accessToken
            })
            .send({
                "code": transaction.code,
                "amount": 20000,
                "type": "01"
            })
            .end((err, res) => {
                response = res
                res.should.have.status(200)
                done()
            })
    })

    it("Merchant Create QR Payment for not enough balance customer", (done) => {
        chai.request(app)
            .post('/api/v1/merchant/payment')
            .set({
                Authorization: 'Bearer ' + merchant1.accessToken
            })
            .send({
                "amount": 1000000000
            })
            .end((err, res) => {
                response = res
                transaction = res.body
                res.should.have.status(200)
                res.body.should.have.property('amount').that.equal(1000000000)
                done()
            })
    })

    it("Submit payment with not enough customer balance", (done) => {
        chai.request(app)
            .post('/api/v1/transaction/payment')
            .set({
                Authorization: 'Bearer ' + customer1.accessToken
            })
            .send({
                "code": transaction.code,
                "amount": 20000,
                "type": "01"
            })
            .end((err, res) => {
                response = res
                res.should.have.status(409)
                done()
            })
    })

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            console.log("    Response body: " + util.inspect(response.body, { depth: null, colors: true }) + "\n");
        }
    })
})