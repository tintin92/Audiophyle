module.exports = function(sequelize, DataTypes) {
  const favoriteArtist = sequelize.define("favoriteArtist", {
    artist: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  return favoriteArtist;
};
