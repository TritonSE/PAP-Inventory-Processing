import styles from "@/components/FurnitureRequest/EditTemplate/styles.module.css";
import { useState } from "react";
import { FurnitureItem, getFurnitureItems, addFurnitureItem, updateFurnitureItem, deleteFurnitureItem } from "@/api/FurnitureItems";
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
        <div className={styles.chipContainer}>
          {furnitureItems.map((furnitureItem) => (
            <FurnitureItemSelection
              isActive={false}
              key={furnitureItem._id}
              furnitureItem={furnitureItem}
            />
          ))}
          <button
            className={styles.chip}
            onClick={isEditing ? onFinishEditing : onBeginEditing}
            disabled={isDisabled}
          >
            {isEditing ? "Save Changes" : "Edit Section"}
          </button>
          <button
            className={styles.chip}
            onClick={handleAddNewItem}
            disabled={isDisabled || isEditing}
          >
            Add New Item
          </button>
          {isAddingNewItem && (
            <div>
              <label>Item Name</label>
              <br/>
              <input
                type="text"
                id="itemName"
                placeholder="Enter Item Name"
              />
              <br/>

              <input
                type="checkbox"
                id="checkBox"
              />
              <label>Multiple Quantities</label>
            </div>
          )}
        </div>
      </FieldDetail>
    </div>
  );
};
// Create a conditional such that if  isAddingNewItem is true, render the text field, mutliple quantities, etc
