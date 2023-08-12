const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')

chai.use(chaiHttp)
chai.should()

describe("Auth", () => {
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
})