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

router.patch(
  "/users/avatar",
  authMiddleware,
  upload.single("avatar"),
  authController.updateUseravatar
);

// router.patch(
//   "/users/avatar",
//   (req, res, next) => {
//     console.log("Headers:", req.headers);
//     console.log("Body before Multer:", req.body);
//     next();
//   },
//   upload.single("avatar"),
//   async (req, res) => {
//     console.log("Multer File:", req.file); // Log to check if the file is received

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     res.json({ message: "Upload successful", file: req.file });
//   }
// );

// router.patch(
//   "/users/avatar",
//   authMiddleware,
//   testUploadMiddleware,
//   (req, res, next) => {
//     console.log("✅ Route hit!");
//     console.log("Headers:", req.headers);
//     console.log("Body before Multer:", req.body);

//     // Send a response immediately to confirm route is reached
//     return res.status(200).json({ message: "Route reached. Check logs." });

//     next(); // This will never execute due to the return above
//   },
//   upload.single("avatar"),
//   async (req, res) => {
//     console.log("Multer File:", req.file);

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     res.json({ message: "Upload successful", file: req.file });
//   }
// );

module.exports = router;
