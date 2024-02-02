import React, { useEffect, useState } from "react";
import styles from "src/app/components/PersonalInformation.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, ListDetail } from "@/app/components";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getVSR, type VSR } from "@/api/VSRs";

export const PersonalInformation = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();

  useEffect(() => {
    getVSR(id as string).then((result) => {
      if (result.success) {
        setVSR(result.data);
      }
    });
  }, [id]);
  return (
    <div className={styles.box}>
      <Accordion className={styles.accordian}>
        <AccordionSummary
          className={styles.accordianTitle}
          expandIcon={<Image src="/dropdown.svg" width={16} height={12} alt="dropdown" />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography className={styles.title}>Personal Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <SingleDetail title="Name" value={vsr.name} />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Street Address" value="6666 NSYNC Ave." />
            </div>
            <div className={styles.row}>
              <SingleDetail title="City" value="San Diego" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="State" value="CA" />
              <SingleDetail title="Zip Code" value="92092" />
            </div>
            <div className={styles.row}>
              <ListDetail title="Marital Status" values={[vsr.maritalStatus]} />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Spouse's Name" value={"Jane Timberlake"} />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Number of boy(s)" value="2" />
              <SingleDetail title="Age(s)" value="10,12" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Number of girl(s)" value="2" />
              <SingleDetail title="Age(s)" value="10,12" />
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
