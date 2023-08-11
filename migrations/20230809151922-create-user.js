'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullname: {
        type: Sequelize.STRING
      },
      birthdate: {
        type: Sequelize.DATE
      },
      email: {
        type: Sequelize.STRING
      },
      pin: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      mother_name: {
        type: Sequelize.STRING
      },
      job: {
        type: Sequelize.STRING
      },
      company_name: {
        type: Sequelize.STRING
      },
      company_address: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      salary_min: {
        type: Sequelize.INTEGER
      },
      salary_max: {
        type: Sequelize.INTEGER
      },
      marital_status: {
        type: Sequelize.INTEGER
      },
      otp: {
        type: Sequelize.STRING
      },
      otp_exp: {
        type: Sequelize.INTEGER
      },
      id_card: {
        type: Sequelize.STRING
      },
      id_card_image: {
        type: Sequelize.STRING
      },
      selfie_image: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.INTEGER
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
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};