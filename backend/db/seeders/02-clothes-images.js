"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("ClothesImages", [
      {
        clothesId: 1,
        imageUrl: "https://example.com/summer-dress-1.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clothesId: 1,
        imageUrl: "https://example.com/summer-dress-2.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clothesId: 2,
        imageUrl: "https://example.com/blazer-1.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ClothesImages", null, {});
  }
};
