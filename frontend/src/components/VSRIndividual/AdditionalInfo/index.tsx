import React from "react";
import styles from "src/components/VSRIndividual/ContactInfo/styles.module.css";
import { ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "../VSRIndividualAccordion";

export interface AdditionalInfoProps {
  vsr: VSR;
}

export const AdditionalInfo = ({ vsr }: AdditionalInfoProps) => {
  return (
    <VSRIndividualAccordion title="Additional Information" permanentlyExpanded={false}>
      <div className={styles.row}>
        <ListDetail
          title="Are you interested in a companionship animal (pet)?"
          values={[vsr.petCompanion ? "Yes" : "No"]}
        />
      </div>
      <div className={styles.row}>
        <ListDetail title="How did you hear about us?" values={[vsr.hearFrom]} />
      </div>
    </VSRIndividualAccordion>
  );
};
