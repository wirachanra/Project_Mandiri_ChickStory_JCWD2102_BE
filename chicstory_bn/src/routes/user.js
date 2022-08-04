const express = require("express");
const router = express.Router();
const fileUploader = require("../lib/uploader");
const { authorizedLoggedInUser } = require("../middlewares/authMiddleware");

const { userController } = require("../controller");

router.post("/login", userController.login);

router.post("/", userController.register);

router.post("/getUserId/:id", userController.getUserId);

router.post("/getUser", userController.getUser);

router.post("/resendVerification", userController.resendVerification);

router.patch("/verify/:vertoken", userController.verifyUser);

router.post("/sendResetPass", userController.sendResetPass);

router.post("/resetPass/:restoken", userController.verifyResToken);

router.patch("/changePassword/:restoken", userController.changePassword);

router.patch("/:id",userController.editUser);

router.patch(
  "/uploadProfile/:id",
  fileUploader({
    destinationFolder: "profile_pict",
    fileType: "image",
    prefix: "POST",
  }).single("image"),
  userController.uploadProfilePict
);

router.get("/refresh-token", authorizedLoggedInUser, userController.keepLogin);

// router.get("/avatar/:user_id", userController.renderAvatar);
// router.delete("/:id", userController.editUser);

module.exports = router;
