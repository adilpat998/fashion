"use strict";
module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define(
    "Genre",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {}
  );
  Genre.associate = function (models) {
    Genre.hasMany(models.Clothes, { foreignKey: "genreId", as: "clothes" });
  };
  return Genre;
};
