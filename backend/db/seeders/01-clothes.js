"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Clothes", [
      {
        name: "Summer Dress",
        description: "A light, floral summer dress.",
        imageUrl: "https://example.com/summer-dress-1.jpg",
        sizes: "S,M,L",
        price: 49.99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Classic Blazer",
        description: "A timeless black blazer for all occasions.",
        imageUrl: "https://example.com/blazer-1.jpg",
        sizes: "M,L,XL",
        price: 89.99,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Clothes", null, {});
  }
};
