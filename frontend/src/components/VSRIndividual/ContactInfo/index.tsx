import React, { useEffect } from "react";
import styles from "src/components/VSRIndividual/ContactInfo/styles.module.css";
import { SingleDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "../VSRIndividualAccordion";
import { TextInputDetail } from "../TextInputDetail";
import { UseFormReturn } from "react-hook-form";
import { IFormInput } from "@/app/vsr/page";

export interface ContactInfoProps {
  vsr: VSR;
  isEditing: boolean;
  formProps: UseFormReturn<IFormInput>;
}

export const ContactInfo = ({ vsr, isEditing, formProps }: ContactInfoProps) => {
  useEffect(() => {
    formProps.setValue("phone_number", vsr.phoneNumber);
  }, [vsr]);

  return (
    <VSRIndividualAccordion permanentlyExpanded={false} title="Contact Information">
      <div className={styles.row}>
        {isEditing ? (
          <TextInputDetail name="phone_number" title="Phone Number" formProps={formProps} />
        ) : (
          <SingleDetail title="Phone Number" value={vsr.phoneNumber} />
        )}
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
