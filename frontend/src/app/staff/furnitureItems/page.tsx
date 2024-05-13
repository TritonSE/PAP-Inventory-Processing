"use client";
import HeaderBar from "@/components/shared/HeaderBar";
import styles from "src/app/staff/furnitureItems/page.module.css";
import { EditTemplate } from "@/components/FurnitureRequest/EditTemplate";
import { useMemo } from "react";
import {
  FurnitureItem,
  getFurnitureItems,
  addFurnitureItem,
  updateFurnitureItem,
  deleteFurnitureItem,
} from "@/api/FurnitureItems";
import React, { useEffect, useState } from "react";
import { ICreateVSRFormInput } from "@/components/VSRForm/VSRFormTypes";

export default function furnitureItemTemplate() {
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>();
  const [editingCategory, setEditingCategory] = useState<string>();
  useEffect(() => {
    getFurnitureItems().then((result) => {
      if (result.success) {
        setFurnitureItems(result.data);
      } else {
        setFurnitureItems([]);
      }
    });
  }, []);

  const furnitureCategoriesToItems = useMemo(
    () =>
      furnitureItems?.reduce(
        (prevMap: Record<string, FurnitureItem[]>, curItem) => ({
          ...prevMap,
          [curItem.category]: [...(prevMap[curItem.category] ?? []), curItem],
        }),
        {},
      ),
    [furnitureItems],
  );

  const handleBeginEditing = (category: string) => {
    setEditingCategory(category);
    console.log(category);
  };

  const handleFinishEditing = () => {
    setEditingCategory(undefined);
  };

  return (
    <>
      <HeaderBar showLogoutButton />
      <div className={styles.main}>
        <h1 className={styles.title}>Furnishing Request Form Template</h1>
        <p className={styles.description}>
          Adding, editing, and removing tags. Remember to save your edits after adding or removing
          furnishing options for future VSR forms.
        </p>

        <div className={styles.formContainer}>
          <h1 className={styles.sectionTitle}>Furnishings</h1>
          <div className={styles.furnishings}>
            {furnitureCategoriesToItems
              ? Object.entries(furnitureCategoriesToItems!).map(([category, items]) => (
                  <EditTemplate
                    key={category}
                    furnitureItems={items}
                    categoryName={category}
                    categoryTitle={category[0].toUpperCase() + category.slice(1)}
                    isEditing={editingCategory === category}
                    isDisabled={editingCategory !== undefined && editingCategory !== category}
                    onBeginEditing={() => handleBeginEditing(category)}
                    onFinishEditing={handleFinishEditing}
                  />
                ))
              : null}

            {/* <EditTemplate
              furnitureItems={furnitureCategoriesToItems?.bedroom ?? []}
              categoryName="bedroom"
              categoryTitle="Bedroom"
            />
            <EditTemplate
              furnitureItems={furnitureCategoriesToItems?.kitchen ?? []}
              categoryName="kitchen"
              categoryTitle="Kitchen"
            />
            <EditTemplate
              furnitureItems={furnitureCategoriesToItems?.livingRoom ?? []}
              categoryName="living room"
              categoryTitle="Living Room"
            />
            <EditTemplate
              furnitureItems={furnitureCategoriesToItems?.diningRoom ?? []}
              categoryName="dining room"
              categoryTitle="Dining Room"
            />
            <EditTemplate
              furnitureItems={furnitureCategoriesToItems?.other ?? []}
              categoryName="other"
              categoryTitle="Other"
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}

// add more furniture items, such as bedroom
