const { Post, Comment, User } = require("../lib/sequelize");

const commentController = {
  // -------------------- Get Comment limit 5 -------------------- //
  getComment: async (req, res) => {
    try {
      const { limit = 5, page = 1 } = req.query;
      const { id } = req.params;

      const findComment = await Comment.findAll({
        offset: (page - 1) * limit,
        limit: limit ? parseInt(limit) : undefined,
        include: [ Post, User ],
        order: [["createdAt", "DESC"]],
        where: {
          post_id: id,
        },
      });

      return res.status(200).json({
        message: "fetching data",
        result: findComment,
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- Add Comment -------------------- //
  addComment: async (req, res) => {
    try {
      const { comment_post, user_id, post_id } = req.body;

      const newComment = await Comment.create({
        comment_post,
        user_id,
        post_id,
      });

      return res.status(201).json({
        message: "Comment created",
        result: newComment,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- Edit Comment -------------------- //
  editComment: async (req, res) => {
    try {
      const { id } = req.params;

      // const findPost = await Post.findOne({
      //   where: {
      //     id,
      //   },
      // });

      // if (!findPost) {
      //   throw new Error("Post doesn't exist");
      // }

      await Comment.update(
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
        message: "Comment success edited",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  },

  // -------------------- Delete Comment -------------------- //
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;

      await Comment.destroy({
        where: { id },
      });

      return res.status(200).json({
        message: "Comment success deleted",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  },
};

module.exports = commentController;
