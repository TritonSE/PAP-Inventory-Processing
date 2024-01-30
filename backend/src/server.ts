/**
 * Initializes mongoose and express.
 */

// import "module-alias/register";
// import mongoose from "mongoose";

// import app from "src/app";
// import env from "src/util/validateEnv";

// const PORT = env.PORT;
// const MONGODB_URI = env.MONGODB_URI;

// mongoose
//   .connect(MONGODB_URI)
//   .then(() => {
//     console.log("Mongoose connected!");
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}.`);
//     });
//   })
//   .catch(console.error);
import "dotenv/config";
import nodemailer from "nodemailer";
import env from "./util/validateEnv";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_APP_PASSWORD,
  },
});
const mailOptions = {
  from: env.EMAIL_USER,
  to: "ben332004@gmail.com",
  subject: "Node.js emailing!",
  text: "Hey there Ben!",
};
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(`Error: ${error}`);
  } else {
    console.log(`Email sent: ${info.response}`);
  }
});
