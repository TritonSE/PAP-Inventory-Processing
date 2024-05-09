import styles from "@/components/VSRIndividual/PageSections/RequestedFurnishings/styles.module.css";
import { useState } from "react";
import {
  FurnitureItem,
  getFurnitureItems,
  addFurnitureItem,
  updateFurnitureItem,
  deleteFurnitureItem,
} from "@/api/FurnitureItems";
import { FurnitureItemSelection } from "@/components/VSRForm/FurnitureItemSelection";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";

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
  const handleStartEditItem = (itemId: string) => {
    setEditingItemId(itemId);
  };

  const handleStopEditItem = () => {
    setEditingItemId(null);
  };

  const handleAddNewItem = () => {
    setIsAddingNewItem(true);
  };

  const handleFinishAddNewItem = () => {
    setIsAddingNewItem(false);
  };

  return (
    <div className={styles.row}>
      <FieldDetail title={categoryTitle}>
        {isEditing ? (
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

            <p> Please Select a Tag to Delete or Start Editing</p>
            <button
              className={styles.chip}
              onClick={handleAddNewItem}
              disabled={isDisabled || isEditing}
            >
              Add New Option
            </button>

            <button
              className={styles.chip}
              //Need onClick
              disabled={isDisabled || isEditing}
            >
              Delete Tag
            </button>

            <button
              className={styles.chip}
              onClick={isEditing ? onFinishEditing : onBeginEditing}
              disabled={isDisabled}
            >
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
    </div>
  );
};
