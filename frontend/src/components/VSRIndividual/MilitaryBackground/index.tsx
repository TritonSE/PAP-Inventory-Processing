import React from "react";
import styles from "@/components/VSRIndividual/ContactInfo/styles.module.css";
import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import { VSRIndividualAccordion } from "../VSRIndividualAccordion";

export interface MilitaryBackgroundProps {
  vsr: VSR;
}

export const MilitaryBackground = ({ vsr }: MilitaryBackgroundProps) => {
  return (
    <VSRIndividualAccordion permanentlyExpanded={false} title="Military Background">
      <div className={styles.row}>
        <ListDetail
          title="Branch"
          values={vsr.branch && vsr.branch.length > 0 ? vsr.branch : ["N/A"]}
        />
      </div>
      <div className={styles.row}>
        <ListDetail
          title="Conflicts"
          values={vsr.conflicts && vsr.conflicts.length > 0 ? vsr.conflicts : ["N/A"]}
        />
      </div>
      <div className={styles.row}>
        <ListDetail
          title="Discharge Status"
          values={
            vsr.dischargeStatus && vsr.dischargeStatus.length > 0 ? [vsr.dischargeStatus] : ["N/A"]
          }
        />
      </div>
      <div className={styles.row}>
        <ListDetail title="Service Connected" values={[vsr.serviceConnected ? "Yes" : "No"]} />
      </div>
      <div className={styles.row}>
        <SingleDetail title="Last Rank:" value={vsr.lastRank} />
        <SingleDetail className={styles.second} title="Military ID Number" value={vsr.militaryID} />
      </div>
    </VSRIndividualAccordion>
  );
};
