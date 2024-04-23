import styles from "@/components/VSRIndividual/PageSections/RequestedFurnishings/styles.module.css";
import { FurnitureItem } from "@/api/FurnitureItems";
import { useMemo } from "react";
import { FurnitureItemSelection } from "@/components/VSRForm/FurnitureItemSelection";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";

export interface EditTemplateProps {
  furnitureItems: FurnitureItem[];
  categoryTitle: string;
  categoryName: string;
}

export const EditTemplate = ({
  furnitureItems,
  categoryTitle,
  categoryName,
}: EditTemplateProps) => {
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
        </div>
      </FieldDetail>
    </div>
  );
};
