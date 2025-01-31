const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const IMGUR_CLIENT_ID = "592e06e7481945a"; // Replace with your actual Imgur Client ID

async function uploadToImgur(imagePath) {
  try {
    const form = new FormData();
    form.append("image", fs.createReadStream(imagePath));

    const response = await axios.post("https://api.imgur.com/3/image", form, {
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        ...form.getHeaders(),
      },
    });

    return response.data.data.link; // Return the image URL
  } catch (error) {
    console.error(
      "Error uploading to Imgur:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// const axios = require("axios");
// const FormData = require("form-data");

// const uploadToImgur = async (fileBuffer) => {
//   try {
//     const formData = new FormData();
//     formData.append("image", fileBuffer, { filename: "upload.jpg" });

//     const response = await axios.post(
//       "https://api.imgur.com/3/image",
//       formData,
//       {
//         headers: {
//           Authorization: `592e06e7481945a`, // Replace with your Imgur Client ID
//           ...formData.getHeaders(), // Important for handling multipart/form-data
//         },
//       }
//     );

//     return response.data.data.link; // Return the Imgur URL
//   } catch (error) {
//     console.error(
//       "Error uploading to Imgur:",
//       error.response?.data || error.message
//     );
//     throw new Error("Failed to upload image to Imgur");
//   }
// };

module.exports = { uploadToImgur };
