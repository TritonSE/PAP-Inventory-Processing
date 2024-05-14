import styles from "@/components/FurnitureRequest/EditTemplate/styles.module.css";
import { useContext, useState } from "react";
import {
  FurnitureItem,
  getFurnitureItems,
  addFurnitureItem,
  updateFurnitureItem,
  deleteFurnitureItem,
  CreateFurnitureItem,
} from "@/api/FurnitureItems";
import { FurnitureItemSelection } from "@/components/VSRForm/FurnitureItemSelection";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import TextField from "@/components/shared/input/TextField";
import { UserContext } from "@/contexts/userContext";
import { Checkbox, FormControlLabel } from "@mui/material";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";

export interface EditTemplateProps {
  furnitureItems: FurnitureItem[];
  categoryTitle: string;
  categoryName: string;
  isEditing: boolean;
  isDisabled: boolean;
  onBeginEditing: () => void;
  onFinishEditing: () => void;
}

//Display components

export const EditTemplate = ({
  furnitureItems,
  categoryTitle,
  categoryName,
  isEditing,
  isDisabled,
  onBeginEditing,
  onFinishEditing,
}: EditTemplateProps) => {
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const { firebaseUser, papUser } = useContext(UserContext);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

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

  const handleStopEditItem = () => {
    setEditingItemId(null);
  };

  const onDelete = async() => {
    const firebaseToken = await firebaseUser?.getIdToken();
    if (!firebaseToken || editingItemId===null) {
      return;
    }
    const response = await deleteFurnitureItem(editingItemId, firebaseToken);
    if (response.success) {
      onFinishEditing();
    } else {
      console.error(`Cannot delete Furniture Item. Error: ${response.error}`);
    }
    setConfirmDeleteModal(false);
  }

  const handleAddNewItem = () => {
    setIsAddingNewItem(true);
  };

  const handleSaveChanges = async () => {
    if (isAddingNewItem) {
      const createFurnitureItem: CreateFurnitureItem = {
        category: categoryName,
        name: itemName,
        allowMultiple: allowMultiple,
        categoryIndex: furnitureItems.length + 1,
      };
      const firebaseToken = await firebaseUser?.getIdToken();
      if (!firebaseToken) {
        return;
      }
      const response = await addFurnitureItem(createFurnitureItem, firebaseToken);
      if (response.success) {
        onFinishEditing();
      } else {
        console.error(`Cannot create Furniture Item. Error: ${response.error}`);
      }
    }

    else if (editingItemId !== null){
      const furnitureItem = getFurnitureItemById(editingItemId);
      if(furnitureItem===null){
        return; //Put error here instead
      }
      const editFurnitureItem: FurnitureItem = {
        _id: furnitureItem._id,
        category: categoryName,
        name: itemName,
        allowMultiple: allowMultiple,
        categoryIndex: furnitureItem.categoryIndex
      }
      const firebaseToken = await firebaseUser?.getIdToken();
      if (!firebaseToken) {
        return;
      }
      const response = await updateFurnitureItem(furnitureItem._id, editFurnitureItem, firebaseToken);
      if (response.success) {
        onFinishEditing();
      } else {
        console.error(`Cannot edit Furniture Item. Error: ${response.error}`);
      }
    }


    setEditingItemId(null);
    setIsAddingNewItem(false);
  };

  return (
    <div className={styles.row}>
      {isEditing ? <p> Please Select a Tag to Delete or Start Editing</p> : null}
      <FieldDetail title={categoryTitle}>
        {isEditing ? (
          <>
            <div className={styles.chipContainer}>
              {furnitureItems.map((furnitureItem) => (
                <FurnitureItemSelection
                  isActive={false}
                  key={furnitureItem._id}
                  furnitureItem={furnitureItem}
                  onChipClicked={() => {
                    handleStartEditItem(furnitureItem._id);
                  }}
                />
              ))}
            </div>

            {isAddingNewItem || editingItemId !== null ? (
              <>
                <TextField
                  label="Item Name"
                  variant="outlined"
                  placeholder="Enter an Item Name"
                  required={false}
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />

                <FormControlLabel
                  label="Multiple Quantities"
                  control={
                    <Checkbox
                      checked={allowMultiple}
                      onChange={(e, checked) => setAllowMultiple(checked)}
                    />
                  }
                />
              </>
            ) : null}

            <button className={styles.chip} onClick={handleAddNewItem} disabled={isDisabled}>
              Add New Option
            </button>

            <button
              className={styles.chip}
              onClick={e => setConfirmDeleteModal(true)}
              disabled={isDisabled}
            >
              Delete Tag
            </button>

            <button className={styles.chip} onClick={handleSaveChanges} disabled={isDisabled}>
              Save Changes
            </button>

            <button
              className={styles.chip}
              onClick={isEditing ? onFinishEditing : onBeginEditing}
              disabled={isDisabled}
            >
              Discard Edits
            </button>
          </>
        ) : (
          <>
            <div className={styles.chipContainer}>
              {furnitureItems.map((furnitureItem) => (
                <FurnitureItemSelection
                  isActive={false}
                  key={furnitureItem._id}
                  furnitureItem={furnitureItem}
                />
              ))}
            </div>
            <button
              className={styles.chip}
              onClick={isEditing ? onFinishEditing : onBeginEditing}
              disabled={isDisabled}
            >
              Edit Section
            </button>
          </>
        )}
      </FieldDetail>

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
    </div>
  );
};
