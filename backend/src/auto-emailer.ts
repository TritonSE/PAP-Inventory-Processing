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

const sendMail = async (name:string, email:string) => {

  const EMAIL_SUBJECT = "New VSR Submitted";
  const EMAIL_BODY = `A new VSR was submitted by ${name} from ${email}`;

  const mailOptions = {
    from: env.EMAIL_USER,
    to: env.EMAIL_NOTIFICATIONS_RECIPIENT,
    subject: EMAIL_SUBJECT,
    text: EMAIL_BODY,
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log("email has been sent");
  } catch (error) {
      console.error(error);
  }
}