"use client";
import React, { useEffect, useState } from "react";
// import { MultipleChoice, TextField } from "@/components/VeteranForm";
import { HeaderBar } from "@/components/VSRIndividual";
import styles from "src/components/VSRIndividual/Page/Page.module.css";
import { getFurnitureItems } from "@/api/FurnitureItems";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getFurnitureItems()
      .then((result) => {
        if (result.success) {
          console.log(result);
          setErrorMessage(null);
        } else {
          setErrorMessage("Furniture items not found.");
        }
      })
      .catch((error) => {
        setErrorMessage(`An error occurred: ${error.message}`);
      });
  }, [id]);
  return (
    <div className={styles.page}>
      <HeaderBar />

      <div className={styles.footer}></div>
    </div>
  );
}
