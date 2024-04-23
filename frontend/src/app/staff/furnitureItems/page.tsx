"use client";
import HeaderBar from "@/components/shared/HeaderBar";
import styles from "src/app/staff/furnitureItems/page.module.css";
import { EditTemplate } from "@/components/FurnitureRequest/EditTemplate";
import { useMemo } from "react";
import { FurnitureItem, getFurnitureItems } from "@/api/FurnitureItems";
import React, { useEffect, useState } from "react";

export default function furnitureItemTemplate() {
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>();

  useEffect(() => {
    getFurnitureItems().then((result) => {
      if (result.success) {
        setFurnitureItems(result.data);
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
          <EditTemplate
            furnitureItems={furnitureCategoriesToItems?.bedroom ?? []}
            categoryName="bedroom"
            categoryTitle="Bedroom"
          />
        </div>
      </div>
    </>
  );
}
