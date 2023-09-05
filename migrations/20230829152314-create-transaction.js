'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cust_id: {
        type: Sequelize.INTEGER
      },
      merchant_id: {
        type: Sequelize.INTEGER
      },
      qrcode: {
        type: Sequelize.STRING, // T0000000010001
      },
      amount: {
        type: Sequelize.INTEGER
      },
      action: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.TINYINT(1)
      },
      message: {
        type: Sequelize.STRING
      },
      transaction_time: {
        type: Sequelize.INTEGER
      },
      created_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};