'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clothes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      imageUrl: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      sizes: {
        type: Sequelize.STRING(50), // e.g. "S,M,L,XL"
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
      },
      colors: {
        type: Sequelize.STRING, // Use STRING for SQLite compatibility
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Clothes', options);
  }
};
