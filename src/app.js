/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const logger = require("morgan");

const passport = require("./passport/passportConfig");

const cors = require("cors");
const corsOptions = require("./cors");

const usersRouter = require("./routes/api/authRoutes");
const helpRouter = require("./routes/api/helpRoutes");
const userRouter = require("./routes/api/userRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

const path = require("path");

const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendGridApiKey = process.env.SENDGRID_API_KEY;
if (!sendGridApiKey) throw new Error("SendGrid API key is missing.");

sgMail.setApiKey(sendGridApiKey);

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors(corsOptions));
app.use(express.json());
// app.use(logger("tiny"));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", usersRouter);
app.use("/api", helpRouter);
app.use("/api", userRouter);

app.use(passport.initialize());

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message:
      "Use api on routes: /api/users, /api-docs , /api/theme, /api/projects, /api-helpEmail",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

module.exports = app;
