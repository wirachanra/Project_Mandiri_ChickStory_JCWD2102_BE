const { DataTypes } = require("sequelize");

const Post = (sequelize) => {
  return sequelize.define("Post", {
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING(300),
    },
    location: {
      type: DataTypes.STRING(120),
    },
    number_of_likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    number_of_comments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
};

module.exports = Post;
