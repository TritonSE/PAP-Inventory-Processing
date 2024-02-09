import React, { useEffect, useState } from "react";
import styles from "src/app/components/ContactInfo.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ListDetail, SingleDetail } from "@/app/components";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getVSR, type VSR } from "@/api/VSRs";
import { List } from "@mui/material";

export const AdditionalInfo = () => {
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
              borderBottom: "1px solid rgba(0, 0, 0, .125)", // Custom line style
              marginBottom: -1, // Adjust as needed
            }),
          }}
        >
          <Typography className={styles.title}>Additional Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <ListDetail
                title="Are you interested in a companionship animal (pet)?"
                values={[vsr.petCompanion]}
              />
            </div>
            <div className={styles.row}>
              <ListDetail title="How did you hear about us?" values={[vsr.hearFrom]} />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
