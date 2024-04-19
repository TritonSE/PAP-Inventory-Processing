"use client";
import HeaderBar from "@/components/shared/HeaderBar";
import styles from "src/app/staff/furnitureItems/page.module.css";

export default function furnitureItemTemplate() {
  return (
    <>
      <HeaderBar showLogoutButton />
      <div className={styles.main}>
        <h1 className={styles.title}>Furnishing Request Form Template</h1>
        <p className={styles.description}>
          Adding, editing, and removing tags. Remember to save your edits after adding or removing
          furnishing options for future VSR forms.
        </p>

        <div className={styles.formContainer}></div>
      </div>
    </>
  );
}
