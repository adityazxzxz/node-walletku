'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init({
    fullname: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    id_card: DataTypes.STRING,
    id_card_image: DataTypes.STRING,
    selfie_image: DataTypes.STRING,
    bpkb_image: DataTypes.STRING,
    email: DataTypes.STRING,
    pin: DataTypes.STRING,
    password: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    mother_name: DataTypes.STRING,
    job: DataTypes.STRING,
    company_name: DataTypes.STRING,
    company_address: DataTypes.STRING,
    position: DataTypes.STRING,
    salary_min: DataTypes.INTEGER,
    salary_max: DataTypes.INTEGER,
    marital_status: DataTypes.STRING,
    otp: DataTypes.STRING,
    otp_exp: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    address: DataTypes.STRING,
    country: DataTypes.STRING,
    province: DataTypes.STRING,
    city: DataTypes.STRING,
    district: DataTypes.STRING,
    sub_district: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    emergency_name: DataTypes.STRING,
    emergency_phone: DataTypes.STRING,
    plat_no: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    is_complete_profile: DataTypes.BOOLEAN,
    is_complete_document: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Customer',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'customers'
  });
  return Customer;
};