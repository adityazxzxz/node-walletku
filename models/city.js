'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  City.init({
    city_name: DataTypes.STRING,
    prov_id: DataTypes.INTEGER
  }, {
    timestamps: false,
    sequelize,
    modelName: 'City',
    tableName: 'cities'
  });
  return City;
};