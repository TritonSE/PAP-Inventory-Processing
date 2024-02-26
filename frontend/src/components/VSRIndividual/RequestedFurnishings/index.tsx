import styles from "src/components/VSRIndividual/RequestedFurnishings/styles.module.css";
import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "../VSRIndividualAccordion";

export interface RequestedFurnishingsProps {
  vsr: VSR;
}

export const RequestedFurnishings = ({ vsr }: RequestedFurnishingsProps) => {
  return (
    <VSRIndividualAccordion permanentlyExpanded={false} title="Furnishing Requests">
      <div className={styles.row}>
        <ListDetail
          title="Bedroom:"
          values={
            vsr.bedroomFurnishing != undefined && Object.keys(vsr.bedroomFurnishing).length > 0
              ? vsr.bedroomFurnishing
              : ["N/A"]
          }
        />
      </div>
      <div className={styles.row}>
        <ListDetail
          title="Bathroom:"
          values={
            vsr.bathroomFurnishing != undefined && Object.keys(vsr.bathroomFurnishing).length > 0
              ? vsr.bathroomFurnishing
              : ["N/A"]
          }
        />
      </div>
      <div className={styles.row}>
        <ListDetail
          title="Kitchen:"
          values={
            vsr.kitchenFurnishing != undefined && Object.keys(vsr.kitchenFurnishing).length > 0
              ? vsr.kitchenFurnishing
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
              ? vsr.livingRoomFurnishing
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
              ? vsr.diningRoomFurnishing
              : ["N/A"]
          }
        />
      </div>
      <div className={styles.row}>
        <ListDetail
          title="Other:"
          values={
            vsr.otherFurnishing != undefined && Object.keys(vsr.otherFurnishing).length > 0
              ? vsr.otherFurnishing
              : ["N/A"]
          }
        />
      </div>
      <div className={styles.row}>
        <SingleDetail title="Additional Items:" value="n/a" />
      </div>
    </VSRIndividualAccordion>
  );
};
