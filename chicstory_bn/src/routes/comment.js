const express = require("express");
const router = express.Router();

const { commentController } = require("../controller");

// -------------------- get comment dari post id dan di limit 5
router.get("/post/:id", commentController.getComment);

// -------------------- add comment
router.post("/", commentController.addComment);

// -------------------- edit comment dari post id
router.patch("/:id", commentController.editComment);

// -------------------- delete comment
router.delete("/:id", commentController.deleteComment);

module.exports = router;
