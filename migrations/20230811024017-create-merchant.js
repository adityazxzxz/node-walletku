'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('merchants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pic_name: {
        type: Sequelize.STRING
      },
      id_card: {
        type: Sequelize.STRING
      },
      id_card_image: {
        type: Sequelize.STRING
      },
      bank_account_name: {
        type: Sequelize.STRING
      },
      bank_account_number: {
        type: Sequelize.STRING
      },
      merchant_name: {
        type: Sequelize.STRING
      },
      merchant_code: {
        type: Sequelize.STRING
      },
      qrcode: {
        type: Sequelize.STRING, // P0000000010001
      },
      balance: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      last_login: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('merchants');
  }
};