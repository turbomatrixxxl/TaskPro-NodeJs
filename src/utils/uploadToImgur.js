const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const IMGUR_CLIENT_ID = "c2cdebbc16a2b5f";
// Replace with your Imgur Client ID

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
    console.error("Error uploading to Imgur:", error.message);
    throw error;
  }
}

// Example usage:
// uploadToImgur("./temp/my-avatar.jpg").then(console.log);
