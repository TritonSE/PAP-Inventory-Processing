"use client";
import HeaderBar from "@/components/shared/HeaderBar";
import { EditTemplate } from "@/components/FurnitureRequest/EditTemplate";
import { useMemo } from "react";
import { FurnitureItem, getFurnitureItems } from "@/api/FurnitureItems";
import React, { useEffect, useState } from "react";
import {
  useRedirectToHomeIfNotAdmin,
  useRedirectToLoginIfNotSignedIn,
} from "@/hooks/useRedirection";
import styles from "@/app/staff/furnitureItems/page.module.css";

export default function furnitureItemTemplate() {
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>();
  const [editingCategory, setEditingCategory] = useState<string>();

  useRedirectToLoginIfNotSignedIn();
  useRedirectToHomeIfNotAdmin();

  useEffect(() => {
    fetchFurnitureItems();
  }, []);

  const fetchFurnitureItems = () => {
    getFurnitureItems().then((result) => {
      if (result.success) {
        setFurnitureItems(result.data);
      } else {
        setFurnitureItems([]);
      }
    });
  };

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
    fetchFurnitureItems();
  };

  return (
    <>
      <HeaderBar showLogoutButton />
      <div className={styles.main}>
        <h1 className={styles.title}>Furnishing Request Form Template</h1>
        <p className={styles.description}>
          Add, edit, or remove furniture items for veterans to select on the VSR. Remember to save
          your edits.
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
          </div>
        </div>
      </div>
    </>
  );
}
