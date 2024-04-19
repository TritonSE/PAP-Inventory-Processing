import React, { useEffect } from "react";
import styles from "@/components/VSRIndividual/PageSections/ContactInfo/styles.module.css";
import { SingleDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "@/components/VSRIndividual/VSRIndividualAccordion";
import { TextInputDetail } from "@/components/VSRIndividual/FieldDetails/TextInputDetail";
import { UseFormReturn } from "react-hook-form";
import { IEditVSRFormInput } from "@/components/VSRForm/VSRFormTypes";
import { SelectInputDetail } from "@/components/VSRIndividual/FieldDetails/SelectInputDetail";
import { genderOptions, stateOptions } from "@/constants/fieldOptions";

export interface ContactInfoProps {
  vsr: VSR;
  isEditing: boolean;
  formProps: UseFormReturn<IEditVSRFormInput>;
}
/**
 * The "Contact Information" section of the VSR individual page.
 */
export const ContactInfo = ({ vsr, isEditing, formProps }: ContactInfoProps) => {
  useEffect(() => {
    formProps.setValue("phoneNumber", vsr.phoneNumber);
    formProps.setValue("email", vsr.email);
    formProps.setValue("streetAddress", vsr.streetAddress);
    formProps.setValue("city", vsr.city);
    formProps.setValue("zipCode", vsr.zipCode);
    formProps.setValue("state", vsr.state);
  }, [vsr]);

  return (
    <VSRIndividualAccordion permanentlyExpanded={false} title="Contact Information">
      <div className={styles.row}>
        {isEditing ? (
          <TextInputDetail
            name="phoneNumber"
            type="tel"
            title="Phone Number"
            formProps={formProps}
            placeholder="e.g. 6197123276"
          />
        ) : (
          <SingleDetail title="Phone Number" value={vsr.phoneNumber} />
        )}
      </div>
      <div className={styles.row}>
        {isEditing ? (
          <TextInputDetail
            name="email"
            title="Email Address"
            type="email"
            formProps={formProps}
            placeholder="e.g. justintimberlake@gmail.com"
          />
        ) : (
          <SingleDetail title="Email Address" value={vsr.email} />
        )}
      </div>
      {isEditing ? (
        <>
          <div className={styles.row}>
            <TextInputDetail
              name="streetAddress"
              title="Street Address"
              formProps={formProps}
              placeholder="e.g. 1234 Baker Street"
            />
          </div>
          <div className={styles.row}>
            <TextInputDetail
              name="city"
              title="City"
              formProps={formProps}
              placeholder="e.g. San Diego"
            />
          </div>
        </>
      ) : (
        <div className={styles.row}>
          <SingleDetail title="Street Address" value={vsr.streetAddress} />
          <SingleDetail title="City" value={vsr.city} />
        </div>
      )}
      <div className={styles.row}>
        {isEditing ? (
          <SelectInputDetail
            name="state"
            title="State"
            formProps={formProps}
            options={stateOptions}
          />
        ) : (
          <SingleDetail title="State" value={vsr.state} />
        )}
        {isEditing ? (
          <TextInputDetail
            name="zipCode"
            title="Zip Code"
            formProps={formProps}
            placeholder="e.g. 92092"
          />
        ) : (
          <SingleDetail title="Zip Code" value={vsr.zipCode} />
        )}
      </div>
    </VSRIndividualAccordion>
  );
};
