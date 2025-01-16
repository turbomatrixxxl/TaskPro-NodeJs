const express = require("express");
const router = express.Router();
const { sendHelpRequest } = require("../../controllers/helpControllers");

// POST route for sending help request email
router.post("/help-request", sendHelpRequest);

module.exports = router;
