const { DataTypes } = require("sequelize");

const User = (sequelize) => {
  return sequelize.define("User", {
    username: {
      type: DataTypes.STRING(25),
      allowNull: false,
      // unique: true
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    verified_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    online_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bio: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    phone_no: {
      type: DataTypes.STRING(14),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    web: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_post: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
};

module.exports = User;
