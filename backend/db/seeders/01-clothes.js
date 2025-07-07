"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Clothes", [
      {
        id: 1,
        name: "Summer Dress",
        description: "A light, floral summer dress.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg",
        sizes: "S,M,L",
        price: 49.99,
        genreId: 1, // Dresses
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Classic Blazer",
        description: "A timeless black blazer for all occasions.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg",
        sizes: "M,L,XL",
        price: 89.99,
        genreId: 2, // Blazers
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Clothes", null, {});
  }
};
