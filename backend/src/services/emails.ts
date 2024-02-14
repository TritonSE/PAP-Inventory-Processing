import "dotenv/config";
import nodemailer from "nodemailer";
import env from "../util/validateEnv";

/**
 * Sends a notification email to PAP staff when a VSR is submitted.
 * Throws an error if the email could not be sent.
 *
 * @param name Name of veteran who submitted the VSR
 * @param email Email address of veteran who submitted the VSR
 */
const sendVSRNotificationEmailToStaff = async (name: string, email: string) => {
  const EMAIL_SUBJECT = "New VSR Submitted";
  const EMAIL_BODY = `A new VSR was submitted by ${name} from ${email}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: env.EMAIL_USER,
    to: env.EMAIL_NOTIFICATIONS_RECIPIENT,
    subject: EMAIL_SUBJECT,
    text: EMAIL_BODY,
  };

  await transporter.sendMail(mailOptions);
};

export { sendVSRNotificationEmailToStaff };
