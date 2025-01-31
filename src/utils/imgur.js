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

    // Check if the upload was successful
    if (response.data.success) {
      console.log("Image uploaded successfully:", response.data.data.link);
      return response.data.data.link; // Return the image URL
    } else {
      throw new Error(
        "Imgur upload failed with response: " + JSON.stringify(response.data)
      );
    }
  } catch (error) {
    // Enhanced error logging
    console.error(
      "Error uploading to Imgur:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      "Failed to upload image to Imgur. Please check the server logs."
    );
  } finally {
    // Clean up the temporary file if it exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("Temporary image file deleted:", imagePath);
    }
  }
}

module.exports = { uploadToImgur };
