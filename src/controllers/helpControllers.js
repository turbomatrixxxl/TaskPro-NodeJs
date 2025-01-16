const sendHelpEmail = require("../services/helpServices");

const sendHelpRequest = async (req, res) => {
  try {
    const { email, comment } = req.body;

    // Call the sendHelpEmail service
    const result = await sendHelpEmail(email, comment);

    res.status(200).json({
      message: "Help request email sent successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send help request email.",
      error: error.message,
    });
  }
};

module.exports = {
  sendHelpRequest,
};
