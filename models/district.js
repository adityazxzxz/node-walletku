'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class District extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    District.init({
        dis_name: DataTypes.STRING,
        city_id: DataTypes.INTEGER,
    }, {
        timestamps: false,
        sequelize,
        modelName: 'District',
        tableName: 'districts'
    });
    return District;
};