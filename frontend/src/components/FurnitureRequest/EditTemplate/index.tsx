import styles from "@/components/FurnitureRequest/EditTemplate/styles.module.css";
import { useContext, useState } from "react";
import {
  FurnitureItem,
  addFurnitureItem,
  updateFurnitureItem,
  deleteFurnitureItem,
  CreateFurnitureItem,
} from "@/api/FurnitureItems";
import { FurnitureItemSelection } from "@/components/VSRForm/FurnitureItemSelection";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import TextField from "@/components/shared/input/TextField";
import { UserContext } from "@/contexts/userContext";
3;
import { Checkbox } from "@mui/material";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { Button } from "@/components/shared/Button";
import { NotificationBanner } from "@/components/shared/NotificationBanner";
import { ConfirmDiscardEditsModal } from "@/components/shared/ConfirmDiscardEditsModal";

enum FurnitureItemAction {
  NONE,
  CREATE,
  EDIT,
  DELETE,
}

export interface EditTemplateProps {
  furnitureItems: FurnitureItem[];
  categoryTitle: string;
  categoryName: string;
  isEditing: boolean;
  isDisabled: boolean;
  onBeginEditing: () => void;
  onFinishEditing: () => void;
}

export const EditTemplate = ({
  furnitureItems,
  categoryTitle,
  categoryName,
  isEditing,
  isDisabled,
  onBeginEditing,
  onFinishEditing,
}: EditTemplateProps) => {
  const { firebaseUser } = useContext(UserContext);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [discardEditsConfirmationModalOpen, setDiscardEditsConfirmationModalOpen] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);
  const [lastAction, setLastAction] = useState(FurnitureItemAction.NONE);

  const getFurnitureItemById = (itemId: string) => {
    for (const furnitureItem of furnitureItems) {
      if (furnitureItem._id === itemId) {
        return furnitureItem;
      }
    }
    return null;
  };

  const handleStartEditItem = (itemId: string) => {
    const furnitureItem = getFurnitureItemById(itemId);
    setEditingItemId(itemId);
    setItemName(furnitureItem?.name ?? "");
    setAllowMultiple(furnitureItem?.allowMultiple ?? false);
  };

  const onDelete = async () => {
    setLoading(true);
    setLastAction(FurnitureItemAction.DELETE);
    setSuccessNotificationOpen(false);
    setErrorNotificationOpen(false);

    const firebaseToken = await firebaseUser?.getIdToken();
    if (!firebaseToken || editingItemId === null) {
      setErrorNotificationOpen(true);
      setLoading(false);
      return;
    }
    const response = await deleteFurnitureItem(editingItemId, firebaseToken);
    if (response.success) {
      setSuccessNotificationOpen(true);
      onFinishEditing();
    } else {
      console.error(`Cannot delete Furniture Item. Error: ${response.error}`);
      setErrorNotificationOpen(true);
    }
    setConfirmDeleteModal(false);
    setLoading(false);
    resetState();
  };

  const handleAddNewItem = () => {
    setIsAddingNewItem(true);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setSuccessNotificationOpen(false);
    setErrorNotificationOpen(false);

    if (isAddingNewItem) {
      setLastAction(FurnitureItemAction.CREATE);
      const createFurnitureItem: CreateFurnitureItem = {
        category: categoryName,
        name: itemName,
        allowMultiple: allowMultiple,
        categoryIndex: furnitureItems.length + 1,
      };
      const firebaseToken = await firebaseUser?.getIdToken();
      if (!firebaseToken) {
        setErrorNotificationOpen(true);
        setLoading(false);
        return;
      }
      const response = await addFurnitureItem(createFurnitureItem, firebaseToken);
      if (response.success) {
        setSuccessNotificationOpen(true);
        onFinishEditing();
      } else {
        console.error(`Cannot create Furniture Item. Error: ${response.error}`);
        setErrorNotificationOpen(true);
      }
    } else if (editingItemId !== null) {
      setLastAction(FurnitureItemAction.EDIT);
      const furnitureItem = getFurnitureItemById(editingItemId);
      if (furnitureItem === null) {
        setErrorNotificationOpen(true);
        setLoading(false);
        return;
      }
      const editFurnitureItem: FurnitureItem = {
        _id: furnitureItem._id,
        category: categoryName,
        name: itemName,
        allowMultiple: allowMultiple,
        categoryIndex: furnitureItem.categoryIndex,
      };
      const firebaseToken = await firebaseUser?.getIdToken();
      if (!firebaseToken) {
        setLoading(false);
        return;
      }
      const response = await updateFurnitureItem(
        furnitureItem._id,
        editFurnitureItem,
        firebaseToken,
      );
      if (response.success) {
        setSuccessNotificationOpen(true);
        onFinishEditing();
      } else {
        console.error(`Cannot edit Furniture Item. Error: ${response.error}`);
        setErrorNotificationOpen(true);
      }
    } else {
      setErrorNotificationOpen(true);
    }

    setLoading(false);
    resetState();
  };

  const resetState = () => {
    setIsAddingNewItem(false);
    setEditingItemId(null);
    setItemName("");
    setAllowMultiple(false);
    setConfirmDeleteModal(false);
  };

  const canSelectAnotherItem = isEditing && !isAddingNewItem && !editingItemId;

  return (
    <>
      <div className={`${styles.column} ${isEditing ? styles.boxShadow : ""}`}>
        {isEditing ? (
          <p className={styles.selectTag}> Select an item to edit or add a new item</p>
        ) : null}
        <FieldDetail title={categoryTitle}>
          <div className={styles.column}>
            <div className={styles.chipContainer}>
              {furnitureItems.map((furnitureItem) => (
                <FurnitureItemSelection
                  isSelected={editingItemId === furnitureItem._id}
                  isActive={false}
                  isDisabled={!canSelectAnotherItem}
                  key={furnitureItem._id}
                  furnitureItem={furnitureItem}
                  onChipClicked={() => {
                    if (canSelectAnotherItem) {
                      handleStartEditItem(furnitureItem._id);
                    }
                  }}
                />
              ))}
            </div>

            {isDisabled ? null : isEditing ? (
              <>
                {isAddingNewItem || editingItemId !== null ? (
                  <>
                    <div className={styles.spacer} />
                    <TextField
                      label="Item Name"
                      variant="outlined"
                      placeholder="Enter an Item Name"
                      required={false}
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />

                    <div className={styles.checkboxRow}>
                      <Checkbox
                        checked={allowMultiple}
                        onChange={(_, checked) => setAllowMultiple(checked)}
                        sx={{
                          color: "#102D5F",
                          "&.Mui-checked": {
                            color: "#102D5F",
                          },
                        }}
                      />
                      <p className={styles.multipleQuantityText}>Multiple Quantities</p>
                    </div>
                  </>
                ) : null}

                <div className={styles.buttonsRow}>
                  {!isAddingNewItem && !editingItemId ? (
                    <Button
                      variant="primary"
                      outlined={false}
                      className={styles.roundButton}
                      onClick={handleAddNewItem}
                      text="Add New Option"
                      iconPath="/ic_add.svg"
                      iconAlt="Add"
                    />
                  ) : null}

                  {editingItemId ? (
                    <Button
                      variant="error"
                      outlined={false}
                      className={styles.roundButton}
                      onClick={() => setConfirmDeleteModal(true)}
                      text="Delete Item"
                      iconPath="/mdi_trash_light.svg"
                      iconAlt="Delete"
                    />
                  ) : null}

                  {!isAddingNewItem || editingItemId ? <div className={styles.spacer} /> : null}

                  <Button
                    variant="error"
                    outlined
                    onClick={() => {
                      if (
                        (isAddingNewItem && (itemName || allowMultiple)) ||
                        (editingItemId &&
                          (itemName !== getFurnitureItemById(editingItemId)?.name ||
                            allowMultiple !== getFurnitureItemById(editingItemId)?.allowMultiple))
                      ) {
                        setDiscardEditsConfirmationModalOpen(true);
                      } else {
                        onFinishEditing();
                        resetState();
                      }
                    }}
                    text={isAddingNewItem || editingItemId ? "Discard Edits" : "Cancel"}
                    iconPath="/ic_close_red.svg"
                    iconAlt="Close"
                  />

                  {isAddingNewItem || editingItemId ? (
                    <Button
                      variant="primary"
                      outlined={false}
                      onClick={handleSaveChanges}
                      text="Save Changes"
                      iconPath="/ic_check.svg"
                      iconAlt="Check"
                      loading={
                        loading &&
                        (lastAction === FurnitureItemAction.CREATE ||
                          lastAction === FurnitureItemAction.EDIT)
                      }
                    />
                  ) : null}
                </div>
              </>
            ) : (
              <div className={styles.buttonsRow}>
                <Button
                  className={styles.editButton}
                  variant="primary"
                  outlined={false}
                  iconPath="/ic_edit_light.svg"
                  iconAlt="Edit"
                  text="Edit Section"
                  onClick={isEditing ? onFinishEditing : onBeginEditing}
                />
              </div>
            )}
          </div>
        </FieldDetail>
      </div>

      <ConfirmDeleteModal
        isOpen={confirmDeleteModal}
        onClose={() => setConfirmDeleteModal(false)}
        title={"Delete Furniture Item"}
        content={"Are you sure you want to delete the selected Furniture Item?"}
        cancelText={"Continue Editing"}
        confirmText={"Delete Item"}
        buttonLoading={false}
        onConfirm={onDelete}
      />

      <ConfirmDiscardEditsModal
        isOpen={discardEditsConfirmationModalOpen}
        onClose={() => setDiscardEditsConfirmationModalOpen(false)}
        onDiscardChanges={() => {
          onFinishEditing();
          resetState();
        }}
      />

      {/* Success/error notifications */}
      <NotificationBanner
        variant="success"
        isOpen={successNotificationOpen}
        mainText={`Item ${lastAction === FurnitureItemAction.CREATE ? "Added" : lastAction === FurnitureItemAction.EDIT ? "Updated" : FurnitureItemAction.DELETE ? "Deleted" : "[Unknown Action]"} Successfully`}
        onDismissClicked={() => setSuccessNotificationOpen(false)}
      />
      <NotificationBanner
        variant="error"
        isOpen={errorNotificationOpen}
        mainText={`Unable to ${lastAction === FurnitureItemAction.CREATE ? "Add" : lastAction === FurnitureItemAction.EDIT ? "Update" : lastAction === FurnitureItemAction.DELETE ? "Delete" : "[Unknown Action]"} Item`}
        subText="An error occurred, please check your internet connection or try again later"
        onDismissClicked={() => setErrorNotificationOpen(false)}
      />
    </>
  );
};
