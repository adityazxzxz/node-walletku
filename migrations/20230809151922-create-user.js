'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
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
      password: {
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
      bpkb_image: {
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
      district: {
        type: Sequelize.STRING
      },
      sub_district: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.INTEGER
      },
      emergency_name: {
        type: Sequelize.STRING
      },
      emergency_phone: {
        type: Sequelize.STRING
      },
      plat_no: {
        type: Sequelize.STRING
      },
      is_complete_profile: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      is_complete_document: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      balance: {
        type: Sequelize.BIGINT(20).UNSIGNED,
        defaultValue: 0
      },
      limit: {
        type: Sequelize.BIGINT(20).UNSIGNED,
        defaultValue: 0
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
    await queryInterface.dropTable('customers');
  }
};