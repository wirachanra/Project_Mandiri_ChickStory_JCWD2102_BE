const { DataTypes } = require("sequelize");

const Comment = (sequelize) => {
  return sequelize.define("Comment", {
    comment_post: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
  });
};

module.exports = Comment;
