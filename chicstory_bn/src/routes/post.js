const express = require("express");
const router = express.Router();
const fileUploader = require("../lib/uploader");

const { postController } = require("../controller");
// router.get("/", postController.getAllPost);

router.get("/", postController.getPostPaging);

router.get("/user/:id", postController.getPostByUser);

router.get("/postId/:id", postController.getPostById);

router.post(
  "/",
  fileUploader({
    destinationFolder: "post_images",
    fileType: "image",
    prefix: "POST",
  }).single("image"),
  postController.addPost
);

router.patch("/:id", postController.editPost);

router.delete("/:id", postController.deletePost);

module.exports = router;
