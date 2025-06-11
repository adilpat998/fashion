"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clothes extends Model {
    static associate(models) {
      Clothes.Images = Clothes.hasMany(models.ClothesImages, {
        foreignKey: "clothesId",
        as: "images",
        onDelete: "CASCADE"
      });
    }
  }
  Clothes.init(
    {
      name: { type: DataTypes.STRING(100), allowNull: false },
      description: DataTypes.TEXT,
      imageUrl: { type: DataTypes.STRING(255), allowNull: false }, // for backward compatibility, can be removed if not needed
      sizes: { type: DataTypes.STRING(50), allowNull: false },
      price: DataTypes.DECIMAL(10, 2)
    },
    {
      sequelize,
      modelName: "Clothes",
      tableName: "Clothes"
    }
  );
  return Clothes;
};
