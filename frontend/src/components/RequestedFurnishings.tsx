import React, { useEffect, useState } from "react";
import styles from "src/components/RequestedFurnishings.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, ListDetail } from "@/components";
import { useParams } from "next/navigation";
import { getVSR, type VSR } from "@/api/VSRs";

export const RequestedFurnishings = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();

  useEffect(() => {
    getVSR(id as string).then((result) => {
      if (result.success) {
        setVSR(result.data);
      }
    });
  }, [id]);

  const expanded = true;

  return (
    <div className={styles.box}>
      <Accordion className={styles.accordian} defaultExpanded expanded={expanded}>
        <AccordionSummary
          className={styles.accordianTitle}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography className={styles.title}>Furnishing Requests</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <ListDetail
                title="Bedroom:"
                values={
                  vsr.bedroomFurnishing != undefined &&
                  Object.keys(vsr.bedroomFurnishing).length > 0
                    ? vsr.bedroomFurnishing
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Bathroom:"
                values={
                  vsr.bathroomFurnishing != undefined &&
                  Object.keys(vsr.bathroomFurnishing).length > 0
                    ? vsr.bathroomFurnishing
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Kitchen:"
                values={
                  vsr.kitchenFurnishing != undefined &&
                  Object.keys(vsr.kitchenFurnishing).length > 0
                    ? vsr.kitchenFurnishing
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Living Room:"
                values={
                  vsr.livingRoomFurnishing != undefined &&
                  Object.keys(vsr.livingRoomFurnishing).length > 0
                    ? vsr.livingRoomFurnishing
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Dining Room:"
                values={
                  vsr.diningRoomFurnishing != undefined &&
                  Object.keys(vsr.diningRoomFurnishing).length > 0
                    ? vsr.diningRoomFurnishing
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <ListDetail
                title="Other:"
                values={
                  vsr.otherFurnishing != undefined && Object.keys(vsr.otherFurnishing).length > 0
                    ? vsr.otherFurnishing
                    : ["N/A"]
                }
              />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Additional Items:" value="n/a" />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
