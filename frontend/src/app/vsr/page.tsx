"use client";
import React, { useEffect, useState } from "react";
// import { MultipleChoice, TextField } from "@/components/VeteranForm";
import { HeaderBar } from "@/components/VSRIndividual";
import SelectAll from "@/components/VeteranForm/SelectAll";
import styles from "src/app/vsr/page.module.css";
import { FurnitureItem, getFurnitureItems } from "@/api/FurnitureItems";

export default function Page() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<FurnitureItem[]>([]);
  const [bedroomFurnishings, setBedroomFurnishings] = useState<FurnitureItem[]>([]);
  const [bathroomFurnishings, setBathroomFurnishings] = useState<FurnitureItem[]>([]);
  const [kitchenFurnishings, setKitchenFurnishings] = useState<FurnitureItem[]>([]);
  const [livingRoomFurnishings, setLivingRoomFurnishings] = useState<FurnitureItem[]>([]);
  const [diningRoomFurnishings, setDiningRoomFurnishings] = useState<FurnitureItem[]>([]);
  const [otherFurnishings, setOtherFurnishings] = useState<FurnitureItem[]>([]);

  useEffect(() => {
    getFurnitureItems()
      .then((result) => {
        if (result.success) {
          setAllItems(result.data);
          setErrorMessage(null);
        } else {
          setErrorMessage("Furniture items not found.");
        }
      })
      .catch((error) => {
        setErrorMessage(`An error occurred: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    const bedroomItems = allItems.filter((item) => item.category === "bedroom");
    const bathroomItems = allItems.filter((item) => item.category === "bathroom");
    const kitchenItems = allItems.filter((item) => item.category === "kitchen");
    const livingRoomItems = allItems.filter((item) => item.category === "living room");
    const diningRoomItems = allItems.filter((item) => item.category === "dining room");
    const otherItems = allItems.filter((item) => item.category === "other");

    setBedroomFurnishings(bedroomItems);
    setBathroomFurnishings(bathroomItems);
    setKitchenFurnishings(kitchenItems);
    setLivingRoomFurnishings(livingRoomItems);
    setDiningRoomFurnishings(diningRoomItems);
    setOtherFurnishings(otherItems);
  }, [allItems]);

  return (
    <div className={styles.page}>
      <HeaderBar />
      <div className={styles.canvas}>
        <div className={styles.title}>Furnishings</div>
        {/* Example of rendering items for a specific category */}
        <div className={styles.sections}>
          <div className={styles.section}>
            <SelectAll label="Bedroom" options={bedroomFurnishings} />
          </div>
          <div className={styles.section}>
            <SelectAll label="Bathroom" options={bathroomFurnishings} />
          </div>
          <div className={styles.section}>
            <SelectAll label="Kitchen" options={kitchenFurnishings} />
          </div>
          <div className={styles.section}>
            <SelectAll label="Living Room" options={livingRoomFurnishings} />
          </div>
          <div className={styles.section}>
            <SelectAll label="Dining Room" options={diningRoomFurnishings} />
          </div>
          <div className={styles.section}>
            <SelectAll label="Other" options={otherFurnishings} />
          </div>
        </div>
      </div>
      <div className={styles.footer}></div>
    </div>
  );
}
