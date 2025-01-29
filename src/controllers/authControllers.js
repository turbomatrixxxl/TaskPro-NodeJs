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

const Joi = require("joi");

const bcrypt = require("bcryptjs");

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

exports.updateUseravatar = async (req, res) => {
  try {
    const tempDir = path.join(__dirname, "../temp");
    console.log("tempDir", tempDir);

    // Create the directory if it doesn't exist
    await fs.mkdir(tempDir, { recursive: true });

    const avatarsDir = path.join(__dirname, "/public/avatars");
    console.log("avatarsDir", avatarsDir);

    // Create the directory if it doesn't exist
    await fs.mkdir(avatarsDir, { recursive: true });

    if (!req.file) {
      return res.status(404).json({ error: "There is no file to upload!" });
    }

    console.log("req.user.avatarURL", req.user.avatarURL);

    // Generate unique filename
    const uniqFilename = `${req.user._id}-${Date.now()}${path.extname(
      req.file.originalname
    )}`;
    console.log("uniqFilename", uniqFilename);

    const imagePath = req.file.path;
    console.log("imagePath", imagePath);

    const tempPath = path.join(tempDir, uniqFilename);
    console.log("tempPath", tempPath);

    // Move file to avatars directory
    await fs.rename(imagePath, tempPath);

    // Resize the image
    const image = await Jimp.read(`${tempPath}`);
    console.log("image", image);

    // Resize the image to width 250 and heigth 250.
    image.resize({ w: 68, h: 68 });

    // Save and overwrite the image
    await image.write(tempPath);

    const destinationPath = path.join(avatarsDir, uniqFilename);
    console.log("destinationPath", destinationPath);

    // Move file to avatars directory
    await fs.rename(tempPath, destinationPath);

    const updateFields = {};

    // Update user avatar URL
    const newAvatarURL = `/avatars/${uniqFilename}`;
    console.log("newAvatarURL", newAvatarURL);

    const userId = req.user._id;

    updateFields.avatarURL = newAvatarURL;

    const updatedUser = await updateUser(userId, updateFields);

    res.status(200).json({ avatarUrl: updatedUser.avatarURL });
  } catch (error) {
    console.error("Error in uploading avatar:", error.message);
    res.status(500).json({
      status: "fail",
      code: 500,
      message: error.message,
      data: "Internal Server Error",
    });
  }
};
