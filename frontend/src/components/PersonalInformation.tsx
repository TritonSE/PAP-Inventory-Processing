import React, { useEffect, useState } from "react";
import styles from "src/components/ContactInfo.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, ListDetail } from "@/components";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getVSR, type VSR } from "@/api/VSRs";

export const PersonalInformation = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    getVSR(id as string).then((result) => {
      if (result.success) {
        setVSR(result.data);
      }
    });
  }, [id]);
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
          aria-controls="panel2-content"
          id="panel2-header"
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
                value={vsr.spouseName != undefined ? vsr.spouseName : "N/A"}
              />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Number of boy(s)" value="2" />
              <SingleDetail
                className={styles.second}
                title="Age(s)"
                value={vsr.agesOfBoys != undefined ? vsr.agesOfBoys : "N/A"}
              />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Number of girl(s)" value="2" />
              <SingleDetail
                className={styles.second}
                title="Age(s)"
                value={vsr.agesOfGirls != undefined ? vsr.agesOfGirls : "N/A"}
              />
            </div>
            <div className={styles.row}>
              <ListDetail title="Ethnicity" values={[vsr.ethnicity]} />
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
