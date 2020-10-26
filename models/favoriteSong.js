module.exports = function(sequelize, DataTypes) {
  const favoriteSong = sequelize.define("favoriteSong", {
    song: {
      type: DataTypes.STRING,
      allowNull: false
    },
    songName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    later: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  return favoriteSong;
};
