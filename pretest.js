const { sequelize } = require('./models')
const fs = require('fs')

const init = async () => {
    try {
        await sequelize.query("DELETE from customers where phone in ('081283398495','081283398496','081283398497')");
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(0)
    }

}

init()