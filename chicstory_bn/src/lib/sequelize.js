const { Sequelize } = require("sequelize");
const dbConfig = require("../configs/database");

const sequelize = new Sequelize({
  username: dbConfig.MYSQL_USERNAME,
  password: dbConfig.MYSQL_PASSWORD,
  database: dbConfig.MYSQL_DB_NAME,
  port: dbConfig.MYSQL_PORT,
  dialect: "mysql",
});

//models
const User = require("../models/user")(sequelize);
const Post = require("../models/post")(sequelize);
const Like = require("../models/like")(sequelize);
const Comment = require("../models/comment")(sequelize);

// 1 : M
User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });

// super many to many relationship
// User.belongsToMany(Post, { through: Like });
// Post.belongsToMany(User, { through: Like });
// Like.belongsTo(User);
// Like.belongsTo(Post);
// User.hasMany(Like);
// Post.hasMany(Like);

// super many to many relationship
// User.belongsToMany(Post, { through: Comment });
// Post.belongsToMany(User, { through: Comment });
// Comment.belongsTo(User);
// Comment.belongsTo(Post);
// User.hasMany(Comment);
// Post.hasMany(Comment);

// M : M
User.hasMany(Like, { foreignKey: "user_id" });
Like.belongsTo(User, { foreignKey: "user_id" });
Post.hasMany(Like, { foreignKey: "post_id" });
Like.belongsTo(Post, { foreignKey: "post_id" });

// M : M
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });
Post.hasMany(Comment, { foreignKey: "post_id" });
Comment.belongsTo(Post, { foreignKey: "post_id" });

module.exports = {
  sequelize,
  Post,
  User,
  Comment,
  Like,
};
