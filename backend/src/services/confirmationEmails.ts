import ConfirmationEmailModel from "src/models/confirmationEmail";

const DEFAULT_CONFIRMATION_EMAIL_HTML =
  "<p>Dear [Recipient],</p>\n<p></p>\n<p>Thank you for submitting a Veteran Service Request (VSR) form.</p>\n<p></p>\n<p>Your VSR form has been <ins>approved</ins>. The next step is to <ins>schedule your pick-up appointment</ins>. To ensure a smooth process, please review the following information:</p>\n<p></p>\n<p><strong>Appointment Availability &amp; Upcoming Closure Dates</strong></p>\n<ul>\n<li>Appointments are available on <ins>Tuesdays, Thursdays, and Saturdays from 10:00 AM to 3:00 PM</ins>.</li>\n<li>Please s<ins>pecify your preferred appointment day and time when responding to this email</ins>.</li>\n<li>Please note that we will not be scheduling appointments on Thursday, November 23rd (Thanksgiving) and Saturday, December 2nd.</li>\n</ul>\n<p></p>\n<p><strong>Appointment Confirmation &amp; Details</strong></p>\n<ul>\n<li>Once you respond with your preferred date and time, we'll promptly reserve your spot and provide you with the appointment protocol, address, and instructions.</li>\n<li>On the scheduled day, please ensure you come prepared to pick up your items.</li>\n</ul>\n<p></p>\n<p><strong>Eligibility &amp; Proof of Service</strong></p>\n<ul>\n<li>Our services are reserved for Veterans, Active Military, Reservists, and their immediate family members (spouses and school-aged children residing with them).</li>\n<li><ins>Proof of service, such as a VA Card, DD214, or Active Military card, will be required</ins> at the appointment.</li>\n</ul>\n<p></p>\n<p><strong>Transportation</strong></p>\n<ul>\n<li>Remember to arrange your own transportation to take the items you request.</li>\n<li>We advise against waiting until the last minute to rent a truck, as availability may be limited.</li>\n</ul>\n<p></p>\n<p><strong>Location Information</strong></p>\n<ul>\n<li>We are located in Anaheim, Orange County.</li>\n</ul>\n<p></p>\n<p><strong>Note</strong></p>\n<ul>\n<li>Please remember that items are donated from the community as a way of saying THANK YOU FOR YOUR SERVICE, so we are like a cashless thrift store environment.</li>\n<li>Our services are not extended to family members and friends who have not served our country.</li>\n</ul>\n<p></p>\n<p><strong>Stay connected with us</strong></p>\n<p>Facebook:  <ins>@patriotsandpaws</ins></p>\n<p>Instagram:  <ins>@patriotsandpaws</ins></p>\n<p>X:                <ins>@PatriotsandPaws</ins></p>\n<p></p>\n<p>Thank you for reaching out to us. We're here to support you.</p>\n<p></p>\n<p>Best regards,</p>\n<p>Patriots and Paws</p>\n<p>veteran@patriotsandpaws.org</p>\n";

export const RECIPIENT_TEXT = "[Recipient]";

export const PAP_LOGO_HTML =
  '<img src="cid:pap_logo.png" alt="Patriots & Paws Logo" width="446" height="217" />';

/**
 * Retrieves the current confirmation email template from the MongoDB database,
 * creating it with the default HTML if it does not exist.
 */
export const retrieveConfirmaionEmail = async () => {
  let confirmationEmail = await ConfirmationEmailModel.findOne();
  if (confirmationEmail === null) {
    confirmationEmail = await ConfirmationEmailModel.create({
      html: DEFAULT_CONFIRMATION_EMAIL_HTML,
    });
  }
  return confirmationEmail;
};

/**
 * Saves the new HTML for the confirmation email to the database. Assumes
 * that the HTML has already been validated and sanitized.
 */
export const updateConfirmationEmail = async (newHTML: string) => {
  const confirmationEmail = await retrieveConfirmaionEmail();
  const updatedConfirmationEmail = await ConfirmationEmailModel.findByIdAndUpdate(
    confirmationEmail._id,
    {
      html: newHTML,
    },
    { new: true },
  );
  return updatedConfirmationEmail;
};
