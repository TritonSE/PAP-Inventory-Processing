import React, { ReactNode, useEffect, useState } from "react";
import styles from "@/components/VSRIndividual/VSRIndividualAccordion/styles.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useScreenSizes } from "@/hooks/useScreenSizes";

export interface VSRIndividualAccordionProps {
  title: string;
  permanentlyExpanded: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * A component for an accordion for one of the VSR individual pages. Can be either
 * permanently expanded, or expand/collapse on click.
 */
export const VSRIndividualAccordion = ({
  title,
  permanentlyExpanded,
  className,
  children,
}: VSRIndividualAccordionProps) => {
  const [expanded, setExpanded] = useState(permanentlyExpanded);

  const { isMobile, isTablet } = useScreenSizes();

  useEffect(() => {
    setExpanded(permanentlyExpanded);
  }, [permanentlyExpanded]);

  return (
    <div className={className}>
      <Accordion
        expanded={expanded || permanentlyExpanded}
        onChange={(e, isExpanded) => setExpanded(isExpanded || permanentlyExpanded)}
        sx={{
          display: "inline-block",
          backgroundColor: "hsl(0, 0%, 100%)",
          width: "100%",
          borderRadius: 6,
          boxShadow: "none",
          padding: "8px 6px",
          paddingTop: "6px",
        }}
      >
        <AccordionSummary
          expandIcon={
            permanentlyExpanded ? null : (
              <Image src="/dropdown.svg" width={16} height={12} alt="dropdown" />
            )
          }
          aria-controls="panel1-content"
          sx={{
            ...{
              borderBottom: `1px solid ${expanded ? "rgba(214, 214, 214)" : "transparent"}`, // Custom line style
              ".MuiAccordionSummary-content": {
                margin: "20px 0",
              },
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-title)",
              color: "var(--Primary-Background-Dark, #232220)",
              fontSize: isMobile ? 20 : isTablet ? 28 : 24,
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>{children}</div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
