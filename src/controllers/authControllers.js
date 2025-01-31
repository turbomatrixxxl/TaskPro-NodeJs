const {
  registerUser,
  getUserById,
  loginUser,
  logoutUser,
  verifyUserEmail,
  resendVerificationEmail,
  updateUser,
} = require("../services/authServices");

const { validateUser } = require("../middlewares/validationMiddleware");

const { extractUserId } = require("../middlewares/extractUserId");

const fs = require("fs").promises;
const path = require("path");

const { Jimp } = require("jimp");
// reactivated jimp import

const Joi = require("joi");

const bcrypt = require("bcryptjs");

const { uploadToImgur } = require("../utils/imgur"); // Move the function to a utility file

// const cloudinary = require("../config/cloudinary");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await registerUser(username, email, password);
    // console.log(newUser);

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        height: newUser.height,
        desiredWeight: newUser.desiredWeight,
        age: newUser.age,
        bloodType: newUser.bloodType,
        weight: newUser.weight,
        avatarURL: newUser.avatarURL,
        verify: newUser.verify,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  const { error } = validateUser.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const { user, token } = await loginUser(email, password);

    // Respond with the user data and token (null if unverified)
    res.status(200).json({
      token: token, // Null if user is not verified
      user: user,
    });
  } catch (error) {
    // Handle login errors (e.g., invalid credentials)
    res.status(401).json({ message: error.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);

    if (!authHeader) {
      // Dacă antetul "Authorization" lipsește, returnați o eroare de autentificare
      return res
        .status(401)
        .json({ status: "error", message: "Missing Authorization header" });
    }

    const userId = extractUserId(authHeader);

    // Continuați cu logica dvs. pentru a găsi utilizatorul și a trimite răspunsul
    const result = await logoutUser(userId);

    if (result) {
      res.status(204).json({ message: "Logged out", data: result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);

    if (!authHeader) {
      // Dacă antetul "Authorization" lipsește, returnați o eroare de autentificare
      return res
        .status(401)
        .json({ status: "error", message: "Missing Authorization header" });
    }

    const userId = extractUserId(authHeader);

    // Continuați cu logica dvs. pentru a găsi utilizatorul și a trimite răspunsul
    const result = await getUserById(userId);
    // console.log(result);
    if (result) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: result,
      });
    } else {
      // Returnați o eroare 404 sau 401 în funcție de situație
      res.status(404).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Server error" });
    next(error);
  }
};

exports.verifyUserEmail = async (req, res) => {
  const { verificationToken } = req.params;

  try {
    await verifyUserEmail(verificationToken);

    res.status(200).json({ message: "User successfully verified", code: 200 });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error verifying user", error: error.message });
  }
};

exports.handleResendVerificationEmail = async (req, res) => {
  const emailSchema = Joi.object({
    email: Joi.string().email().required(),
  });

  // Validate request body
  const { error } = emailSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Email wrong written" });
  }

  console.log(req.body);

  const { email } = req.body;
  // console.log(email);

  if (!email) {
    return res.status(400).json({ message: "Missing required field email" });
  }

  try {
    const response = await resendVerificationEmail(email);
    return res.status(200).json(response);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(400).json({ message: "User not found" });
    }
    if (error.message === "Verification has already been passed") {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUserInfo = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);

    if (!authHeader) {
      // Dacă antetul "Authorization" lipsește, returnați o eroare de autentificare
      return res
        .status(401)
        .json({ status: "error", message: "Missing Authorization header" });
    }

    const userId = extractUserId(authHeader);

    // Hash the password if a new password is provided
    const updateFields = { username, email };

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      updateFields.password = hashedPassword;
    }

    // Call the service to update user information
    const updatedUser = await updateUser(userId, updateFields);

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // If the update is successful, return the updated user data
    res.status(200).json({
      status: "success",
      code: 200,
      data: { user: updatedUser },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
    next(error);
  }
};

// exports.updateUseravatar = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded!" });
//     }

