"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Categories", [
      { id: 1, name: "Dresses", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "Blazers", createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: "Tops", createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: "Bottoms", createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: "Outerwear", createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: "New", createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  }
};
