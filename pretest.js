const { sequelize } = require('./models')
const fs = require('fs')

const init = async () => {
    try {
        await sequelize.query("DELETE from customers where phone in ('6281283398495','6281283398496','6281283398497')");
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(0)
    }

}

init()