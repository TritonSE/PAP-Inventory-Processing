import { Modal } from "@mui/material";
import styles from "@/components/VSRForm/ConfirmVSRSubmissionModal/styles.module.css";
import Image from "next/image";

interface ConfirmVSRSubmissionModalProps {
  isOpen: boolean;
  onClose: () => unknown;
}

/**
 * A modal that displays a confirmation that a VSR was submitted successfully.
 */
export const ConfirmVSRSubmissionModal = ({ isOpen, onClose }: ConfirmVSRSubmissionModalProps) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <button onClick={onClose} className={styles.closeButton}>
          <Image src="/ic_close_large.svg" alt="close" width={24} height={24} />
        </button>
        <h2 className={styles.title}>Submitted successfully!</h2>
        <p className={styles.content}>
          A copy of your submitted VSR form has been sent to your email. We&apos;ll review it
          promptly and respond via email as soon as possible. Allow up to 48 business hours to be
          contacted for appointment scheduling.
          <br></br>
          <br></br>
          Please check your spam folder if you don&apos;t receive a response within 48 business
          hours.
          <br></br>
          <br></br>
          If you need to make changes to your VSR form, submit another VSR form and let us know at{" "}
          <a
            style={{ textDecorationLine: "underline", fontStyle: "italic" }}
            href="veteran@patriotsandpaws.org"
          >
            veteran@patriotsandpaws.org.
          </a>
        </p>
      </div>
    </Modal>
  );
};
