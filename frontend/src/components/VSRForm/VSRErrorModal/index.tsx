import styles from "@/components/VSRForm/VSRErrorModal/styles.module.css";
import { Modal } from "@mui/material";
import { ReactNode } from "react";
import Image from "next/image";

export interface VSRErrorModalProps {
  isOpen: boolean;
  onClose: () => unknown;
  imageComponent: ReactNode;
  title: string;
  content: string | ReactNode;
  buttonText: string;
  onButtonClicked: () => unknown;
}

/**
 * A modal that displays an error with loading/submitting a VSR.
 */
export const VSRErrorModal = ({
  isOpen,
  onClose,
  imageComponent,
  title,
  content,
  buttonText,
  onButtonClicked,
}: VSRErrorModalProps) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <button onClick={onClose} className={styles.closeButton}>
          <Image src="/ic_close_large.svg" alt="close" width={24} height={24} />
        </button>
        {imageComponent}
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.content}>{content}</p>
        <button className={styles.button} onClick={onButtonClicked}>
          {buttonText}
        </button>
      </div>
    </Modal>
  );
};
