import React, { useEffect, useState } from "react";
import {
  HeaderBar,
  VeteranTag,
  ContactInfo,
  CaseDetails,
  PersonalInformation,
  MilitaryBackground,
  AdditionalInfo,
  RequestedFurnishings,
} from "@/components/VSRIndividual";
import styles from "src/components/VSRIndividual/Page/styles.module.css";
import Image from "next/image";
import { type VSR, getVSR, updateVSRStatus } from "@/api/VSRs";
import { useParams } from "next/navigation";
import { STATUS_OPTIONS, StatusDropdown } from "@/components/shared/StatusDropdown";
import { StatusChip } from "@/components/shared/StatusChip";

function CanApprove({ status, id }: { status: string; id: any }) {
  if (status == "Received" || status === undefined) {
    return (
      <button
        className={styles.approve}
        onClick={() => {
          updateVSRStatus(id, "Approved");
          //window.location.reload();
        }}
      >
        Approve VSR
      </button>
    );
  }
}

export const Page = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getVSR(id as string)
      .then((result) => {
        if (result.success) {
          setVSR(result.data);
          setErrorMessage(null);
        } else {
          setErrorMessage("VSR not found.");
        }
      })
      .catch((error) => {
        setErrorMessage(`An error occurred: ${error.message}`);
      });
  }, [id]);
  return (
    <div className={styles.page}>
      <HeaderBar />
      <a href="/staff/vsr">
        <button className={styles.toDashboard}>
          <Image src="/ic_arrowback.svg" width={24} height={24} alt="arrowback" />
          Dashboard
        </button>
      </a>
      <div className={styles.allDetails}>
        <div className={styles.headerRow}>
          <div className={styles.name}>
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <VeteranTag vsr={vsr}></VeteranTag>
          </div>
          <div className={styles.actions}>
            <a href="REPLACE">
              <button id="edit" className={styles.button}>
                <Image width={24} height={24} src="/ic_edit.svg" alt="edit" />
                Edit Form
              </button>
            </a>
            <a href="REPLACE">
              <button className={styles.button}>
                <Image width={24} height={24} src="/ic_upload.svg" alt="upload" />
                Export
              </button>
            </a>
          </div>
        </div>
        <div className={styles.bodyDetails}>
          <CaseDetails vsr={vsr}></CaseDetails>
          <div className={styles.otherDetails}>
            <div className={styles.personalInfo}>
              <ContactInfo vsr={vsr} />
              <PersonalInformation vsr={vsr} />
              <MilitaryBackground vsr={vsr} />
              <AdditionalInfo vsr={vsr} />
            </div>
            <div className={styles.rightColumn}>
              <RequestedFurnishings vsr={vsr} />
              <div className={styles.finalActions}>
                <CanApprove status={vsr.status} id={vsr._id}></CanApprove>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}></div>
      </div>
    </div>
  );
};
