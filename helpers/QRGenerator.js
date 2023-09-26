const generatorv1 = () => {
    const type = '00' // 00 static 01 dynamic
    const amount = '0000000000' // amount max 1M
    const merchant_name = 'RAMEN_KAKEK_JEPANG' // replace _ with space
    const id = 'T000001' // P00001 for merchant id T00001 for transaction ID 
}

const generatorv2 = ({ type, amount = '0000000000', merchant_name, id }) => {
    // type 00 static 01 dynamic
    // amount 0000000000 max 1M
    let name = merchant_name.replace(/ /g, '_')
    return `${type}.${amount}.${name}.${id}`
}

module.exports = {
    generatorv1,
    generatorv2
}