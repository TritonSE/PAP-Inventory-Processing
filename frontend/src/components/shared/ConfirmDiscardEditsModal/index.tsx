import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/shared/Button";
import styles from "@/components/shared/ConfirmDiscardEditsModal/styles.module.css";

interface ConfirmDiscardEditsModalProps {
  isOpen: boolean;
  onClose: () => unknown;
  onDiscardChanges: () => unknown;
}

export const ConfirmDiscardEditsModal = ({
  isOpen,
  onClose,
  onDiscardChanges,
}: ConfirmDiscardEditsModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Discard Changes"
      content="Are you sure you want to discard your changes?"
      bottomRow={
        <div className={styles.modalBottomRow}>
          <Button
            variant="primary"
            outlined
            text="Keep Editing"
            className={styles.modalButton}
            onClick={onClose}
            style={{ width: "100%" }}
          />
          <Button
            variant="error"
            outlined={false}
            text="Discard Changes"
            className={styles.modalButton}
            onClick={() => {
              onDiscardChanges();
              onClose();
            }}
            style={{ width: "100%" }}
          />
        </div>
      }
    />
  );
};
