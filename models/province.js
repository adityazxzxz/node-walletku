'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Province.init({
        province_name: DataTypes.STRING,
        province_name_en: DataTypes.STRING,
        province_code: DataTypes.INTEGER
    }, {
        timestamps: false,
        sequelize,
        modelName: 'Province',
        tableName: 'provinces'
    });
    return Province;
};