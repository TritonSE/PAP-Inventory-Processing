import styles from "src/components/VSRIndividual/CaseDetails/styles.module.css";
import { SingleDetail, StatusDropdown } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import moment from "moment";
import { VSRIndividualAccordion } from "@/components/VSRIndividual/VSRIndividualAccordion";
import { STATUS_OPTIONS } from "@/components/shared/StatusDropdown";
import { StatusChip } from "@/components/shared/StatusChip";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { CircularProgress } from "@mui/material";

export interface CaseDetailsProp {
  vsr: VSR;
  loadingStatus: boolean;
  onUpdateVSRStatus: (status: string) => void;
}

/**
 * Formats a Date object as a string in our desired format, using Moment.js library
 */
const formatDate = (date: Date) => {
  const dateMoment = moment(date);
  // We need to do 2 separate format() calls because Moment treats brackets ("[]") as escape chars
  return `${dateMoment.format("MM-DD-YYYY")} [${dateMoment.format("hh:mm A")}]`;
};

/**
 * The "Case Details" section of the VSR individual page.
 */
export const CaseDetails = ({ vsr, loadingStatus, onUpdateVSRStatus }: CaseDetailsProp) => {
  const { isMobile, isTablet } = useScreenSizes();

  const renderStatus = () => {
    if (loadingStatus) {
      return <CircularProgress size={24} />;
    }

    if (vsr.status === "Received" || vsr.status === undefined) {
      return (
        <StatusChip
          status={STATUS_OPTIONS.find((statusOption) => statusOption.value === "Received")!}
        />
      );
    }
    return (
      <StatusDropdown
        onChanged={onUpdateVSRStatus}
        value={vsr.status != undefined ? vsr.status : "Received"}
      />
    );
  };

  const valueFontSize = isMobile ? 14 : isTablet ? 18 : 20;

  return (
    <VSRIndividualAccordion permanentlyExpanded title="Case Details">
      <div className={styles.details}>
        <SingleDetail
          title="Date Received:"
          value={formatDate(vsr.dateReceived)}
          valueFontSize={valueFontSize}
          className={styles.singleDetail}
        />
        <SingleDetail
          title="Last Updated:"
          value={formatDate(vsr.lastUpdated)}
          valueFontSize={valueFontSize}
          className={styles.singleDetail}
        />

        <SingleDetail title="Status:" value={renderStatus()} className={styles.singleDetail} />
      </div>
    </VSRIndividualAccordion>
  );
};
