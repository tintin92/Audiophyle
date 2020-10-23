module.exports = function(sequelize, DataTypes) {
  const favoriteSong = sequelize.define("favoriteSong", {
    song: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  return favoriteSong;
};
