// cloudinary multer
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Set up Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", // Folder in Cloudinary to store the images
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed formats
    transformation: [{ width: 32, height: 32, crop: "fill" }], // Resize and crop
    resource_type: "image", // Ensures Cloudinary treats it as an image
  },
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Initialize multer with Cloudinary storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;

// imgur multer

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Use absolute path for reliability
//     cb(null, path.join(__dirname, "../public/avatars"));
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//     );
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Only images are allowed."), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

// module.exports = upload;

// aws multer s3

// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const path = require("path");
// const s3Client = require("../config/s3Client"); // Import your s3Client configuration

// // Configure multer to upload to R2 using s3Client
// const upload = multer({
//   storage: multerS3({
//     s3: s3Client,
//     bucket: process.env.BUCKET_NAME || "taskpro-avatars", // Use the bucket name from your environment variables
//     acl: "public-read", // You can change the ACL as needed (e.g., private, public-read)
//     key: function (req, file, cb) {
//       // Generate a unique file name for each upload
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(null, `avatars/${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//     },
//   }),
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Invalid file type. Only images are allowed."), false);
//     }
//   },
// });

// module.exports = upload;
