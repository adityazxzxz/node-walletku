const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const util = require('util')

chai.use(chaiHttp)
chai.should()
let response

describe("Auth", () => {
    it("Register phone and password", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                phone: '6281283398494',
                password: 'U2FsdGVkX19LTIOlhZXI07bGxalyX5xYs4LTxJM5U7A='
            })
            .end((err, res) => {
                response = res
                res.should.have.status(200)
                done()
            })
    })

    it("Register password less then 8 char", (done) => {
        chai.request(app)
            .post('/api/v1/auth/phone_register')
            .set({})
            .send({
                phone: '6281283398494',
                password: 'U2FsdGVkX1+A+qmxAGN0aVUIkuEshV7b8lvBa4Xk0d4='
            })
            .end((err, res) => {
                response = res
                res.should.have.status(400)
                done()
            })
    })

    it("Register phone exist", (done) => {
        chai.request(app)
            .post('/api/v1/auth/register')
            .set({ timestamp: `12341` })
            .send({
                "email": "adityapratamax@gmail.com",
                "pin": "U2FsdGVkX19kT4LkoC/pkF3VakSfn3526KAKwG2hoc0=",
                "fullname": "Aditya",
                "id_card": "1234567890123456",
                "phone": "6281283398494",
                "job": "IT consult",
                "password": "U2FsdGVkX19kT4LkoC/pkF3VakSfn3526KAKwG2hoc0="
            })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

    afterEach(function () {
        if (this.currentTest.state == 'failed') {
            console.log("    Response body: " + util.inspect(response.body, { depth: null, colors: true }) + "\n");
        }
    })
})