const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const util = require('util')

chai.use(chaiHttp)
chai.should()
let response, otp1, otp2, otp3, user1, user2, user3

describe("Auth", () => {
    it("Register password less then 8 char", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                phone: '081283398498',
                password: 'U2FsdGVkX1/cBpMD9Xckco5oPT+7rx+zBoEPDLIXb8o='
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Register empty phone", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                phone: '',
                password: 'U2FsdGVkX1+A+qmxAGN0aVUIkuEshV7b8lvBa4Xk0d4='
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Register without phone body", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                password: 'U2FsdGVkX1+A+qmxAGN0aVUIkuEshV7b8lvBa4Xk0d4='
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Register empty password", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                phone: '081283398494',
                password: ''
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Register without password body", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                phone: '081283398494',
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Register phone and password akun 1", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                phone: '081283398495',
                password: 'U2FsdGVkX19LTIOlhZXI07bGxalyX5xYs4LTxJM5U7A='
            })
            .end((err, res) => {
                otp1 = res.body.otp
                response = res
                res.should.have.status(200)
                done()
            })
    })

    it("Register phone and password akun 2", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                phone: '081283398496',
                password: 'U2FsdGVkX19LTIOlhZXI07bGxalyX5xYs4LTxJM5U7A='
            })
            .end((err, res) => {
                otp2 = res.body.otp
                response = res
                res.should.have.status(200)
                done()
            })
    })

    it("Register phone and password akun 3", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                phone: '081283398497',
                password: 'U2FsdGVkX19LTIOlhZXI07bGxalyX5xYs4LTxJM5U7A='
            })
            .end((err, res) => {
                otp3 = res.body.otp
                response = res
                res.should.have.status(200)
                done()
            })
    })

    it("Input Wrong OTP", (done) => {
        chai.request(app)
            .post('/api/v1/auth/otp/register')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398495",
                "otp": 'U2FsdGVkX1+OgJuxc1XFKi3ADTlQMirrP4VDazrWpcc='
            })
            .end((err, res) => {
                response = res
                res.should.have.status(401)
                done()
            })
    })

    it("Input OTP without phone", (done) => {
        chai.request(app)
            .post('/api/v1/auth/otp/register')
            .set({ timestamp: `12341` })
            .send({
                "otp": 'U2FsdGVkX1+OgJuxc1XFKi3ADTlQMirrP4VDazrWpcc='
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Input OTP only phone number", (done) => {
        chai.request(app)
            .post('/api/v1/auth/otp/register')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398495",
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Input OTP Register user 1", (done) => {
        chai.request(app)
            .post('/api/v1/auth/otp/register')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398495",
                "otp": otp1
            })
            .end((err, res) => {
                response = res
                user1 = res.body
                res.should.have.status(200)
                done()
            })
    })

    it("Input OTP Register user 2", (done) => {
        chai.request(app)
            .post('/api/v1/auth/otp/register')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398496",
                "otp": otp2
            })
            .end((err, res) => {
                response = res
                user2 = res.body
                res.should.have.status(200)
                done()
            })
    })

    it("Input OTP Register user 3", (done) => {
        chai.request(app)
            .post('/api/v1/auth/otp/register')
            .set({ timestamp: `12341` })
            .send({
                "phone": "081283398497",
                "otp": otp3
            })
            .end((err, res) => {
                response = res
                user3 = res.body
                res.should.have.status(200)
                done()
            })
    })

    it("Register Personal Data user 1", (done) => {
        chai.request(app)
            .post('/api/v1/customer/personal_data')
            .set({ Authorization: 'Bearer ' + user1.accessToken })
            .send({
                "fullname": "mrzxzxz",
                "email": "mrzxzxz@gmail.com",
                "id_card": "123456789",
                "plat_no": "123123",
                "province": "Banten",
                "city": "Tangerang",
                "district": "Kelapadua",
                "sub_district": "Bencongan",
                "zipcode": "123",
                "pin": "U2FsdGVkX19pqLEMcxWA0lW/7Qq/p09dkgWnRfbB5VU=",
                "address": "harkit",
                "emergency_name": "AAwer",
                "emergency_phone": "123123",
                "stnk_name": "mrzxzxz"
            })
            .end((err, res) => {
                response = res
                res.should.have.status(200)
                done()
            })
    })

    it("Register name not match with STNK name", (done) => {
        chai.request(app)
            .post('/api/v1/customer/personal_data')
            .set({ Authorization: 'Bearer ' + user1.accessToken })
            .send({
                "fullname": "mrzxzxz",
                "email": "mrzxzxz@gmail.com",
                "id_card": "123456789",
                "plat_no": "123123",
                "province": "Banten",
                "city": "Tangerang",
                "district": "Kelapadua",
                "sub_district": "Bencongan",
                "zipcode": "123",
                "pin": "U2FsdGVkX19pqLEMcxWA0lW/7Qq/p09dkgWnRfbB5VU=",
                "address": "harkit",
                "emergency_name": "AAwer",
                "emergency_phone": "123123",
                "stnk_name": "Aditya Pratama"
            })
            .end((err, res) => {
                response = res
                res.should.have.status(409)
                done()
            })
    })

    it("Register Personal Data with ktp existing", (done) => {
        chai.request(app)
            .post('/api/v1/customer/personal_data')
            .set({ Authorization: 'Bearer ' + user2.accessToken })
            .send({
                "fullname": "mrzxzxz",
                "email": "mrzxzxz@gmail.com",
                "id_card": "123456789",
                "plat_no": "123123",
                "province": "Banten",
                "city": "Tangerang",
                "district": "Kelapadua",
                "sub_district": "Bencongan",
                "zipcode": "123",
                "pin": "U2FsdGVkX19pqLEMcxWA0lW/7Qq/p09dkgWnRfbB5VU=",
                "address": "harkit",
                "emergency_name": "AAwer",
                "emergency_phone": "123123",
                "stnk_name": "mrzxzxz"
            })
            .end((err, res) => {
                response = res
                res.should.have.status(401)
                done()
            })
    })

    it("Register Personal not finish fill all required value", (done) => {
        chai.request(app)
            .post('/api/v1/customer/personal_data')
            .set({ Authorization: 'Bearer ' + user2.accessToken })
            .send({
                "fullname": "mrzxzxz",
                "email": "mrzxzxz@gmail.com",
                "id_card": "123456789",
                "plat_no": "123123",
                "province": "Banten",
                "city": "Tangerang",
                "district": "Kelapadua",
                "sub_district": "Bencongan",
                "zipcode": "123",
                "pin": "U2FsdGVkX19pqLEMcxWA0lW/7Qq/p09dkgWnRfbB5VU=",
                "address": "harkit"
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Register Personal Data without token", (done) => {
        chai.request(app)
            .post('/api/v1/customer/personal_data')
            .send({
                "fullname": "mrzxzxz",
                "email": "mrzxzxz@gmail.com",
                "id_card": "123456789",
                "plat_no": "123123",
                "province": "Banten",
                "city": "Tangerang",
                "district": "Kelapadua",
                "sub_district": "Bencongan",
                "zipcode": "123",
                "pin": "U2FsdGVkX19pqLEMcxWA0lW/7Qq/p09dkgWnRfbB5VU=",
                "address": "harkit",
                "emergency_name": "AAwer",
                "emergency_phone": "123123"
            })
            .end((err, res) => {
                response = res
                res.should.have.status(401)
                done()
            })
    })

    it("Register Personal Data twice", (done) => {
        chai.request(app)
            .post('/api/v1/customer/personal_data')
            .set({ Authorization: 'Bearer ' + user1.accessToken })
            .send({
                "fullname": "mrzxzxz",
                "email": "mrzxzxz@gmail.com",
                "id_card": "123456789",
                "plat_no": "123123",
                "province": "Banten",
                "city": "Tangerang",
                "district": "Kelapadua",
                "sub_district": "Bencongan",
                "zipcode": "123",
                "pin": "U2FsdGVkX19pqLEMcxWA0lW/7Qq/p09dkgWnRfbB5VU=",
                "address": "harkit",
                "emergency_name": "AAwer",
                "emergency_phone": "123123",
                "stnk_name": "mrzxzxz"
            })
            .end((err, res) => {
                response = res
                res.should.have.status(404)
                done()
            })
    })

    it("Register phone existing", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                phone: '081283398495',
                password: 'U2FsdGVkX19LTIOlhZXI07bGxalyX5xYs4LTxJM5U7A='
            })
            .end((err, res) => {
                otp3 = res.body.otp
                response = res
                res.should.have.status(409)
                done()
            })
    })

    it("Login user 1 wrong password", (done) => {
        chai.request(app)
            .post('/api/v1/auth/login')
            .send({
                "phone": "081283398495",
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
                "phone": "081283398495"
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Login with out phone number", (done) => {
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

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            console.log("    Response body: " + util.inspect(response.body, { depth: null, colors: true }) + "\n");
        }
    })
})