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
  if (req.file) {
    console.log("Received file in multer:", req.file); // This will log Multer's processed file
  } else {
    console.log("No file received by Multer.");
  }
  next();
};

router.patch(
  "/users/avatar",
  authMiddleware,
  testUploadMiddleware,
  (req, res, next) => {
    console.log("Request received:", req.headers);
    console.log("File data:", req.file); // Should log 'undefined' if Multer isn't processing the file
    next();
  },
  upload.single("avatar"),
  authController.updateUseravatar
);

module.exports = router;
