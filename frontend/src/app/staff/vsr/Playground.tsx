import { useState } from "react";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

export const Playground = () => {
  const html = `<p>Dear ${"Benjamin Johnson"},</p>\
  <p>Thank you for submitting a veteran service request (VSR).</p>\
  <p>\
    <strong>We schedule appointments on Tuesdays, Thursday, and Saturdays from 10-3pm. You need to be specific about what day and time you want to make your appointment.</strong>\
  </p>\
  \
  <p>\
    <strong\
      >PLEASE NOTE: We will not be making appointments on THURSDAY, NOVEMBER 23RD (THANKSGIVING) OR SATURDAY, DECEMBER 2nd.</strong\
    >\
  </p>\
  \
  <p>\
    <strong\
      >Respond to this email and let us know what day and time will work and we will put you down.</strong\
    >\
  </p>\
  \
  <p>You pick up your items on the date and time of your appointment. You need to come prepared on that day.</p>\
  <p>We will help you with as much as we can on your list.</p>\
  <p>Please remember that items are donated from the community as a way of saying THANK YOU FOR YOUR SERVICE, so we are like a cashless thrift store environment.</p>\
  <p>You will need to provide your own transportation for all your items you are requesting.</p>\
  <p>\
    <span style="color: rgb(31, 73, 125)">Wherever you are going to rent a truck, don&apos;t wait to the last minute to rent a truck as there might not be one available.</span>\
  </p>\
  <p>We are located in the Anaheim, in Orange County.</p>\
  <p>Once we confirm your appointment we will send you the warehouse protocol and address.</p>\
  <p>\
    <span style="color: rgb(31, 73, 125)">Items in the warehouse have been donated from the General Public and are strictly for Veterans, Active Military and Reservists and their immediate family (wives and school aged children) who live with them. The Veteran/Active Duty/Reservist has to be at appointment and will need to show proof of service, such as a VA Card, DD214 or Active Military card.</span>\
  </p>\
  <p>They are not for family members and friends who have not served our Country.</p>\
  <p>Thank you for contacting us.</p>\
  <p>Volunteer</p>\
  <p><a href="mailto:veteran@patriotsandpaws.org"> veteran@patriotsandpaws.org</a></p>\
  <img src="/pap_logo.png" alt="Patriots & Paws Logo" width="446" height="217" />\
  <p>Facebook <a href="https://www.facebook.com/pages/Patriots-and-Paws/283613748323930">https://www.facebook.com/pages/Patriots-and-Paws/283613748323930</a>\
  </p>\
  <p>Twitter @patriotsandpaws</p>\
  <p>Instagram patriotsandpaws</p>\
  `;
  const contentBlock = htmlToDraft(html);
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);

  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));

  return (
    <>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={setEditorState}
      />
      <textarea disabled value={draftToHtml(convertToRaw(editorState.getCurrentContent()))} />
    </>
  );
};
