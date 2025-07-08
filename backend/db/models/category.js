"use strict";
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {}
  );
  Category.associate = function (models) {
    Category.hasMany(models.Clothes, { foreignKey: "categoryId", as: "clothes" });
  };
  return Category;
};
