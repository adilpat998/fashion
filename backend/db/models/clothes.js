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
      Clothes.belongsTo(models.Category, { foreignKey: "categoryId", as: "category" });
    }
  }
  Clothes.init(
    {
      name: { type: DataTypes.STRING(100), allowNull: false },
      description: DataTypes.TEXT,
      imageUrl: { type: DataTypes.STRING(255), allowNull: false },
      sizes: { type: DataTypes.STRING(50), allowNull: false },
      price: DataTypes.DECIMAL(10, 2),
      categoryId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Categories', key: 'id' } },
      colors: {
        type: DataTypes.STRING, // Use STRING for SQLite compatibility
        allowNull: true,
        get() {
          const raw = this.getDataValue('colors');
          if (Array.isArray(raw)) return raw;
          if (typeof raw === 'string') return raw.split(',').map(s => s.trim()).filter(Boolean);
          return [];
        },
        set(val) {
          if (Array.isArray(val)) this.setDataValue('colors', val.join(','));
          else this.setDataValue('colors', val);
        }
      }
    },
    {
      sequelize,
      modelName: "Clothes",
      tableName: "Clothes"
    }
  );
  return Clothes;
};
