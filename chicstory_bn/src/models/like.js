const { DataTypes } = require("sequelize");

const Like = (sequelize) => {
  return sequelize.define("Like", {});
};

module.exports = Like;
