import React, { useContext, useState } from "react";
import styles from "@/components/Profile/UserProfile/styles.module.css";
import Image from "next/image";
import { Avatar, ClickAwayListener, Popper } from "@mui/material";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { UserContext } from "@/contexts/userContext";
import { deleteUser } from "@/api/Users";
import { ChangePasswordModal } from "@/components/Profile/ChangePasswordModal";

export interface UserProps {
  uid: string;
  name: string;
  email: string;
  afterChangeUser: () => unknown;
}
export function UserProfile({ uid, name, email, afterChangeUser }: UserProps) {
  const { firebaseUser, setSuccessNotificationOpen, setErrorNotificationOpen } =
    useContext(UserContext);
  const [actionsPopupAnchorEl, setActionsPopupAnchorEl] = useState<HTMLElement | null>(null);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleConfirmDeleteUser = async () => {
    setLoadingDelete(true);
    setSuccessNotificationOpen(null);
    setErrorNotificationOpen(null);

    const firebaseToken = await firebaseUser?.getIdToken();
    const result = await deleteUser(uid, firebaseToken!);
    if (result.success) {
      setSuccessNotificationOpen("deleteUser");
    } else {
      console.error(`Error deleting user: ${result.error}`);
      setErrorNotificationOpen("deleteUser");
    }
    setLoadingDelete(false);
    setDeleteUserModalOpen(false);
    afterChangeUser();
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar style={{ width: 93, height: 93, fontSize: 48 }}>{name?.slice(0, 1)}</Avatar>
        <div className={styles.row}>
          <p className={styles.name}>{name}</p>
          <p className={styles.email}>{email}</p>
          <div />
        </div>
        <Image
          src="/ic_settings.svg"
          alt="Gear"
          width={24}
          height={24}
          className={styles.settingsIcon}
          onClick={(e) => {
            setActionsPopupAnchorEl(e.target as HTMLElement);
          }}
        />
      </div>
      {actionsPopupAnchorEl === null ? null : (
        <ClickAwayListener onClickAway={() => setActionsPopupAnchorEl(null)}>
          <Popper
            anchorEl={actionsPopupAnchorEl}
            open={actionsPopupAnchorEl !== null}
            placement="left-start"
          >
            <div className={styles.menuRoot}>
              <div
                className={styles.menuRow}
                onClick={() => {
                  setChangePasswordModalOpen(true);
                  setActionsPopupAnchorEl(null);
                }}
              >
                <Image width={24} height={24} src="/ic_lock.svg" alt="Lock" />
                <p className={styles.menuText}>Change Password</p>
              </div>
              <div
                className={styles.menuRow}
                onClick={() => {
                  setDeleteUserModalOpen(true);
                  setActionsPopupAnchorEl(null);
                }}
              >
                <Image width={24} height={24} src="/mdi_trash.svg" alt="Delete" />
                <p className={`${styles.menuText} ${styles.redText}`}>Remove User</p>
              </div>
            </div>
          </Popper>
        </ClickAwayListener>
      )}

      <ChangePasswordModal
        uid={uid}
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        afterChangePassword={afterChangeUser}
      />
      <ConfirmDeleteModal
        isOpen={deleteUserModalOpen}
        onClose={() => setDeleteUserModalOpen(false)}
        title="Delete User"
        content="Deleting a user denies them all access to this web application. Are you sure you’d like to remove this user?"
        cancelText="Cancel"
        confirmText="Yes, Remove User"
        buttonLoading={loadingDelete}
        onConfirm={handleConfirmDeleteUser}
      />
    </>
  );
}
