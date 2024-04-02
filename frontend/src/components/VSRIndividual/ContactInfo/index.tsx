import React from "react";
import styles from "src/components/VSRIndividual/ContactInfo/styles.module.css";
import { SingleDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "../VSRIndividualAccordion";

export interface ContactInfoProps {
  vsr: VSR;
}

/**
 * The "Contact Information" section of the VSR individual page.
 */
export const ContactInfo = ({ vsr }: ContactInfoProps) => {
  return (
    <VSRIndividualAccordion permanentlyExpanded={false} title="Contact Information">
      <div className={styles.row}>
        <SingleDetail title="Phone Number" value={vsr.phoneNumber} />{" "}
      </div>
      <div className={styles.row}>
        <SingleDetail title="Email Address" value={vsr.email} />
      </div>
      <div className={styles.row}>
        <SingleDetail title="Gender" value={vsr.gender} />
        <SingleDetail className={styles.second} title="Age" value={vsr.age} />
      </div>
      <div className={styles.row}>
        <SingleDetail title="Street Address" value={vsr.streetAddress} />
        <SingleDetail className={styles.second} title="City" value={vsr.city} />
      </div>
      <div className={styles.row}>
        <SingleDetail title="Zip Code" value={vsr.zipCode} />
        <SingleDetail className={styles.second} title="State" value={vsr.state} />
      </div>
    </VSRIndividualAccordion>
  );
};
