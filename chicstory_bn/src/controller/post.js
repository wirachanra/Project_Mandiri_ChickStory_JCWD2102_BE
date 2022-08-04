const { Post, User, Comment, Like } = require("../lib/sequelize");

const postController = {
  // -------------------- get all post untuk mengambil semua data post yang akan ditampilkan di home perlimit -------------------- //
  getPostPaging: async (req, res) => {
    try {
      const { limit = 5, page = 1 } = req.query;

      const findPost = await Post.findAll({
        offset: (page - 1) * limit,
        limit: limit ? parseInt(limit) : undefined,
        include: [User, Comment, Like],
        order: [["createdAt", "DESC"]]
      });

      return res.status(200).json({
        message: "fetching data",
        result: findPost,
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "error ",
      });
    }
  },

  // -------------------- get Post by User untuk mengambil data post saat masuk profile user -------------------- //
  getPostByUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { limit = 9, page = 1 } = req.query;

      const findPost = await Post.findAll({
        offset: (page - 1) * limit,
        limit: limit ? parseInt(limit) : undefined,
        include: [User,Comment, Like],
        order: [["createdAt", "DESC"]],
        where: {
          user_id: id,
        },
      });

      return res.status(200).json({
        message: "fetching data",
        result: findPost,
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "error ",
      });
    }
  },

  // -------------------- get Post by ID untuk memanggil post sesuai dengan ID -------------------- //
  getPostById: async (req, res) => {
    try {
      const { id } = req.params;

      const findPost = await Post.findAll({
        include: [User,Comment, Like],
        where: {
          id: id,
        },
      });

      return res.status(200).json({
        message: "fetching data",
        result: findPost,
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: "error ",
      });
    }
  },

  // -------------------- Add Post by User -------------------- //
  addPost: async (req, res) => {
    try {
      const { caption, location, user_id } = req.body;
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "post_images";
      const { filename } = req.file;

      const newPost = await Post.create({
        image_url: `${uploadFileDomain}/${filePath}/${filename}`,
        caption,
        location,
        user_id,
      });

      return res.status(201).json({
        message: "Post created",
        result: newPost,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },

  // -------------------- edit Post by User -------------------- //
  editPost: async (req, res) => {
    try {
      const { id } = req.params;

      const findPost = await Post.findOne({
        where: {
          id: id,
        },
      });

      if (!findPost) {
        throw new Error("Post doesn't exist");
      }

      await Post.update(
        {
          ...req.body,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        message: "Post success edited",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- Delete Post User -------------------- //
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;

      await Post.destroy({
        where: {
          id,
        },
      });

      return res.status(200).json({
        message: "Post success deleted",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  },
};

module.exports = postController;
