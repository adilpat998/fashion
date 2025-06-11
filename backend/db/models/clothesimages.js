"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClothesImages extends Model {
    static associate(models) {
      ClothesImages.belongsTo(models.Clothes, {
        foreignKey: "clothesId",
        as: "clothes",
        onDelete: "CASCADE"
      });
    }
  }
  ClothesImages.init(
    {
      clothesId: { type: DataTypes.INTEGER, allowNull: false },
      imageUrl: { type: DataTypes.STRING(255), allowNull: false }
    },
    {
      sequelize,
      modelName: "ClothesImages",
      tableName: "ClothesImages"
    }
  );
  return ClothesImages;
};
