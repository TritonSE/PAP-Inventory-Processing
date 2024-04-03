import { deleteVSR } from "@/api/VSRs";
import styles from "@/components/shared/DeleteVSRsModal/styles.module.css";
import { UserContext } from "@/contexts/userContext";
import { CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { SuccessNotification } from "@/components/shared/SuccessNotification";
import { ErrorNotification } from "@/components/Errors/ErrorNotification";
import { BaseModal } from "@/components/shared/BaseModal";

interface DeleteVSRsModalProps {
  isOpen: boolean;
  onClose: () => unknown;
  afterDelete: () => unknown;
  vsrIds: string[];
}

/**
 * A modal that asks the user to confirm whether they want to delete one or more
 * VSRs, and then deletes them if they confirm that they want to.
 */
export const DeleteVSRsModal = ({ isOpen, onClose, afterDelete, vsrIds }: DeleteVSRsModalProps) => {
  const { firebaseUser } = useContext(UserContext);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  const onDelete = async () => {
    if (loadingDelete || !firebaseUser) {
      return;
    }

    setSuccessNotificationOpen(false);
    setErrorNotificationOpen(false);
    setLoadingDelete(true);

    try {
      const firebaseToken = await firebaseUser.getIdToken();
      if (!firebaseToken) {
        setLoadingDelete(false);
        return;
      }

      await Promise.all(
        vsrIds.map((vsrId) =>
          deleteVSR(vsrId, firebaseToken).then((res) => {
            if (res.success) {
              return Promise.resolve();
            } else {
              return Promise.reject(res.error);
            }
          }),
        ),
      );

      setSuccessNotificationOpen(true);
      afterDelete();
    } catch (error) {
      console.error(`Error deleting VSR(s): ${error}`);
      setErrorNotificationOpen(true);
    } finally {
      setLoadingDelete(false);
      onClose();
    }
  };

  return (
    <>
      {" "}
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Delete VSR(s)"
        content={
          <>
            {"Deleted VSR’s "}
            <span style={{ fontWeight: 700 }}>cannot</span>
            {" be recovered. Are you sure you’d like to delete the selected VSR forms ("}
            {vsrIds.length}
            {")?"}
          </>
        }
        bottomRow={
          <>
            <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
              Cancel
            </button>
            <button
              className={`${styles.button} ${styles.deleteButton}`}
              disabled={loadingDelete}
              onClick={onDelete}
            >
              {loadingDelete ? <CircularProgress size={24} /> : "Delete VSR(s)"}
            </button>
          </>
        }
      />
      <SuccessNotification
        isOpen={successNotificationOpen}
        mainText="VSR(s) Deleted Successfully"
        actionText="Dismiss"
        onActionClicked={() => setSuccessNotificationOpen(false)}
      />
      <ErrorNotification
        isOpen={errorNotificationOpen}
        mainText="Unable to Delete VSR(s)"
        subText="There was an error deleting the VSR(s). Please try again later."
        actionText="Dismiss"
        onActionClicked={() => setErrorNotificationOpen(false)}
      />
    </>
  );
};
