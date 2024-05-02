import styles from "@/components/VSRIndividual/PageSections/RequestedFurnishings/styles.module.css";
import { FurnitureItem } from "@/api/FurnitureItems";
import { useState } from "react";
import { useMemo } from "react";
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
        </div>
      </FieldDetail>
    </div>
  );
};

// The button is currently being styled by styles.chip, although its not completed
// and I'm not sure that's where we want to style the button. and it doesn't do anything

//const[isEditing, setIsEditing] = useState(false);
//const handleEditClick = () => {
//  setIsEditing(current => !current);
//              console.log('Button clicked for furniture item:', categoryTitle); }}>Edit Section</button>
