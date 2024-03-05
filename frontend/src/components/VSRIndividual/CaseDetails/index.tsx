import styles from "src/components/VSRIndividual/CaseDetails/styles.module.css";
import { SingleDetail, StatusDropdown } from "@/components/VSRIndividual";
import { updateVSRStatus, type VSR } from "@/api/VSRs";
import moment from "moment";
import { VSRIndividualAccordion } from "@/components/VSRIndividual/VSRIndividualAccordion";
import { STATUS_OPTIONS } from "@/components/shared/StatusDropdown";
import { StatusChip } from "@/components/shared/StatusChip";

export interface CaseDetailsProp {
  vsr: VSR;
  setPageStatus: (status: VSR) => void;
}

/**
 * Formats a Date object as a string in our desired format, using Moment.js library
 */
const formatDate = (date: Date) => {
  const dateMoment = moment(date);
  // We need to do 2 separate format() calls because Moment treats brackets ("[]") as escape chars
  return `${dateMoment.format("MM-DD-YYYY")} [${dateMoment.format("hh:mm A")}]`;
};

export const CaseDetails = ({ vsr, setPageStatus }: CaseDetailsProp) => {
  function StatusComponent({ status, id }: { status: string; id: string }) {
    console.log(status);
    if (status === "Received" || status === undefined) {
      return <StatusChip status={STATUS_OPTIONS[0]} />;
    }
    return (
      <StatusDropdown
        onChanged={async (status) => {
          const res = await updateVSRStatus(id, status);
          setPageStatus(res.success ? res.data : vsr);
        }}
        value={status != undefined ? status : "Received"}
      />
    );
  }

  return (
    <VSRIndividualAccordion permanentlyExpanded title="Case Details">
      <div className={styles.details}>
        <SingleDetail title="Case ID:" value={vsr._id} valueFontSize="20px" />
        <SingleDetail
          title="Date Received:"
          value={formatDate(vsr.dateReceived)}
          valueFontSize="20px"
        />
        <SingleDetail
          title="Last Updated:"
          value={formatDate(vsr.lastUpdated)}
          valueFontSize="20px"
        />

        <SingleDetail
          title="Status:"
          value={<StatusComponent status={vsr.status} id={vsr._id} />}
        />
      </div>
    </VSRIndividualAccordion>
  );
};
