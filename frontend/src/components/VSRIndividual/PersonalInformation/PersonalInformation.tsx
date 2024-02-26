import React from "react";
import styles from "src/components/VSRIndividual/ContactInfo/ContactInfo.module.css";
import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "../VSRIndividualAccordion/VSRIndividualAccordion";

export interface PersonalInformationProps {
  vsr: VSR;
}
export const PersonalInformation = ({ vsr }: PersonalInformationProps) => {
  return (
    <VSRIndividualAccordion permanentlyExpanded={false} title="Personal Information">
      <div className={styles.row}>
        <SingleDetail title="Name" value={vsr.name} />
      </div>
      <div className={styles.row}>
        <SingleDetail title="Street Address" value={vsr.streetAddress} />
      </div>
      <div className={styles.row}>
        <SingleDetail title="City" value={vsr.city} />
      </div>
      <div className={styles.row}>
        <SingleDetail title="State" value={vsr.state} />
        <SingleDetail className={styles.second} title="Zip Code" value={vsr.zipCode} />
      </div>
      <div className={styles.row}>
        <ListDetail title="Marital Status" values={[vsr.maritalStatus]} />
      </div>
      <div className={styles.row}>
        <SingleDetail
          title="Spouse's Name"
          value={vsr.spouseName && vsr.spouseName.length > 0 ? vsr.spouseName : "N/A"}
        />
      </div>
      <div className={styles.row}>
        <SingleDetail title="Number of boy(s)" value={vsr.agesOfBoys?.length ?? 0} />
        <SingleDetail
          className={styles.second}
          title="Age(s)"
          value={vsr.agesOfBoys && vsr.agesOfBoys.length > 0 ? vsr.agesOfBoys : "N/A"}
        />
      </div>
      <div className={styles.row}>
        <SingleDetail title="Number of girl(s)" value={vsr.agesOfGirls?.length ?? 0} />
        <SingleDetail
          className={styles.second}
          title="Age(s)"
          value={vsr.agesOfGirls && vsr.agesOfGirls.length > 0 ? vsr.agesOfGirls : "N/A"}
        />
      </div>
      <div className={styles.row}>
        <ListDetail
          title="Ethnicity"
          values={vsr.ethnicity && vsr.ethnicity.length > 0 ? vsr.ethnicity : ["N/A"]}
        />
      </div>
      <div className={styles.row}>
        <ListDetail title="Employment Status" values={[vsr.employmentStatus]} />
      </div>
      <div className={styles.row}>
        <ListDetail title="Income Level" values={[vsr.incomeLevel]} />
      </div>
      <div className={styles.row}>
        <ListDetail title="Size of Home" values={[vsr.sizeOfHome]} />
      </div>
    </VSRIndividualAccordion>
  );
};
