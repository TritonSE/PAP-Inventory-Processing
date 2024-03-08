"use client";
import React, { useEffect, useState } from "react";
// import { MultipleChoice, TextField } from "@/components/VeteranForm";
import { HeaderBar } from "@/components/VSRIndividual";
import SelectAll from "@/components/VeteranForm/SelectAll";
import TextField from "@/components/VeteranForm/TextField";
import PageNumber from "@/components/VeteranForm/PageNumber";
import styles from "src/app/vsr/page.module.css";
import { FurnitureItem, getFurnitureItems } from "@/api/FurnitureItems";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateVSRRequest, createVSR } from "@/api/VSRs";

export default function Page() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<FurnitureItem[]>([]);
  const [bedroomFurnishings, setBedroomFurnishings] = useState<FurnitureItem[]>([]);
  const [bathroomFurnishings, setBathroomFurnishings] = useState<FurnitureItem[]>([]);
  const [kitchenFurnishings, setKitchenFurnishings] = useState<FurnitureItem[]>([]);
  const [livingRoomFurnishings, setLivingRoomFurnishings] = useState<FurnitureItem[]>([]);
  const [diningRoomFurnishings, setDiningRoomFurnishings] = useState<FurnitureItem[]>([]);
  const [otherFurnishings, setOtherFurnishings] = useState<FurnitureItem[]>([]);

  interface FurnitureInputs {
    _id: string;
    quantity: number;
    isGasElectric: boolean;
  }

  interface CountMap {
    [key: string]: number;
  }

  type FurnitureSelection = Record<string, FurnitureInputs[]>;

  const selectionByCategory: FurnitureSelection = {
    Bedroom: [],
    Bathroom: [],
    Kitchen: [],
    "Living Room": [],
    "Drining Room": [],
    Other: [],
  };

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

  const { handleSubmit } = useForm<FurnitureInputs>();

  const onSubmit: SubmitHandler<FurnitureInputs> = async (data) => {
    const createVSRRequest: CreateVSRRequest = {
      name: "Sophia Yu",
      gender: "Female",
      age: 20,
      maritalStatus: "Single",
      spouseName: "N/A",
      agesOfBoys: [0],
      agesOfGirls: [0],
      ethnicity: "Asian",
      employmentStatus: "N/A",
      incomeLevel: "N/A",
      sizeOfHome: "Apartment",
      date: "2020-05-18T14:10:30.000+00:00",
      bedroomFurnishing: selectionByCategory["Bedroom"],
      bathroomFurnishing: selectionByCategory["Bathroom"],
      kitchenFurnishing: selectionByCategory["Kitchen"],
      livingRoomFurnishing: selectionByCategory["Living Room"],
      diningRoomFurnishing: selectionByCategory["Dining Room"],
      otherFurnishing: selectionByCategory["Other"],
      caseId: "0000",
      dateReceived: "2020-05-18T14:10:30.000+00:00",
      lastUpdated: "2020-05-18T14:10:30.000+00:00",
      status: "Archived",
      streetAddress: "1111 TSE Lane",
      city: "La Jolla",
      state: "CA",
      zipCode: 92092,
      phoneNumber: "123-456-7890",
      email: "tsepapdev@gmail.com",
      branch: ["Navy", "Air Force"],
      conflicts: [],
      dischargeStatus: "Still Serving",
      serviceConnected: true,
      lastRank: "Officer",
      militaryId: 2932,
      petCompanion: true,
      hearFrom: "Social Media",
    };

    try {
      const response = await createVSR(createVSRRequest);

      if (!response.success) {
        // TODO: better way of displaying error
        throw new Error(`HTTP error! status: ${response.error}`);
      }

      // TODO: better way of displaying successful submission (popup/modal)
      alert("VSR submitted successfully!");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleSelectionChange = (data: CountMap, category: string) => {
    console.log("HANDLING CHANGE for: ", category);
    selectionByCategory[category] = [];
    Object.entries(data).forEach(([furnitureItem, count]) => {
      const item = allItems.find((item) => item.name === furnitureItem);
      const vsrItem: FurnitureInputs = {
        _id: item ? item._id : "",
        quantity: count,
        isGasElectric: item ? item.isGasElectric : false, // This is optional
      };
      selectionByCategory[category].push(vsrItem);
    });
    console.log(selectionByCategory[category]);
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HeaderBar />
        <div className={styles.canvas}>
          <div className={styles.title}>Furnishings</div>
          <div className={styles.sections}>
            <div className={styles.section}>
              <SelectAll
                label="Bedroom"
                options={bedroomFurnishings}
                onChildDataChange={handleSelectionChange}
              />
            </div>
            <div className={styles.section}>
              <SelectAll
                label="Bathroom"
                options={bathroomFurnishings}
                onChildDataChange={handleSelectionChange}
              />
            </div>
            <div className={styles.section}>
              <SelectAll
                label="Kitchen"
                options={kitchenFurnishings}
                onChildDataChange={handleSelectionChange}
              />
            </div>
            <div className={styles.section}>
              <SelectAll
                label="Living Room"
                options={livingRoomFurnishings}
                onChildDataChange={handleSelectionChange}
              />
            </div>
            <div className={styles.section}>
              <SelectAll
                label="Dining Room"
                options={diningRoomFurnishings}
                onChildDataChange={handleSelectionChange}
              />
            </div>
            <div className={styles.section}>
              <SelectAll
                label="Other"
                options={otherFurnishings}
                onChildDataChange={handleSelectionChange}
              />
            </div>
            <div className={styles.section}>
              <TextField
                label="Identify other necessary items"
                helperText="**We do not offer cleaning supplies"
                required={false}
                variant={"outlined"}
              ></TextField>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.backButton}>
            <button className={styles.back}>Back</button>
          </div>
          <PageNumber pageNum={3} />
          <div className={styles.submitButton}>
            <button className={styles.submit} type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
      <div className={styles.footer}></div>
    </div>
  );
}
