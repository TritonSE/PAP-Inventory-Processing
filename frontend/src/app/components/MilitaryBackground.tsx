import React, { useEffect, useState } from "react";
import styles from "@/app/components/ContactInfo.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, ListDetail } from "@/app/components";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getVSR, type VSR } from "@/api/VSRs";

export const MilitaryBackground = () => {
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
          <Typography className={styles.title}>Military Background</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <ListDetail title="Branch" values={vsr.branch != undefined ? vsr.branch : ["N/A"]} />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Conflicts"
                values={vsr.conflicts != undefined ? vsr.conflicts : ["N/A"]}
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Discharge Status"
                values={vsr.dischargeStatus != undefined ? [vsr.dischargeStatus] : ["N/A"]}
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Service Connected"
                values={vsr.serviceConnected != undefined ? [vsr.serviceConnected] : ["N/A"]}
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
