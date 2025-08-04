"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Clothes", [
      // Dresses
      {
        id: 1,
        name: "Summer Dress",
        description: "A light, floral summer dress.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg",
        sizes: "S,M,L",
        price: 49.99,
        categoryId: 1, // Dresses
        colors: "red,white",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Evening Gown",
        description: "Elegant evening gown for special occasions.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg",
        sizes: "M,L",
        price: 129.99,
        categoryId: 1, // Dresses
        colors: "black",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "Casual Midi Dress",
        description: "Comfortable midi dress for everyday wear.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg",
        sizes: "S,M",
        price: 59.99,
        categoryId: 1, // Dresses
        colors: "blue,green",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Blazers
      {
        id: 4,
        name: "Classic Blazer",
        description: "A timeless black blazer for all occasions.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg",
        sizes: "M,L,XL",
        price: 89.99,
        categoryId: 2, // Blazers
        colors: "black",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: "White Linen Blazer",
        description: "Lightweight linen blazer for summer.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg",
        sizes: "S,M,L",
        price: 99.99,
        categoryId: 2, // Blazers
        colors: "white",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: "Double-Breasted Blazer",
        description: "Sharp double-breasted blazer.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg",
        sizes: "L,XL",
        price: 119.99,
        categoryId: 2, // Blazers
        colors: "navy,gray",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Tops
      {
        id: 7,
        name: "Silk Camisole",
        description: "Luxurious silk camisole top.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg",
        sizes: "XS,S,M",
        price: 39.99,
        categoryId: 3, // Tops
        colors: "black,red",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        name: "Ribbed Tank Top",
        description: "Classic ribbed tank for layering.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg",
        sizes: "S,M,L",
        price: 24.99,
        categoryId: 3, // Tops
        colors: "white,gray",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        name: "Lace Blouse",
        description: "Delicate lace blouse for a feminine touch.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg",
        sizes: "M,L",
        price: 54.99,
        categoryId: 3, // Tops
        colors: "pink,white",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Bottoms
      {
        id: 10,
        name: "High-Waisted Trousers",
        description: "Chic high-waisted trousers.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg",
        sizes: "S,M,L",
        price: 69.99,
        categoryId: 4, // Bottoms
        colors: "black,beige",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        name: "Denim Skirt",
        description: "Classic blue denim skirt.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg",
        sizes: "XS,S,M",
        price: 34.99,
        categoryId: 4, // Bottoms
        colors: "blue",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        name: "Wide-Leg Pants",
        description: "Trendy wide-leg pants for comfort.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/1.jpg",
        sizes: "M,L,XL",
        price: 59.99,
        categoryId: 4, // Bottoms
        colors: "black,white",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Outerwear
      {
        id: 13,
        name: "Wool Coat",
        description: "Warm wool coat for winter.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg",
        sizes: "M,L,XL",
        price: 149.99,
        categoryId: 5, // Outerwear
        colors: "camel,black",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 14,
        name: "Trench Coat",
        description: "Classic beige trench coat.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg",
        sizes: "S,M,L",
        price: 139.99,
        categoryId: 5, // Outerwear
        colors: "beige",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 15,
        name: "Faux Fur Jacket",
        description: "Statement faux fur jacket.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg",
        sizes: "S,M",
        price: 119.99,
        categoryId: 5, // Outerwear
        colors: "black,white",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // New
      {
        id: 16,
        name: "Limited Edition Dress",
        description: "Exclusive new arrival dress.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg",
        sizes: "S,M,L",
        price: 159.99,
        categoryId: 6, // New
        colors: "red,blue",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 17,
        name: "Modern Blazer",
        description: "Fresh new blazer style.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/2.jpg",
        sizes: "M,L",
        price: 109.99,
        categoryId: 6, // New
        colors: "gray,black",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 18,
        name: "Trendy Top",
        description: "Brand new trendy top.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/3.jpg",
        sizes: "XS,S,M,L",
        price: 44.99,
        categoryId: 6, // New
        colors: "pink,green",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // More 'New' products for spacing test
      {
        id: 19,
        name: "New Arrival Kurta",
        description: "Trendy new kurta for the season.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/new1.jpg",
        sizes: "S,M,L",
        price: 54.99,
        categoryId: 6, // New
        colors: "blue,white",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 20,
        name: "New Palazzo Pants",
        description: "Wide-leg palazzo pants in new colors.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/new2.jpg",
        sizes: "M,L,XL",
        price: 39.99,
        categoryId: 6, // New
        colors: "black,beige",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 21,
        name: "New Festive Dupatta",
        description: "Colorful dupatta for festive occasions.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/new3.jpg",
        sizes: "One Size",
        price: 24.99,
        categoryId: 6, // New
        colors: "red,gold",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 22,
        name: "New Embroidered Shawl",
        description: "Elegant shawl with new embroidery.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/new4.jpg",
        sizes: "One Size",
        price: 64.99,
        categoryId: 6, // New
        colors: "green,white",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 23,
        name: "New Silk Scarf",
        description: "Soft silk scarf in new patterns.",
        imageUrl: "https://adil-fashion-app-bucket.s3.us-east-2.amazonaws.com/new5.jpg",
        sizes: "One Size",
        price: 19.99,
        categoryId: 6, // New
        colors: "pink,blue",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Clothes", null, {});
  }
};
