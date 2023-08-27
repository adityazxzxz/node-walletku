const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const util = require('util')

chai.use(chaiHttp)
chai.should()
let response, otp1, otp2, otp3, user1, user2, user3

describe("Customer", () => {

    it("Login user 1", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .set({ timestamp: `12341` })
            .send({
                "phone": "6281283398497",
                "password": "U2FsdGVkX1+M5loCNfEuTYlhwzVDL8Pclx0pLtQ1FU4="
            })
            .end((err, res) => {
                response = res
                user1 = res.body
                res.should.have.status(200)
                done()
            })
    })

    it("Login user unfinish OTP", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .set({ timestamp: `12341` })
            .send({
                "phone": "6281283398495",
                "password": "U2FsdGVkX1+M5loCNfEuTYlhwzVDL8Pclx0pLtQ1FU4="
            })
            .end((err, res) => {
                response = res
                res.should.have.status(200)
                done()
            })
    })

    it("Login user 1 wrong password", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .send({
                "phone": "6281283398497",
                "password": "U2FsdGVkX19ZwrldPBDRvxT7isX5XblN8oX/+1zeKT4="
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Login user 1 without password", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .send({
                "phone": "6281283398497"
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Login user 1 with out phone number", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .send({
                "password": "U2FsdGVkX19ZwrldPBDRvxT7isX5XblN8oX/+1zeKT4="
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Get Profile", (done) => {
        chai.request(app)
            .get('/api/v1/customer/profile')
            .set({ Authorization: 'Bearer ' + user1.accessToken })
            .end((err, res) => {
                response = res
                res.should.have.status(200)
                done()
            })
    })

    it("Get Profile without token", (done) => {
        chai.request(app)
            .get('/api/v1/customer/profile')
            .end((err, res) => {
                response = res
                res.should.have.status(401)
                done()
            })
    })

    it("Update profile", (done) => {
        chai.request(app)
            .put('/api/v1/customer/profile')
            .send({
                fullname: 'Aditya Metrometro',
                emergency_name: 'Batman',
                emergency_call: 14045
            })
            .end((err, res) => {
                response = res
                res.should.have.status(200)
                done()
            })
    })

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            console.log("    Response body: " + util.inspect(response.body, { depth: null, colors: true }) + "\n");
        }
    })
})