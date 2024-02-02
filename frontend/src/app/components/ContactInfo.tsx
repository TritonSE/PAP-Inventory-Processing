import React, { useEffect, useState } from "react";
import styles from "src/app/components/ContactInfo.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail } from "@/app/components";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getVSR, type VSR } from "@/api/VSRs";

export const ContactInfo = () => {
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
          <Typography className={styles.title}>Contact Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <SingleDetail title="Phone Number" value="(609) 712-327" />{" "}
            </div>
            <div className={styles.row}>
              <SingleDetail title="Email Address" value="justintimberlake@gmail.com" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Gender" value={vsr.gender} />
              <SingleDetail title="Age" value={vsr.age} />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Street Address" value="6666 NSYNC Ave." />
              <SingleDetail title="City" value="San Diego" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Zip Code" value="92093" />
              <SingleDetail title="State" value="CA" />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
