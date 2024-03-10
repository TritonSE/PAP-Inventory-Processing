import styles from "src/components/VSRIndividual/RequestedFurnishings/RequestedFurnishings.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { useEffect, useState } from "react";
import { getFurnitureItems } from "@/api/FurnitureItems";

export interface RequestedFurnishingsProps {
  vsr: VSR;
}

interface FurnitureInputs {
  _id: string;
  quantity: number;
  isGasElectric: boolean;
}

interface itemMapping {
  id: string;
  name: string;
}
// let furnitureItemMap: itemMapping[]; // mapping of each furniture item to its name
const furnitureItemMap = new Map<string, string>();
let selectedBedroomItemNames: string[];
let selectedBathroomItemNames: string[];
let selectedKitchenItemNames: string[];
let selectedLivingRoomItemNames: string[];
let selectedDiningRoomItemNames: string[];
let selectedOtherItemNames: string[];

export const RequestedFurnishings = ({ vsr }: RequestedFurnishingsProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getFurnitureItems()
      .then((result) => {
        if (result.success) {
          result.data.forEach((item) => {
            furnitureItemMap.set(item._id, item.name);
          });
          console.log("ALL FETCHED FURNITURE ITEMS: ", furnitureItemMap);
        } else {
          setErrorMessage("Furniture items not found.");
        }
      })
      .catch((error) => {
        setErrorMessage(`An error occurred: ${error.message}`);
      });
  }, []);
  const expanded = true;

  const userBedroomItems: FurnitureInputs[] = vsr.bedroomFurnishing as FurnitureInputs[];
  const userBathroomItems: FurnitureInputs[] = vsr.bathroomFurnishing as FurnitureInputs[];
  const userKitchenItems: FurnitureInputs[] = vsr.kitchenFurnishing as FurnitureInputs[];
  const userLivingRoomItems: FurnitureInputs[] = vsr.livingRoomFurnishing as FurnitureInputs[];
  const userDiningRoomItems: FurnitureInputs[] = vsr.diningRoomFurnishing as FurnitureInputs[];
  const userOtherItems: FurnitureInputs[] = vsr.otherFurnishing as FurnitureInputs[];

  if (userBedroomItems != undefined) {
    selectedBedroomItemNames = [];
    userBedroomItems.forEach((item) => {
      const id = furnitureItemMap.get(item._id);
      if (id != undefined) {
        selectedBedroomItemNames.push(id);
      }
    });
  }
  if (userBathroomItems != undefined) {
    selectedBathroomItemNames = [];
    userBathroomItems.forEach((item) => {
      const id = furnitureItemMap.get(item._id);
      if (id != undefined) {
        selectedBathroomItemNames.push(id);
      }
    });
  }
  if (userKitchenItems != undefined) {
    selectedKitchenItemNames = [];
    userKitchenItems.forEach((item) => {
      const id = furnitureItemMap.get(item._id);
      if (id != undefined) {
        selectedKitchenItemNames.push(id);
      }
    });
  }
  if (userLivingRoomItems != undefined) {
    selectedLivingRoomItemNames = [];
    userLivingRoomItems.forEach((item) => {
      const id = furnitureItemMap.get(item._id);
      if (id != undefined) {
        selectedLivingRoomItemNames.push(id);
      }
    });
  }
  if (userDiningRoomItems != undefined) {
    selectedDiningRoomItemNames = [];
    userDiningRoomItems.forEach((item) => {
      const id = furnitureItemMap.get(item._id);
      if (id != undefined) {
        selectedDiningRoomItemNames.push(id);
      }
    });
  }
  if (userOtherItems != undefined) {
    selectedOtherItemNames = [];
    userOtherItems.forEach((item) => {
      const id = furnitureItemMap.get(item._id);
      if (id != undefined) {
        selectedOtherItemNames.push(id);
      }
    });
  }

  return (
    <div className={styles.box}>
      <Accordion className={styles.accordian} defaultExpanded expanded={expanded}>
        <AccordionSummary
          className={styles.accordianTitle}
          aria-controls="panel1-content"
          id="requested-furnishings-header"
        >
          <Typography className={styles.title}>Furnishing Requests</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <ListDetail
                title="Bedroom:"
                values={
                  vsr.bedroomFurnishing != undefined &&
                  Object.keys(vsr.bedroomFurnishing).length > 0
                    ? selectedBedroomItemNames
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Bathroom:"
                values={
                  vsr.bathroomFurnishing != undefined &&
                  Object.keys(vsr.bathroomFurnishing).length > 0
                    ? selectedBathroomItemNames
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Kitchen:"
                values={
                  vsr.kitchenFurnishing != undefined &&
                  Object.keys(vsr.kitchenFurnishing).length > 0
                    ? selectedKitchenItemNames
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Living Room:"
                values={
                  vsr.livingRoomFurnishing != undefined &&
                  Object.keys(vsr.livingRoomFurnishing).length > 0
                    ? selectedLivingRoomItemNames
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Dining Room:"
                values={
                  vsr.diningRoomFurnishing != undefined &&
                  Object.keys(vsr.diningRoomFurnishing).length > 0
                    ? selectedDiningRoomItemNames
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Other:"
                values={
                  vsr.otherFurnishing != undefined && Object.keys(vsr.otherFurnishing).length > 0
                    ? selectedOtherItemNames
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Additional Items:" value="n/a" />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
