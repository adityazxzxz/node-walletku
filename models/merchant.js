'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Merchant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Merchant.init({
    pic_name: DataTypes.STRING,
    id_card: DataTypes.STRING,
    id_card_image: DataTypes.STRING,
    bank_account_name: DataTypes.STRING,
    bank_account_number: DataTypes.STRING,
    merchant_name: DataTypes.STRING,
    merchant_code: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    last_login: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Merchant',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  return Merchant;
};