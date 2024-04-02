import styles from "src/components/VSRIndividual/RequestedFurnishings/styles.module.css";
import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "../VSRIndividualAccordion";
import { FurnitureItem } from "@/api/FurnitureItems";
import { useMemo } from "react";

export interface RequestedFurnishingsProps {
  vsr: VSR;
  furnitureItems: FurnitureItem[];
}

/**
 * The "Furnishing Requests" section of the VSR individual page.
 */
export const RequestedFurnishings = ({ vsr, furnitureItems }: RequestedFurnishingsProps) => {
  const furnitureItemIdsToItems = useMemo(
    () =>
      furnitureItems?.reduce(
        (prevMap: Record<string, FurnitureItem>, curItem) => ({
          ...prevMap,
          [curItem._id]: curItem,
        }),
        {},
      ) ?? {},
    [furnitureItems],
  );

  const findSelectedItemsByCategory = (category: string) => {
    return vsr.selectedFurnitureItems?.filter(
      (selectedItem) =>
        furnitureItemIdsToItems[selectedItem.furnitureItemId]?.category === category,
    );
  };

  const renderItemsSection = (categoryTitle: string, categoryName: string) => {
    const selectedItemsForCategory = findSelectedItemsByCategory(categoryName);

    return (
      <div className={styles.row}>
        <ListDetail
          title={categoryTitle}
          values={
            selectedItemsForCategory && selectedItemsForCategory.length > 0
              ? selectedItemsForCategory.map(
                  (selectedItem) =>
                    `${furnitureItemIdsToItems[selectedItem.furnitureItemId].name} ${
                      furnitureItemIdsToItems[selectedItem.furnitureItemId]?.allowMultiple
                        ? ": " + selectedItem.quantity
                        : ""
                    }`,
                )
              : ["N/A"]
          }
        />
      </div>
    );
  };

  return (
    <VSRIndividualAccordion permanentlyExpanded={false} title="Furnishing Requests">
      {renderItemsSection("Bedroom:", "bedroom")}
      {renderItemsSection("Bathroom:", "bathroom")}
      {renderItemsSection("Kitchen:", "kitchen")}
      {renderItemsSection("Living Room:", "living room")}
      {renderItemsSection("Dining Room:", "dining room")}
      {renderItemsSection("Other:", "other")}

      <div className={styles.row}>
        <SingleDetail
          title="Additional Items:"
          value={
            vsr.additionalItems && vsr.additionalItems.length > 0 ? vsr.additionalItems : "n/a"
          }
        />
      </div>
    </VSRIndividualAccordion>
  );
};
