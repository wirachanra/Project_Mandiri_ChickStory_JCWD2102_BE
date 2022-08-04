const express = require("express");
const router = express.Router();

const { likeController } = require("../controller");
// router.get("/", postController.getAllPost);

router.get("/post/:id", likeController.getLikebyPost); 

router.get("/user/:id", likeController.getLikebyUser); 

router.post("/", likeController.addLike);

router.delete("/user/:user_id/post/:post_id", likeController.deleteLike);

module.exports = router;
