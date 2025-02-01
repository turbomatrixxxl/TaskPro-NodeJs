const AWS = require("aws-sdk");
require("dotenv").config();

// Set your Cloudflare R2 credentials here using the environment variables
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const REGION = process.env.R2_REGION; // Region set to 'eu'

const s3Client = new AWS.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
  endpoint: process.env.R2_ENDPOINTS, // R2 endpoint from the .env file
  signatureVersion: "v4",
  s3BucketEndpoint: true,
});

module.exports = { s3Client };
