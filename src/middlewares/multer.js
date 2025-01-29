const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Define storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "taskpro_avatars", // Cloudinary folder where images will be stored
    format: async (req, file) => "png", // Convert all images to PNG format
    public_id: (req, file) => `${req.user._id}-${Date.now()}`,
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Multer instance using Cloudinary
const upload = multer({ storage, fileFilter });

module.exports = upload;
