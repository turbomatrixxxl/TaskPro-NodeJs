const express = require("express");
const authController = require("../../controllers/authControllers");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const upload = require("../../middlewares/multer");

const router = express.Router();

router.post("/users/signup", authController.register);
router.post("/users/login", authController.login);

router.get("/users/verify/:verificationToken", authController.verifyUserEmail);

// POST /users/verify - Resend verification email
router.post("/users/verify", authController.handleResendVerificationEmail);

router.post("/users/logout", authMiddleware, authController.logout);

router.get("/users/current", authMiddleware, authController.getCurrentUser);

router.patch("/users/update", authMiddleware, authController.updateUserInfo);

const testUploadMiddleware = (req, res, next) => {
  console.log("Received file:", req.file); // This will log before passing to the controller
  next();
};

router.patch(
  "/users/avatar",
  authMiddleware,
  testUploadMiddleware,
  upload.single("avatar"),
  authController.updateUseravatar
);

module.exports = router;
