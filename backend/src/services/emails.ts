import "dotenv/config";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import {
  PAP_LOGO_HTML,
  RECIPIENT_TEXT,
  retrieveConfirmaionEmail,
} from "src/services/confirmationEmails";
import env from "src/util/validateEnv";

const trimmedFrontendUrl = env.FRONTEND_ORIGIN.replace(
  // Trim trailing slash from frontend URL, if there is one
  /\/$/gi,
  "",
);

const sendEmail = async (options: Mail.Options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: env.EMAIL_USER,
    ...options,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Sends a notification email to PAP staff when a VSR is submitted.
 * Throws an error if the email could not be sent.
 *
 * @param name Name of veteran who submitted the VSR
 * @param email Email address of veteran who submitted the VSR
 * @param id ID of the submitted VSR, used to construct a link to the VSR on our web app
 */
const sendVSRNotificationEmailToStaff = async (name: string, email: string, id: string) => {
  const EMAIL_SUBJECT = "New VSR Submitted";
  const EMAIL_BODY = `A new VSR was submitted by ${name} from ${email}. You can view it at ${trimmedFrontendUrl}/staff/vsr/${id}`;

  await sendEmail({
    to: env.EMAIL_NOTIFICATIONS_RECIPIENT,
    subject: EMAIL_SUBJECT,
    text: EMAIL_BODY,
  });
};

/**
 * Sends a confirmation email to the veteran who submitted a VSR.
 * Throws an error if the email could not be sent.
 *
 * @param name Name of veteran who submitted the VSR
 * @param email Email address of veteran who submitted the VSR
 */
const sendVSRConfirmationEmailToVeteran = async (name: string, email: string) => {
  const EMAIL_SUBJECT = "VSR Submission Confirmation";
  const confirmationEmail = await retrieveConfirmaionEmail();
  const emailHTML = confirmationEmail.html.replace(RECIPIENT_TEXT, name) + PAP_LOGO_HTML;

  await sendEmail({
    to: email,
    subject: EMAIL_SUBJECT,
    html: emailHTML,
    attachments: [
      {
        filename: "pap_logo.png",
        path: `${__dirname}/../../public/pap_logo.png`,
        cid: "pap_logo.png",
      },
    ],
  });
};

const sendOwnPasswordChangedNotificationEmail = async (email: string) => {
  const EMAIL_SUBJECT = "PAP Application Password Change Confirmation";
  const EMAIL_BODY = `Your password for the ${email} account has been changed.`;

  await sendEmail({
    to: email,
    subject: EMAIL_SUBJECT,
    text: EMAIL_BODY,
  });
};

const sendPasswordChangedEmailToAdmin = async (email: string) => {
  const EMAIL_SUBJECT = "PAP Application Password Change Notification";
  const EMAIL_BODY = `The password for the ${email} account has been changed.`;

  await sendEmail({
    to: env.EMAIL_NOTIFICATIONS_RECIPIENT,
    subject: EMAIL_SUBJECT,
    text: EMAIL_BODY,
  });
};

export {
  sendVSRNotificationEmailToStaff,
  sendVSRConfirmationEmailToVeteran,
  sendOwnPasswordChangedNotificationEmail,
  sendPasswordChangedEmailToAdmin,
};
