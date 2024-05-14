import { deleteVSR } from "@/api/VSRs";
import styles from "@/components/shared/ConfirmDeleteModal/styles.module.css";
import { UserContext } from "@/contexts/userContext";
import { ReactElement, ReactNode, useContext, useState } from "react";
import { SuccessNotification } from "@/components/shared/SuccessNotification";
import { ErrorNotification } from "@/components/Errors/ErrorNotification";
import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/shared/Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => unknown;
  title: string;
  content: string | ReactElement;
  cancelText: string;
  confirmText: string;
  buttonLoading: boolean;
  onConfirm: () => unknown;
}

/**
 * A modal that asks the user to confirm whether they want to delete one or more
 * VSRs, and then deletes them if they confirm that they want to.
 */
export const ConfirmDeleteModal = ({ isOpen, onClose, title, content, cancelText, confirmText, buttonLoading, onConfirm}: ConfirmDeleteModalProps) => {
  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        content={content}
        bottomRow={
          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              outlined
              text={cancelText}
              onClick={onClose}
              className={styles.button}
            />
            <Button
              variant="error"
              outlined={false}
              text={confirmText}
              onClick={onConfirm}
              loading={buttonLoading}
              className={styles.button}
            />
          </div>
        }
      />

    </>
  );
};
