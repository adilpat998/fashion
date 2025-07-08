"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("ClothesImages", [
      // Dresses
      { clothesId: 1, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 2, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 3, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg", createdAt: new Date(), updatedAt: new Date() },
      // Blazers
      { clothesId: 4, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 5, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 6, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg", createdAt: new Date(), updatedAt: new Date() },
      // Tops
      { clothesId: 7, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 8, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 9, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg", createdAt: new Date(), updatedAt: new Date() },
      // Bottoms
      { clothesId: 10, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 11, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 12, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg", createdAt: new Date(), updatedAt: new Date() },
      // Outerwear
      { clothesId: 13, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 14, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 15, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg", createdAt: new Date(), updatedAt: new Date() },
      // New
      { clothesId: 16, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 17, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg", createdAt: new Date(), updatedAt: new Date() },
      { clothesId: 18, imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg", createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ClothesImages", null, {});
  }
};
