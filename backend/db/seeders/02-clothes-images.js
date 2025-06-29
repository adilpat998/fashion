"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("ClothesImages", [
      {
        clothesId: 1,
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clothesId: 1,
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clothesId: 2,
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ClothesImages", null, {});
  }
};
