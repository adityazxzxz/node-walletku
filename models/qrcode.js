'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Qrcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Merchant, { foreignKey: 'merchant_id' })
    }
  }
  Qrcode.init({
    code: DataTypes.STRING,
    merchant_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    status: DataTypes.STRING,
    exp_time: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Qrcode',
    tableName: 'qrcodes'
  });
  return Qrcode;
};