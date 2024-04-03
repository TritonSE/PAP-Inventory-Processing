import styles from "@/components/shared/BaseModal/styles.module.css";
import { Modal } from "@mui/material";
import Image from "next/image";
import { ReactElement } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => unknown;
  title: string;
  content: string | ReactElement;
  bottomRow: ReactElement | null;
}

/**
 * A base component for a modal with a title, content, and a bottom row.
 */
export const BaseModal = ({ isOpen, onClose, title, content, bottomRow }: BaseModalProps) => {
  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <div className={styles.root}>
          <button onClick={onClose} className={styles.closeButton}>
            <Image src="/ic_close_large.svg" alt="close" width={24} height={24} />
          </button>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.content}>{content}</p>
          <div className={styles.bottomRowContainer}>{bottomRow}</div>
        </div>
      </Modal>
    </>
  );
};
