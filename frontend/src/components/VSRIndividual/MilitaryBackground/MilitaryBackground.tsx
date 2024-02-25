import React, { useState } from "react";
import styles from "@/components/VSRIndividual/ContactInfo/ContactInfo.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import Image from "next/image";
import { type VSR } from "@/api/VSRs";

export interface MilitaryBackgroundProps {
  vsr: VSR;
}

export const MilitaryBackground = ({ vsr }: MilitaryBackgroundProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={styles.box}>
      <Accordion
        className={styles.accordian}
        expanded={expanded === "panel"}
        onChange={handleChange("panel")}
        sx={{
          paddingTop: "6px",
          "&.Mui-expanded": {
            paddingTop: "0px",
          },
        }}
      >
        <AccordionSummary
          className={styles.accordianTitle}
          expandIcon={<Image src="/dropdown.svg" width={16} height={12} alt="dropdown" />}
          aria-controls="panel1-content"
          id="military-background-header"
          sx={{
            ...(expanded === "panel" && {
              borderBottom: "1px solid rgba(214, 214, 214)", // Custom line style
              marginBottom: -1, // Adjust as needed
            }),
          }}
        >
          <Typography className={styles.title}>Military Background</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
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
                  vsr.dischargeStatus && vsr.dischargeStatus.length > 0
                    ? [vsr.dischargeStatus]
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Service Connected"
                values={[vsr.serviceConnected ? "Yes" : "No"]}
              />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Last Rank:" value={vsr.lastRank} />
              <SingleDetail
                className={styles.second}
                title="Military ID Number"
                value={vsr.militaryId}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
