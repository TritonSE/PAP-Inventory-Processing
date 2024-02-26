import React, { useState } from "react";
import styles from "src/components/VSRIndividual/ContactInfo/ContactInfo.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, ListDetail } from "@/components/VSRIndividual";
import Image from "next/image";
import { type VSR } from "@/api/VSRs";

export interface PersonalInformationProps {
  vsr: VSR;
}
export const PersonalInformation = ({ vsr }: PersonalInformationProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={styles.box}>
      <Accordion
        className={styles.accordion}
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
          className={styles.accordionTitle}
          expandIcon={<Image src="/dropdown.svg" width={16} height={12} alt="dropdown" />}
          aria-controls="panel1-content"
          id="personal-info-header"
          sx={{
            ...(expanded === "panel" && {
              borderBottom: "1px solid rgba(214, 214, 214)", // Custom line style
              marginBottom: -1, // Adjust as needed
            }),
          }}
        >
          <Typography className={styles.title}>Personal Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
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
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