//     console.log("req.user.avatarURL:", req.user.avatarURL);

//     // Define paths
//     const tempDir = path.join(__dirname, "../temp");
//     const avatarsDir = path.join(__dirname, "../../public/avatars");

//     console.log("avatarsDir:", avatarsDir);

//     // Create the directories if they don't exist
//     await fs.mkdir(tempDir, { recursive: true });
//     await fs.mkdir(avatarsDir, { recursive: true });

//     // Generate unique filename
//     const uniqFilename = `${req.user._id}-${Date.now()}${path.extname(
//       req.file.originalname
//     )}`;
//     console.log("uniqFilename:", uniqFilename);

//     const imagePath = req.file.path;
//     console.log("imagePath:", imagePath);

//     const tempPath = path.join(tempDir, uniqFilename);

//     // Move file to avatars directory
//     await fs.rename(imagePath, tempPath);

//     // Resize the image
//     const image = await Jimp.read(tempPath);
//     console.log("image:", image);

//     // Resize the image to width 32 and height 32.
//     image.resize({ w: 32, h: 32 });

//     // Save and overwrite the image
//     await image.write(tempPath);

//     const destinationPath = path.join(avatarsDir, uniqFilename);

//     // Move file to avatars directory
//     await fs.rename(tempPath, destinationPath);

//     const updateFields = {};

//     // Update user avatar URL
//     const newAvatarURL = `/public/avatars/${uniqFilename}`;

//     updateFields.avatarURL = newAvatarURL;

//     const updatedUser = await updateUser(userId, updateFields);

//     res.status(200).json({ avatarUrl: updatedUser.avatarURL });
//   } catch (error) {
//     console.error("Error in uploading avatar:", error.message);
//     res.status(500).json({
//       status: "fail",
//       code: 500,
//       message: error.message,
//       data: "Internal Server Error",
//     });
//   }
// };

// exports.updateUseravatar = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(404).json({ error: "There is no file to upload!" });
//     }

//     // Log file details to verify it's being received correctly
//     console.log("Received file:", req.file);

//     // Upload to Cloudinary
//     const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
//       folder: "taskpro_avatars", // Store inside a folder in Cloudinary
//       width: 32,
//       height: 32,
//       crop: "fill", // Crop image to exactly 32x32
//       format: "png", // Convert image to PNG format
//     });

//     // Update fields with Cloudinary URL
//     const updateFields = { avatarURL: uploadedFile.secure_url };

//     // Update user in the database
//     const updatedUser = await updateUser(req.user._id, updateFields, {
//       new: true,
//     });

//     // Send success response
//     res.status(200).json({
//       avatarUrl: updatedUser.avatarURL,
//       message: "Avatar updated successfully!",
//     });
//   } catch (error) {
//     console.error("Error in uploading avatar:", error.message);
//     res.status(500).json({
//       status: "fail",
//       code: 500,
//       message: error.message,
//       data: "Internal Server Error",
//     });
//   }
// };

exports.updateUseravatar = async (req, res) => {
  try {
    console.log("File path from Multer:", req.file?.path); // Ensure Multer processes the file

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }

    const imagePath = req.file.path;
    const imgurUrl = await uploadToImgur(imagePath);

    // Remove the local temp file
    await fs.unlink(imagePath);

    // Update the user's avatar URL in the database
    const updatedUser = await updateUser(req.user._id, { avatarURL: imgurUrl });

    res.status(200).json({ avatarUrl: updatedUser.avatarURL });
  } catch (error) {
    console.error("Error updating avatar:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.updateUseravatar = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded!" });
//     }

//     console.log("Received file buffer:", req.file.buffer);

//     // Upload image buffer directly to Imgur
//     const imgurUrl = await uploadToImgur(req.file.buffer);

//     // Update user avatar in the database
//     const updatedUser = await updateUser(req.user._id, { avatarURL: imgurUrl });

//     res.status(200).json({ avatarUrl: updatedUser.avatarURL });
//   } catch (error) {
//     console.error("Error updating avatar:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
