const { Router } = require('express')
const { getProvince, getCity, getDistrict, getPostal } = require('../controllers/utils')
const router = Router()

router.get('/province', getProvince)
router.get('/postal/:province_code', getPostal)
router.get('/city/:prov_id', getCity)
router.get('/district/:city_id', getDistrict)

module.exports = router