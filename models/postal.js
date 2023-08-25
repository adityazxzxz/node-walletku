'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Postal extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Postal.init({
        urban: DataTypes.STRING,
        sub_district: DataTypes.STRING,
        city: DataTypes.INTEGER,
        province_code: DataTypes.INTEGER,
        postal_code: DataTypes.INTEGER
    }, {
        timestamps: false,
        sequelize,
        modelName: 'Postal',
        tableName: 'Postals'
    });
    return Postal;
};