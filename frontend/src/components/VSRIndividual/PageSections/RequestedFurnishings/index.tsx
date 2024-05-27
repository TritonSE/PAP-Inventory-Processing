import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "@/components/VSRIndividual/VSRIndividualAccordion";
import { FurnitureItem } from "@/api/FurnitureItems";
import { useEffect, useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import { TextInputDetail } from "@/components/VSRIndividual/FieldDetails/TextInputDetail";
import { FurnitureItemSelection } from "@/components/VSRForm/FurnitureItemSelection";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import styles from "@/components/VSRIndividual/PageSections/RequestedFurnishings/styles.module.css";

export interface RequestedFurnishingsProps {
  vsr: VSR;
  furnitureItems: FurnitureItem[];
  isEditing: boolean;
  formProps: UseFormReturn<IEditVSRFormInput>;
}

/**
 * The "Furnishing Requests" section of the VSR individual page.
 */
export const RequestedFurnishings = ({
  vsr,
  furnitureItems,
  isEditing,
  formProps,
}: RequestedFurnishingsProps) => {
  useEffect(() => {
    formProps.setValue(
      "selectedFurnitureItems",
      Object.fromEntries(
        vsr.selectedFurnitureItems.map((selectedItem) => [
          selectedItem.furnitureItemId,
          selectedItem,
        ]),
      ),
    );
    formProps.setValue("additionalItems", vsr.additionalItems);
  }, [vsr]);

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

  const furnitureCategoriesToItems = useMemo(
    () =>
      furnitureItems.reduce(
        (prevMap: Record<string, FurnitureItem[]>, curItem) => ({
          ...prevMap,
          [curItem.category]: [...(prevMap[curItem.category] ?? []), curItem],
        }),
        {},
      ),
    [furnitureItems],
  );

  const findSelectedItemsByCategory = (category: string) => {
    return Object.values(formProps.watch().selectedFurnitureItems ?? {}).filter(
      (selectedItem) =>
        furnitureItemIdsToItems[selectedItem.furnitureItemId]?.category === category,
    );
  };

  const renderItemsSection = (categoryTitle: string, categoryName: string) => {
    const selectedItemsForCategory = findSelectedItemsByCategory(categoryName);

    return isEditing ? (
      <Controller
        name="selectedFurnitureItems"
        control={formProps.control}
        render={({ field }) => (
          <div className={styles.row}>
            <FieldDetail title={categoryTitle}>
              <div className={styles.chipContainer}>
                {furnitureCategoriesToItems[categoryName].map((furnitureItem) => (
                  <FurnitureItemSelection
                    key={furnitureItem._id}
                    furnitureItem={furnitureItem}
                    selection={
                      formProps.watch().selectedFurnitureItems[furnitureItem._id] ?? {
                        furnitureItemId: furnitureItem._id,
                        quantity: 0,
                      }
                    }
                    onChangeSelection={(newSelection) =>
                      field.onChange({
                        ...field.value,
                        [furnitureItem._id]: newSelection,
                      })
                    }
                  />
                ))}
              </div>
            </FieldDetail>
          </div>
        )}
      />
    ) : (
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
              : ["No items selected"]
          }
          isEmpty={!(selectedItemsForCategory && selectedItemsForCategory.length > 0)}
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
        {isEditing ? (
          <TextInputDetail name="additionalItems" title="Additional Items:" formProps={formProps} />
        ) : (
          <SingleDetail
            title="Additional Items:"
            value={
              vsr.additionalItems && vsr.additionalItems.length > 0
                ? vsr.additionalItems
                : "No items selected"
            }
            isEmpty={!(vsr.additionalItems && vsr.additionalItems.length > 0)}
          />
        )}
      </div>
    </VSRIndividualAccordion>
  );
};
