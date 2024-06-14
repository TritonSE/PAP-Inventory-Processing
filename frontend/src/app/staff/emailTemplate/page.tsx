"use client";

import { getConfirmationEmail, updateConfirmationEmail } from "@/api/ConfirmationEmails";
import HeaderBar from "@/components/shared/HeaderBar";
import { UserContext } from "@/contexts/userContext";
import {
  useRedirectToHomeIfNotAdmin,
  useRedirectToLoginIfNotSignedIn,
} from "@/hooks/useRedirection";
import { ComponentType, useContext, useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import { EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { NotificationBanner } from "@/components/shared/NotificationBanner";
import draftToHtml from "draftjs-to-html";
import { useDirtyForm } from "@/hooks/useDirtyForm";
import { ConfirmDiscardEditsModal } from "@/components/shared/ConfirmDiscardEditsModal";
import dynamic from "next/dynamic";
import styles from "@/app/staff/emailTemplate/page.module.css";

const Editor = dynamic(
  () =>
    import("react-draft-wysiwyg").then(
      (mod) => mod.Editor as unknown as ComponentType<EditorProps>,
    ),
  {
    ssr: false,
  },
);
const htmlToDraft =
  typeof window === "undefined" ? null : import("html-to-draftjs").then((mod) => mod.default);

export default function EditEmailTemplate() {
  const { firebaseUser } = useContext(UserContext);

  const [initialHTML, setInitialHTML] = useState("");
  const [papLogoHTML, setPAPLogoHTML] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loadingGet, setLoadingGet] = useState(false);
  const [errorGet, setErrorGet] = useState(false);

  const [loadingSave, setLoadingSave] = useState(false);
  const [successSave, setSuccessSave] = useState(false);
  const [errorSave, setErrorSave] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [discardEditsModalOpen, setDiscardEditsModalOpen] = useState(false);

  useDirtyForm({ isDirty });

  const { isTablet } = useScreenSizes();

  useRedirectToLoginIfNotSignedIn();
  useRedirectToHomeIfNotAdmin();

  const htmlToEditorState = async (html: string) => {
    if (!htmlToDraft) {
      return EditorState.createEmpty();
    }
    const contentBlock = (await htmlToDraft)(html);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    return EditorState.createWithContent(contentState);
  };

  const fetchConfirmationEmail = async () => {
    if (!firebaseUser) {
      return;
    }
    setLoadingGet(true);
    const firebaseToken = await firebaseUser.getIdToken();
    const result = await getConfirmationEmail(firebaseToken);
    if (result.success) {
      setInitialHTML(result.data.html);
      htmlToEditorState(result.data.html).then(setEditorState);
      setPAPLogoHTML(result.data.papLogoHTML.replace("cid:", "/"));
    } else {
      console.error(`Error retrieving confirmation email: ${result.error}`);
      setErrorGet(true);
    }
    setLoadingGet(false);
  };

  useEffect(() => {
    fetchConfirmationEmail();
  }, [firebaseUser]);

  const saveChanges = async () => {
    setLoadingSave(true);
    setErrorSave(false);
    setSuccessSave(false);
    const newHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const firebaseToken = await firebaseUser?.getIdToken();
    const result = await updateConfirmationEmail(firebaseToken!, newHTML);
    if (result.success) {
      setInitialHTML(result.data.html);
      htmlToEditorState(result.data.html).then(setEditorState);
      setSuccessSave(true);
    } else {
      console.error(`Error saving email changes: ${result.error}`);
      setErrorSave(true);
    }
    setLoadingSave(false);
    setIsDirty(false);
  };

  const discardChanges = async () => {
    htmlToEditorState(initialHTML).then(setEditorState);
    setIsDirty(false);
  };

  const renderButtons = () => (
    <div
      className={styles.buttonsContainer}
      style={
        isDirty
          ? {}
          : {
              opacity: 0.5,
            }
      }
    >
      <Button
        variant="error"
        outlined
        text="Discard Changes"
        iconPath="/ic_close_red.svg"
        iconAlt="Close"
        className={styles.button}
        onClick={() => setDiscardEditsModalOpen(true)}
        disabled={!isDirty}
      />
      <Button
        variant="primary"
        outlined={false}
        text="Save Changes"
        iconPath="/ic_check.svg"
        iconAlt="Check"
        className={styles.button}
        onClick={saveChanges}
        disabled={!isDirty}
        loading={loadingSave}
      />
    </div>
  );

  return (
    <>
      <HeaderBar veteranVersion={false} />
      <div className={styles.main}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>Edit Email Template</h1>
          {isTablet ? null : renderButtons()}
        </div>
        <p className={styles.description}>
          To edit the VSR confirmation email template, make your desired changes in the text field
          below, and then click &quot;Save Changes&quot;.
        </p>
        {loadingGet ? (
          <LoadingScreen />
        ) : (
          <div className={styles.formContainer}>
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={setEditorState}
              onChange={() => setIsDirty(true)}
            />
            <div dangerouslySetInnerHTML={{ __html: papLogoHTML }} />
          </div>
        )}
        {isTablet ? renderButtons() : null}

        <ConfirmDiscardEditsModal
          isOpen={discardEditsModalOpen}
          onClose={() => setDiscardEditsModalOpen(false)}
          onDiscardChanges={discardChanges}
        />

        {/* Success/error notifications */}
        <NotificationBanner
          variant="error"
          isOpen={errorGet}
          mainText="Cannot Retrieve Template"
          subText="Unable to retrieve email template. Please check your connection or try again later."
          onDismissClicked={() => setErrorGet(false)}
        />
        <NotificationBanner
          variant="success"
          isOpen={successSave}
          mainText="Changes Saved Successfully"
          onDismissClicked={() => setSuccessSave(false)}
        />
        <NotificationBanner
          variant="error"
          isOpen={errorSave}
          mainText="Error Saving Changes"
          subText="Unable to save changes. Please check your connection or try again later."
          onDismissClicked={() => setErrorSave(false)}
        />
      </div>
    </>
  );
}
