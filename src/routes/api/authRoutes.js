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

// const testUploadMiddleware = (req, res, next) => {
//   if (req.file) {
//     console.log("Received file in multer:", req.file); // This will log Multer's processed file
//   } else {
//     console.log("No file received by Multer.");
//   }
//   next();
// };

// Route to handle avatar upload
// Route to handle avatar upload
router.patch(
  "/users/avatar",
  authMiddleware,
  (req, res, next) => {
    console.log("Upload started");
    req.uploadStart = Date.now(); // Store start time in the req object
    next();
  },
  upload.single("avatar"),
  async (req, res) => {
    const uploadDuration = Date.now() - req.uploadStart; // Retrieve start time from req object
    console.log(`Upload finished in ${uploadDuration}ms`);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file); // Log the uploaded file

    // Handle further logic like Imgur upload or response formatting here.
    try {
      await authController.updateUseravatar(req, res);
    } catch (error) {
      return res.status(500).json({ error: "Error updating avatar" });
    }
  }
);

module.exports = router;
