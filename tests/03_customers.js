const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const util = require('util')
const jwt_decode = require('jwt-decode')
const { decrypt } = require('../helpers/encrypt')

chai.use(chaiHttp)
chai.should()
let response, otp1, otp2, otp3, user1, user2, user3

describe("Customer", () => {

    it("Customer with finished OTP", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398495",
                "password": "U2FsdGVkX1+M5loCNfEuTYlhwzVDL8Pclx0pLtQ1FU4="
            })
            .end((err, res) => {
                user1 = res.body
                let decoded = JSON.parse(decrypt(jwt_decode(res.body.accessToken).data))
                response = decoded
                decoded.should.have.property('is_complete_profile').that.equal(true)
                done()
            })
    })

    it("Customer with unfinish OTP", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398496",
                "password": "U2FsdGVkX1+M5loCNfEuTYlhwzVDL8Pclx0pLtQ1FU4="
            })
            .end((err, res) => {
                let decoded = JSON.parse(decrypt(jwt_decode(res.body.accessToken).data))
                response = decoded
                decoded.should.have.property('is_complete_profile').that.equal(false)
                done()
            })
    })

    it("Customer with unfinish Upload Document", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398497",
                "password": "U2FsdGVkX1+M5loCNfEuTYlhwzVDL8Pclx0pLtQ1FU4="
            })
            .end((err, res) => {
                let decoded = JSON.parse(decrypt(jwt_decode(res.body.accessToken).data))
                response = decoded
                decoded.should.have.property('is_complete_document').that.equal(false)
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
            .set({
                Authorization: 'Bearer ' + user1.accessToken
            })
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

    it("Update Password without old_password", (done) => {
        chai.request(app)
            .put('/api/v1/customer/password')
            .set({
                Authorization: 'Bearer ' + user1.accessToken
            })
            .send({
                new_password: 'U2FsdGVkX1/kh2edrQ2YiTH/l/w3biz+362yKxQkEdY='
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Update Password without new_password", (done) => {
        chai.request(app)
            .put('/api/v1/customer/password')
            .set({
                Authorization: 'Bearer ' + user1.accessToken
            })
            .send({
                old_password: 'U2FsdGVkX1+M5loCNfEuTYlhwzVDL8Pclx0pLtQ1FU4=',
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Update Password", (done) => {
        chai.request(app)
            .put('/api/v1/customer/password')
            .set({
                Authorization: 'Bearer ' + user1.accessToken
            })
            .send({
                old_password: 'U2FsdGVkX1+M5loCNfEuTYlhwzVDL8Pclx0pLtQ1FU4=',
                new_password: 'U2FsdGVkX1/kh2edrQ2YiTH/l/w3biz+362yKxQkEdY='
            })
            .end((err, res) => {
                response = res
                res.should.have.status(200)
                done()
            })
    })

    it("Login user after update password", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .send({
                "phone": "081283398495",
                "password": "U2FsdGVkX1/kh2edrQ2YiTH/l/w3biz+362yKxQkEdY="
            })
            .end((err, res) => {
                response = res
                user1 = res.body
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